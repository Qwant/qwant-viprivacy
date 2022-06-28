import React, { useState } from 'react';

export const ImageWithFallback = ({
    src, srcFallback, alt = '', ...props
}) => {
    const [source, setSource] = useState(src);

    const onError = () => {
        setSource(srcFallback);

        const transaction = window?.apm?.startTransaction('image-load-fail');
        if (transaction) {
            transaction.addLabels([{ src }, { alt }, { srcFallback }]);
            transaction.result = 'failure';
            transaction.end();
        }
        // eslint-disable-next-line no-console
        console.warn(`Error loading image src=${src}, fallback=${srcFallback}`);
    };

    return (
        <img src={source} alt={alt} onError={onError} {...props} />
    );
};
