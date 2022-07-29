import React from 'react';

import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as LogoWithSquare } from './logo-square.svg';

export function QwantLogo({ withSquare, ...props }) {
    if (withSquare) {
        return <LogoWithSquare {...props} />;
    }
    return <Logo {...props} />;
}
