import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { useAsyncEffect } from '~src/pages/common/hooks/useAsyncEffect';
import { useAsync } from 'react-use';
import { hasAllOptionalPermissions } from '~src/background/utils/optional-permissions';
import { popupStore } from '../stores/PopupStore';
import { rootStore } from '../../options/stores/RootStore';
import { messenger } from '../../services/messenger';

import Main from './MainView';
import SettingsView from './SettingsView/SettingsView';
import TabStatsView from './TabStatsView/TabStatsView';
import GlobalStatsView from './GlobalStatsView/GlobalStatsView';

export const PopupRoutes = observer(() => {
    const location = useLocation();

    const store = useContext(popupStore);
    const { settingsStore } = React.useContext(rootStore);
    const { protectionLevel } = settingsStore;

    useAsync(async () => {
        if (!protectionLevel) return;
        const isPermissionsGranted = await hasAllOptionalPermissions();
        if (isPermissionsGranted) {
            messenger.applyQwantSettings(protectionLevel);
        }
    }, [protectionLevel]);

    useAsyncEffect(async () => {
        await store.getPopupData();
        await settingsStore.requestOptionsData(true);
    }, [settingsStore, store]);

    return (
        <Routes location={location}>
            <Route path="main" element={<Main store={store} settingsStore={settingsStore} />} />
            <Route path="settings" element={<SettingsView store={store} settingsStore={settingsStore} />} />
            <Route path="tab-stats" element={<TabStatsView store={store} settingsStore={settingsStore} />} />
            <Route path="global-stats" element={<GlobalStatsView store={store} settingsStore={settingsStore} />} />
        </Routes>
    );
});
