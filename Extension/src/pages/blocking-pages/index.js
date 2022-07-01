import React from 'react';
import ReactDOM from 'react-dom';
import { t } from '../../common/translators/reactTranslator';

import { AdBlocked } from './components/AdBlocked';
// import { SafeBrowsing } from './components/SafeBrowsing';

export const adBlocked = {
    init: () => {
        document.title = t('blocking_pages_page_title');

        ReactDOM.render(
            <AdBlocked />,
            document.getElementById('root'),
        );
    },
};

// export const safeBrowsing = {
//    init: () => {
//        document.title = t('blocking_pages_page_title');

//        ReactDOM.render(
//            <SafeBrowsing />,
//            document.getElementById('root'),
//        );
//    },
// };
