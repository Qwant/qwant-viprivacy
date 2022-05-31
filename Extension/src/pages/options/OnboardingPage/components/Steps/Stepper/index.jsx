/* eslint-disable max-len */
import cx from 'classnames';
import React from 'react';

import { States } from '../../../stateMachine';
import { Button } from '../../../../../common/components/Button';
import { reactTranslator } from '../../../../../../common/translators/reactTranslator';

import './styles.css';

export const Stepper = ({
    isLoading, state, onForward, onBack,
}) => {
    const states = Object.keys(state.machine.config.states).filter((key) => !state.machine.config.states[key].meta.skip);

    const showIndicators = state.value !== States.PERMISSIONS_REJECTED && state.value !== States.THANK_YOU;
    const showBackButton = !!state.machine.states?.[state.value]?.config?.on?.PREVIOUS;
    const showForwardButton = state.value !== States.THANK_YOU;

    return (
        <div className="stepper">

            <div className="stepper__left">
                <Button
                    color="secondary"
                    hidden={!showBackButton}
                    onClick={onBack}
                    isLoading={isLoading}
                    name={`btn-back_${state.value}`}
                >
                    {reactTranslator.getMessage('onboarding_stepper_back')}
                </Button>
            </div>

            <div className="indicators_wrapper">
                <div className={cx('indicators', {
                    hidden: !showIndicators,
                })}
                >
                    {states.map((item) => (
                        <div
                            key={item}
                            className={cx('indicator', {
                                'indicator-active': item === state.value,
                            })}
                        />
                    ))}
                </div>
            </div>

            <div className="stepper__right">
                <Button
                    color="primary"
                    onClick={onForward}
                    hidden={!showForwardButton}
                    isLoading={isLoading}
                    name={`btn-forward_${state.value}`}
                >
                    <ButtonForwardText step={state.value} />
                </Button>
            </div>

        </div>
    );
};

const ButtonForwardText = ({ step }) => {
    switch (step) {
        case States.REQUEST_PERMISSIONS:
            return reactTranslator.getMessage('onboarding_stepper_authorize');

        case States.TELEMETRY:
            return reactTranslator.getMessage('onboarding_stepper_finish');

        case States.PERMISSIONS_REJECTED:
            return reactTranslator.getMessage('onboarding_stepper_i_understand');

        case States.THANK_YOU:
            return reactTranslator.getMessage('onboarding_stepper_lets_go');

        default:
            return reactTranslator.getMessage('onboarding_stepper_next_step');
    }
};
