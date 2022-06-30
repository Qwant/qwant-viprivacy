import React from 'react';
import { observer } from 'mobx-react';
import { useErrorBoundary } from 'use-error-boundary';
import { useLocation } from 'react-router-dom';

import { apm } from '~src/background/apm';
import { Box } from '@qwant/qwant-ponents';
import { PopupHeader } from '~src/pages/popup/components/PopupHeader';
import { popupStore } from '../stores/PopupStore';
import { rootStore } from '../../options/stores/RootStore';
import { messenger } from '../../services/messenger';
import ErrorView from './ErrorView';
import { PopupRoutes } from './PopupRoutes';

export const Popup = observer(() => {
    const { pathname } = useLocation();
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
        if (!pathname) return;

        const transaction = window?.apm?.startTransaction(`popup-navigate-${pathname.replace('/', '')}`);
        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    }, [pathname]);

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
            <Box p="s">
                <PopupHeader />
                <PopupRoutes />
            </Box>
        </ErrorBoundary>
    );
});
