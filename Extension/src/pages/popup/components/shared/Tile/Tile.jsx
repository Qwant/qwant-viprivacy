import React from 'react';
import { Box, Text } from '@qwant/qwant-ponents';
import Styles from './Tile.module.scss';

export const Tile = ({
    color = 'green',
    icon: IconComponent,
    value,
    label,
}) => {
    return (
        <Box style={{ background: `var(--${color}-100)` }} p="s" className={Styles.Tile}>
            <div style={{ color: `var(--${color}-300)` }}><IconComponent /></div>
            <div>
                <Text typo="caption-1">{label}</Text>
                <Text typo="body-1" bold>{value}</Text>
            </div>
        </Box>
    );
};
