import React from 'react';
import { reactTranslator } from '../../../../../../../common/translators/reactTranslator';
import { POPUP_STATES } from '../../../../../constants';
import { Check } from './Check';
import { ArrowRight } from '../../../components/Icons';
import { Section } from '../Section';

import './styles.css';
import { isWebURL } from '../../../helpers';

const getBackgroundColor = (switcherMode, protectionEnabledLocal) => {
    if (switcherMode === 'enabled' || protectionEnabledLocal) {
        return '#85d6ad';
    }
    return '#e9eaec';
};

export const ProtectionStatus = ({
    totalBlockedTab, currentSite, toggleAllowlisted, changeApplicationFilteringDisabled, popupState,
    onClick,
}) => {
    const isValidURL = isWebURL(currentSite);
    // eslint-disable-next-line max-len
    const [protectionEnabledLocal, setProtectionEnabledLocal] = React.useState(() => {
        if (isValidURL) return popupState === POPUP_STATES.APPLICATION_ENABLED;
        return true;
    });

    React.useEffect(() => {
        if (isValidURL) {
            setProtectionEnabledLocal(popupState === POPUP_STATES.APPLICATION_ENABLED);
        }
    }, [isValidURL, popupState]);

    const switchersMap = {
        [POPUP_STATES.APPLICATION_ENABLED]: {
            handler: () => {
                toggleAllowlisted();
            },
            mode: 'enabled',
        },
        [POPUP_STATES.APPLICATION_FILTERING_DISABLED]: {
            handler: () => {
                changeApplicationFilteringDisabled(false);
            },
            mode: 'disabled',
        },
        [POPUP_STATES.APPLICATION_UNAVAILABLE]: {
            handler: () => {
                if (!isValidURL) { setProtectionEnabledLocal((v) => !v); }
            },
            mode: 'unavailable',
        },
        [POPUP_STATES.SITE_IN_EXCEPTION]: {
            handler: () => {
                if (!isValidURL) { setProtectionEnabledLocal((v) => !v); }
            },
            mode: 'in-exception',
        },
        [POPUP_STATES.SITE_ALLOWLISTED]: {
            handler: () => {
                toggleAllowlisted();
            },
            mode: 'allowlisted',
        },
    };

    const switcher = switchersMap[popupState];
    const backgroundColor = getBackgroundColor(switcher.mode, protectionEnabledLocal);
    const title = reactTranslator.getMessage(switcher.mode === 'enabled' || protectionEnabledLocal ? 'popup_main_protection_enabled' : 'popup_main_protection_disabled');

    return (
        <div className="protection_status__section">
            <Section
                title={title}
                text={(
                    <div className="protection_status_count_domain">
                        {reactTranslator.getMessage('popup_main_nbr_blocked_elements', {
                            count: totalBlockedTab,
                        })}
                        {' '}
                        {isValidURL && (
                            <span>
                                {reactTranslator.getMessage('popup_main_nbr_blocked_elements_domain', {
                                    domain: currentSite,
                                })}
                            </span>
                        )}
                        <br />
                        <div
                            style={{
                                visibility: switcher.mode === 'enabled' ? 'visible' : 'hidden',
                            }}
                        >
                            {reactTranslator.getMessage('popup_main_problem_disable_protection')}
                        </div>
                    </div>
                )}
                onClick={onClick}
                background={backgroundColor}
            >
                <div className="protection_status__bottom">
                    <Check
                        onChange={() => switcher.handler()}
                        checked={switcher.mode === 'enabled' || protectionEnabledLocal}
                    />
                    <div className="right-side">
                        <span className="total_blocked_count">
                            {totalBlockedTab}
                        </span>
                        <ArrowRight />
                    </div>
                </div>
            </Section>
        </div>
    );
};
