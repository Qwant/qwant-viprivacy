import React from 'react';
import { Box, Text } from '@qwant/qwant-ponents';
import Styles from './Tile.module.scss';

export const Tile = ({
    color = 'green',
    icon: IconComponent,
    value,
    label,
}) => {
    const colorVariation = color === 'purple' ? '200' : '300';
    return (
        <Box style={{ background: `var(--${color}-100)` }} p="s" className={Styles.Tile}>
            <div style={{ color: `var(--${color}-${colorVariation})` }}><IconComponent /></div>
            <div>
                <Text typo="caption-1">{label}</Text>
                <Text typo="body-1" bold>{value}</Text>
            </div>
        </Box>
    );
};
