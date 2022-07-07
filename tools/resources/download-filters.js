/**
 * Update filters in repository
 */
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import crypto from 'crypto';
import axios from 'axios';
import { cliLog } from '../cli-log';
import {
    METADATA_DOWNLOAD_URL_FORMAT,
    FILTERS_DEST,
    ADGUARD_FILTERS_IDS,
    FILTER_DOWNLOAD_URL_FORMAT,
} from '../constants';

const CHECKSUM_PATTERN = /^\s*!\s*checksum[\s-:]+([\w\+/=]+).*[\r\n]+/im;

/**
 * Getting filters array
 *
 * @param browser Which browser filters to download
 * @return array
 */
const getUrlsOfFiltersResources = (browser) => {
    const filters = [];
    const filtersMobile = [];
    const meta = [];

    meta.push({
        url: METADATA_DOWNLOAD_URL_FORMAT.replace('%browser', browser),
        file: 'filters.json',
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const filterId of ADGUARD_FILTERS_IDS) {
        filters.push({
            url: FILTER_DOWNLOAD_URL_FORMAT.replace('%browser', browser).replace('%filter', filterId),
            file: `filter_${filterId}.txt`,
            validate: true,
        });
    }

    return [
        ...meta,
        ...filters,
        ...filtersMobile,
    ];
};

/**
 * Normalize response
 *
 * @param response Filter rules response
 * @return Normalized response
 */
const normalizeResponse = (response) => {
    const partOfResponse = response.substring(0, 200);
    response = response.replace(partOfResponse.match(CHECKSUM_PATTERN)?.[0], '');
    response = response.replace(/\r/g, '');
    response = response.replace(/\n+/g, '\n');
    return response;
};

/**
 * Validates filter rules checksum
 * See https://adblockplus.org/en/filters#special-comments for details
 *
 * @param url   Download URL
 * @param body  Filter rules response
 * @throws Error
 */
const validateChecksum = (url, body) => {
    const partOfResponse = body.substring(0, 200);
    const checksumMatch = partOfResponse.match(CHECKSUM_PATTERN);

    if (!checksumMatch?.[1]) {
        cliLog.warningRed(`Filter rules from ${url.url} doesn't contain a checksum ${partOfResponse}`);
    }

    const bodyChecksum = crypto.createHash('md5').update(normalizeResponse(body)).digest('base64').replace(/=/g, '');

    if (checksumMatch?.[1] && bodyChecksum !== checksumMatch[1]) {
        cliLog.warningRed(`Wrong checksum: url=${url.url}`);
        cliLog.warningRed(`Found ${bodyChecksum} - Expected ${checksumMatch[1]}`);
        return false;
    }

    cliLog.info('Checksum is valid');
    return true;
};

const downloadFilter = async (url, browser) => {
    const filtersDir = FILTERS_DEST.replace('%browser', browser);

    fse.ensureDirSync(filtersDir);

    cliLog.info(`Download ${url.url}...`);

    const response = await axios.get(url.url, { responseType: 'arraybuffer' });

    if (url.validate) {
        if (!validateChecksum(url, response.data.toString())) {
            cliLog.warning(`Skipped: Checksum not valid for url=${url.url}`);
            return;
        }
    }

    let body = response.data.toString();
    if (url?.file?.endsWith('.json')) {
        body = JSON.stringify(JSON.parse(body), null, 2);
    }

    await fs.promises.writeFile(path.join(filtersDir, url.file), body, { encoding: 'utf-8' });

    cliLog.info('Done');
};

/**
 * Download filter
 * @param browser Which browser filters to download
 */
const startDownload = async (browser) => {
    const urls = getUrlsOfFiltersResources(browser);
    for (let i = 0; i < urls.length; i += 1) {
        const url = urls[i];
        // eslint-disable-next-line no-await-in-loop
        await downloadFilter(url, browser);
    }
};

export const downloadFilters = async () => {
    await startDownload('chromium');
    await startDownload('edge');
    await startDownload('firefox');
};
