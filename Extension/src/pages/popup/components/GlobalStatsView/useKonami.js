import React from 'react';

const codes = [
    'arrowup',
    'arrowup',
    'arrowdown',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'arrowleft',
    'arrowright',
    'b',
    'a',
];

export const useKonamiCode = () => {
    // State for keeping track of whether key is pressed
    const [konamiCode, setIsKonami] = React.useState(false);

    const resetKonami = () => {
        setIsKonami(false);
    };

    // Add event listeners
    React.useEffect(() => {
        let index = 0;

        const onKeyUp = ({ key }) => {
            if (index === codes.length - 1) {
                setIsKonami(true);
            }
            if (codes[index] != null && key.toLowerCase() === codes[index]) {
                index += 1;
            } else {
                index = 0;
                setIsKonami(false);
            }
        };

        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    return [konamiCode, resetKonami];
};
