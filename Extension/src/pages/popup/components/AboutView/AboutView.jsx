import {
    Checkbox, Flex, IconExternalLink, Stack, Text,
} from '@qwant/qwant-ponents';
import { observer } from 'mobx-react';
import React from 'react';

import { t } from '~src/common/translators/reactTranslator';
import { ThinCard } from '~src/pages/common/components/ThinCard/ThinCard';
import { openTabHandler } from '~src/pages/popup/helpers';
import { messenger } from '~src/pages/services/messenger';

import Styles from './AboutView.module.scss';
import imageIllustration from './illustration-info.svg';

const links = [
    {
        text: 'popup_settings_help_know_more_label',
        url: 'popup_settings_help_know_more_link',
    },
    {
        text: 'popup_settings_help_new_label',
        url: 'popup_settings_help_new_link',
    },
];

const telemetryUrl = t('popup_settings_telemetry_learn_more_link');
const telemetryRedirect = openTabHandler(telemetryUrl);

const AboutView = observer(({ settingsStore }) => {
    const { settings } = settingsStore;
    const key = settings?.names?.DISABLE_COLLECT_HITS;
    const disableCollectHit = key ? settings?.values[key] || false : false;

    const toggleTelemetry = async () => {
        const value = !disableCollectHit;
        const transaction = window?.apm?.startTransaction(`popup-telemetry-toggle-${value ? 'disabled' : 'enabled'}`);

        await messenger.changeUserSetting('hits-count-disabled', value);
        await settingsStore.requestOptionsData();

        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    };

    return (
        <>
            <Stack gap="s">
                <Stack gap="xxs">
                    <Text typo="heading-5" bold color="primary" as="h1">
                        {t('popup_about_title')}
                    </Text>
                </Stack>

                <ThinCard className={Styles.AboutViewLinks}>
                    {links.map((link) => (
                        <Text key={link.url} typo="body-2" color="primary" raw>
                            <Flex
                                px="s"
                                py="xs"
                                alignCenter
                                between
                                as="button"
                                onClick={openTabHandler(t(link.url))}
                            >
                                {t(link.text)}
                                <IconExternalLink />
                            </Flex>
                        </Text>
                    ))}
                </ThinCard>

                <Checkbox
                    id="privacy-toggle"
                    onChange={toggleTelemetry}
                    checked={!disableCollectHit}
                    className={Styles.AboutViewCheckbox}
                    label={(
                        <Text typo="caption-1" color="secondary">
                            {t('popup_settings_telemetry_label')}
                            {' '}
                            <a href={telemetryUrl} onClick={telemetryRedirect}>
                                {t('popup_settings_telemetry_learn_more')}
                            </a>
                        </Text>
                    )}
                />

            </Stack>
            <Flex p="s" column alignCenter center className={Styles.Image}>
                <img src={imageIllustration} alt="" />
            </Flex>
        </>
    );
});

export default AboutView;
