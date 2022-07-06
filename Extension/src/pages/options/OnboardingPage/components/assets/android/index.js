/**
 * We can't use sprite when a SVG contains a gradient on chrome browser
 * issue : https://bugs.chromium.org/p/chromium/issues/detail?id=751733
 * So we are forced to use the image path
 */
import de from './de.svg';
import en from './en.svg';
import fr from './fr.svg';
import it from './it.svg';

export default {
    fr,
    de,
    it,
    en,
};
