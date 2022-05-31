import React from 'react';
import cx from 'classnames';

import './styles.css';

const Loading = () => (<span className="btn_loader" />);

export const Button = ({
    children, className, disabled, hidden, isLoading, onClick,
    name, size = 'default', color = 'primary',
}) => {
    const ref = React.useRef(null);
    const [width, setWidth] = React.useState(null);
    const [showLoading, setShowLoading] = React.useState(false);

    React.useEffect(() => {
        if (!isLoading) {
            setWidth(ref.current.offsetWidth);
        }
    }, [isLoading]);

    React.useEffect(() => {
        let timer = null;

        if (isLoading) {
            timer = setTimeout(() => {
                setShowLoading(true);
            }, 300);
        } else {
            setShowLoading(false);
            if (timer) { clearTimeout(timer); }
        }

        return () => { if (timer) clearTimeout(timer); };
    }, [isLoading]);

    return (
        <button
            ref={ref}
            type="button"
            onClick={onClick}
            disabled={disabled || isLoading}
            name={name}
            style={{ '--btn_width_loading': `${width}px` }}
            className={cx('btn_button', {
                [className]: !!className,
                btn_button__loading: showLoading,
                [color]: true,
                [size]: true,
                hidden,
            })}
        >
            {showLoading ? <Loading /> : children}
        </button>
    );
};
