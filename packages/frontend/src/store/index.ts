import { create } from "zustand";
import { createAuthSlice } from "./auth";
import { IAppStore } from "@/types/store";

export const useAppStore = create<IAppStore>((...a) => ({
  ...createAuthSlice(...a),
}));
