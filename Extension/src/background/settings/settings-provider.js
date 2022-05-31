/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adguard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */

import { application } from '../application';
import { log } from '../../common/log';
import { subscriptions } from '../filter/filters/subscription';
import { allowlist } from '../filter/allowlist';
import { userrules } from '../filter/userrules';
import { listeners } from '../notifier';
import { utils } from '../utils/common';
import { settings } from './user-settings';
import { backgroundPage } from '../extension-api/background-page';
import { customFilters } from '../filter/filters/custom-filters';
import { categories } from '../filter/filters/filters-categories';
import { defaultSettings } from './default-settings.js';

/**
 * This is standalone validator module precompiled by ajv
 * We use this module for prevent ajv run cached validator function code from string
 */
import validateJsonSchema from './validator';

/**
 * Application settings provider.
 */
export const settingsProvider = (function () {
    const BACKUP_PROTOCOL_VERSION = '1.0';

    /**
     * Collect enabled filters ids without custom filters
     * @returns {Array}
     */
    const collectEnabledFilterIds = () => {
        const enabledFilters = application.getEnabledFilters();
        return enabledFilters
            .filter(filter => !filter.customUrl)
            .map(filter => filter.filterId);
    };

    /**
     * Collects data about added custom filters to the extension
     * @returns {CustomFilterInitial} - returns data enough to import custom filter
     */
    const collectCustomFiltersData = () => {
        const customFiltersList = customFilters.getCustomFilters();
        return customFiltersList.map(filter => ({
            customUrl: filter.customUrl,
            enabled: filter.enabled,
            title: filter.name || '',
            trusted: filter.trusted,
        }));
    };

    const collectEnabledGroupIds = () => {
        const groups = subscriptions.getGroups();
        return groups
            .filter(group => group.enabled)
            .map(group => group.groupId);
    };

    /**
     * Loads filters settings section
     */
    const loadFiltersSection = async () => {
        const enabledFilterIds = collectEnabledFilterIds();
        const enabledGroupIds = collectEnabledGroupIds();
        const customFiltersData = collectCustomFiltersData();

        // Collect allowlist/blacklist domains, allowlist inverted mode and allowlist enabled state
        const allowlistDomains = allowlist.getAllowlistedDomains() || [];
        const blockListDomains = allowlist.getBlocklistedDomains() || [];
        const defaultAllowlistMode = !!allowlist.isDefaultMode();
        const allowlistEnabled = settings.getAllowlistEnabledState();

        // Collect user rules
        const content = await userrules.getUserRulesText();
        const userFilterEnabled = settings.getUserFilterEnabled();
        const section = {
            'filters': {
                'enabled-groups': enabledGroupIds,
                'enabled-filters': enabledFilterIds,
                'custom-filters': customFiltersData,
                'user-filter': {
                    'rules': content,
                    'disabled-rules': '',
                    enabled: userFilterEnabled,
                },
                'whitelist': {
                    'inverted': !defaultAllowlistMode,
                    'domains': allowlistDomains,
                    'inverted-domains': blockListDomains,
                    'enabled': allowlistEnabled,
                },
            },
        };

        return section;
    };

    /**
     * Loads stealth mode settings section
     */
    const loadStealthModeSection = () => {
        const enabledFilterIds = collectEnabledFilterIds();
        const blockKnownTrackers = enabledFilterIds.indexOf(utils.filters.ids.TRACKING_FILTER_ID) >= 0;
        const stripTrackingParameters = enabledFilterIds.indexOf(utils.filters.ids.URL_TRACKING_FILTER_ID) >= 0;

        const section = {
            stealth: {
                'stealth_disable_stealth_mode': settings.getDisableStealthMode(),
                'stealth-hide-referrer': settings.getHideReferrer(),
                'stealth-hide-search-queries': settings.getHideSearchQueries(),
                'stealth-send-do-not-track': settings.getSendDoNotTrack(),
                'stealth-block-webrtc': settings.isWebRTCDisabled(),
                'stealth-remove-x-client': settings.isRemoveXClientData(),
                'stealth-block-third-party-cookies': settings.getSelfDestructThirdPartyCookies(),
                'stealth-block-third-party-cookies-time': settings.getSelfDestructThirdPartyCookiesTime(),
                'stealth-block-first-party-cookies': settings.getSelfDestructFirstPartyCookies(),
                'stealth-block-first-party-cookies-time': settings.getSelfDestructFirstPartyCookiesTime(),
                'block-known-trackers': blockKnownTrackers,
                'strip-tracking-parameters': stripTrackingParameters,
            },
        };
        return section;
    };

    /**
     * Loads general settings section
     */
    const loadGeneralSettingsSection = function () {
        const enabledFilterIds = collectEnabledFilterIds();
        // TODO update self search settings on filter status change
        const allowAcceptableAds = enabledFilterIds.indexOf(utils.filters.ids.SEARCH_AND_SELF_PROMO_FILTER_ID) >= 0;

        const section = {
            'general-settings': {
                'app-language': backgroundPage.app.getLocale(),
                'allow-acceptable-ads': allowAcceptableAds,
                'show-blocked-ads-count': settings.showPageStatistic(),
                'autodetect-filters': settings.isAutodetectFilters(),
                'safebrowsing-enabled': settings.safebrowsingInfoEnabled(),
                'filters-update-period': settings.getFiltersUpdatePeriod(),
                'appearance-theme': settings.getAppearanceTheme(),
            },
        };

        return section;
    };

    /**
     * Loads extension specific settings section
     */
    const loadExtensionSpecificSettingsSection = function () {
        const section = {
            'extension-specific-settings': {
                'use-optimized-filters': settings.isUseOptimizedFiltersEnabled(),
                'collect-hits-count': settings.collectHitsCount(),
                'show-context-menu': settings.showContextMenu(),
                'show-info-about-adguard': settings.isShowInfoAboutAdguardFullVersion(),
                'show-app-updated-info': settings.isShowAppUpdatedNotification(),
                'hide-rate-adguard': settings.isHideRateBlock(),
                'user-rules-editor-wrap': settings.isUserRulesEditorWrap(),
            },
        };

        return section;
    };

    /**
     * Applies general section settings to application
     * @param section Section
     */
    const applyGeneralSettingsSection = async function (section) {
        const set = section['general-settings'];

        settings.changeShowPageStatistic(!!set['show-blocked-ads-count']);
        settings.changeAutodetectFilters(!!set['autodetect-filters']);
        settings.changeEnableSafebrowsing(!!set['safebrowsing-enabled']);
        settings.setFiltersUpdatePeriod(set['filters-update-period']);
        settings.setAppearanceTheme(set['appearance-theme']);

        if (set['allow-acceptable-ads']) {
            await application.addAndEnableFilters([utils.filters.ids.SEARCH_AND_SELF_PROMO_FILTER_ID]);
        } else {
            application.disableFilters([utils.filters.ids.SEARCH_AND_SELF_PROMO_FILTER_ID]);
        }
    };

    /**
     * Applies extension specific section settings to application
     * @param section
     */
    const applyExtensionSpecificSettingsSection = function (section) {
        const set = section['extension-specific-settings'];

        settings.changeUseOptimizedFiltersEnabled(!!set['use-optimized-filters']);
        settings.changeCollectHitsCount(!!set['collect-hits-count']);
        settings.changeShowContextMenu(!!set['show-context-menu']);
        settings.changeShowInfoAboutAdguardFullVersion(!!set['show-info-about-adguard']);
        settings.changeShowAppUpdatedNotification(!!set['show-app-updated-info']);
        settings.changeHideRateBlock(!!set['hide-rate-adguard']);
        settings.changeUserRulesEditorWrap(!!set['user-rules-editor-wrap']);
    };

    /**
     * Applies stealth mode section settings to application
     * @param section
     */
    const applyStealthModeSection = async (section) => {
        const set = section['stealth'];

        if (!set) {
            // use default settings
            return;
        }

        // set "block webrtc" setting as soon as possible. AG-9980
        // don't set the actual value to avoid requesting permissions
        if (settings.isWebRTCDisabled() !== !!set['stealth-block-webrtc']) {
            settings.setWebRTCDisabled(!!set['stealth-block-webrtc']);
        }

        settings.setDisableStealthMode(!!set['stealth_disable_stealth_mode']);
        settings.setHideReferrer(!!set['stealth-hide-referrer']);
        settings.setHideSearchQueries(!!set['stealth-hide-search-queries']);
        settings.setSendDoNotTrack(!!set['stealth-send-do-not-track']);
        settings.setRemoveXClientData(!!set['stealth-remove-x-client']);
        settings.setSelfDestructThirdPartyCookies(!!set['stealth-block-third-party-cookies']);
        settings.setSelfDestructThirdPartyCookiesTime(set['stealth-block-third-party-cookies-time']);
        settings.setSelfDestructFirstPartyCookies(!!set['stealth-block-first-party-cookies']);
        settings.setSelfDestructFirstPartyCookiesTime(set['stealth-block-first-party-cookies-time']);

        if (set['strip-tracking-parameters']) {
            await application.addAndEnableFilters([utils.filters.ids.URL_TRACKING_FILTER_ID]);
        } else {
            application.disableFilters([utils.filters.ids.URL_TRACKING_FILTER_ID]);
        }
    };

    /**
     * Initial data needed to add custom filter from the scratch
     * @typedef {Object} CustomFilterInitial
     * @property {string} customUrl - url of the custom filter
     * @property {boolean} enabled - state of custom filter
     * @property {number} [filterId] - identifier of the filter
     * @property {boolean} [trusted] - trusted flag of the filter
     * @property {string} [title] - title of the filter
     */

    /**
     * Add a custom filter
     * @param {CustomFilterInitial} customFilterData - initial data of imported custom filter
     * @returns {Promise<any>} SubscriptionFilter
     */
    const addCustomFilter = async (customFilterData) => {
        const {
            customUrl,
            title,
            trusted,
            enabled,
        } = customFilterData;

        const options = { title, trusted, enabled };
        const filter = await application.loadCustomFilter(customUrl, options);
        return filter;
    };

    const addCustomFilters = async (absentCustomFiltersInitials) => {
        const result = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const customFilterInitial of absentCustomFiltersInitials) {
            try {
                // eslint-disable-next-line no-await-in-loop
                const customFilter = await addCustomFilter(customFilterInitial);
                log.info(`Settings sync: Custom filter was added: ${customFilter.customUrl}`);
                result.push({ error: null, filter: customFilter });
            } catch (e) {
                const { customUrl } = customFilterInitial;
                const message = `Settings sync: Error occurred while downloading: ${customUrl} - ${e.message}`;
                log.info(message);
                result.push({ error: message });
            }
        }
        return result;
    };

    /**
     * Remove existing custom filters before adding new custom filters
     */
    const removeCustomFilters = (filterIds) => {
        filterIds.forEach((filterId) => {
            application.removeFilter(filterId);
        });
        log.info(`Settings sync: Next filters were removed: ${filterIds}`);
    };

    /**
     * Returns filterId which not listed in the filtersToAdd list, but listed in the existingFilters
     * @param existingFilters
     * @param filtersToAdd
     * @returns {array<number>}
     */
    const getCustomFiltersToRemove = (existingFilters, filtersToAdd) => {
        const customUrlsToAdd = filtersToAdd.map(f => f.customUrl);
        const filtersToRemove = existingFilters.filter(f => !customUrlsToAdd.includes(f.customUrl));
        return filtersToRemove.map(f => f.filterId);
    };

    /**
     * Adds custom filters if there were not added one by one to the subscriptions list
     * @param {Array<CustomFilterInitial>} customFiltersInitials
     * @returns {Promise<any>} Promise object which represents array with filters
     */
    const syncCustomFilters = async (customFiltersInitials) => {
        const presentCustomFilters = customFilters.getCustomFilters();

        const enrichedFiltersInitials = customFiltersInitials.map((filterToAdd) => {
            presentCustomFilters.forEach((existingFilter) => {
                if (existingFilter.customUrl === filterToAdd.customUrl) {
                    filterToAdd.filterId = existingFilter.filterId;
                }
            });
            return filterToAdd;
        });

        const customFiltersToAdd = enrichedFiltersInitials.filter(f => !f.filterId);
        const existingCustomFilters = enrichedFiltersInitials.filter(f => f.filterId);
        const redundantExistingCustomFiltersIds = getCustomFiltersToRemove(presentCustomFilters, customFiltersInitials);

        if (redundantExistingCustomFiltersIds.length > 0) {
            removeCustomFilters(redundantExistingCustomFiltersIds);
        }

        if (customFiltersToAdd.length === 0) {
            return enrichedFiltersInitials;
        }

        const customFiltersAddResult = await addCustomFilters(customFiltersToAdd);

        // get results without errors, in order to do not enable filters with errors
        const addedCustomFiltersWithoutError = customFiltersAddResult
            .filter(f => f.error === null)
            .map(f => f.filter);

        const addedCustomFiltersIds = addedCustomFiltersWithoutError.map(f => f.filterId);
        log.info(`Settings sync: Were added custom filters: ${addedCustomFiltersIds}`);

        return [...existingCustomFilters, ...addedCustomFiltersWithoutError];
    };

    /**
     * Enables filters by filterId and disables those filters which were not in the list of enabled filters
     * @param {array<number>} filterIds - ids to enable
     * @returns {Promise<any>}
     */
    const syncEnabledFilters = async (filterIds) => {
        await application.addAndEnableFilters(filterIds, { forceRemote: true });
        const enabledFilters = application.getEnabledFilters();
        const filtersToDisable = enabledFilters
            .filter(enabledFilter => !filterIds.includes(enabledFilter.filterId))
            .map(filter => filter.filterId);
        application.disableFilters(filtersToDisable);
    };

    /**
     * Enables groups by groupId and disable those groups which were not in the list
     * @param {array<number>} enabledGroups
     * @param {boolean} drop enabled flag
     */
    const syncEnabledGroups = (enabledGroups, drop) => {
        enabledGroups.forEach((groupId) => {
            categories.enableFiltersGroup(groupId);
        });
        log.info(`Settings sync: Next groups were enabled: ${enabledGroups}`);

        // disable groups not listed in the imported list
        const groups = subscriptions.getGroups();

        const groupIdsToDisable = groups
            .map(group => group.groupId)
            .filter(groupId => !enabledGroups.includes(groupId));

        groupIdsToDisable.forEach((groupId) => {
            categories.disableFiltersGroup(groupId, drop);
        });
    };

    /**
     * Applies filters section settings to application
     * @param section Section
     * @param dropGroupsEnabled
     */
    const applyFiltersSection = async function (section, dropGroupsEnabled) {
        const allowlistSection = section.filters['whitelist'] || {};
        const allowlistDomains = allowlistSection.domains || [];
        const blacklistDomains = allowlistSection['inverted-domains'] || [];

        // Apply allowlist/blacklist domains, allowlist mode and allowlist enabled state
        allowlist.configure({
            allowlist: allowlistDomains,
            blocklist: blacklistDomains,
            mode: !allowlistSection.inverted,
            enabled: typeof allowlistSection.enabled === 'undefined' ? true : !!allowlistSection.enabled,
        });

        const userFilterSection = section.filters['user-filter'] || {};
        const userRules = userFilterSection.rules || '';
        const userFilterEnabled = typeof userFilterSection.enabled === 'undefined'
            ? true
            : userFilterSection.enabled;

        // Apply user rules
        settings.setUserFilterEnabled(userFilterEnabled);
        userrules.updateUserRulesText(userRules);

        // Apply custom filters
        const customFiltersData = section.filters['custom-filters'] || [];

        // STEP 1 sync custom filters
        const availableCustomFilters = await syncCustomFilters(customFiltersData);

        // STEP 2 get filters with enabled flag from export data
        const customFilterIdsToEnable = availableCustomFilters
            .filter((availableCustomFilter) => {
                const filterData = customFiltersData
                    .find((filter) => {
                        if (!filter.customUrl) {
                            // eslint-disable-next-line max-len
                            throw new Error(`Custom filter should always have custom URL: ${JSON.stringify(filter)}`);
                        }
                        return filter.customUrl === availableCustomFilter.customUrl;
                    });
                return filterData && filterData.enabled;
            })
            .map(filter => filter.filterId);

        // STEP 3 sync enabled filters
        const enabledFilterIds = section.filters['enabled-filters'] || [];
        await syncEnabledFilters([...enabledFilterIds, ...customFilterIdsToEnable]);

        // STEP 4 sync enabled groups
        const enabledGroups = section.filters['enabled-groups'] || [];
        syncEnabledGroups(enabledGroups, dropGroupsEnabled);
    };

    /**
     * Exports settings set in json format
     */
    const loadSettingsBackupJson = async function () {
        const result = {
            'protocol-version': BACKUP_PROTOCOL_VERSION,
        };

        const generalSettingsSection = loadGeneralSettingsSection();
        result['general-settings'] = generalSettingsSection['general-settings'];

        const extensionSpecificSettingsSection = loadExtensionSpecificSettingsSection();
        result['extension-specific-settings'] = extensionSpecificSettingsSection['extension-specific-settings'];

        const filtersSection = await loadFiltersSection();
        result['filters'] = filtersSection['filters'];

        const stealthSection = loadStealthModeSection();
        result['stealth'] = stealthSection['stealth'];

        return JSON.stringify(result);
    };

    /**
     * Validates data
     *
     * @param data
     */
    const validateJSON = (data) => {
        const valid = validateJsonSchema(data);
        if (!valid) {
            log.error(JSON.stringify(validateJsonSchema.errors));
            return false;
        }

        return true;
    };

    /**
     * Imports settings set from json format
     * @param {string} json
     */
    const applySettingsBackupJson = async function (json) {
        function onFinished(success) {
            if (success) {
                log.info('Settings import finished successfully');
            } else {
                log.error('Error importing settings');
            }

            listeners.notifyListeners(listeners.SETTINGS_UPDATED, success);
        }

        let input = null;

        try {
            input = JSON.parse(json);
        } catch (ex) {
            log.error('Error parsing input json {0}, {1}', json, ex);
            onFinished(false);
            return false;
        }

        if (
            !input
            || input['protocol-version'] !== BACKUP_PROTOCOL_VERSION
            || !validateJSON(input)
        ) {
            log.error('Json input is invalid {0}', json);
            onFinished(false);
            return false;
        }

        try {
            // apply stealth settings as soon as possible due to WebRTC permissions. AG-9980
            await applyStealthModeSection(input);
            await applyGeneralSettingsSection(input);
            applyExtensionSpecificSettingsSection(input);
            await applyFiltersSection(input);
            onFinished(true);
            return true;
        } catch (e) {
            log.error(e);
            onFinished(false);
            return false;
        }
    };

    /**
     * Applies default settings
     *
     * @return {Promise<boolean>}
     */
    const applyDefaultSettings = async () => {
        const input = defaultSettings;

        try {
            await applyGeneralSettingsSection(input);
            applyExtensionSpecificSettingsSection(input);
            await applyFiltersSection(input, true);
            await applyStealthModeSection(input);

            await application.addAndEnableFilters(subscriptions.getLangSuitableFilters());

            return true;
        } catch (e) {
            log.error(e);
            return false;
        }
    };

    // EXPOSE
    return {
        /**
         * Loads settings backup json
         */
        loadSettingsBackup: loadSettingsBackupJson,

        /**
         * Applies settings backup json
         */
        applySettingsBackup: applySettingsBackupJson,

        /**
         * Applies default settings json
         */
        applyDefaultSettings,
    };
})();
