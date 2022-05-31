import React from 'react';

export const Image = ({
    src, srcFallback, alt = '', ...props
}) => {
    const [source, setSource] = React.useState(src);

    const onError = () => {
        setSource(srcFallback);

        const transaction = window?.apm?.startTransaction('image-load-fail');
        if (transaction) {
            transaction.addLabels([{ src }, { alt }, { srcFallback }]);
            transaction.result = 'failure';
            transaction.end();
        }
        console.warn(`Error loading image src=${src}, fallback=${srcFallback}`);
    };

    return (
        <img src={source} alt={alt} onError={onError} {...props} />
    );
};
