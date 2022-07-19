import React from 'react';
import { browser } from '~src/background/extension-api/browser';
import androidSvgUrls from '../assets/android';
import appleSvgUrl from '../assets/apple.svg';

const getAppDownloadLink = (isIos) => {
    if (isIos) return 'https://apps.apple.com/app/qwant/id924470452';
    return 'https://play.google.com/store/apps/details?id=com.qwant.liberty';
};

const getLang = () => {
    const lang = browser.i18n.getUILanguage();
    if (lang === 'fr') return 'fr';
    return 'en';
};

export const ButtonDlApp = ({ isIos }) => {
    const lang = getLang();
    const href = getAppDownloadLink(isIos);

    let spriteUrl = null;
    let imageUrl = null;

    if (isIos) {
        spriteUrl = `${appleSvgUrl}#apple-dark-${lang}`;
    } else {
        imageUrl = androidSvgUrls[lang];
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
        >
            {spriteUrl && (
                <svg width="120" height="40">
                    <use href={spriteUrl} style={{ [`--lang-${lang}`]: 'block' }} />
                </svg>
            )}
            {imageUrl && <img width="120" height="40" src={imageUrl} alt="" />}
        </a>
    );
};
