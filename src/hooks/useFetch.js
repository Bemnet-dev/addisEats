import { useState, useEffect, useCallback } from 'react';
export function useFetch(fetchFn, deps = []) {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null,
    });
    const execute = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const result = await fetchFn();
            setState({ data: result, loading: false, error: null });
        }
        catch (err) {
            setState({ data: null, loading: false, error: err });
        }
    }, [fetchFn, ...deps]);
    useEffect(() => {
        execute();
    }, [execute]);
    return { ...state, refetch: execute };
}
