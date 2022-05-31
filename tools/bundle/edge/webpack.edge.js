import CopyWebpackPlugin from 'copy-webpack-plugin';
import ZipWebpackPlugin from 'zip-webpack-plugin';
import { merge } from 'webpack-merge';
import path from 'path';

import { genCommonConfig } from '../webpack.common';
import { edgeManifest } from './manifest.edge';
import { updateManifestBuffer } from '../../helpers';

export const genEdgeConfig = (browserConfig) => {
    const commonConfig = genCommonConfig(browserConfig);

    const edgeConfig = {
        output: {
            path: path.join(commonConfig.output.path, browserConfig.buildDir),
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, '../manifest.common.json'),
                        to: 'manifest.json',
                        transform: (content) => updateManifestBuffer(process.env.BUILD_ENV, content, edgeManifest),
                    },
                    {
                        context: 'Extension',
                        from: 'filters/edge',
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

    return merge(commonConfig, edgeConfig);
};
