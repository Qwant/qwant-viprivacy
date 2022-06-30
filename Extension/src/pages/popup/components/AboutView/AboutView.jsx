import React from 'react';
import {
    Box, Card, Checkbox, Flex, IconExternalLink, Stack, Text,
} from '@qwant/qwant-ponents';
import { reactTranslator } from '~src/common/translators/reactTranslator';
import { openTabHandler } from '~src/pages/popup/helpers';
import { observer } from 'mobx-react';
import { messenger } from '~src/pages/services/messenger';
import imageIllustration from './illustration-info.svg';
import Styles from './AboutView.module.scss';

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

const telemetryUrl = reactTranslator.getMessage('popup_settings_telemetry_learn_more_link');
const telemetryRedirect = openTabHandler(telemetryUrl);

export const AboutView = observer(({ settingsStore }) => {
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
        <Stack gap="s">
            <Stack gap="xxs">
                <Text typo="heading-5" bold color="primary" as="h1">
                    {reactTranslator.getMessage('popup_about_title')}
                </Text>
            </Stack>

            <Card className={Styles.AboutViewLinks}>
                {links.map((link) => (
                    <Text typo="body-2" color="primary" raw>
                        <Flex
                            px="s"
                            py="xs"
                            alignCenter
                            between
                            as="button"
                            onClick={openTabHandler(reactTranslator.getMessage(link.url))}
                        >
                            {reactTranslator.getMessage(link.text)}
                            <IconExternalLink />
                        </Flex>
                    </Text>
                ))}
            </Card>

            <Checkbox
                id="privacy-toggle"
                onChange={toggleTelemetry}
                checked={!disableCollectHit}
                className={Styles.AboutViewCheckbox}
                label={(
                    <Text typo="caption-1" color="secondary">
                        {reactTranslator.getMessage('popup_settings_telemetry_label')}
                        {' '}
                        <a href={telemetryUrl} onClick={telemetryRedirect}>
                            {reactTranslator.getMessage('popup_settings_telemetry_learn_more')}
                        </a>
                    </Text>
                )}
            />

            <Box mt="s">
                <img src={imageIllustration} alt="" />
            </Box>

        </Stack>
    );
});
