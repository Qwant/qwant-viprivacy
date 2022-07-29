import React, { useCallback } from 'react';
import { t } from '~src/common/translators/reactTranslator';

import { MESSAGE_TYPES } from '~src/common/constants';
import {
    Button, Flex, QwantSquaredLogo, Stack, Text,
} from '@qwant/qwant-ponents';
import { ThinCard } from '~src/pages/common/components/ThinCard/ThinCard';
import { messenger } from '../../../services/messenger';

import Styles from './AdBlocked.module.scss';

const AdBlocked = ({ url, onGoBack, onAddUrlToTrusted }) => {
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
                    <Button variant="secondary-black" onClick={onGoBack} size="large">
                        {t('back')}
                    </Button>

                    <Button variant="primary-black" onClick={onAddUrlToTrusted} size="large">
                        {t('blocking_pages_btn_proceed')}
                    </Button>
                </Flex>
            </Stack>
        </div>
    );
};

const getParams = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
};

const AdBlockedWrapper = () => {
    const { url } = getParams();

    const onGoBack = useCallback((e) => {
        e.preventDefault();
        window.history.back();
    }, []);

    const onAddUrlToTrusted = useCallback((e) => {
        e.preventDefault();
        messenger.sendMessage(MESSAGE_TYPES.ADD_URL_TO_TRUSTED, { url });
    }, [url]);

    return (
        <AdBlocked
            url={url}
            onAddUrlToTrusted={onAddUrlToTrusted}
            onGoBack={onGoBack}
        />
    );
};

export default AdBlockedWrapper;
