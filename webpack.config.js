// This file is used for the editor to understand the editor-side alias in scss files
const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '~src': path.resolve(__dirname, 'Extension/src'),
        },
    },
};
