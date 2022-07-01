import React from 'react';
import { Box, Text } from '@qwant/qwant-ponents';
import Styles from './ShieldCount.module.scss';

export function ShieldCount({ color = 'green', count, ...props }) {
    return (
        <Box className={Styles.IconShield} {...props}>
            <svg width="60" height="68" viewBox="0 0 60 68" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.733 1.53a10.349 10.349 0 0 1 6.534 0L51.934 7.74A10.319 10.319 0 0 1 59 17.529v16.578c0 6.942-2.742 12.82-6.556 17.625-5.812 7.322-14.117 12.124-18.703 14.39a8.4 8.4 0 0 1-7.482 0c-4.586-2.266-12.891-7.068-18.703-14.39C3.742 46.927 1 41.049 1 34.107V17.53a10.319 10.319 0 0 1 7.066-9.788z" stroke={`var(--${color}-500)`} strokeWidth="2" fill="#FFF" />
                <path d="M30 2c.997 0 1.994.16 2.952.478L51.618 8.69A9.319 9.319 0 0 1 58 17.53v16.577c0 17.088-17.298 27.46-24.702 31.118a7.438 7.438 0 0 1-3.297.775z" fill={`var(--${color}-300)`} />
                <path d="M28.524 6.898 9.858 13.109a4.66 4.66 0 0 0-3.191 4.42v16.578c0 6.855 3.448 12.6 8.19 17.284 4.75 4.692 10.43 7.937 13.914 9.658a2.73 2.73 0 0 0 2.458 0c3.484-1.72 9.165-4.966 13.914-9.658 4.742-4.684 8.19-10.43 8.19-17.284V17.53a4.66 4.66 0 0 0-3.19-4.42L31.475 6.898a4.674 4.674 0 0 0-2.952 0z" fill={`var(--${color}-100)`} />
                {count === undefined && <path d="M22.707 23.293a1 1 0 0 0-1.414 1.414L28.586 32l-7.293 7.293a1 1 0 1 0 1.414 1.414L30 33.414l7.293 7.293a1 1 0 1 0 1.414-1.414L31.414 32l7.293-7.293a1 1 0 0 0-1.414-1.414L30 30.586l-7.293-7.293z" fill={`var(--${color}-500)`} />}
            </svg>
            <Text typo={count > 99 ? 'heading-5' : 'heading-1'} bold center className={Styles.IconShieldCount}>{count > 99 ? '99+' : count}</Text>
        </Box>
    );
}
