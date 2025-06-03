export type CacheEntry<T> = {
  createdAt: number,
  val: T
}

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalID?: NodeJS.Timeout;
  #interval: number

  add<T>(key: string, val: T) {
    const entry = { createdAt: Date.now(), val }
    this.#cache.set(key, entry);
  }

  get<T>(key: string) {
    return this.#cache.get(key)?.val;
  }

  #reap() {
    for (const [key, entry] of this.#cache) {
      if(entry.createdAt <= Date.now()-this.#interval)
        this.#cache.delete(key);
    }
  }

  #startReapLoop() {
    this.#reapIntervalID = setInterval(() => this.#reap(), this.#interval);
  }

  constructor(interval: number) {
    this.#interval = interval;
    this.#startReapLoop();
  }

  stopReapLoop() {
    clearInterval(this.#reapIntervalID);
    this.#reapIntervalID = undefined;
  }
}