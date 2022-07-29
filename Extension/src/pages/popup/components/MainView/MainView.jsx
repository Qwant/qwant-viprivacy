/* eslint-disable max-len */
import { Stack } from '@qwant/qwant-ponents';
import { observer } from 'mobx-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { browser } from '~src/background/extension-api/browser';
import { hasAllOptionalPermissions } from '~src/background/utils/optional-permissions';
import { MESSAGE_TYPES } from '~src/common/constants';
import { MainLinks } from '~src/pages/popup/components/MainLinks/MainLinks';

import { messenger } from '../../../services/messenger';
import { LoadingView } from '../LoadingView/LoadingView';
import { GlobalStats } from './GlobalStats/GlobalStats';
import Styles from './MainView.module.scss';
import { PermissionsMissing } from './PermissionsMissing/PermissionMissing';
import { ProtectionLevel } from './ProtectionLevel/ProtectionLevel';
import { ProtectionStatus } from './ProtectionStatus/ProtectionStatus';

const Main = observer(({ store, settingsStore }) => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = React.useState(false);
    const [hasPermissions, setHasPermissions] = React.useState(null);
    const isReady = !isLoading && store.isInitialDataReceived;

    React.useEffect(() => {
        let timer;

        const checkRequestFilterReady = async () => {
            setLoading(true);
            const response = await messenger.sendMessage(MESSAGE_TYPES.CHECK_REQUEST_FILTER_READY);

            if (response?.ready) {
                setLoading(false);
            } else {
                timer = setTimeout(checkRequestFilterReady, 500);
            }
        };

        checkRequestFilterReady();

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            const isPermissionsGranted = await hasAllOptionalPermissions();
            setHasPermissions(isPermissionsGranted);
            setLoading(false);
        })();
    }, []);

    const onRequestPermissions = () => {
        browser.runtime.openOptionsPage();
    };

    if (hasPermissions === false) {
        return (
            <PermissionsMissing onRequestPermissions={onRequestPermissions} />
        );
    }

    if (!isReady) {
        return <LoadingView />;
    }

    return (
        <Stack gap="s">
            <ProtectionStatus
                totalBlockedTab={store.totalBlockedTab}
                currentSite={store.currentSite}
                toggleAllowlisted={store.toggleAllowlisted}
                changeApplicationFilteringDisabled={store.changeApplicationFilteringDisabled}
                popupState={store.popupState}
                onClick={() => navigate('/tab-stats')}
            />
            <ProtectionLevel
                protectionLevel={settingsStore.protectionLevel}
                applicationFilteringDisabled={store.applicationFilteringDisabled}
                onClick={() => navigate('/settings')}
            />
            <GlobalStats
                showGlobalStats={store.showGlobalStats}
                totalBlocked={store.totalBlocked}
            />
            <div className={Styles.MainLinks}>
                <MainLinks withStats />
            </div>
        </Stack>
    );
});

export default Main;
