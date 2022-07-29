import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from 'mobx';

import { ANTIBANNER_GROUPS_ID } from '../../../common/constants';
import { log } from '../../../common/log';
import { createSavingService, EVENTS as SAVING_FSM_EVENTS, STATES } from '../../common/components/Editor/savingFSM';
import { sleep } from '../../helpers';
import { messenger } from '../../services/messenger';

const savingAllowlistService = createSavingService({
    id: 'allowlist',
    services: {
        saveData: async (_, e) => {
            /**
             * If saveAllowlist executes faster than MIN_EXECUTION_TIME_REQUIRED_MS we increase
             * execution time for smoother user experience
             */
            const MIN_EXECUTION_TIME_REQUIRED_MS = 500;
            const start = Date.now();
            await messenger.saveAllowlist(e.value);
            const end = Date.now();
            const timePassed = end - start;
            if (timePassed < MIN_EXECUTION_TIME_REQUIRED_MS) {
                await sleep(MIN_EXECUTION_TIME_REQUIRED_MS - timePassed);
            }
        },
    },
});

class SettingsStore {
    KEYS = {
        ALLOW_ACCEPTABLE_ADS: 'allowAcceptableAds',
        BLOCK_KNOWN_TRACKERS: 'blockKnownTrackers',
        STRIP_TRACKING_PARAMETERS: 'stripTrackingParameters',
    };

    @observable settings = null;

    @observable optionsReadyToRender = false;

    @observable version = null;

    @observable filters = [];

    @observable categories = [];

    @observable visibleFilters = [];

    @observable rulesCount = 0;

    @observable allowAcceptableAds = null;

    @observable blockKnownTrackers = null;

    @observable stripTrackingParameters = null;

    @observable allowlist = '';

    @observable savingAllowlistState = savingAllowlistService.initialState.value;

    @observable filtersUpdating = false;

    @observable isChrome = null;

    constructor(rootStore) {
        makeObservable(this);
        this.rootStore = rootStore;

        savingAllowlistService.onTransition((state) => {
            runInAction(() => {
                this.savingAllowlistState = state.value;
                if (state.value === STATES.SAVING) {
                    this.allowlistEditorContentChanged = false;
                }
            });
        });
    }

    @action
    async requestOptionsData(firstRender) {
        const data = await messenger.getOptionsData();
        if (!data) {
            log.error('requestOptionsData: messenger.getOptionsData empty response. firstRender={0}', firstRender);
            return;
        }

        runInAction(() => {
            this.settings = data.settings;
            // on first render we sort filters to show enabled on the top
            // filter should remain on the same place event after being enabled or disabled
            if (firstRender) {
                // this.setFilters(sortFilters(data.filtersMetadata.filters));
            } else {
                // on the next filters updates, we update filters keeping order
                // this.setFilters(updateFilters(this.filters, data.filtersMetadata.filters));
            }
            // do not rerender groups on its turning on/off while searching
            if (this.isSearching) {
                // this.setGroups(updateGroups(this.categories, data.filtersMetadata.categories));
            } else {
                this.setGroups(data.filtersMetadata.categories);
            }
            this.rulesCount = data.filtersInfo.rulesCount;
            this.version = data.appVersion;
            this.constants = data.constants;
            this.setAllowAcceptableAds(data.filtersMetadata.filters);
            this.setBlockKnownTrackers(data.filtersMetadata.filters);
            this.setStripTrackingParameters(data.filtersMetadata.filters);
            this.isChrome = data.environmentOptions.isChrome;
            this.optionsReadyToRender = true;
            this.fullscreenUserRulesEditorIsOpen = data.fullscreenUserRulesEditorIsOpen;
        });
    }

    @action
    updateRulesCount(rulesCount) {
        this.rulesCount = rulesCount;
    }

    @action
    updateSetting(settingId, value) {
        this.settings.values[settingId] = value;
        messenger.changeUserSetting(settingId, value);
    }

    async setFilterRelatedSettingState(filterId, optionKey, enabled) {
        const prevValue = this[optionKey];
        this[optionKey] = enabled;
        try {
            const relatedFilter = this.filters
                .find((f) => f.filterId === filterId);

            if (enabled) {
                await messenger.enableFilter(filterId);
                await this.updateGroupSetting(relatedFilter.groupId, enabled);
            } else {
                await messenger.disableFilter(filterId);
            }

            relatedFilter.enabled = enabled;
            this.refreshFilter(relatedFilter);
        } catch (e) {
            runInAction(() => {
                this[optionKey] = prevValue;
            });
        }
    }

