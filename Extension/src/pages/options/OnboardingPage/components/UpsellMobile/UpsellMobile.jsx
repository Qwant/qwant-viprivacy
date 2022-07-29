import { Card, Stack, Text } from '@qwant/qwant-ponents';
import React from 'react';

import { t } from '~src/common/translators/reactTranslator';

import QRCode from '../assets/qr-code.png';
import UpsellMobileIllustration from '../assets/upsell-mobile.png';
import { ButtonDlApp } from './ButtonDlApp';
import Styles from './UpsellMobile.module.scss';

export function UpsellMobile() {
    return (
        <Card className={Styles.UpsellMobile} pr="xl">
            <div className={Styles.LeftImage}>
                <img src={UpsellMobileIllustration} width="196" height="196" alt="" />
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
