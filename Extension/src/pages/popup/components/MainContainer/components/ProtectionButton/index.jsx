import React from 'react';
import cx from 'classnames';
import { reactTranslator } from '../../../../../../common/translators/reactTranslator';

import './styles.css';
import { Check } from '../Icons';

export const ProtectionButton = ({
    level, onClick: onClickProp, active, inPopup,
}) => {
    const onClick = () => {
        const transaction = window?.apm?.startTransaction(`protection-button-click-${level}`);

        onClickProp(level);

        if (transaction) {
            transaction.result = 'success';
            transaction.end();
        }
    };

    return (
        <div
            tabIndex="0"
            role="button"
            onClick={onClick}
            onKeyPress={onClick}
            className={cx('protection-list__button', {
                'protection-list__button--active': active,
                'protection-list__button_in_popup': inPopup,
            })}
        >
            <div className={cx('inner-left', {
                'inner-left__popup': inPopup,
            })}
            >
                <span className={cx('inner-left__title', {
                    'inner-left__title__popup': inPopup,
                })}
                >
                    {reactTranslator.getMessage(`protection_level_${level}`)}

                </span>
                <span className="inner-left__desc">
                    {reactTranslator.getMessage(`protection_level_${level}_description`)}
                </span>
            </div>
            <div className="inner-right">
                <Check
                    className={cx(
                        'inner-right__active-check',
                        {
                            'inner-right__active-check--visible': active,
                        },
                    )}
                />
            </div>
        </div>
    );
};
