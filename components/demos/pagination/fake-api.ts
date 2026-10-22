// A tiny in-browser stand-in for a cursor-paginated bookings endpoint.
// The cursor names a boundary row ("after BK-1017"), the way many real APIs do. That is what makes
// a stale cursor dangerous: sent with a different filter, it doesn't fail, it silently skips rows.

export type BookingType = "EMERGENCY" | "EVENT";

export type Booking = {
  id: string;
  seq: number;
  type: BookingType;
  status: "Pending" | "En route" | "Transporting" | "Completed" | "Cancelled";
  amount: number;
};

export type Filters = { limit: string; cursor?: string; type?: BookingType };

export type Page = {
  data: Booking[];
  nextCursor: string | null;
  previousCursor: string | null;
  position: number;
  total: number;
};

const STATUSES: Booking["status"][] = ["Completed", "Transporting", "En route", "Completed", "Pending", "Cancelled"];
const TYPES: BookingType[] = ["EMERGENCY", "EMERGENCY", "EVENT", "EMERGENCY", "EVENT", "EVENT", "EMERGENCY"];

// 24 bookings, newest first.
const ALL: Booking[] = Array.from({ length: 24 }, (_, i) => {
  const seq = 1024 - i;
  return {
    id: `BK-${seq}`,
    seq,
    type: TYPES[i % TYPES.length],
    status: STATUSES[(i * 5) % STATUSES.length],
    amount: 45000 + ((i * 7919) % 11) * 6500,
  };
});

const encode = (dir: "after" | "before", seq: number) => `${dir}:${seq}`;

function decode(cursor: string) {
  const [dir, seq] = cursor.split(":");
  return { dir: dir as "after" | "before", seq: Number(seq) };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getBookings(filters: Filters, { fail = false, latency = 700 } = {}): Promise<Page> {
  await wait(latency);
  if (fail) throw new Error("The request failed before it reached the server.");

  const limit = Number(filters.limit);
  const set = filters.type ? ALL.filter((b) => b.type === filters.type) : ALL;

  let start = 0;
  if (filters.cursor) {
    const { dir, seq } = decode(filters.cursor);
    if (dir === "after") {
      const i = set.findIndex((b) => b.seq < seq);
      start = i === -1 ? set.length : i;
    } else {
      const end = set.filter((b) => b.seq > seq).length;
      start = Math.max(0, end - limit);
    }
  }

  const data = set.slice(start, start + limit);
  const last = data.at(-1);
  return {
    data,
    nextCursor: last && start + limit < set.length ? encode("after", last.seq) : null,
    previousCursor: data[0] && start > 0 ? encode("before", data[0].seq) : null,
    position: start,
    total: set.length,
  };
}
