import React from 'react';
import { observer } from 'mobx-react';
import { useBeforeUnload } from 'react-use';

import { MESSAGE_TYPES } from '../../../../common/constants';
import { browser } from '../../../../background/extension-api/browser';
import { hasAllOptionalPermissions, requestOptionalPermissions } from '../../../../background/utils/optional-permissions';
import { rootStore } from '../../stores/RootStore';
import { messenger } from '../../../services/messenger';
import { apm } from '../../../../background/apm';
import { browserUtils } from '../../../../background/utils/browser-utils';

const applyQwantSettings = async ({ protectionLevel }) => {
    const value = await messenger.checkSettingsApplied(protectionLevel);
    if (!value) {
        await messenger.changeProtectionLevel(protectionLevel);
    }
};

const isChrome = browserUtils.isChromeBrowser();
const isEdge = browserUtils.isEdgeChromiumBrowser();
// const isFirefox = browserUtils.isFirefoxBrowser();

const Permissions = observer(() => {
    const { settingsStore } = React.useContext(rootStore);
    const { settings, protectionLevel } = settingsStore;
    const disableCollectHit = settings.values[settings.names.DISABLE_COLLECT_HITS];

    React.useEffect(() => {
        if (!disableCollectHit) {
            apm.init(true);
        } else {
            console.warn('APM disabled'); // eslint-disable-line no-console
        }
    }, [disableCollectHit]);

    // 'protection-level' 'pin' 'permissions-refused' 'telemetry' 'thank-you'
    const [step, setStep] = React.useState('permissions-request');
    const [hasPermissions, setHasPermissions] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [afterTimeout, setAfterTimeout] = React.useState(false);

    useBeforeUnload(isLoading, 'Wait until loading finishes');

    React.useEffect(() => {
        const listener = (message) => {
            if (message?.type === MESSAGE_TYPES.QWANT_SETTINGS_APPLIED) {
                setStep('protection-level');
                setLoading(false);
            }
        };
        browser.runtime.onMessage.addListener(listener);

        (async () => {
            setLoading(true);

            const isPermissionsGranted = await hasAllOptionalPermissions();

            setHasPermissions(isPermissionsGranted);

            setLoading(false);

            if (isPermissionsGranted) {
                setStep('thank-you');
            }
        })();

        return () => {
            browser.runtime.onMessage.removeListener(listener);
        };
    }, []);

    React.useEffect(() => {
        (async () => {
            if (!hasPermissions) return;
            await applyQwantSettings({ protectionLevel });
        })();
    }, [protectionLevel, hasPermissions]);

    const onGrantPermissions = async () => {
        const isPermissionsGranted = await requestOptionalPermissions();
        setHasPermissions(isPermissionsGranted);
        setLoading(true);

        if (isPermissionsGranted) {
            browser.runtime.sendMessage({
                type: MESSAGE_TYPES.START_TRACKING_BLOCKER,
                data: { message: 'permissions-accepted' },
            });

            setTimeout(() => {
                setAfterTimeout(true);
                setStep('protection-level');
                setLoading(false);
            }, 30000);
        } else {
            setLoading(false);
            setStep('permissions-refused');
        }
    };

    const onDenyPermissions = () => {
        setStep('permissions-refused');
    };

    const updateTelemetry = (enabled) => {
        messenger.changeUserSetting('hits-count-disabled', !enabled);
    };

    const updateProtectionLevel = async (value) => {
        setLoading(true);

        await messenger.changeProtectionLevel(value);

        setLoading(false);
    };

    const onReload = async () => {
        if (hasPermissions) {
            setLoading(true);
            await applyQwantSettings({ protectionLevel });
        }

        browser.tabs.create({ active: true, url: 'https://qwant.com' });
        browser.runtime.reload();
    };

    if (step === 'permissions-request') {
        return (
            <div>
                You are missing permissions, here is why we need them.
                {' '}
                {isLoading && <span>Loading...</span>}
                <div>
                    <button name="grant-permission" type="button" disabled={isLoading} onClick={onGrantPermissions}>Grant</button>
                </div>
                <br />
                <div>
                    <button name="deny-permission" type="button" disabled={isLoading} onClick={onDenyPermissions}>Deny</button>
                </div>
            </div>
        );
    }

    if (step === 'protection-level') {
        return (
            <div>
                Choose a protection level:
                {' '}
                {protectionLevel}
                {' '}
                {/* eslint-disable-next-line max-len */}
                {afterTimeout && <div>Skipped some steps (after 30 seconds) but you can continue ...</div>}
                {isLoading && <span>Loading...</span>}
                <div>
                    <button name="level-standard" type="button" disabled={protectionLevel === 'standard'} onClick={() => updateProtectionLevel('standard')}>Standard</button>
                    <button name="level-strict" type="button" disabled={protectionLevel === 'strict'} onClick={() => updateProtectionLevel('strict')}>Strict</button>
                </div>
                <br />
                <br />
                <div>
                    <button
                        type="button"
                        name="next_protection-level"
                        onClick={() => {
                            if (isChrome || isEdge) {
                                setStep('pin');
                            } else {
                                setStep('telemetry');
                            }
                        }}
                    >
                        Suivant
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'permissions-refused') {
        return (
            <div>
                You can keep using the extension, and setup later.
                <div>
                    <a href="https://qwant.com">Go to qwant</a>
                </div>
            </div>
        );
    }

    if (step === 'pin') {
        return (
            <div>
                Pin the extension like this
                <iframe title="giphy" src="https://giphy.com/embed/ao9DUiTKH60XS" width="480" height="425" frameBorder="0" className="giphy-embed" allowFullScreen />

                <div>
                    <button name="next_pin" type="button" onClick={() => setStep('telemetry')}>Suivant</button>
                </div>
            </div>
        );
    }

    if (step === 'telemetry') {
        return (
            <div>
                Enable telemetry
                {' '}
                {isLoading && <span>Loading...</span>}
                <div>
                    You can disable at any time in the future
                </div>

                <div>
                    <button name="next_enable-telemetry" type="button" disabled={!disableCollectHit} onClick={() => updateTelemetry(true)}>Enable</button>
                    <button name="next_disable-telemetry" type="button" disabled={disableCollectHit} onClick={() => updateTelemetry(false)}>Disable</button>
                </div>
                <div>
                    <button name="next_thank-you" type="button" onClick={() => setStep('thank-you')}>Suivant</button>
                </div>
            </div>
        );
    }

    if (step === 'thank-you') {
        return (
            <div>
                You are all setup ! Thanks for installing Qwant
                <br />
                <button name="next_finish" type="button" onClick={onReload}>
                    Click here to finish setup
                </button>
            </div>
        );
    }

    return (
        <div>
            There seems to be an issue ! =X
        </div>
    );
});

export { Permissions };
