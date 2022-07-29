import {
    Button, Card, Flex, IconArrowRightSLine, Stack, Text,
} from '@qwant/qwant-ponents';
import cx from 'classnames';
import React, { useEffect } from 'react';
import { RiShieldCheckLine } from 'react-icons/ri';
import ReactSwitch from 'react-switch';

import { t } from '~src/common/translators/reactTranslator';
import { useAutoAnimate } from '~src/pages/common/hooks/useAutoanimate';
import { ShieldCount } from '~src/pages/popup/components/MainView/ShieldCount/ShieldCount';

import { POPUP_STATES } from '../../../constants';
import { isWebURL } from '../../../helpers';
import Styles from './ProtectionStatus.module.scss';

const STATES = {
    DISABLED: 'disabled',
    ENABLED: 'enabled',
    ALLOWLISTED: 'unavailable',
};

const TITLES = {
    [STATES.DISABLED]: 'popup_main_protection_disabled',
    [STATES.ALLOWLISTED]: 'popup_main_protection_unavailable',
    [STATES.ENABLED]: 'popup_stats_blocked_elements',
};

const COLORS = {
    [STATES.DISABLED]: 'grey',
    [STATES.ALLOWLISTED]: 'red',
    [STATES.ENABLED]: 'green',
};

const stopPropagation = (e) => e.stopPropagation();

export const ProtectionStatus = ({
    totalBlockedTab,
    currentSite,
    toggleAllowlisted,
    changeApplicationFilteringDisabled,
    popupState,
    onClick,
}) => {
    const isValidURL = isWebURL(currentSite);
    // For unreachable URLs (example chrome://), fake the state of protection to avoid confusing users
    const [fakeEnable, setFakeEnable] = React.useState(() => {
        if (isValidURL) return popupState === POPUP_STATES.APPLICATION_ENABLED;
        return true;
    });

    useEffect(() => {
        if (isValidURL) {
            setFakeEnable(popupState === POPUP_STATES.APPLICATION_ENABLED);
        }
    }, [isValidURL, popupState]);

    const switchersMap = {
        [POPUP_STATES.APPLICATION_ENABLED]: {
            handler: () => toggleAllowlisted(),
            state: STATES.ENABLED,
        },
        [POPUP_STATES.APPLICATION_FILTERING_DISABLED]: {
            handler: () => changeApplicationFilteringDisabled(false),
            state: STATES.DISABLED,
        },
        [POPUP_STATES.APPLICATION_UNAVAILABLE]: {
            handler: () => {
                if (!isValidURL) {
                    setFakeEnable((v) => !v);
                }
            },
            state: fakeEnable ? STATES.ENABLED : STATES.ALLOWLISTED,
        },
        [POPUP_STATES.SITE_IN_EXCEPTION]: {
            handler: () => {
                if (!isValidURL) {
                    setFakeEnable((v) => !v);
                }
            },
            state: STATES.ENABLED,
        },
        [POPUP_STATES.SITE_ALLOWLISTED]: {
            handler: () => toggleAllowlisted(),
            state: STATES.ALLOWLISTED,
        },
    };

    const { state } = switchersMap[popupState];
    const handleChange = switchersMap[popupState].handler;
    const isDisabled = state === STATES.DISABLED;
    const isEnabled = state === STATES.ENABLED || fakeEnable;
    const showDomain = state !== STATES.DISABLED && isValidURL;
    const showToggle = !isDisabled;
    const className = cx(
        Styles.ProtectionStatus,
        isDisabled && Styles.ProtectionStatusDisabled,
        state === STATES.ALLOWLISTED && Styles.ProtectionStatusUnavailable,
    );
    const handleClick = isEnabled ? onClick : null;
    const [animationParent] = useAutoAnimate();

    return (
        <Card
            ref={animationParent}
            relative
            mt="xl2"
            className={className}
            onClick={handleClick}
        >
            <ShieldCount
                className={Styles.ProtectionStatusShield}
                count={isEnabled ? totalBlockedTab : undefined}
                color={COLORS[state]}
            />

            {isEnabled && (
                <Text typo="heading-5" color="primary" raw>
                    <Flex alignCenter className={Styles.ProtectionStatusDetail}>
                        <Text typo="body-2" color="primary">{t('popup_main_protection_detail')}</Text>
                        <IconArrowRightSLine />
                    </Flex>
                </Text>
            )}

            <Stack gap="s" p="s" as={isEnabled ? 'button' : 'a'}>
                <Stack gap="xxs">
                    <Text typo="heading-5" bold color="primary" center as="h1">
                        {t(TITLES[state])}
                    </Text>
                    {showDomain && (
                        <Text typo="body-2" color="primary" center as="h2">
                            {t('popup_main_nbr_blocked_elements_domain', {
                                domain: currentSite,
                            })}
                        </Text>
                    )}
                </Stack>
                {isEnabled && showToggle && (
                    <Text typo="caption-1" color="primary" center as="p">
                        {t('popup_main_problem_disable_protection')}
                    </Text>
                )}
                {isDisabled && (
                    <Button mt="s" onClick={handleChange} variant="primary-black" full>
                        <RiShieldCheckLine />
                        {t('popup_main_protection_enable')}
                    </Button>
                )}
            </Stack>

            {showToggle && (
                <Text typo="body-2" bold raw>
                    <Flex onClick={stopPropagation} as="label" htmlFor="switchProtection" between alignCenter className={Styles.ProtectionStatusFooter} gap="s" py="xs" px="s">
                        {t(isEnabled ? 'popup_main_protection_enabled' : 'popup_main_protection_disabled')}
                        <ReactSwitch
                            checked={isEnabled}
                            onChange={handleChange}
                            offColor="#ff5c5f"
                            onColor="#38a870"
                            handleDiameter={20}
                            width={48}
                            height={28}
                            checkedHandleIcon={null}
                            uncheckedIcon={null}
                            uncheckedHandleIcon={null}
                            checkedIcon={null}
                            id="switchProtection"
                        />
                    </Flex>
                </Text>
            )}
        </Card>
    );
};
