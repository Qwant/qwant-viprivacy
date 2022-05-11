import React from 'react';
import { observer } from 'mobx-react';
import { useErrorBoundary } from 'use-error-boundary';

import { popupStore } from '../../stores/PopupStore';
import { rootStore } from '../../../options/stores/RootStore';
import { messenger } from '../../../services/messenger';
import { MainContainer } from '../MainContainer/MainContainer';
import { apm } from '../../../../background/apm';

import './main.css';

export const Popup = observer(() => {
    const { settingsStore } = React.useContext(rootStore);
    const { ErrorBoundary, didCatch, error } = useErrorBoundary();
    const { getPopupData, updateBlockedStats } = React.useContext(popupStore);

    const { settings } = settingsStore;
    const key = settings?.names?.DISABLE_COLLECT_HITS;
    const disableCollectHit = key ? settings?.values[key] || false : false;

    React.useEffect(() => {
        (async () => {
            await getPopupData();
        })();
    }, [getPopupData]);

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
        // TODO Handle Error state
        return (
            <p>
                Error:
                {' '}
                {error.message}
            </p>
        );
    }

    return (
        <ErrorBoundary>
            <MainContainer />
        </ErrorBoundary>
    );
});
