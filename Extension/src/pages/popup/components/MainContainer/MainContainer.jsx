import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { popupStore } from '../../stores/PopupStore';
import { rootStore } from '../../../options/stores/RootStore';
import { messenger } from '../../../services/messenger';
import { hasAllOptionalPermissions } from '../../../../background/utils/optional-permissions';

import Main from './Main';
import SettingsView from './SettingsView';
import TabStatsView from './TabStatsView';
import GlobalStatsView from './GlobalStatsView';

import './main-container.css';

export const MainContainer = observer(() => {
    const location = useLocation();

    const store = useContext(popupStore);
    const { settingsStore } = React.useContext(rootStore);
    const { protectionLevel } = settingsStore;

    React.useEffect(() => {
        (async () => {
            if (protectionLevel) {
                const isPermissionsGranted = await hasAllOptionalPermissions();
                if (isPermissionsGranted) {
                    await messenger.applyQwantSettings(protectionLevel);
                }
            }
        })();
    }, [protectionLevel]);

    React.useEffect(() => {
        const removeListenerCallback = () => { };

        (async () => {
            await store.getPopupData();
            await settingsStore.requestOptionsData(true);
        })();

        return () => {
            removeListenerCallback();
        };
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
