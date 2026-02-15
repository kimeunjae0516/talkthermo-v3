import { IStorage } from "./IStorage";
import { AnalysisRecord, PersonProfile } from "@/types/domain";

const RECORDS_KEY = "talkthermo.records";
const PROFILES_KEY = "talkthermo.profiles";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
}

function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export class LocalStorageStorage implements IStorage {
  async listRecords() {
    return read<AnalysisRecord>(RECORDS_KEY);
  }
  async saveRecord(record: AnalysisRecord) {
    const records = read<AnalysisRecord>(RECORDS_KEY);
    write(RECORDS_KEY, [record, ...records]);
  }
  async listProfiles() {
    return read<PersonProfile>(PROFILES_KEY);
  }
  async saveProfile(profile: PersonProfile) {
    const profiles = read<PersonProfile>(PROFILES_KEY);
    write(PROFILES_KEY, [profile, ...profiles.filter((p) => p.id !== profile.id)]);
  }
}