    @action
    async setAllowAcceptableAdsState(enabled) {
        const { SEARCH_AND_SELF_PROMO_FILTER_ID } = this.constants.AntiBannerFiltersId;
        await this.setFilterRelatedSettingState(
            SEARCH_AND_SELF_PROMO_FILTER_ID,
            this.KEYS.ALLOW_ACCEPTABLE_ADS,
            !enabled,
        );
    }

    @action
    async setBlockKnownTrackersState(enabled) {
        const { TRACKING_FILTER_ID } = this.constants.AntiBannerFiltersId;
        await this.setFilterRelatedSettingState(
            TRACKING_FILTER_ID,
            this.KEYS.BLOCK_KNOWN_TRACKERS,
            enabled,
        );
    }

    @action
    async setStripTrackingParametersState(enabled) {
        const { URL_TRACKING_FILTER_ID } = this.constants.AntiBannerFiltersId;
        await this.setFilterRelatedSettingState(
            URL_TRACKING_FILTER_ID,
            this.KEYS.STRIP_TRACKING_PARAMETERS,
            enabled,
        );
    }

    setSetting(filtersId, settingKey, filters) {
        const relatedFilter = filters
            .find((f) => f.filterId === filtersId);
        this[settingKey] = !!relatedFilter?.enabled || false;
    }

    @action
    setAllowAcceptableAds(filters) {
        const { SEARCH_AND_SELF_PROMO_FILTER_ID } = this.constants.AntiBannerFiltersId;
        this.setSetting(SEARCH_AND_SELF_PROMO_FILTER_ID, this.KEYS.ALLOW_ACCEPTABLE_ADS, filters);
    }

    @action
    setBlockKnownTrackers(filters) {
        const { TRACKING_FILTER_ID } = this.constants.AntiBannerFiltersId;
        this.setSetting(TRACKING_FILTER_ID, this.KEYS.BLOCK_KNOWN_TRACKERS, filters);
    }

    @action
    setStripTrackingParameters(filters) {
        const { URL_TRACKING_FILTER_ID } = this.constants.AntiBannerFiltersId;
        this.setSetting(URL_TRACKING_FILTER_ID, this.KEYS.STRIP_TRACKING_PARAMETERS, filters);
    }

    isFilterEnabled(filterId) {
        const filter = this.filters
            .find((f) => f.filterId === filterId);
        return filter.enabled;
    }

    isAllowAcceptableAdsFilterEnabled() {
        const { SEARCH_AND_SELF_PROMO_FILTER_ID } = this.constants.AntiBannerFiltersId;
        this.isFilterEnabled(SEARCH_AND_SELF_PROMO_FILTER_ID);
    }

    isBlockKnownTrackersFilterEnabled() {
        const { TRACKING_FILTER_ID } = this.constants.AntiBannerFiltersId;
        this.isFilterEnabled(TRACKING_FILTER_ID);
    }

    isStripTrackingParametersFilterEnabled() {
        const { URL_TRACKING_FILTER_ID } = this.constants.AntiBannerFiltersId;
        this.isFilterEnabled(URL_TRACKING_FILTER_ID);
    }

    @computed
    get lastUpdateTime() {
        return Math.max(...this.filters.map((filter) => filter.lastCheckTime || 0));
    }

    @action
    async updateGroupSetting(id, enabled) {
        await messenger.updateGroupStatus(id, enabled);
        runInAction(() => {
            const groupId = parseInt(id, 10);
            if (groupId === ANTIBANNER_GROUPS_ID.OTHER_FILTERS_GROUP_ID
                && this.isAllowAcceptableAdsFilterEnabled()) {
                this.allowAcceptableAds = enabled;
            } else if (groupId === ANTIBANNER_GROUPS_ID.PRIVACY_FILTERS_GROUP_ID) {
                // if (this.isBlockKnownTrackersFilterEnabled()) {
                //     this.blockKnownTrackers = enabled;
                // }
                // if (this.isStripTrackingParametersFilterEnabled()) {
                //     this.stripTrackingParameters = enabled;
                // }
            }
            this.categories.forEach((group) => {
                if (group.groupId === groupId) {
                    if (enabled) {
                        // eslint-disable-next-line no-param-reassign
                        group.enabled = true;
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        delete group.enabled;
                    }
                }
            });
        });
    }

    @action
    refreshFilters(updatedFilters) {
        if (updatedFilters && updatedFilters.length) {
            updatedFilters.forEach((filter) => this.refreshFilter(filter));
        }
    }

