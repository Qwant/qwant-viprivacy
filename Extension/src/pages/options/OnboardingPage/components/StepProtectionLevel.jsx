import { Box, Stack, Text } from '@qwant/qwant-ponents';
import React from 'react';

import { t } from '~src/common/translators/reactTranslator';
import { CheckboxCard } from '~src/pages/common/components/CheckboxCard/CheckboxCard';

import { QwantVIPrivacy } from './QwantVIPrivacy';
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
                {t('onboarding_step_protection_level_title')}
            </Text>
            <Text as="p" typo="body-1" color="primary">
                {t('onboarding_step_protection_level_description')}
                <br />
                <QwantVIPrivacy />
            </Text>
            <Box className={Styles.StepChoices} mt="m">
                <CheckboxCard
                    onClick={onClickHandler('standard')}
                    title={t('protection_level_standard')}
                    description={t('protection_level_standard_description')}
                    selected={protectionLevel === 'standard'}
                />
                <CheckboxCard
                    onClick={onClickHandler('strict')}
                    title={t('protection_level_strict')}
                    description={t('protection_level_strict_description')}
                    selected={protectionLevel === 'strict'}
                />
            </Box>
        </Stack>
    );
};
