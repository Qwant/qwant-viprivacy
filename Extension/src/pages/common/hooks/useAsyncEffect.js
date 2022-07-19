import { useEffect, useRef } from 'react';

/**
 * useEffect that accepts async functions
 *
 * @param {({current: boolean}) => any} cb The callback will receive
 *                                         a ref to know if the component is
 *                                         still mounted
 * @param {array} deps
 */
export function useAsyncEffect(cb, deps) {
    const isMounted = useRef(true);
    useEffect(() => {
        cb(isMounted);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => () => { isMounted.current = false; }, []);
}
