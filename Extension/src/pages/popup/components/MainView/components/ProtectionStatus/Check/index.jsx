import React from 'react';
import Switch from 'react-switch';

import './styles.css';

const LineSVG = ({ stroke = '#000000' }) => (
    <svg viewBox="0 0 10 10" height="24" width="24">
        <line y2="7" x2="5" y1="3" x1="5" stroke={stroke} strokeWidth="0.35" fill="none" />
    </svg>
);

const CircleSVG = ({ stroke = '#000000' }) => (
    <svg viewBox="0 0 10 10" height="24" width="24">
        <ellipse rx="2" ry="2" cx="5" cy="5" stroke={stroke} strokeWidth="0.5" fill="none" />
    </svg>
);

const onColor = '#ffffff';
const offColor = '#ffffff';
const onHandleColor = '#85d6ad';
const offHandleColor = '#e9eaec';

export const Check = ({
    className, checked, onChange,
}) => {
    const preventBubble = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            onClick={preventBubble}
            onKeyPress={preventBubble}
            className={className}
        >
            <Switch
                className="check-switch"
                height={32}
                width={56}
                borderRadius={22}
                handleDiameter={24}
                onChange={onChange}
                onKeyUp={onChange}
                checked={checked}
                onColor={onColor}
                offColor={offColor}
                onHandleColor={onHandleColor}
                offHandleColor={offHandleColor}
                checkedHandleIcon={(<LineSVG />)}
                uncheckedIcon={(<LineSVG />)}
                uncheckedHandleIcon={(<CircleSVG />)}
                checkedIcon={(<CircleSVG />)}
            />
        </div>
    );
};
