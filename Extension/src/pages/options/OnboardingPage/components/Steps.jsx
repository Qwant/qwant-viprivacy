import React, { useMemo } from 'react';

import { Events, States } from '~pages/options/OnboardingPage/stateMachine';

import { reactTranslator } from '~common/translators/reactTranslator';

import { Box, Button, Flex } from '@qwant/qwant-ponents';
import { QwantLogo } from '~pages/popup/components/MainContainer/components/QwantLogo.jsx';
import Styles from './Steps.module.scss';
import { ButtonForwardText } from './ButtonForwardText';
import { StepPermissions } from './StepPermissions';
import { StepSelectMode } from './StepSelectMode';
import { StepProtectionLevel } from './StepProtectionLevel';

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
}) => {
    const showBackButton = !!state.machine.states?.[state.value]?.config?.on?.PREVIOUS;
    const showForwardButton = state.value !== States.THANK_YOU;

    return (
        <div className={Styles.StepsWrapper}>
            <Box my="xl" className={Styles.Steps}>
                <Box className={Styles.StepsHeader} px="xl" py="l">
                    <a name="qwant-logo-link" href="https://qwant.com" target="_blank" rel="noreferrer">
                        <QwantLogo />
                    </a>
                </Box>
                <Box p="xl" relative>
                    <Content
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
            <Box className={Styles.StepsFooter}>
                <div>
                    {showBackButton && (
                        <Button
                            variant="secondary-black"
                            onClick={onBack}
                            loading={isLoading}
                            size="large"
                            name={`btn-back_${state.value}`}
                        >
                            {reactTranslator.getMessage('onboarding_stepper_back')}
                        </Button>
                    )}
                </div>
                <div>
                    <StepsIndicators state={state.value} states={state.machine.config.states} />
                </div>
                <div>
                    {showForwardButton && (
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
        </div>
    );
};

/**
 * Displays a bullet list indicating the progress
 *
 * @param {string} state Current state name
 * @param {{[string]: {meta: {skip: boolean}}}} states
 */
function StepsIndicators({
    state,
    states,
}) {
    const statesKeys = useMemo(() => Object.keys(states)
        .filter((key) => !states[key].meta.skip), [states]);
    return (
        <Flex alignCenter center className={Styles.StepsIndicators}>
            {statesKeys.map((stateName) => (
                <div
                    key={stateName}
                    aria-current={stateName === state ? true : undefined}
                />
            ))}
        </Flex>
    );
}

const Content = ({
    state,
    updateProtectionLevel,
    send,
    protectionLevel,
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
        case States.PIN_EXTENSION:
            return null;
        case States.TELEMETRY:
            return null;
        case States.THANK_YOU:
            return null;
        default:
            return null;
    }
};
