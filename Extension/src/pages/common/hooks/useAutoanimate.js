import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef } from 'react';
/**
 * AutoAnimate hook for adding dead-simple transitions and animations to react.
 * @param options - Auto animate options or a plugin
 * @returns
 */
export function useAutoAnimate(options = {}) {
    const element = useRef(null);
    useEffect(() => {
        if (element.current instanceof HTMLElement) autoAnimate(element.current, options);
    }, [element]);
    return [element];
}
