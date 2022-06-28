import React from 'react';
import {
    Box, Card, Stack, Text,
} from '@qwant/qwant-ponents';
import cx from 'classnames';
import { reactTranslator } from '~common/translators/reactTranslator';
import Styles from './CheckboxCard.module.scss';
import { ReactComponent as IconCheck } from './icon-check.svg';

/**
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} icon
 * @param {() => void} onClick
 * @param {?boolean} selected
 * @param {?boolean} isNew
 */
export function CheckboxCard({
    title, description, selected, icon, isNew, onClick,
}) {
    return (
        <Card as="button" className={cx(Styles.CheckboxCard, selected && Styles.CheckboxCardActive)} onClick={onClick}>
            {isNew && (
                <Text raw typo="body-2" color="primary" bold>
                    <Box className={Styles.CheckboxCardHeader} px="m" py="xs">{reactTranslator.getMessage('new')}</Box>
                </Text>
            )}
            <Stack gap="xs" m="m" relative>
                <Stack horizontal gap="xxs" center pb="xs" className={Styles.CheckboxCardIcon}>
                    {icon}
                </Stack>
                <Text typo="heading-5" as="h2" bold>{title}</Text>
                <Text typo="body-2" as="p" color="secondary">{description}</Text>
                {selected && <IconCheck className={Styles.CheckboxCardActiveIcon} />}
            </Stack>
        </Card>
    );
}
