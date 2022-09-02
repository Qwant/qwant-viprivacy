import React from 'react';
import { Stack } from '@qwant/qwant-ponents';
import cx from 'classnames';
import Styles from './List.module.scss';

/**
 * List of element ordered
 * @param {React.ReactNode} children
 */
export function OrderedList({ children }) {
    return <Stack gap="s" as="ul" className={cx(Styles.List, Styles.OrderedList)}>{children}</Stack>;
}
