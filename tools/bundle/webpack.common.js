/* eslint-disable max-len */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import path from 'path';

import fs from 'fs';
import { BUILD_PATH, ENVS } from '../constants';
import { getEnvConf, updateLocalesMSGName } from '../helpers';
import { getModuleReplacements } from './module-replacements';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = getEnvConf(process.env.BUILD_ENV);

const BACKGROUND_PATH = path.resolve(__dirname, '../../Extension/pages/background');
const OPTIONS_PATH = path.resolve(__dirname, '../../Extension/pages/options');
const POPUP_PATH = path.resolve(__dirname, '../../Extension/pages/popup');
// const FILTERING_LOG_PATH = path.resolve(__dirname, '../../Extension/pages/filtering-log');
// const FILTER_DOWNLOAD_PATH = path.resolve(__dirname, '../../Extension/pages/filter-download');
const CONTENT_SCRIPT_START_PATH = path.resolve(__dirname, '../../Extension/pages/content-script-start');
// const THANKYOU_PATH = path.resolve(__dirname, '../../Extension/pages/thankyou');
// const ASSISTANT_PATH = path.resolve(__dirname, '../../Extension/pages/assistant');
// const FULLSCREEN_USER_RULES_PATH = path.resolve(__dirname, '../../Extension/pages/fullscreen-user-rules');
// const SAFEBROWSING_PATH = path.resolve(__dirname, '../../Extension/pages/safebrowsing');
const AD_BLOCKED_PATH = path.resolve(__dirname, '../../Extension/pages/ad-blocked');
// const EDITOR_PATH = path.resolve(__dirname, '../../Extension/src/pages/common/components/Editor');

const OUTPUT_PATH = config.outputPath;

const htmlTemplatePluginCommonOptions = {
    cache: false,
    scriptLoading: 'blocking',
};

