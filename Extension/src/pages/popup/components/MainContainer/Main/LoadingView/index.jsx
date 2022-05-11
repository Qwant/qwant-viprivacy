import React from 'react';
import BarLoader from 'react-spinners/BarLoader';

import { browser } from '../../../../../../background/extension-api/browser';
import { reactTranslator } from '../../../../../../common/translators/reactTranslator';
import { Button } from '../../../../../common/components/Button';

import './styles.css';

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
        <div className="section-loading">
            <BarLoader color="#5c97ff" width={250} />
            <Button
                color="secondary"
                onClick={onReload}
                hidden={!showButton}
                className="section-loading_button"
            >
                {reactTranslator.getMessage('loading_reload_cta')}
            </Button>
        </div>
    );
};
