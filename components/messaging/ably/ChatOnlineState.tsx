import { create } from "zustand";

export const useOnlineSetStore = create<{ onlineSet: string[] }>(() => ({
  onlineSet: [],
}));

export const useOnlineSetStoreManager = create(() => ({
  insert: (username: string) => {
    const onlineSet = useOnlineSetStore.getState().onlineSet;
    onlineSet.push(username);
    useOnlineSetStore.setState({ onlineSet });
  },
  delete: (username: string) => {
    const onlineSet = useOnlineSetStore.getState().onlineSet;
    useOnlineSetStore.setState({
      onlineSet: onlineSet.filter((item) => item !== username),
    });
  },
}));
