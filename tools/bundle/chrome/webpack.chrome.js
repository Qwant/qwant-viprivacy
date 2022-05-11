import CopyWebpackPlugin from 'copy-webpack-plugin';
import ZipWebpackPlugin from 'zip-webpack-plugin';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
import { merge } from 'webpack-merge';
import path from 'path';

import { genCommonConfig } from '../webpack.common';
import { chromeManifest } from './manifest.chrome';
import { updateManifestBuffer } from '../../helpers';

export const genChromeConfig = (browserConfig) => {
    const commonConfig = genCommonConfig(browserConfig);

    const chromeConfig = {
        output: {
            path: path.join(commonConfig.output.path, browserConfig.buildDir),
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../manifest.common.json'),
                        to: 'manifest.json',
                        transform: (content) => updateManifestBuffer(process.env.BUILD_ENV, content, chromeManifest),
                    },
                    {
                        context: 'Extension',
                        from: 'filters/chromium',
                        to: 'filters',
                    },
                ],
            }),
            new ZipWebpackPlugin({
                path: '../',
                filename: `${browserConfig.browser}.zip`,
            }),
        ],
    };

    return merge(commonConfig, chromeConfig);
};
