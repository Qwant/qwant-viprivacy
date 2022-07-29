import { Stack } from '@qwant/qwant-ponents';
import cx from 'classnames';
import React from 'react';

import Styles from './List.module.scss';

/**
 * List of element ordered
 * @param {React.ReactNode} children
 */
export function CheckList({ children }) {
    return <Stack gap="s" as="ul" className={cx(Styles.List, Styles.CheckList)}>{children}</Stack>;
}
