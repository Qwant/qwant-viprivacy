import React, { useMemo } from 'react';

import { Events, States } from '~src/pages/options/OnboardingPage/stateMachine';

import { t } from '~src/common/translators/reactTranslator';

import { Box, Button, Flex } from '@qwant/qwant-ponents';
import { QwantLogo } from '~src/pages/common/components/QwantLogo/QwantLogo';
import { UpsellMobile } from '~src/pages/options/OnboardingPage/components/UpsellMobile/UpsellMobile';
import Styles from './Steps.module.scss';
import { ButtonForwardText } from './ButtonForwardText';
import { StepPermissions } from './StepPermissions';
import { StepSelectMode } from './StepSelectMode';
import { StepProtectionLevel } from './StepProtectionLevel';
import { StepTelemetry } from './StepTelemetry';
import { StepThanks } from './StepThanks';
import { AlertPermission } from './AlertPermission/AlertPermission';

export const Steps = ({
    isLoading,
    state,
    send,
    updateProtectionLevel,
    protectionLevel,
    disableCollectHit,
    updateTelemetry,
    onForward,
    onBack,
    onAlertRequestPermissions,
}) => {
    const showBackButton = !!state.machine.states?.[state.value]?.config?.on?.PREVIOUS;
    const showForwardButton = !!state.machine.states?.[state.value]?.config?.on?.NEXT;
    const isFinal = state.machine.states?.[state.value]?.type === 'final';
    const { showPermissionAlert } = state.context;

    return (
        <div className={Styles.StepsWrapper}>
            {showPermissionAlert && (
                <AlertPermission
                    onClose={() => send(Events.DISMISS_ALERT)}
                    onRequestPermissions={onAlertRequestPermissions}
                />
            )}
            <Box mt="xl" mb={isFinal ? 's' : 'xl'} className={Styles.Steps}>
                <Flex alignCenter between className={Styles.StepsHeader} px="xl" py="l">
                    <a name="qwant-logo-link" href="https://qwant.com" target="_blank" rel="noreferrer">
                        <QwantLogo />
                    </a>
                    {isFinal && (
                        <Button
                            variant="primary-black"
                            as="a"
                            href="https://qwant.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t('qwant_redirect')}
                        </Button>
                    )}
                </Flex>
                <Box p="xl" relative className={Styles.StepsBody}>
                    <CurrentStep
                        send={send}
                        state={state}
                        isLoading={isLoading}
                        updateProtectionLevel={updateProtectionLevel}
                        protectionLevel={protectionLevel}
                        updateTelemetry={updateTelemetry}
                        disableCollectHit={disableCollectHit}
                    />
                </Box>
            </Box>
            {isFinal
                ? <UpsellMobile />
                : (
                    <StepsNavigation
                        onBack={showBackButton ? onBack : undefined}
                        onForward={showForwardButton ? onForward : undefined}
                        state={state.value}
                        states={state.machine.config.states}
                        isLoading={isLoading}
                    />
                )}
        </div>
    );
};

/**
 * Navigate between onboarding states
 *
 * @param {() => void} onBack
 * @param {boolean} isLoading
 * @param {() => void} onForward
 * @param {string} state Current state name
 * @param {{[string]: {meta: {skip: boolean}}}} states
 */
function StepsNavigation({
    onBack, isLoading, onForward, state, states,
}) {
    const statesKeys = useMemo(() => Object.keys(states)
        .filter((key) => !states[key].meta.skip), [states]);
    return (
        <Box className={Styles.StepsFooter}>
            <div>
                {onBack && (
                    <Button
                        variant="secondary-black"
                        onClick={onBack}
                        disabled={isLoading}
                        size="large"
                        name={`btn-back_${state.value}`}
                    >
                        {t('onboarding_stepper_back')}
                    </Button>
                )}
            </div>
            <div>
                <Flex alignCenter center className={Styles.StepsIndicators}>
                    {statesKeys.map((stateName) => (
                        <div
                            key={stateName}
                            aria-current={stateName === state ? true : undefined}
                        />
                    ))}
                </Flex>
            </div>
            <div>
                {onForward && (
                    <Button
                        variant="primary-black"
                        onClick={onForward}
                        loading={isLoading}
                        size="large"
                        name={`btn-forward_${state.value}`}
                    >
                        <ButtonForwardText step={state.value} />
                    </Button>
                )}
            </div>
        </Box>
    );
}

const CurrentStep = ({
    state,
    updateProtectionLevel,
    send,
    protectionLevel,
    updateTelemetry,
    disableCollectHit,
}) => {
    switch (state.value) {
        case States.SELECT_MODE:
            return (
                <StepSelectMode
                    protectionEnabled={state.context.protectionEnabled}
                    onEnable={() => send(Events.ENABLE_PROTECTION)}
                    onDisable={() => send(Events.DISABLE_PROTECTION)}
                />
            );
        case States.REQUEST_PERMISSIONS:
            return <StepPermissions />;
        case States.PROTECTION_LEVEL:
            return (
                <StepProtectionLevel
                    protectionLevel={protectionLevel}
                    updateProtectionLevel={updateProtectionLevel}
                />
            );
        case States.TELEMETRY:
            return <StepTelemetry onChange={updateTelemetry} checked={!disableCollectHit} />;
        case States.THANK_YOU:
            return <StepThanks />;
        default:
            return null;
    }
};
