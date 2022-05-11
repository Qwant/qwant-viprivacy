import React, {
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import sortBy from 'lodash/sortBy';
import classNames from 'classnames';

import { Group } from './Group';
import { Filter } from './Filter';
import { EmptyCustom } from './EmptyCustom';
import { Search } from './Search';
import { FiltersUpdate } from './FiltersUpdate';
import { rootStore } from '../../stores/RootStore';
import { reactTranslator } from '../../../../common/translators/reactTranslator';
import { AddCustomModal } from './AddCustomModal';
import { SettingsSection } from '../Settings/SettingsSection';
import { Icon } from '../../../common/components/ui/Icon';
import { Setting, SETTINGS_TYPES } from '../Settings/Setting';
import { ANTIBANNER_GROUPS_ID } from '../../../../common/constants';

const QUERY_PARAM_NAMES = {
    GROUP: 'group',
    TITLE: 'title',
    SUBSCRIBE: 'subscribe',
};

const Filters = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const history = useHistory();

    const location = useLocation();
    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [urlToSubscribe, setUrlToSubscribe] = useState(decodeURIComponent(query.get(QUERY_PARAM_NAMES.SUBSCRIBE) || ''));
    const [customFilterTitle, setCustomFilterTitle] = useState(query.get(QUERY_PARAM_NAMES.TITLE));

    const GROUP_DESCRIPTION = {
        0: reactTranslator.getMessage('group_description_custom'),
        1: reactTranslator.getMessage('group_description_adblocking'),
        2: reactTranslator.getMessage('group_description_stealth'),
        3: reactTranslator.getMessage('group_description_social'),
        4: reactTranslator.getMessage('group_description_annoyances'),
        5: reactTranslator.getMessage('group_description_security'),
        6: reactTranslator.getMessage('group_description_miscellaneous'),
        7: reactTranslator.getMessage('group_description_lang'),
    };

    const {
        categories,
        filters,
        filtersToRender,
    } = settingsStore;

    useEffect(() => {
        settingsStore.setSelectedGroupId(query.get(QUERY_PARAM_NAMES.GROUP));
    }, [location.search, query, settingsStore]);

    const handleGroupSwitch = async ({ id, data }) => {
        await settingsStore.updateGroupSetting(id, data);
    };

    const groupClickHandler = (groupId) => () => {
        // Prevent a click event after text selection
        if (!window.getSelection().toString()) {
            settingsStore.setSelectedGroupId(groupId);
            history.push(`/filters?group=${groupId}`);
        }
    };

    const getEnabledFiltersByGroup = (group) => (
        filters.filter((filter) => filter.groupId === group.groupId && filter.enabled)
    );

    const renderGroups = (groups) => {
        const sortedGroups = sortBy(groups, 'displayNumber');
        return sortedGroups.map((group) => {
            const enabledFilters = getEnabledFiltersByGroup(group);
            return (
                <Group
                    key={group.groupId}
                    groupName={group.groupName}
                    groupId={group.groupId}
                    enabledFilters={enabledFilters}
                    groupClickHandler={groupClickHandler(group.groupId)}
                    checkboxHandler={handleGroupSwitch}
                    checkboxValue={!!group.enabled}
                />
            );
        });
    };

    const handleReturnToGroups = () => {
        history.push('/filters');
        settingsStore.setSelectedGroupId(null);
    };

    const renderFilters = (filtersList) => {
        return filtersList
            .map((filter) => <Filter key={filter.filterId} filter={filter} />);
    };

    const openModalHandler = useCallback(() => {
        setModalIsOpen(true);
    }, [setModalIsOpen]);

    const closeModalHandler = () => {
        setModalIsOpen(false);
        setUrlToSubscribe('');
        setCustomFilterTitle('');

        // clear querystring params
        if (query.has(QUERY_PARAM_NAMES.TITLE) || query.has(QUERY_PARAM_NAMES.SUBSCRIBE)) {
            query.delete(QUERY_PARAM_NAMES.TITLE);
            query.delete(QUERY_PARAM_NAMES.SUBSCRIBE);
            history.push(`${history.location.pathname}?${decodeURIComponent(query.toString())}`);
        }
    };

    useEffect(() => {
        if (urlToSubscribe) {
            openModalHandler();
        }
    }, [urlToSubscribe, openModalHandler]);

    const renderAddFilterBtn = (isEmpty) => {
        const buttonClass = classNames('button button--m button--green', {
            'button--empty-custom-filter': isEmpty,
            'button--add-custom-filter': !isEmpty,
        });

        return (
            <button
                type="button"
                onClick={openModalHandler}
                className={buttonClass}
            >
                {reactTranslator.getMessage('options_add_custom_filter')}
            </button>
        );
    };

    if (Number.isInteger(settingsStore.selectedGroupId)) {
        const selectedGroup = categories.find((group) => {
            return group.groupId === settingsStore.selectedGroupId;
        });

        // eslint-disable-next-line max-len
        const isCustom = settingsStore.selectedGroupId === ANTIBANNER_GROUPS_ID.CUSTOM_FILTERS_GROUP_ID;
        const isEmpty = filtersToRender.length === 0;

        const groupChangeHandler = async ({ id, data }) => {
            await settingsStore.updateGroupSetting(id, !data);
        };

        const renderBackButton = () => (
            <>
                <button
                    type="button"
                    className="button setting__back"
                    onClick={handleReturnToGroups}
                >
                    <Icon id="#arrow-back" classname="icon--back" />
                </button>
                <div className="title__inner">
                    <button
                        type="button"
                        onClick={handleReturnToGroups}
                        className="title title--back-btn"
                    >
                        {selectedGroup.groupName}
                    </button>
                    <div className="title__desc title__desc--back">{GROUP_DESCRIPTION[selectedGroup.groupId]}</div>
                </div>
            </>
        );

        return (
            <SettingsSection
                title={selectedGroup.groupName}
                description={GROUP_DESCRIPTION[selectedGroup.groupId]}
                inlineControl={(
                    <Setting
                        id={selectedGroup.groupId}
                        type={SETTINGS_TYPES.CHECKBOX}
                        label={reactTranslator.getMessage('options_privacy_title')}
                        inverted
                        value={!selectedGroup.enabled}
                        handler={groupChangeHandler}
                    />
                )}
                renderBackButton={renderBackButton}
            >
                {isEmpty && isCustom && !settingsStore.isSearching
                    ? <EmptyCustom />
                    : (
                        <>
                            <Search />
                            {renderFilters(filtersToRender)}
                        </>
                    )}
                {isCustom && (
                    <>
                        {renderAddFilterBtn(isEmpty && !settingsStore.isSearching)}
                        <AddCustomModal
                            closeModalHandler={closeModalHandler}
                            modalIsOpen={modalIsOpen}
                            initialUrl={urlToSubscribe}
                            initialTitle={customFilterTitle}
                        />
                    </>
                )}
            </SettingsSection>
        );
    }

    return (
        <SettingsSection
            title={reactTranslator.getMessage('options_filters')}
        >
            <FiltersUpdate />
            {renderGroups(categories)}
        </SettingsSection>
    );
});

export { Filters };
