"use client";

import { useCallback, useRef, useState } from "react";
import { DemoFrame } from "./DemoFrame";
import { getBookings, type BookingType, type Filters } from "./pagination/fake-api";
import { useCachedQuery } from "./pagination/useCachedQuery";

const DEFAULT_FILTERS: Filters = { limit: "5", cursor: undefined, type: undefined };
const TYPES: { label: string; value?: BookingType }[] = [
  { label: "All" },
  { label: "Emergency", value: "EMERGENCY" },
  { label: "Event", value: "EVENT" },
];

// The cursor-aware filter state pattern from the ambulance admin, running against a fake API.
export function CursorPaginationDemo() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [forgetReset, setForgetReset] = useState(false);
  const failNext = useRef(false);
  const [failArmed, setFailArmed] = useState(false);
  const [stale, setStale] = useState(false);

  // The one place filters change. Every call site has to say whether the cursor survives.
  function updateFilters(partial: Partial<Filters>, { resetCursor }: { resetCursor: boolean }) {
    setFilters((prev) => ({
      ...prev,
      ...partial,
      cursor: resetCursor ? undefined : (partial.cursor ?? prev.cursor),
    }));
  }

  const fetcher = useCallback((key: Filters) => {
    const fail = failNext.current;
    failNext.current = false;
    setFailArmed(false);
    return getBookings(key, { fail });
  }, []);

  const query = useCachedQuery(filters, fetcher);
  const page = query.data;
  const limit = Number(filters.limit);
  const firstLoadError = query.error && !page;

  // Filter and page-size changes reset the cursor, unless the demo is told to "forget".
  function changeFilter(partial: Partial<Filters>) {
    const resetCursor = !forgetReset;
    setStale(resetCursor ? false : stale || Boolean(filters.cursor));
    updateFilters(partial, { resetCursor });
  }

  function handleNext() {
    if (page?.nextCursor) updateFilters({ cursor: page.nextCursor }, { resetCursor: false });
  }

  function handlePrev() {
    if (page?.previousCursor) updateFilters({ cursor: page.previousCursor }, { resetCursor: false });
  }

  const from = page ? page.position + 1 : 0;
  const to = page ? page.position + page.data.length : 0;
  const showSkip = stale && !query.isFetching && page && page.position > 0;

  return (
    <DemoFrame
      title="Filter and page through bookings"
      note="The state and the call sites follow the ambulance admin's code. The API is a fake one running in your browser, with a deliberate delay so you can see the loading state; the request log shows what each change asked for."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <div role="group" aria-label="Booking type" className="flex rounded-full border border-line p-0.5">
            {TYPES.map((t) => (
              <button
                key={t.label}
                type="button"
                aria-pressed={filters.type === t.value}
                onClick={() => changeFilter({ type: t.value })}
                className="rounded-full px-3 py-1 aria-pressed:bg-ink aria-pressed:text-paper"
              >
                {t.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <span className="text-muted">Per page</span>
            <select
              value={filters.limit}
              onChange={(e) => changeFilter({ limit: e.target.value })}
              className="rounded-md border border-line bg-paper px-2 py-1"
            >
              <option value="5">5</option>
              <option value="8">8</option>
            </select>
          </label>
        </div>

        {firstLoadError ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-line py-12 text-center text-sm">
            <p>Couldn&apos;t load bookings. {query.error?.message}</p>
            <button type="button" onClick={query.refetch} className="rounded-full border border-line px-3 py-1.5">
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-line">
            <table className={`w-full text-left text-sm transition-opacity ${query.isFetching ? "opacity-60" : ""}`}>
              <thead className="bg-paper text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Booking</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {page?.data.map((b) => (
                  <tr key={b.id}>
                    <td className="px-3 py-2 font-mono text-xs">{b.id}</td>
                    <td className="px-3 py-2">{b.type === "EMERGENCY" ? "Emergency" : "Event"}</td>
                    <td className="px-3 py-2">{b.status}</td>
                    <td className="hidden px-3 py-2 text-right tabular-nums sm:table-cell">
                      ₦{b.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {!page &&
                  Array.from({ length: limit }, (_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-3 py-2">
                        <span className="block h-4 w-2/3 animate-pulse rounded bg-line" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-3 py-2.5 text-sm">
              <span className="text-muted tabular-nums">{page ? `Rows ${from}–${to} of ${page.total}` : "Loading"}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={query.isFetching || !page?.previousCursor}
                  aria-label="Previous page"
                  className="flex size-9 items-center justify-center rounded-md border border-line disabled:opacity-30"
                >
                  ‹
                </button>
                <span
                  aria-live="polite"
                  className="flex size-9 items-center justify-center rounded-md bg-ink text-xs font-semibold text-paper tabular-nums"
                >
                  {query.isFetching ? (
                    <span className="size-3.5 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                  ) : (
                    page && Math.floor(page.position / limit) + 1
                  )}
                  <span className="sr-only">{query.isFetching ? "Loading" : ""}</span>
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={query.isFetching || !page?.nextCursor}
                  aria-label="Next page"
                  className="flex size-9 items-center justify-center rounded-md border border-line disabled:opacity-30"
                >
                  ›
                </button>
              </div>
            </div>

            {query.error && page && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-paper px-3 py-2 text-sm">
                <span>That page didn&apos;t load. The rows above are from the last good response.</span>
                <button type="button" onClick={query.refetch} className="font-medium text-accent">
                  Retry
                </button>
              </div>
            )}
          </div>
        )}

        {showSkip && (
          <p className="rounded-md border border-line bg-paper px-3 py-2 text-sm">
            The old cursor went out with the new filter. The server didn&apos;t complain: it answered from the middle
            of the new result set, so rows 1–{page.position} were never shown. This is the bug the pattern prevents.
          </p>
        )}

        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="font-medium">Query key</p>
            <pre className="overflow-x-auto rounded-md bg-paper p-3 font-mono text-xs leading-relaxed">
              {JSON.stringify({ ...filters, cursor: filters.cursor ?? null }, null, 2)}
            </pre>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <p className="font-medium">Request log</p>
            <ol className="flex flex-col gap-1 rounded-md bg-paper p-3 font-mono text-xs leading-relaxed">
              {query.log.length === 0 && <li className="text-muted">Waiting for the first response</li>}
              {query.log.map((entry) => (
                <li key={entry.id} className="flex justify-between gap-3">
                  <span className="min-w-0 break-all">{describe(entry.key)}</span>
                  <span className={entry.outcome === "failed" ? "text-red-600 dark:text-red-400" : "text-muted"}>
                    {entry.outcome === "cache" ? "cache" : entry.outcome === "failed" ? "failed" : "200"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-4 text-sm">
          <button
            type="button"
            onClick={() => {
              failNext.current = true;
              setFailArmed(true);
            }}
            disabled={failArmed}
            className="rounded-full border border-line px-3 py-1.5 disabled:opacity-50"
          >
            {failArmed ? "The next request will fail" : "Make the next request fail"}
          </button>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={forgetReset}
              onChange={(e) => setForgetReset(e.target.checked)}
              className="size-4 accent-accent"
            />
            Forget to reset the cursor on filter changes
          </label>
        </div>
      </div>
    </DemoFrame>
  );
}

function describe(key: string) {
  const f = JSON.parse(key) as Filters;
  const params = [`limit=${f.limit}`, f.type && `type=${f.type}`, f.cursor && `cursor=${f.cursor}`].filter(Boolean);
  return `GET /bookings?${params.join("&")}`;
}
