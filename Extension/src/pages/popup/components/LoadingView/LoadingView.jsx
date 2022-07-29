import { Button, Flex } from '@qwant/qwant-ponents';
import React from 'react';
import BarLoader from 'react-spinners/BarLoader';

import { browser } from '~src/background/extension-api/browser';
import { t } from '~src/common/translators/reactTranslator';

import Styles from './LoadingView.module.scss';

export const LoadingView = () => {
    const [showButton, setShowButton] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 5000);

        return () => {
            if (timer) { clearTimeout(timer); }
        };
    }, []);

    const onReload = () => {
        browser.runtime.reload();
    };

    return (
        <Flex column alignCenter center className={Styles.LoadingView}>
            <BarLoader color="#5c97ff" width={250} />
            {showButton && (
                <Button
                    mt="s"
                    variant="secondary-black"
                    onClick={onReload}
                    className="section-loading_button"
                >
                    {t('loading_reload_cta')}
                </Button>
            )}
        </Flex>
    );
};
