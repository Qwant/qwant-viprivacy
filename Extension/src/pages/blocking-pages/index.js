import React from 'react';
import ReactDOM from 'react-dom';
import { t } from '../../common/translators/reactTranslator';

import { AdBlocked } from './components/AdBlocked';

export const adBlocked = {
    init: () => {
        document.title = t('blocking_pages_page_title');

        ReactDOM.render(
            <AdBlocked />,
            document.getElementById('root'),
        );
    },
};
