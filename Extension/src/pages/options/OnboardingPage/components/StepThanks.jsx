/* eslint-disable jsx-a11y/media-has-caption */
import React, { useMemo } from 'react';
import { Box, Stack, Text } from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import { OrderedList } from '~src/pages/common/components/List/OrderedList';
import { browserUtils } from '~src/background/utils/browser-utils';
import { backgroundPage } from '~src/background/extension-api/background-page';
import { CheckList } from '~src/pages/common/components/List/CheckList';
import imageUrl from './assets/illustration-telemetry.png';
import videoUrlFR from './assets/pin_extension_fr.webm';
import videoUrlEN from './assets/pin_extension_en.webm';
import Styles from './Steps.module.scss';

const showTutorial = !browserUtils.isFirefoxBrowser();
const videoUrl = backgroundPage.app.getLocale() === 'fr' ? videoUrlFR : videoUrlEN;

export const StepThanks = () => {
    return (
        <Box className={Styles.StepWithImage}>
            <Stack gap="m">
                <Text bold typo="heading-3" color="primary" as="h1">
                    {t('onboarding_step_thank_you_title')}
                </Text>
                {showTutorial ? <ExtensionPinTutorial /> : <ExtensionFeatures />}
            </Stack>
            {showTutorial && (
                <video autoPlay muted loop>
                    <source
                        src={videoUrl}
                        type="video/webm"
                    />
                </video>
            )}
            {!showTutorial && <img src={imageUrl} alt="" width="336" height="354" />}

        </Box>
    );
};

function ExtensionPinTutorial() {
    const browser = browserUtils.isEdgeBrowser() ? 'edge' : 'chrome';
    return (
        <>
            <Text as="p" typo="body-1" color="primary">
                {t('onboarding_step_thank_you_description')}
            </Text>
            <OrderedList>
                {[1, 2].map((i) => (
                    <Stack key={i} gap="xxs" as="li">
                        <Text as="h2" typo="body-1" bold color="primary">
                            {t(`onboarding_step_thank_you_${browser}_${i}_title`)}
                        </Text>
                        <Text as="p" typo="body-2" color="primary">
                            {t(`onboarding_step_thank_you_${browser}_${i}_description`)}
                        </Text>
                    </Stack>
                ))}
            </OrderedList>
        </>
    );
}

function ExtensionFeatures() {
    const features = useMemo(() => t('onboarding_step_thank_you_features').split(';').map((v) => v.trim()), []);
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
