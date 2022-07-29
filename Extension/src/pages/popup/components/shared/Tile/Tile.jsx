import { Box, Text } from '@qwant/qwant-ponents';
import React from 'react';

import { ThinCard } from '~src/pages/common/components/ThinCard/ThinCard';

import Styles from './Tile.module.scss';

export const Tile = ({
    asCard = false,
    color = 'green',
    icon: IconComponent,
    value,
    label,
}) => {
    const purpleColor = asCard ? '100' : '200';
    const colorVariation = color === 'purple' ? purpleColor : '300';
    const Wrapper = asCard ? ThinCard : Box;
    const style = { color: `var(--${color}-${colorVariation})` };
    if (!asCard) {
        style.background = `var(--${color}-100)`;
    }
    return (
        <Wrapper style={style} p="s" className={Styles.Tile}>
            <IconComponent />
            <div>
                <Text typo="caption-1" color="primary">{label}</Text>
                <Text typo="body-1" color="primary" bold>{value}</Text>
            </div>
        </Wrapper>
    );
};
