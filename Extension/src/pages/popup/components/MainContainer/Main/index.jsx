/* eslint-disable max-len */
import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';

import { LoadingView } from './LoadingView';
import { MainHeader } from './components/MainHeader';
import { GlobalStats } from './components/GlobalStats';
import { PermissionsMissing } from './PermissionsMissing';
import { ProtectionLevel } from './components/ProtectionLevel';
import { ProtectionStatus } from './components/ProtectionStatus';

import { messenger } from '../../../../services/messenger';
import { MESSAGE_TYPES } from '../../../../../common/constants';
import { browser } from '../../../../../background/extension-api/browser';
import { hasAllOptionalPermissions } from '../../../../../background/utils/optional-permissions';

import './styles.css';

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
            <div className="main">
                <MainHeader />
                <div className="main__content">
                    <PermissionsMissing onRequestPermissions={onRequestPermissions} />
                </div>
            </div>
        );
    }

    return (
        <div className="main">
            <MainHeader isReady={isReady} showSettings />
            <div className="main__content">
                {isReady ? (
                    <>
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
                            totalBlocked={store.totalBlocked}
                            onClick={() => navigate('/global-stats')}
                        />
                    </>
                ) : (
                    <LoadingView />
                )}
            </div>
        </div>
    );
});

export default Main;
