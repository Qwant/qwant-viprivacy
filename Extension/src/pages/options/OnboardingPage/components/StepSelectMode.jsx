import React from 'react';
import { Box, Stack, Text } from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import { CheckboxCard } from '~src/pages/common/components/CheckboxCard/CheckboxCard';
import { ReactComponent as IconSearch } from './assets/icon-search.svg';
import { ReactComponent as IconProtection } from './assets/icon-protection.svg';
import Styles from './Steps.module.scss';

export const StepSelectMode = ({
    protectionEnabled,
    onEnable,
    onDisable,
}) => {
    return (
        <Stack gap="m">
            <Text bold typo="heading-3" color="primary" as="h1">
                {t('onboarding_step_mode_title')}
            </Text>
            <Text as="p" typo="body-1" color="primary">
                {t('onboarding_step_mode_description')}
            </Text>
            <Box className={Styles.StepChoices} mt="m">
                <CheckboxCard
                    onClick={onDisable}
                    title={t('onboarding_step_mode_search')}
                    description={t('onboarding_step_mode_search_description')}
                    selected={!protectionEnabled}
                    icon={<IconSearch />}
                />
                <CheckboxCard
                    onClick={onEnable}
                    title={t('onboarding_step_mode_search_protection')}
                    description={t('onboarding_step_mode_search_protection_description')}
                    selected={protectionEnabled}
                    isNew
                    icon={(
                        <>
                            <IconSearch />
                            <Text typo="heading-6" color="primary" bold>+</Text>
                            <IconProtection />
                        </>
                    )}
                />
            </Box>
        </Stack>
    );
};
