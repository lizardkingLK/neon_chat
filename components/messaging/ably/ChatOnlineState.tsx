import { create } from "zustand";

export const useOnlineSetStore = create<{ onlineSet: string[] }>(() => ({
  onlineSet: [],
}));

export const useOnlineSetStoreManager = create(() => ({
  updateOnlineSet: (onlineSet: string[]) => {
    useOnlineSetStore.setState({ onlineSet });
  },
}));
