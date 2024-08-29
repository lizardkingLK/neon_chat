import { SettingsType } from "@/types/client";
import { create } from "zustand";

export const useSettingsStore = create<SettingsType>(() => ({
  id: 0,
  autoScroll: true,
  ownerId: 0,
}));

export const useSettingsStoreManager = create(() => ({
  initializeSettings: (initialState: SettingsType) => {
    console.log({ state: useSettingsStore.getState() });
    useSettingsStore.setState(initialState);
  },
  updateSettings: (updatedState: SettingsType) => {
    useSettingsStore.setState(updatedState);
  },
}));