export const genCommonConfig = (browserConfig) => {
    const isDev = process.env.BUILD_ENV === ENVS.DEV;
    return {
        mode: config.mode,
        optimization: {
            minimize: false,
            runtimeChunk: 'single',
        },
        cache: false,
        devtool: isDev ? 'eval-source-map' : false,
        entry: {
            'pages/background': {
                import: BACKGROUND_PATH,
                runtime: false,
            },
            'pages/options': {
                import: OPTIONS_PATH,
                dependOn: [
                    'vendors/react',
                    'vendors/mobx',
                    'vendors/xstate',
                    'vendors/react-icons',
                    // 'shared/editor',
                ],
            },
            'pages/popup': {
                import: POPUP_PATH,
                dependOn: [
                    'vendors/react',
                    'vendors/mobx',
                    'vendors/react-icons',
                ],
            },
            // 'pages/filtering-log': {
            //     import: FILTERING_LOG_PATH,
            //     dependOn: [
            //         'vendors/react',
            //         'vendors/mobx',
            //         'vendors/xstate',
            //     ],
            // },
            // 'pages/filter-download': {
            //     import: FILTER_DOWNLOAD_PATH,
            //     runtime: false,
            // },
            'pages/content-script-start': {
                import: CONTENT_SCRIPT_START_PATH,
                runtime: false,
            },
            // 'pages/thankyou': {
            //    import: THANKYOU_PATH,
            //    runtime: false,
            // },

            // 'pages/assistant': {
            //     import: ASSISTANT_PATH,
            //     runtime: false,
            // },
            // 'pages/fullscreen-user-rules': {
            //     import: FULLSCREEN_USER_RULES_PATH,
            //     dependOn: [
            //         'vendors/react',
            //         'vendors/mobx',
            //         'vendors/xstate',
            //         'shared/editor',
            //     ],
            // },
            // 'pages/safebrowsing': {
            //     import: SAFEBROWSING_PATH,
            //     dependOn: [
            //         'vendors/react',
            //     ],
            // },
            'pages/ad-blocked': {
                import: AD_BLOCKED_PATH,
                dependOn: [
                    'vendors/react',
                ],
            },
            // 'shared/editor': {
            //    import: EDITOR_PATH,
            //    dependOn: [
            //        'vendors/react',
            //    ],
            // },
            'vendors/react': ['react', 'react-dom'],
            'vendors/react-icons': ['react-icons', 'react-icons/ri'],
            'vendors/mobx': ['mobx'],
            'vendors/xstate': ['xstate'],
        },
        output: {
            path: path.join(BUILD_PATH, OUTPUT_PATH),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
            symlinks: false,
            alias: {
                '~src': path.resolve(fs.realpathSync(process.cwd()), 'Extension/src'),
            },
            // Node modules polyfills
            fallback: {
                url: require.resolve('url'),
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: '@svgr/webpack',
                            options: {
                                icon: false,
                                expandProps: 'end',
                            },
                        },
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 2000,
                                name: '[name].[contenthash:8].[ext]',
                                publicPath: '/',
                            },
                        },
                    ],
                },
                // .mjs import is buggy : https://github.com/webpack/webpack/issues/11467#issuecomment-691873586
                {
                    test: /\.m?js/,
                    type: 'javascript/auto',
                },
                {
                    test: /\.m?js/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    include: [
                        path.resolve(__dirname, '../../Extension/src/background/filter/request-filter.js'),
                    ],
                    use: [{
                        loader: 'preprocess-loader',
                        options: {
                            remoteScripts: browserConfig.remoteScripts,
                            devtools: browserConfig.devtools,
                            ppOptions: {
                                type: 'js',
                            },
                        },
                    }],
                },
                /*
                 * Prevent browser console warnings with source map issue
                 * by deleting source map url comments in production build
                 */
                {
                    test: /\.(m?js|jsx)$/,
                    enforce: 'pre',
                    resolve: {
                        fullySpecified: false,
                    },
                    use: [
                        {
                            loader: 'source-map-loader',
                            options: {
                                filterSourceMappingUrl: () => (isDev ? 'skip' : 'remove'),
                            },
                        },
                    ],
                },
                {
                    test: /\.(m?js|jsx)$/,
                    exclude: /node_modules\/(?!@qwant)/,
                    use: [{
                        loader: 'babel-loader',
                        options: { babelrc: true },
                    }],
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 1,
                                url: false,
                                modules: {
                                    auto: true,
                                    exportOnlyLocals: false,
                                    localIdentName: '[name]__[local]___[hash:base64:5]',
                                },
                            },
                        },
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                }, {
                    test: /\.(png|jpe?g|gif|webm)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
            ],
        },

        plugins: [
            new BundleAnalyzerPlugin({ analyzerMode: 'disabled', reportFilename: `../report-${browserConfig.browser}.html` }),
            new CleanWebpackPlugin(),
            ...getModuleReplacements(browserConfig),
            new HtmlWebpackPlugin({
                ...htmlTemplatePluginCommonOptions,
                template: path.join(BACKGROUND_PATH, 'index.html'),
                templateParameters: {
                    browser: process.env.BROWSER,
                },
                filename: 'pages/background.html',
                chunks: ['pages/background'],
            }),
            new HtmlWebpackPlugin({
                ...htmlTemplatePluginCommonOptions,
                template: path.join(OPTIONS_PATH, 'index.html'),
                filename: 'pages/options.html',
                chunks: ['vendors/react', 'vendors/react-icons', 'vendors/mobx', 'vendors/xstate', 'pages/options'],
            }),
            new HtmlWebpackPlugin({
                ...htmlTemplatePluginCommonOptions,
                template: path.join(POPUP_PATH, 'index.html'),
                filename: 'pages/popup.html',
                chunks: ['vendors/react', 'vendors/react-icons', 'vendors/mobx', 'pages/popup'],
            }),
            // new HtmlWebpackPlugin({
            //     ...htmlTemplatePluginCommonOptions,
            //     template: path.join(FILTERING_LOG_PATH, 'index.html'),
            //     filename: 'pages/filtering-log.html',
            //     chunks: ['vendors/react', 'vendors/mobx', 'vendors/xstate', 'pages/filtering-log'],
            // }),
            // new HtmlWebpackPlugin({
            //     ...htmlTemplatePluginCommonOptions,
            //     template: path.join(FILTER_DOWNLOAD_PATH, 'index.html'),
            //     filename: 'pages/filter-download.html',
            //     chunks: ['pages/filter-download'],
            // }),
            // new HtmlWebpackPlugin({
            //     ...htmlTemplatePluginCommonOptions,
            //     template: path.join(FULLSCREEN_USER_RULES_PATH, 'index.html'),
            //     filename: 'pages/fullscreen-user-rules.html',
            //     chunks: ['vendors/react', 'vendors/mobx', 'vendors/xstate', 'shared/editor', 'pages/fullscreen-user-rules'],
            // }),
            new HtmlWebpackPlugin({
                ...htmlTemplatePluginCommonOptions,
                template: path.join(AD_BLOCKED_PATH, 'index.html'),
                filename: 'pages/ad-blocked.html',
                chunks: ['vendors/react', 'pages/ad-blocked'],
            }),
            // new HtmlWebpackPlugin({
            //     ...htmlTemplatePluginCommonOptions,
            //     template: path.join(SAFEBROWSING_PATH, 'index.html'),
            //     filename: 'pages/safebrowsing.html',
            //     chunks: ['vendors/react', 'pages/safebrowsing'],
            // }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: 'Extension',
                        from: 'assets',
                        to: 'assets',
                    },
                    {
                        context: 'Extension',
                        from: '_locales',
                        to: '_locales',
                        transform: (content) => {
                            return updateLocalesMSGName(content, process.env.BUILD_ENV, browserConfig.browser);
                        },
                    },
                    {
                        context: 'Extension',
                        from: 'web-accessible-resources',
                        to: 'web-accessible-resources',
                    },
                    {
                        context: 'Extension',
                        from: 'src/content-script/subscribe.js',
                        to: 'content-script/subscribe.js',
                    },
                ],
            }),
        ],
    };
};
