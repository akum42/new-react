export type StorageEntity<T> = T & { id: string };

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function hasLocalStorage(): boolean {
  try {
    const k = '__ls_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const memoryStore = new Map<string, string>();

function readRaw(key: string): string | null {
  if (hasLocalStorage()) return window.localStorage.getItem(key);
  return memoryStore.get(key) ?? null;
}

function writeRaw(key: string, value: string) {
  if (hasLocalStorage()) {
    window.localStorage.setItem(key, value);
  } else {
    memoryStore.set(key, value);
  }
}

export function getAll<T>(key: string): StorageEntity<T>[] {
  return safeParse<StorageEntity<T>[]>(readRaw(key), []);
}

export function save<T>(key: string, item: StorageEntity<T>): void {
  const all = getAll<T>(key);
  const idx = all.findIndex((x) => x.id === item.id);
  if (idx >= 0) {
    all[idx] = item;
  } else {
    all.push(item);
  }
  writeRaw(key, JSON.stringify(all));
}

export function removeById<T>(key: string, id: string): void {
  const all = getAll<T>(key).filter((x) => x.id !== id);
  writeRaw(key, JSON.stringify(all));
}

export function clear(key: string): void {
  writeRaw(key, JSON.stringify([]));
}
