import { create } from "zustand";
import type { QueueEntry } from "@/schemas";

interface QueueState {
  entry: QueueEntry | null;
  setEntry: (entry: QueueEntry | null) => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  entry: null,
  setEntry: (entry) => set({ entry }),
}));