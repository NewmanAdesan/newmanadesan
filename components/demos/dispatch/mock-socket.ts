// An in-browser stand-in for the Socket.IO gateway, with the same event names the admin feed listens to.
// It walks a few bookings through their statuses and can be told to drop or to send a socket error.

export const STATUSES = ["PENDING", "APPROACHING", "PICKUP", "LOADING", "TRANSPORTING", "COMPLETED"] as const;
export type BookingStatus = (typeof STATUSES)[number];

export type StatusChange = { bookingId: string; status: BookingStatus; ambulance: string };

type Events = {
  connect: () => void;
  disconnect: () => void;
  "socket-error": (err: { message: string }) => void;
  "booking-status-change": (data: StatusChange) => void;
};

const AMBULANCES = ["LAG-789-XY", "LAG-456-CD", "LAG-213-KJ", "LAG-902-AB"];

export class MockSocket {
  connected = false;
  private handlers = new Map<keyof Events, ((...args: never[]) => void)[]>();
  private timers: ReturnType<typeof setTimeout>[] = [];
  private ticker?: ReturnType<typeof setInterval>;
  private bookings: { id: string; step: number; ambulance: string }[] = [];
  private nextId = 0x12de;

  on<E extends keyof Events>(event: E, fn: Events[E]) {
    this.handlers.set(event, [...(this.handlers.get(event) ?? []), fn]);
    return this;
  }

  private emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>) {
    for (const fn of this.handlers.get(event) ?? []) (fn as (...a: Parameters<Events[E]>) => void)(...args);
  }

  connect() {
    this.timers.push(
      setTimeout(() => {
        this.connected = true;
        this.emit("connect");
        this.ticker = setInterval(() => this.tick(), 2000);
        this.tick();
      }, 700),
    );
    return this;
  }

  disconnect() {
    this.stop();
    if (this.connected) {
      this.connected = false;
      this.emit("disconnect");
    }
  }

  // Simulates the network going away. Like Socket.IO, it reconnects by itself a few seconds later.
  drop() {
    this.disconnect();
    this.timers.push(setTimeout(() => this.connect(), 4000));
  }

  // Simulates the gateway rejecting the session, which the feed shows as an error with a retry.
  fail() {
    this.disconnect();
    this.emit("socket-error", { message: "The live feed was refused by the server." });
  }

  private stop() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    clearInterval(this.ticker);
  }

  private tick() {
    const active = this.bookings.filter((b) => b.step < STATUSES.length - 1);
    if (active.length < 2) {
      const booking = {
        id: `EMG-${(this.nextId++).toString(16).toUpperCase().padStart(6, "0")}`,
        step: 0,
        ambulance: AMBULANCES[this.nextId % AMBULANCES.length],
      };
      this.bookings = [...active, booking];
      this.emit("booking-status-change", { bookingId: booking.id, status: "PENDING", ambulance: booking.ambulance });
      return;
    }
    const booking = active[Math.floor(Math.random() * active.length)];
    booking.step += 1;
    this.bookings = active;
    this.emit("booking-status-change", {
      bookingId: booking.id,
      status: STATUSES[booking.step],
      ambulance: booking.ambulance,
    });
  }
}
