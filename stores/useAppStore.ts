"use client";

import { create } from "zustand";
import { AnalysisRecord, AnalyzeOutput, InputMode, PersonProfile } from "@/types/domain";
import { getStorage } from "@/lib/storage";

interface AppState {
  mode: InputMode;
  saveEnabled: boolean;
  personId?: string;
  records: AnalysisRecord[];
  profiles: PersonProfile[];
  setMode: (mode: InputMode) => void;
  setSaveEnabled: (v: boolean) => void;
  setPersonId: (id?: string) => void;
  load: () => Promise<void>;
  saveMetadata: (params: {
    mode: InputMode;
    personId?: string;
    relationshipType?: string;
    goal?: string;
    userFeeling?: string;
    output: AnalyzeOutput;
  }) => Promise<void>;
  addProfile: (nickname: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: "text",
  saveEnabled: false,
  records: [],
  profiles: [],
  setMode: (mode) => set({ mode }),
  setSaveEnabled: (saveEnabled) => set({ saveEnabled }),
  setPersonId: (personId) => set({ personId }),
  load: async () => {
    const storage = getStorage();
    const [records, profiles] = await Promise.all([storage.listRecords(), storage.listProfiles()]);
    set({ records: records.sort((a,b)=>b.createdAt-a.createdAt), profiles: profiles.sort((a,b)=>b.createdAt-a.createdAt) });
  },
  saveMetadata: async ({ mode, personId, relationshipType, goal, userFeeling, output }) => {
    const rec: AnalysisRecord = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      mode,
      personId,
      relationshipType,
      goal,
      userFeeling,
      toneScore: output.toneScore,
      toneLabel: output.toneLabel,
      conflictTags: output.conflictSignals.map((c) => c.tag).slice(0, 6)
    };
    await getStorage().saveRecord(rec);
    await get().load();
  },
  addProfile: async (nickname) => {
    const profile: PersonProfile = { id: crypto.randomUUID(), nickname, createdAt: Date.now() };
    await getStorage().saveProfile(profile);
    await get().load();
  }
}));
