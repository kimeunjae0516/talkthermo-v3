import { openDB } from "idb";
import { IStorage } from "./IStorage";
import { AnalysisRecord, PersonProfile } from "@/types/domain";

const DB_NAME = "talkthermo-db";

export class IndexedDbStorage implements IStorage {
  private async db() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore("records", { keyPath: "id" });
        db.createObjectStore("profiles", { keyPath: "id" });
      }
    });
  }

  async listRecords() {
    const db = await this.db();
    return (await db.getAll("records")) as AnalysisRecord[];
  }
  async saveRecord(record: AnalysisRecord) {
    const db = await this.db();
    await db.put("records", record);
  }
  async listProfiles() {
    const db = await this.db();
    return (await db.getAll("profiles")) as PersonProfile[];
  }
  async saveProfile(profile: PersonProfile) {
    const db = await this.db();
    await db.put("profiles", profile);
  }
}
