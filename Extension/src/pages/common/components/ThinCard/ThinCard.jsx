import { Card } from '@qwant/qwant-ponents';
import cx from 'classnames';
import React from 'react';

import Styles from './ThinCard.module.scss';

export function ThinCard({ className, ...props }) {
    return <Card {...props} className={cx(Styles.ThinCard, className)} />;
}
