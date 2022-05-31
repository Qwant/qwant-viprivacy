import cx from 'classnames';
import React from 'react';

import './styles.css';

export const Section = ({
    title, text, children, onClick, size = 'big', background = '#85d6ad',
}) => {
    return (
        <div className="main_section__wrapper">
            <div
                role="button"
                tabIndex={0}
                style={{ background }}
                onClick={onClick}
                onKeyPress={onClick}
                className={cx('main_section', {
                    main_section_big: size === 'big',
                })}
            >
                <div className="top">
                    <div className="title">
                        {title}
                    </div>
                    {text && (
                        <div className="text">
                            {text}
                        </div>
                    )}
                </div>
                <div className="bottom">
                    {children}
                </div>
            </div>
        </div>
    );
};
