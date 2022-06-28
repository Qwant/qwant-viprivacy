import { States } from '~pages/options/OnboardingPage/stateMachine';
import { reactTranslator } from '~common/translators/reactTranslator';

export const ButtonForwardText = ({ step }) => {
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
