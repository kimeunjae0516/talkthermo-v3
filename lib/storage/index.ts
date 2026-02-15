import { IStorage } from "./IStorage";
import { IndexedDbStorage } from "./IndexedDbStorage";
import { LocalStorageStorage } from "./LocalStorageStorage";

let singleton: IStorage | null = null;

export function getStorage(): IStorage {
  if (singleton) return singleton;
  if (typeof window !== "undefined" && "indexedDB" in window) {
    singleton = new IndexedDbStorage();
  } else {
    singleton = new LocalStorageStorage();
  }
  return singleton;
}
