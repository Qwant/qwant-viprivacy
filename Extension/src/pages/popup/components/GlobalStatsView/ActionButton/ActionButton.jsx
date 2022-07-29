import { Flex, Text } from '@qwant/qwant-ponents';
import cx from 'classnames';
import React from 'react';

import Styles from './ActionButton.module.scss';

export function ActionButton({ children, type, ...props }) {
    return (
        <Text color="secondary" typo="body-2" raw>
            <Flex
                alignCenter
                center
                as="button"
                className={cx(Styles.ActionButton, type === 'danger' && Styles.ActionButtonDanger)}
                {...props}
            >
                {children}
            </Flex>
        </Text>
    );
}
