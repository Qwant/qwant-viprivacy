/* eslint-disable max-len */
import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';

import { MESSAGE_TYPES } from '~src/common/constants';
import { browser } from '~src/background/extension-api/browser';
import { hasAllOptionalPermissions } from '~src/background/utils/optional-permissions';
import { Stack } from '@qwant/qwant-ponents';
import { LoadingView } from './LoadingView';
import { GlobalStats } from './GlobalStats/GlobalStats';
import { PermissionsMissing } from './PermissionsMissing';
import { ProtectionLevel } from './ProtectionLevel/ProtectionLevel';
import { ProtectionStatus } from './ProtectionStatus/ProtectionStatus';

import { messenger } from '../../../services/messenger';

const Main = observer(({ store, settingsStore }) => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = React.useState(false);
    const [hasPermissions, setHasPermissions] = React.useState(null);
    const isReady = !isLoading && store.isInitialDataReceived;

    React.useEffect(() => {
        const checkRequestFilterReady = async () => {
            setLoading(true);
            const response = await messenger.sendMessage(MESSAGE_TYPES.CHECK_REQUEST_FILTER_READY);

            if (response?.ready) {
                setLoading(false);
            } else {
                setTimeout(checkRequestFilterReady, 500);
            }
        };
        checkRequestFilterReady();
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
        </Stack>
    );
});

export default Main;
