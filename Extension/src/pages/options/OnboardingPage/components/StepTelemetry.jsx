import React from 'react';
import {
    Card, Flex, Stack, Switch, Text,
} from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';

export const StepTelemetry = ({ onChange, checked }) => {
    const handleChange = () => {
        onChange(!checked);
    };

    return (
        <Stack gap="m">
            <Text bold typo="heading-3" color="primary" as="h1">
                {t('onboarding_step_telemetry_title')}
            </Text>
            <Text as="p" typo="body-1" color="primary">
                {t('onboarding_step_telemetry_description')}
            </Text>
            <Card mt="m">
                <Flex between alignCenter px="m" py="s">
                    <Text typo="body-1" color="primary">
                        {t('onboarding_step_telemetry_checkbox_label')}
                    </Text>
                    <Switch checked={checked} onChange={handleChange} />
                </Flex>
            </Card>
        </Stack>
    );
};
