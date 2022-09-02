/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useCallback } from 'react';
import { t } from '~src/common/translators/reactTranslator';

import { MESSAGE_TYPES } from '~src/common/constants';
import {
    Button, Flex, QwantSquaredLogo, Stack, Text,
} from '@qwant/qwant-ponents';
import { ThinCard } from '~src/pages/common/components/ThinCard/ThinCard';
import { getParams } from '../../getParams';
import { messenger } from '../../../services/messenger';

import Styles from './AdBlocked.module.scss';

export const AdBlocked = () => {
    const { url } = getParams();

    const handleGoBack = useCallback((e) => {
        e.preventDefault();
        window.history.back();
    }, []);

    const handleProceed = useCallback((e) => {
        e.preventDefault();
        messenger.sendMessage(MESSAGE_TYPES.ADD_URL_TO_TRUSTED, { url });
    }, [url]);

    return (
        <div className={Styles.Wrapper}>
            <Stack gap="l" p="xl" pt="xxxs" className={Styles.AdBlockedBody}>
                <QwantSquaredLogo width="128" height="128" />
                <Text typo="heading-1" bold color="primary" as="h1">
                    {t('blocking_pages_rule_content_title', {
                        name: t('name'),
                    })}
                </Text>
                <Stack gap="xs">
                    <ThinCard p="xs">
                        <Text typo="body-1" color="primary" as="code">
                            {url}
                        </Text>
                    </ThinCard>
                    <Text typo="body-1" color="primary">
                        {t('blocking_pages_rule_content_description', {
                            name: t('name'),
                        })}
                    </Text>
                </Stack>
                <Flex alignCenter between mt="xxl5">
                    <Button variant="secondary-black" onClick={handleGoBack} size="large">
                        {t('back')}
                    </Button>

                    <Button variant="primary-black" onClick={handleProceed} size="large">
                        {t('blocking_pages_btn_proceed')}
                    </Button>
                </Flex>
            </Stack>
        </div>
    );
};