    @action
    refreshFilter(filter) {
        if (!filter) {
            return;
        }

        const idx = this.filters.findIndex((f) => f.filterId === filter.filterId);
        if (idx !== -1) {
            Object.keys(filter).forEach((key) => {
                this.filters[idx][key] = filter[key];
            });
        }
    }

    @action
    setFilterEnabledState = (rawFilterId, enabled) => {
        const filterId = parseInt(rawFilterId, 10);
        this.filters.forEach((filter) => {
            if (filter.filterId === filterId) {
                // eslint-disable-next-line no-param-reassign
                filter.enabled = !!enabled;
            }
        });
        this.visibleFilters.forEach((filter) => {
            if (filter.filterId === filterId) {
                // eslint-disable-next-line no-param-reassign
                filter.enabled = !!enabled;
            }
        });
    };

    @action
    async updateFilterSetting(rawFilterId, enabled) {
        const filterId = Number.parseInt(rawFilterId, 10);
        this.setFilterEnabledState(filterId, enabled);
        try {
            const filters = await messenger.updateFilterStatus(filterId, enabled);
            this.refreshFilters(filters);
            // update allow acceptable ads setting
            if (filterId === this.constants.AntiBannerFiltersId.SEARCH_AND_SELF_PROMO_FILTER_ID) {
                this.allowAcceptableAds = enabled;
            } else if (filterId === this.constants.AntiBannerFiltersId.TRACKING_FILTER_ID) {
                this.blockKnownTrackers = enabled;
            } else if (filterId === this.constants.AntiBannerFiltersId.URL_TRACKING_FILTER_ID) {
                this.stripTrackingParameters = enabled;
            }
        } catch (e) {
            log.error(e);
            this.setFilterEnabledState(filterId, !enabled);
        }
    }

    @action
    setFiltersUpdating(value) {
        this.filtersUpdating = value;
    }

    @action
    async updateFilters() {
        this.setFiltersUpdating(true);
        try {
            const filtersUpdates = await messenger.updateFilters();
            this.refreshFilters(filtersUpdates);
            setTimeout(() => {
                this.setFiltersUpdating(false);
            }, 2000);
            return filtersUpdates;
        } catch (error) {
            this.setFiltersUpdating(false);
            throw error;
        }
    }

    @action
    async removeCustomFilter(filterId) {
        await messenger.removeCustomFilter(filterId);
        runInAction(() => {
            this.setFilters(this.filters.filter((filter) => filter.filterId !== filterId));
            this.setVisibleFilters(this.visibleFilters.filter((filter) => {
                return filter.filterId !== filterId;
            }));
        });
    }

    @action
    setAllowlist = (allowlist) => {
        this.allowlist = allowlist;
    };

    @action
    getAllowlist = async () => {
        try {
            const { content } = await messenger.getAllowlist();
            this.setAllowlist(content);
        } catch (e) {
            log.debug(e);
        }
    };

    @action
    appendAllowlist = async (allowlist) => {
        await this.saveAllowlist(this.allowlist.concat('\n', allowlist));
    };

    @action
    saveAllowlist = async (allowlist) => {
        await savingAllowlistService.send(SAVING_FSM_EVENTS.SAVE, { value: allowlist });
    };

    @action
    setFilters = (filters) => {
        this.filters = filters;
    };

    @action
    setVisibleFilters = (visibleFilters) => {
        this.visibleFilters = visibleFilters;
    };

    @action
    setGroups = (categories) => {
        this.categories = categories;
    };

    @computed
    get appearanceTheme() {
        if (!this.settings) {
            return null;
        }

        return this.settings.values[this.settings.names.APPEARANCE_THEME];
    }

    @action
    setFullscreenUserRulesEditorState(isOpen) {
        this.fullscreenUserRulesEditorIsOpen = isOpen;
    }

    @computed
    get isFullscreenUserRulesEditorOpen() {
        return this.fullscreenUserRulesEditorIsOpen;
    }

    @computed
    get userFilterEnabledSettingId() {
        return this.settings.names.USER_FILTER_ENABLED;
    }

    @computed
    get userFilterEnabled() {
        return this.settings.values[this.userFilterEnabledSettingId];
    }

    @computed
    get protectionLevel() {
        return this?.settings?.values?.['protection-level'];
    }

    @computed
    get arePermissionsRejected() {
        return !!this?.settings?.values?.['permissions-rejected'];
    }

    @action
    async setProtectionLevel(value) {
        this.updateSetting('protection-level', value);
    }
}

export default SettingsStore;
