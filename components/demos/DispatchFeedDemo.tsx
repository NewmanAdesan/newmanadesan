"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DemoFrame } from "./DemoFrame";
import { MockSocket, type BookingStatus, type StatusChange } from "./dispatch/mock-socket";

type FeedItem = StatusChange & { key: number; at: number };

const MESSAGES: Record<BookingStatus, (item: StatusChange) => string> = {
  PENDING: (i) => `Emergency booking #${i.bookingId} received`,
  APPROACHING: (i) => `#${i.bookingId} Ambulance ${i.ambulance} dispatched to the pickup address`,
  PICKUP: (i) => `#${i.bookingId} Ambulance ${i.ambulance} arrived at the pickup location`,
  LOADING: (i) => `#${i.bookingId} Patient being loaded into the vehicle`,
  TRANSPORTING: (i) => `#${i.bookingId} Patient on the way to the hospital`,
  COMPLETED: (i) => `Emergency booking #${i.bookingId} completed`,
};

const BADGE: Record<BookingStatus, string> = {
  PENDING: "bg-amber-500",
  APPROACHING: "bg-sky-500",
  PICKUP: "bg-violet-500",
  LOADING: "bg-violet-500",
  TRANSPORTING: "bg-sky-500",
  COMPLETED: "bg-emerald-500",
};

// The admin dashboard's live status feed, connected to a mock gateway instead of the real one.
// It only holds a connection while it is on screen and the tab is visible.
export function DispatchFeedDemo() {
  const root = useRef<HTMLDivElement>(null);
  const socket = useRef<MockSocket | null>(null);
  const counter = useRef(0);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const connect = useCallback(() => {
    socket.current?.disconnect();
    setIsLoading(true);
    setError(null);
    const s = new MockSocket()
      .on("connect", () => {
        setIsConnected(true);
        setIsLoading(false);
      })
      .on("disconnect", () => setIsConnected(false))
      .on("socket-error", (err) => {
        setError(err.message);
        setIsLoading(false);
      })
      .on("booking-status-change", (data) => {
        counter.current += 1;
        // Keyed by event, not booking: one booking sends several updates.
        setItems((prev) => [{ ...data, key: counter.current, at: Date.now() }, ...prev.slice(0, 6)]);
      });
    socket.current = s.connect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden), {
      threshold: 0.25,
    });
    const onVisibility = () => setVisible(!document.hidden && el.getBoundingClientRect().top < window.innerHeight);
    observer.observe(el);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    connect();
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(clock);
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [visible, connect]);

  const state = error ? "Error" : isConnected ? "Live" : isLoading && visible ? "Connecting" : "Offline";

  return (
    <DemoFrame
      title="Live booking feed"
      note="The Live, Offline and Error states and the seven-update limit follow the ambulance admin dashboard. The bookings are simulated in your browser; the real feed listens to the platform's Socket.IO gateway. This demo only stays connected while it is on screen."
    >
      <div ref={root} className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-md border border-line">
          <div className="flex items-center gap-3 border-b border-line bg-paper px-4 py-3 text-sm font-medium">
            Live status updates
            <span
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                state === "Live"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : state === "Error"
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted"
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  state === "Live" ? "bg-emerald-500" : state === "Error" ? "bg-red-500" : "bg-muted"
                }`}
              />
              {state}
            </span>
          </div>

          {error ? (
            <div className="flex h-72 flex-col items-center justify-center gap-3 px-4 text-center text-sm">
              <p>{error}</p>
              <button type="button" onClick={connect} className="rounded-full bg-ink px-4 py-1.5 font-medium text-paper">
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-72 items-center justify-center text-sm text-muted">
              {!visible ? "Connects when it scrolls into view" : isLoading ? "Connecting to the live feed" : "No bookings at the moment"}
            </div>
          ) : (
            <ol
              className={`h-72 divide-y divide-line overflow-hidden transition-opacity ${isConnected ? "" : "opacity-50"}`}
            >
              {items.map((item) => (
                <li
                  key={item.key}
                  className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 px-4 py-2.5 text-sm motion-safe:animate-[feed-in_400ms_ease-out]"
                >
                  <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted">
                    <span className={`size-2 rounded-full ${BADGE[item.status]}`} aria-hidden="true" />
                    <span className="hidden sm:inline">{item.status}</span>
                  </span>
                  <span className="min-w-0 sm:truncate">{MESSAGES[item.status](item)}</span>
                  <span className="text-xs text-muted tabular-nums">{ago(now - item.at)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            onClick={() => socket.current?.drop()}
            disabled={!isConnected}
            className="rounded-full border border-line px-3 py-1.5 disabled:opacity-40"
          >
            Drop the connection
          </button>
          <button
            type="button"
            onClick={() => socket.current?.fail()}
            disabled={!isConnected}
            className="rounded-full border border-line px-3 py-1.5 disabled:opacity-40"
          >
            Send a socket error
          </button>
        </div>
      </div>
    </DemoFrame>
  );
}

function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}
