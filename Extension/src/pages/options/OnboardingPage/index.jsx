import React from 'react';
import { observer } from 'mobx-react';
import { useMachine } from '@xstate/react';

import { apm } from '~src/background/apm';
import { browser } from '~src/background/extension-api/browser';
import { MESSAGE_TYPES, NOTIFIER_TYPES } from '~src/common/constants';
import { hasAllOptionalPermissions, requestOptionalPermissions } from '~src/background/utils/optional-permissions';
import { Steps } from './components/Steps';
import { Events, stateMachine, States } from './stateMachine';

import { rootStore } from '../stores/RootStore';
import { messenger } from '../../services/messenger';
import { urls } from '../../helpers';

export const OnboardingPage = observer(() => {
    const [state, send] = useMachine(stateMachine);
    const timerRef = React.useRef(null);
    const [isLoading, setLoading] = React.useState(false);
    const [isEngineInitialized, setEngineInitialized] = React.useState(false);

    const { settingsStore } = React.useContext(rootStore);
    const { settings, protectionLevel } = settingsStore;
    const key = settings?.names?.DISABLE_COLLECT_HITS;
    const disableCollectHit = key ? settings?.values[key] || false : false;

    React.useEffect(() => {
        (async () => {
            const isPermissionsGranted = await hasAllOptionalPermissions();
            if (isPermissionsGranted) {
                messenger.applyQwantSettings(protectionLevel);
            }
        })();
    }, [protectionLevel]);

    // clear timer
    React.useEffect(() => {
        const timer = timerRef.current;
        return () => { if (timer) clearTimeout(timer); };
    }, []);

    React.useEffect(() => {
        if (!disableCollectHit) {
            apm.init(true);
        } else {
            console.warn('APM disabled'); // eslint-disable-line no-console
        }
    }, [disableCollectHit]);

    // Listen to store changes
    React.useEffect(() => {
        let removeListenerCallback = () => { };
        (async () => {
            await settingsStore.requestOptionsData(true);
            const events = [
                NOTIFIER_TYPES.REQUEST_FILTER_UPDATED,
                NOTIFIER_TYPES.SETTING_UPDATED,
            ];
            removeListenerCallback = await messenger.createEventListener(
                events,
                async (message) => {
                    const { type, data } = message;
                    switch (type) {
                        case NOTIFIER_TYPES.REQUEST_FILTER_UPDATED: {
                            await settingsStore.requestOptionsData();
                            if (data?.[0].rulesCount > 100) {
                                setEngineInitialized(true);
                            }
                            break;
                        }
                        case NOTIFIER_TYPES.SETTING_UPDATED: {
                            await settingsStore.requestOptionsData();
                            break;
                        }
                        default: {
                            // eslint-disable-next-line no-console
                            console.log('Undefined message type:', type);
                            break;
                        }
                    }
                },
            );
        })();
        return () => {
            removeListenerCallback();
        };
    }, [settingsStore]);

    React.useEffect(() => {
        (async () => {
            const isPermissionsGranted = await hasAllOptionalPermissions();
            if (isPermissionsGranted) {
                send(Events.PERMISSIONS_ALREADY_GRANTED);
            }
        })();
    }, [send]);

    React.useEffect(() => {
        if (isEngineInitialized && state.value === States.REQUEST_PERMISSIONS) {
            if (timerRef.current) { // TODO is this still needed?
                clearTimeout(timerRef.current);
            }
            send(Events.NEXT);
            setLoading(false);
        }
    }, [isEngineInitialized, state.value, send]);

    const onRequestPermissions = async () => {
        const isPermissionsGranted = await requestOptionalPermissions();

        if (isPermissionsGranted) {
            setLoading(true);
            const transaction = window?.apm?.startTransaction('options-accepted-permissions');
            browser.runtime.sendMessage({
                type: MESSAGE_TYPES.START_TRACKING_BLOCKER,
                data: { message: 'permissions-accepted' },
            });
            if (transaction) {
                transaction.result = 'success';
                transaction.end();
            }

            // To avoid getting stuck in case of a bug we wait 30 seconds and move on
            timerRef.current = setTimeout(() => {
                send(Events.NEXT);
                setLoading(false);
            }, 30_000);
        } else {
            const transaction = window?.apm?.startTransaction('options-rejected-permissions');
            await onRejectPermissions();
            setLoading(false);
            if (transaction) {
                transaction.result = 'success';
                transaction.end();
            }
        }
    };

    const onRejectPermissions = async () => {
        await messenger.savePermissionsRejected();
        send(Events.REJECT_PERMISSIONS);
    };

    const updateProtectionLevel = async (value) => {
        if (value) {
            setLoading(true);
            await messenger.changeProtectionLevel(value);
            setLoading(false);
        }
    };

    const updateTelemetry = async (enabled) => {
        const transaction = window?.apm?.startTransaction(`options-telemetry-toggle-${enabled ? 'enabled' : 'disabled'}`);
        await messenger.changeUserSetting('hits-count-disabled', !enabled);
        await settingsStore.requestOptionsData();

        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    };

    const onForward = async (e) => {
        const transaction = window?.apm?.startTransaction(`options-button-forward-${e.target.name || 'no_name'}`);

        if (state.value === States.REQUEST_PERMISSIONS) {
            await onRequestPermissions();
        } else if (state.value === States.THANK_YOU) {
            setLoading(true);
            await messenger.applyQwantSettings(protectionLevel);
            browser.tabs.create({ active: true, url: urls.qwant() });
        } else if (state.value === States.PERMISSIONS_REJECTED) {
            const tab = await browser.tabs.getCurrent();
            if (tab.id) {
                browser.tabs.update(tab.id, {
                    active: true,
                    url: urls.qwant(),
                });
            }
        } else {
            send(Events.NEXT);
        }
        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    };

    const onBack = () => {
        send(Events.PREVIOUS);
    };

    const onAlertRequestPermissions = async () => {
        const transaction = window?.apm?.startTransaction('options-button-forward-alert-permission');
        send(Events.DISMISS_ALERT);
        send(Events.ENABLE_PROTECTION);
        const nextState = send(Events.NEXT);
        if (nextState.value === States.REQUEST_PERMISSIONS) {
            await onRequestPermissions();
        }
        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    };

    return (
        <Steps
            send={send}
            state={state}
            isLoading={isLoading}
            protectionLevel={protectionLevel}
            updateProtectionLevel={updateProtectionLevel}
            disableCollectHit={disableCollectHit}
            updateTelemetry={updateTelemetry}
            onForward={onForward}
            onBack={onBack}
            onAlertRequestPermissions={onAlertRequestPermissions}
        />
    );
});
