import { AnalysisRecord, PersonProfile } from "@/types/domain";

export interface IStorage {
  listRecords(): Promise<AnalysisRecord[]>;
  saveRecord(record: AnalysisRecord): Promise<void>;
  listProfiles(): Promise<PersonProfile[]>;
  saveProfile(profile: PersonProfile): Promise<void>;
}
