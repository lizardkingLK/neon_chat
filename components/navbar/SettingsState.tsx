import { SettingsType } from "@/types/client";
import { create } from "zustand";

export const useSettingsStore = create<SettingsType>(() => ({
  id: 0,
  autoScroll: true,
  expiringMessages: false,
  enterIsSend: false,
  ownerId: 0,
}));

export const useSettingsStoreManager = create(() => ({
  initializeSettings: (initialState: SettingsType) => {
    useSettingsStore.setState(initialState);
  },
  updateSettings: (updatedState: SettingsType) => {
    useSettingsStore.setState(updatedState);
  },
}));
