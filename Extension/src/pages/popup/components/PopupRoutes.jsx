import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { useAsyncEffect } from '~src/pages/common/hooks/useAsyncEffect';
import { useAsync } from 'react-use';
import { hasAllOptionalPermissions } from '~src/background/utils/optional-permissions';
import { popupStore } from '../stores/PopupStore';
import { rootStore } from '../../options/stores/RootStore';
import { messenger } from '../../services/messenger';

import { LoadingView } from './LoadingView/LoadingView';

const Main = React.lazy(() => import('./MainView/MainView'));
const SettingsView = React.lazy(() => import('./SettingsView/SettingsView'));
const TabStatsView = React.lazy(() => import('./TabStatsView/TabStatsView'));
const GlobalStatsView = React.lazy(() => import('./GlobalStatsView/GlobalStatsView'));
const AboutView = React.lazy(() => import('./AboutView/AboutView'));

export const PopupRoutes = observer(() => {
    const location = useLocation();

    const store = useContext(popupStore);
    const { settingsStore } = React.useContext(rootStore);

    const { getPopupData } = store;
    const { protectionLevel, requestOptionsData } = settingsStore;

    useAsync(async () => {
        if (!protectionLevel) return;
        const isPermissionsGranted = await hasAllOptionalPermissions();
        if (isPermissionsGranted) {
            messenger.applyQwantSettings(protectionLevel);
        }
    }, [protectionLevel]);

    useAsyncEffect(async () => {
        await getPopupData();
        await requestOptionsData(true);
    }, [requestOptionsData, getPopupData]);

    return (
        <Routes location={location}>
            <Route
                path="main"
                element={(
                    <React.Suspense fallback={<LoadingView />}>
                        <Main store={store} settingsStore={settingsStore} />
                    </React.Suspense>
                )}
            />
            <Route
                path="settings"
                element={(
                    <React.Suspense fallback={<LoadingView />}>
                        <SettingsView store={store} settingsStore={settingsStore} />
                    </React.Suspense>
                )}
            />
            <Route
                path="tab-stats"
                element={(
                    <React.Suspense fallback={<LoadingView />}>
                        <TabStatsView store={store} settingsStore={settingsStore} />
                    </React.Suspense>
                )}
            />
            <Route
                path="global-stats"
                element={(
                    <React.Suspense fallback={<LoadingView />}>
                        <GlobalStatsView store={store} settingsStore={settingsStore} />
                    </React.Suspense>
                )}
            />
            <Route
                path="about"
                element={(
                    <React.Suspense fallback={<LoadingView />}>
                        <AboutView store={store} settingsStore={settingsStore} />
                    </React.Suspense>
                )}
            />
        </Routes>
    );
});
