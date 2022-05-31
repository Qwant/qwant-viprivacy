import React from 'react';
import './styles.css';

export const Tile = ({
    background = '#85d6ad',
    icon = <div />,
    value,
    label,
}) => {
    return (
        <div className="tile-wrapper">
            <div className="tile" style={{ background }}>
                <div className="icon">{icon}</div>
                <div>
                    <div className="label">{label}</div>
                    <div className="value">{value}</div>
                </div>
            </div>
        </div>
    );
};
