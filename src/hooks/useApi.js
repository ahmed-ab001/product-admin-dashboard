"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic hook for calling async API functions.
 *
 * @template T
 * @param {() => Promise<T>} apiFn  — The async function to call. Wrap it in
 *   useCallback when passing arguments to avoid infinite re-renders.
 * @param {Array}  [deps=[]]       — Dependency array (re-fetches when these change).
 * @param {object} [options={}]
 * @param {boolean} [options.immediate=true] — Whether to call apiFn immediately.
 * @returns {{ data: T|null; loading: boolean; error: string|null; refetch: () => void }}
 */
export default function useApi(apiFn, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Track whether the component is still mounted to prevent state updates on
  // unmounted components.
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    if (!isMounted.current) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err?.message || "Something went wrong.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, [apiFn, ...deps]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
