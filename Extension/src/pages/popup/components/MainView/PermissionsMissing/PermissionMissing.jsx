import React from 'react';

import { t } from '~src/common/translators/reactTranslator';

import { Button, Stack, Text } from '@qwant/qwant-ponents';
import { CheckboxCard } from '~src/pages/common/components/CheckboxCard/CheckboxCard';
import { MainLinks } from '~src/pages/popup/components/MainLinks/MainLinks';
import { ThinCard } from '~src/pages/common/components/ThinCard/ThinCard';
import { ShieldCount } from '~src/pages/popup/components/MainView/ShieldCount/ShieldCount';
import { RiShieldCheckLine } from 'react-icons/ri';
import Styles from './PermissionMissing.module.scss';

export const PermissionsMissing = ({
    onRequestPermissions,
}) => {
    return (
        <div>
            <Stack gap="s">
                <ThinCard className={Styles.PermissionMissing} p="s">
                    <ShieldCount color="grey" className={Styles.PermissionMissingShield} />
                    <Stack gap="xxs">
                        <Text typo="body-1" color="primary" bold as="h2">
                            {t('missing_permissions_disabled_title')}
                        </Text>
                        <Text typo="body-2" color="primary" as="p">
                            {t('missing_permissions_disabled_description')}
                        </Text>
                    </Stack>
                    <Button className={Styles.PermissionMissingAction} onClick={onRequestPermissions} variant="primary-black" full>
                        <RiShieldCheckLine />
                        {t('missing_permissions_cta_button_popup')}
                    </Button>
                </ThinCard>
                <CheckboxCard
                    selected
                    compact
                    title={t('missing_permissions_default_search_engine_title')}
                    description={t('missing_permissions_default_search_engine_description')}
                />
            </Stack>
            <div className={Styles.MainLinks}>
                <MainLinks />
            </div>
        </div>
    );
};
