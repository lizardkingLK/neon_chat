import { SettingsState } from "@/types/client";
import { create } from "zustand";

const settingsState =  (async () =>
  (await (await fetch("/api/settings")).json()) as SettingsState)();

export const useSettingsStore = create<SettingsState>(() => settingsState);

export const useSettingsStoreManager = create(() => ({
  update: (autoscroll: boolean) => {
    useSettingsStore.setState({ autoscroll });
  },
}));
