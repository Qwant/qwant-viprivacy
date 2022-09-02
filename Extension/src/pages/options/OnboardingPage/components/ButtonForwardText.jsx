import { States } from '~src/pages/options/OnboardingPage/stateMachine';
import { t } from '~src/common/translators/reactTranslator';

export const ButtonForwardText = ({ step }) => {
    switch (step) {
        case States.REQUEST_PERMISSIONS:
            return t('onboarding_stepper_authorize');

        case States.TELEMETRY:
            return t('onboarding_stepper_finish');

        case States.PERMISSIONS_REJECTED:
            return t('onboarding_stepper_i_understand');

        case States.THANK_YOU:
            return t('onboarding_stepper_lets_go');

        default:
            return t('onboarding_stepper_next_step');
    }
};
