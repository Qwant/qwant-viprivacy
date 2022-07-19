import React from 'react';
import {
    Box, Card, Flex, Stack, Switch, Text,
} from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import Styles from './Steps.module.scss';
import imageUrl from './assets/illustration-telemetry.png';

export const StepTelemetry = ({
    onChange,
    checked,
}) => {
    const handleChange = () => {
        onChange(!checked);
    };

    return (
        <Box className={Styles.StepWithImage}>
            <Stack gap="m">
                <Text bold typo="heading-3" color="primary" as="h1">
                    {t('onboarding_step_telemetry_title')}
                </Text>
                <Text as="p" typo="body-1" color="primary">
                    {t('onboarding_step_telemetry_description')}
                </Text>
                <Card className={Styles.StepTelemetryCard} mt="m">
                    <Flex between px="m" py="s">
                        <Text typo="body-1" color="primary" raw>
                            <Box mr="m" as="label" htmlFor="telemetry-toggle">
                                {t('onboarding_step_telemetry_checkbox_label')}
                            </Box>
                        </Text>
                        <Switch checked={checked} onChange={handleChange} id="telemetry-toggle" />
                    </Flex>
                </Card>
            </Stack>
            <img src={imageUrl} alt="" width="336" height="354" />
        </Box>
    );
};
