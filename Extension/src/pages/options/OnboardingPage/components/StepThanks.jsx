import React, { useMemo } from 'react';
import { Box, Stack, Text } from '@qwant/qwant-ponents';
import { reactTranslator } from '~src/common/translators/reactTranslator';
import { OrderedList } from '~src/pages/common/components/List/OrderedList';
import PermissionsRequestImage from '~src/pages/options/OnboardingPage/components/assets/permission-request.svg';
import { browserUtils } from '~src/background/utils/browser-utils';
import { CheckList } from '~src/pages/common/components/List/CheckList';
import Styles from './Steps.module.scss';

const showPinTutorial = browserUtils.isFirefoxBrowser();

export const StepThanks = () => {
    return (
        <Box className={Styles.StepWithImage}>
            <Stack gap="m">
                <Text bold typo="heading-3" color="primary" as="h1">
                    {reactTranslator.getMessage('onboarding_step_thank_you_title')}
                </Text>
                {showPinTutorial ? <ExtensionPinTutorial /> : <ExtensionFeatures />}
            </Stack>
            <img src={PermissionsRequestImage} alt="" width="312" height="204" />
        </Box>
    );
};

function ExtensionPinTutorial() {
    return (
        <>
            <Text as="p" typo="body-1" color="primary">
                {reactTranslator.getMessage('onboarding_step_thank_you_description')}
            </Text>
            <OrderedList>
                {[1, 2].map((i) => (
                    <Stack key={i} gap="xxs" as="li">
                        <Text as="h2" typo="body-1" bold color="primary">
                            {reactTranslator.getMessage(`onboarding_step_thank_you_${i}_title`)}
                        </Text>
                        <Text as="p" typo="body-2" color="primary">
                            {reactTranslator.getMessage(`onboarding_step_thank_you_${i}_description`)}
                        </Text>
                    </Stack>
                ))}
            </OrderedList>
        </>
    );
}

function ExtensionFeatures() {
    const features = useMemo(() => reactTranslator.getMessage('onboarding_step_thank_you_features').split(';').map((v) => v.trim()), []);
    return (
        <CheckList>
            {features.map((feature) => (
                <Text key={feature} as="li" typo="body-1" color="primary">
                    {feature}
                </Text>
            ))}
        </CheckList>
    );
}
