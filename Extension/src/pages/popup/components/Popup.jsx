import React from 'react';
import { observer } from 'mobx-react';
import { useErrorBoundary } from 'use-error-boundary';
import { useLocation, useNavigate } from 'react-router-dom';

import { apm } from '~src/background/apm';
import { Box } from '@qwant/qwant-ponents';
import { PopupHeader } from '~src/pages/popup/components/PopupHeader';
import { popupStore } from '../stores/PopupStore';
import { rootStore } from '../../options/stores/RootStore';
import { messenger } from '../../services/messenger';
import ErrorView from './ErrorView';
import { PopupRoutes } from './PopupRoutes';
import Styles from './Popup.module.scss';

export const Popup = observer(() => {
    const location = useLocation();
    const navigate = useNavigate();

    const { settingsStore } = React.useContext(rootStore);
    const { ErrorBoundary, didCatch, error } = useErrorBoundary();
    const { getPopupData, updateBlockedStats } = React.useContext(popupStore);

    const { settings } = settingsStore;
    const key = settings?.names?.DISABLE_COLLECT_HITS;
    const disableCollectHit = key ? settings?.values[key] || false : false;

    React.useEffect(() => {
        getPopupData();
    }, [getPopupData]);

    React.useEffect(() => {
        const messageHandler = (message) => {
            switch (message.type) {
                case 'android-go-back': {
                    if (location.pathname === '/main') {
                        window.close();
                    } else {
                        navigate('/main');
                    }
                    break;
                }
                default:
                    break;
            }
        };

        messenger.onMessage.addListener(messageHandler);

        return () => {
            messenger.onMessage.removeListener(messageHandler);
        };
    }, [location.pathname, navigate]);

    React.useEffect(() => {
        if (!location.pathname) return;

        const transaction = window?.apm?.startTransaction(`popup-navigate-${location.pathname.replace('/', '')}`);
        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    }, [location.pathname]);

    // subscribe to stats change
    React.useEffect(() => {
        const messageHandler = (message) => {
            switch (message.type) {
                case 'updateTotalBlocked': {
                    const { tabInfo } = message;
                    updateBlockedStats(tabInfo);
                    break;
                }
                default:
                    break;
            }
        };
        messenger.onMessage.addListener(messageHandler);
        return () => {
            messenger.onMessage.removeListener(messageHandler);
        };
    }, [updateBlockedStats]);

    React.useEffect(() => {
        if (!disableCollectHit) {
            apm.init(true);
        } else {
            console.warn('APM disabled'); // eslint-disable-line no-console
        }
    }, [disableCollectHit]);

    if (didCatch) {
        return <ErrorView error={error} />;
    }

    return (
        <ErrorBoundary>
            <PopupHeader />
            <Box p="s" className={Styles.Popup}>
                <PopupRoutes />
            </Box>
        </ErrorBoundary>
    );
});
