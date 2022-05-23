import React from 'react';
import { browser } from '../../../../../../../background/extension-api/browser';

import './styles.css';

const QWANT_URL = 'https://qwant.com';

const ArrowBack = () => (

    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
            <path d="M0 0h32v32H0z" />
            <path d="M13.821 24.293a1 1 0 1 1-1.414 1.414l-7.724-7.724a2.333 2.333 0 0 1 0-3.3l7.724-7.723a1 1 0 0 1 1.414 1.414l-6.96 6.96h19.587a1 1 0 0 1 0 2H6.862l6.96 6.959z" fill="#050506" />
        </g>
    </svg>
);

const QwantLogo = () => (
    <svg width="207" height="28" viewBox="0 0 207 28" xmlns="http://www.w3.org/2000/svg">
        <g fill="#050506" fillRule="evenodd">
            <path d="M96.176 0h-4.312l7.638 21.698h4.853L112.004 0h-4.323l-5.636 17.078h-.222L96.176 0zm21.676 0h-3.93v21.698h3.93V0zm3.024 21.698h3.93v-7.332h4.153c5.011 0 7.702-3.009 7.702-7.183 0-4.142-2.659-7.183-7.649-7.183h-8.136v21.698zm3.93-10.563v-7.85h3.602c2.946 0 4.249 1.588 4.249 3.898s-1.303 3.952-4.228 3.952h-3.623zM138.188 21.718h1.857V11.372c0-2.378 1.825-4.1 4.328-4.1.49 0 .95.084 1.116.105V5.49c-.25-.01-.678-.03-.98-.03-2.013 0-3.734 1.084-4.38 2.7h-.136V5.698h-1.805v16.02zm9.36 0h1.867V5.698h-1.866v16.02zm.95-18.773c.761 0 1.397-.605 1.397-1.335S149.26.275 148.498.275c-.762 0-1.388.604-1.388 1.335 0 .73.626 1.335 1.388 1.335zM165.2 5.698h-2.013l-4.755 13.569h-.146L153.53 5.698h-2.013l5.85 16.02h1.982l5.851-16.02zm5.808 16.385c2.67 0 4.297-1.481 4.964-2.9h.115v2.535h1.857V10.84c0-4.297-3.234-5.361-5.685-5.361-2.45 0-4.975.97-6.06 3.588l1.763.636c.584-1.377 2.034-2.555 4.35-2.555 2.43 0 3.775 1.335 3.775 3.525v.375c0 1.21-1.502 1.231-4.193 1.565-3.619.448-6.153 1.46-6.153 4.63 0 3.088 2.357 4.84 5.267 4.84zm.25-1.7c-2.096 0-3.66-1.116-3.66-3.056s1.585-2.753 4.296-3.087c1.315-.157 3.65-.449 4.193-.98v2.315c0 2.628-1.867 4.808-4.829 4.808zm15.389 1.669c3.337 0 5.684-2.107 6.112-5.007h-1.878c-.427 2.045-2.106 3.307-4.234 3.307-3.14 0-5.215-2.733-5.215-6.634 0-3.88 2.138-6.55 5.215-6.55 2.284 0 3.828 1.471 4.224 3.286h1.877c-.438-2.973-2.92-4.975-6.132-4.975-4.193 0-7.05 3.483-7.05 8.302 0 4.777 2.773 8.27 7.08 8.27zm9.228 5.673c2.003 0 3.473-1.147 4.329-3.473l6.779-18.554h-2.013l-4.756 13.569h-.146l-4.756-13.569H193.3l5.893 16.176-.584 1.627c-.887 2.42-2.138 2.848-4.026 2.253l-.5 1.638c.375.177 1.063.333 1.793.333zM10.92 0c6.02 0 10.919 4.898 10.919 10.92 0 5.874-4.664 10.68-10.483 10.91l-.287.007h10.733l1.417 4.516H12.334l-1.416-4.514C4.898 21.839 0 16.94 0 10.919 0 4.9 4.898 0 10.92 0zm50.135 5.37v16.333H57.36v-2.13a8.129 8.129 0 0 1-5.37 2.017c-4.484 0-8.13-3.622-8.13-8.073 0-4.45 3.646-8.072 8.13-8.072 2.056 0 3.936.762 5.37 2.017V5.37h3.694zm-34.556 0 1.615 6.001.465 1.817.11.43.464 1.815.02.08.019.072h.043L31.657 5.37h3.664l2.384 9.987c.02.08.034.141.044.187l.01.041h.11L40.676 5.37h4.061l-5.385 16.323h-3.48l-1.497-6.016c-.224-.893-.594-2.924-.773-4.013l-.038-.234h-.035a3.364 3.364 0 0 1-.06.334c-.068.319-.302 1.28-.532 2.198l-.114.452-.108.425-.05.197-1.772 6.657h-3.39L22.469 5.37h4.031zM10.92 3.694c-3.984 0-7.225 3.241-7.225 7.225 0 3.985 3.241 7.226 7.226 7.226 3.984 0 7.225-3.241 7.225-7.226 0-3.984-3.241-7.225-7.225-7.225zM51.99 9.139a4.435 4.435 0 0 0-3.142 1.288 4.322 4.322 0 0 0-1.293 3.09c0 1.167.459 2.264 1.293 3.09a4.435 4.435 0 0 0 3.142 1.289 4.435 4.435 0 0 0 3.142-1.289 4.322 4.322 0 0 0 1.294-3.09c0-1.166-.46-2.263-1.294-3.09A4.435 4.435 0 0 0 51.99 9.14zm18.326-3.603a7.224 7.224 0 0 0-3.548.906V5.373h-3.76v7.396a9.17 9.17 0 0 0-.014.503v8.431h3.774V12.87c.172-2.45 1.92-3.573 3.548-3.573 2.12 0 3.657 1.672 3.657 3.975v8.431h3.761v-8.431c0-2.063-.724-3.986-2.04-5.414-1.379-1.497-3.288-2.322-5.378-2.322M80.382 0v5.381h-1.894v3.298h1.894v13.024h3.786V8.68h3.65V5.381h-3.62V0h-3.816z" />
        </g>
    </svg>
);

export const MainHeader = () => {
    const openTab = (url) => {
        browser.tabs.create({ active: true, url });
    };

    const onClose = () => {
        window.close();
    };

    return (
        <div className="main__header">
            <div
                tabIndex="0"
                role="button"
                className="close"
                onClick={onClose}
                onKeyPress={onClose}
            >
                <ArrowBack />
            </div>

            <div
                tabIndex="0"
                role="button"
                className="logo"
                onClick={() => openTab(QWANT_URL)}
                onKeyPress={() => openTab(QWANT_URL)}
            >
                <QwantLogo />
            </div>
        </div>
    );
};