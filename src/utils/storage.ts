import { StorageType } from "@/types";

const isBrowser = typeof window !== "undefined";

const getStorage = (type: StorageType): Storage | null => {
  if (!isBrowser) return null;
  return type === "local" ? window.localStorage : window.sessionStorage;
};

export const storage = {
  get: (key: string, type: StorageType = "local"): string | null => {
    const storage = getStorage(type);
    if (!storage) return null;
    return storage.getItem(key);
  },

  set: (key: string, value: string, type: StorageType = "local"): void => {
    const storage = getStorage(type);
    if (!storage) return;
    storage.setItem(key, value);
  },

  remove: (key: string, type: StorageType = "local"): void => {
    const storage = getStorage(type);
    if (!storage) return;
    storage.removeItem(key);
  },

  clear: (type: StorageType = "local"): void => {
    const storage = getStorage(type);
    if (!storage) return;
    storage.clear();
  },

  setObject: (
    key: string,
    value: unknown,
    type: StorageType = "local"
  ): void => {
    try {
      const json = JSON.stringify(value);
      storage.set(key, json, type);
    } catch (err) {
      console.error(
        `Failed to stringify and save object for key "${key}"`,
        err
      );
    }
  },

  getObject: <T = unknown>(
    key: string,
    type: StorageType = "local"
  ): T | null => {
    try {
      const item = storage.get(key, type);
      return item ? (JSON.parse(item) as T) : null;
    } catch (err) {
      console.error(`Failed to parse JSON for key "${key}"`, err);
      return null;
    }
  },
};
