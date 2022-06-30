import React from 'react';
import { Box, Stack, Text } from '@qwant/qwant-ponents';
import { reactTranslator } from '~src/common/translators/reactTranslator';
import { CheckboxCard } from '~src/pages/common/components/CheckboxCard/CheckboxCard';
import Styles from './Steps.module.scss';

export const StepProtectionLevel = ({ protectionLevel, updateProtectionLevel }) => {
    const onClickHandler = (level) => () => {
        const transaction = window?.apm?.startTransaction(`protection-button-click-${level}`);

        updateProtectionLevel(level);

        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    };

    return (
        <Stack gap="m">
            <Text bold typo="heading-3" color="primary" as="h1">
                {reactTranslator.getMessage('onboarding_step_protection_level_title')}
            </Text>
            <Text as="p" typo="body-1" color="primary">
                {reactTranslator.getMessage('onboarding_step_protection_level_description')}
            </Text>
            <Box className={Styles.StepChoices} mt="m">
                <CheckboxCard
                    onClick={onClickHandler('standard')}
                    title={reactTranslator.getMessage('protection_level_standard')}
                    description={reactTranslator.getMessage('protection_level_standard_description')}
                    selected={protectionLevel === 'standard'}
                />
                <CheckboxCard
                    onClick={onClickHandler('strict')}
                    title={reactTranslator.getMessage('protection_level_strict')}
                    description={reactTranslator.getMessage('protection_level_strict_description')}
                    selected={protectionLevel === 'strict'}
                />
            </Box>
        </Stack>
    );
};
