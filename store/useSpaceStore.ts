import { create } from "zustand";
import type { Seat, Space, SpaceType } from "@/schemas";

type TypeFilter = SpaceType | "all";
type AvailabilityFilter = "all" | "available";

interface SpaceState {
  spaces: Space[];
  seats: Seat[];
  typeFilter: TypeFilter;
  availabilityFilter: AvailabilityFilter;
  search: string;

  setSpaces: (spaces: Space[]) => void;
  setSeats: (seats: Seat[]) => void;
  setTypeFilter: (v: TypeFilter) => void;
  setAvailabilityFilter: (v: AvailabilityFilter) => void;
  setSearch: (v: string) => void;
  /** لیست سالن‌ها بعد از اعمال فیلترها */
  filteredSpaces: () => Space[];
}

export const useSpaceStore = create<SpaceState>((set, get) => ({
  spaces: [],
  seats: [],
  typeFilter: "all",
  availabilityFilter: "all",
  search: "",

  setSpaces: (spaces) => set({ spaces }),
  setSeats: (seats) => set({ seats }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setAvailabilityFilter: (availabilityFilter) => set({ availabilityFilter }),
  setSearch: (search) => set({ search }),

  filteredSpaces: () => {
    const { spaces, typeFilter, availabilityFilter, search } = get();
    return spaces.filter((s) => {
      if (typeFilter !== "all" && s.type !== typeFilter) return false;
      if (availabilityFilter === "available" && s.currentOccupancy >= s.totalCapacity)
        return false;
      if (search && !`${s.name} ${s.city} ${s.address}`.includes(search.trim()))
        return false;
      return true;
    });
  },
}));