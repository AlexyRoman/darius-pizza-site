// Local pacer: windowed rate limit + basic concurrency control
type VoidFn = () => void;

class Pacer {
  private readonly windowMs: number;
  private readonly max: number;
  private readonly concurrency: number;
  private tokens: number;
  private inFlight: number = 0;
  private queue: VoidFn[] = [];

  constructor(options: { windowMs: number; max: number; concurrency: number }) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.concurrency = options.concurrency;
    this.tokens = this.max;
    setInterval(() => {
      this.tokens = this.max;
      this.drain();
    }, this.windowMs);
  }

  private drain(): void {
    while (
      this.inFlight < this.concurrency &&
      this.tokens > 0 &&
      this.queue.length > 0
    ) {
      const next = this.queue.shift();
      if (!next) break;
      this.tokens -= 1;
      this.inFlight += 1;
      const finish = () => {
        this.inFlight = Math.max(0, this.inFlight - 1);
        this.drain();
      };
      try {
        next();
      } finally {
        // Ensure we release a slot shortly after execution
        setTimeout(finish, 0);
      }
    }
  }

  schedule(fn: VoidFn): void {
    this.queue.push(fn);
    this.drain();
  }
}

export const uiPacer = new Pacer({ windowMs: 1000, max: 10, concurrency: 4 });

export function withDebounce<A extends unknown[]>(
  fn: (...args: A) => void,
  waitMs = 250
): (...args: A) => void {
  let id: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => fn(...args), waitMs);
  };
}

export function withThrottle<A extends unknown[]>(
  fn: (...args: A) => void,
  waitMs = 250
): (...args: A) => void {
  let last = 0;
  let scheduled = false;
  return (...args: A) => {
    const now = Date.now();
    if (now - last >= waitMs) {
      last = now;
      fn(...args);
    } else if (!scheduled) {
      scheduled = true;
      setTimeout(
        () => {
          scheduled = false;
          last = Date.now();
          fn(...args);
        },
        Math.max(0, waitMs - (now - last))
      );
    }
  };
}

export function withRateLimit<A extends unknown[]>(
  fn: (...args: A) => void
): (...args: A) => void {
  return (...args: A) => {
    uiPacer.schedule(() => fn(...args));
  };
}
