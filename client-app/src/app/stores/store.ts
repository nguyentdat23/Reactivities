import { useContext } from "react";
import { createContext } from "react";
import { Modal } from "semantic-ui-react";
import AccountStore from "./accountStore";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";

interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  accountStore: AccountStore;
  modalStore: ModalStore;
  profileStore: ProfileStore;
}
export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  accountStore: new AccountStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore()
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
