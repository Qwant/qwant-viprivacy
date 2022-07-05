import React from 'react';
import {
    Box, Flex,
} from '@qwant/qwant-ponents';
import { ReactComponent as IconQwantFavicon } from './assets/qwant-favicon.svg';

export const QwantVIPrivacy = () => (
    <Flex as="span" alignCenter>
        <Box as="span" mr="xxs">
            <b>Qwant VIP</b>
            {'rivacy '}
        </Box>
        <IconQwantFavicon />
    </Flex>
);
