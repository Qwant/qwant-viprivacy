import React from 'react';
import './styles.css';

export const IconRound = ({
    className, src, children, alt = '', background = '#000000',
}) => (
    <div className={`icon-round ${className}`} style={{ background }}>
        {children || <img alt={alt} src={src} />}
    </div>
);
