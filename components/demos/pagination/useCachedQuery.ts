import { useCallback, useEffect, useRef, useState } from "react";

export type LogEntry = { id: number; key: string; outcome: "network" | "cache" | "failed" };

type State<T> = { data?: T; error?: Error; isFetching: boolean };

// A 50-line stand-in for TanStack Query, so this page doesn't ship a data library for one demo.
// It keeps the behaviours the pattern relies on: the key is the whole filters object, a cached key
// renders instantly, the previous rows stay on screen while a new key loads, and refetch re-runs
// exactly the current key. Responses for a key the user has already left are ignored.
export function useCachedQuery<K, T>(key: K, fetcher: (key: K) => Promise<T>) {
  const hash = JSON.stringify(key);
  const cache = useRef(new Map<string, T>());
  const latest = useRef(hash);
  const [state, setState] = useState<State<T>>({ isFetching: true });
  const [log, setLog] = useState<LogEntry[]>([]);
  const seq = useRef(0);

  const record = useCallback((outcome: LogEntry["outcome"], k: string) => {
    seq.current += 1;
    const entry = { id: seq.current, key: k, outcome };
    setLog((prev) => [entry, ...prev].slice(0, 4));
  }, []);

  const run = useCallback(
    (k: K, h: string) => {
      setState((s) => ({ data: s.data, isFetching: true }));
      fetcher(k).then(
        (data) => {
          cache.current.set(h, data);
          record("network", h);
          if (latest.current === h) setState({ data, isFetching: false });
        },
        (error: Error) => {
          record("failed", h);
          if (latest.current === h) setState((s) => ({ data: s.data, error, isFetching: false }));
        },
      );
    },
    [fetcher, record],
  );

  useEffect(() => {
    latest.current = hash;
    const cached = cache.current.get(hash);
    if (cached) {
      record("cache", hash);
      setState({ data: cached, isFetching: false });
      return;
    }
    run(JSON.parse(hash) as K, hash);
  }, [hash, run, record]);

  const refetch = useCallback(() => run(JSON.parse(latest.current) as K, latest.current), [run]);

  return { ...state, refetch, log };
}
