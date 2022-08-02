import React from 'react';
import { Card, Stack, Text } from '@qwant/qwant-ponents';
import { t } from '~src/common/translators/reactTranslator';
import { backgroundPage } from '~src/background/extension-api/background-page';
import Styles from './UpsellMobile.module.scss';
import QRCode from '../assets/qr-code.png';

import imageUrlEN from '../assets/upsell-mobile.png';
import imageUrlFR from '../assets/upsell-mobile-fr.png';

import { ButtonDlApp } from './ButtonDlApp';

const locale = backgroundPage.app.getLocale();

const imageUrl = locale === 'fr' ? imageUrlFR : imageUrlEN;

export function UpsellMobile() {
    return (
        <Card className={Styles.UpsellMobile} pr="xl">
            <div className={Styles.LeftImage}>
                <img src={imageUrl} width="196" height="196" alt="" />
            </div>
            <Stack gap="m">
                <Text typo="heading-5" color="primary" bold>
                    {t('upsell_mobile_title')}
                </Text>
                <Stack horizontal gap="xs">
                    <ButtonDlApp />
                    <ButtonDlApp isIos />
                </Stack>
            </Stack>
            <Stack p="xs" gap="xs" className={Styles.UpsellMobileQRCode}>
                {/* TODO replace with qwant-ponents QR code */}
                <img src={QRCode} alt="" width="88" height="88" />
                <Text center typo="body-2" color="primary" bold>
                    {t('upsell_mobile_qrcode')}
                </Text>
            </Stack>
        </Card>
    );
}
