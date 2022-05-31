import path from 'path';
import { promises as fs } from 'fs';
import webExt from 'web-ext';
import {
    BUILD_PATH,
    ENVS,
    FIREFOX_CREDENTIALS,
    FIREFOX_UPDATE_TEMPLATE,
    FIREFOX_WEBEXT_UPDATE_URL,
} from '../constants';
import { getBrowserConf, getEnvConf } from '../helpers';
import { version } from '../../package.json';

// IMPORTANT!!!
// Signing artifacts for Mozilla publishes build to the store simultaneously
// We sign only beta build, because we do not publish it the AMO store
export const xpi = async (browser) => {
    const buildEnv = process.env.BUILD_ENV;
    if (buildEnv !== ENVS.BETA) {
        throw new Error('Xpi is build only for beta');
    }

    const envConf = getEnvConf(buildEnv);
    const browserConf = getBrowserConf(browser);

    const buildDir = path.join(BUILD_PATH, envConf.outputPath);
    const sourceDir = path.join(buildDir, browserConf.buildDir);
    const manifestPath = path.join(sourceDir, 'manifest.json');

    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    const updatedManifest = { ...manifest };
    updatedManifest.applications.gecko.update_url = FIREFOX_WEBEXT_UPDATE_URL;
    await fs.writeFile(manifestPath, JSON.stringify(updatedManifest, null, 4));

    const { apiKey, apiSecret } = JSON.parse(await fs.readFile(FIREFOX_CREDENTIALS, 'utf-8'));

    const { downloadedFiles } = await webExt.cmd.sign({
        apiKey,
        apiSecret,
        sourceDir,
        artifactsDir: buildDir,
        timeout: 15 * 60 * 1000, // 15 minutes
        channel: buildEnv === ENVS.RELEASE ? 'listed' : 'unlisted',
    }, {
        shouldExitProgram: false,
    });

    if (!downloadedFiles) {
        throw new Error('An error occurred during xpi signing');
    }

    const [downloadedXpi] = downloadedFiles;
    // Rename
    const basePath = path.dirname(downloadedXpi);
    const xpiPath = path.join(basePath, 'firefox.xpi');
    await fs.rename(downloadedXpi, xpiPath);

    // Revert manifest to prev state
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 4));

    // create update.json
    let updateJsonTemplate = (await fs.readFile(FIREFOX_UPDATE_TEMPLATE)).toString();
    updateJsonTemplate = updateJsonTemplate.replace(/\%VERSION\%/g, version);
    await fs.writeFile(path.join(buildDir, 'update.json'), updateJsonTemplate);
};
