import { UserSearchResult } from "@src/types/user";
import { STATUS_LOADING, STATUS_UPDATE } from "../actions/status";

export type Status = "makeIntro" | "choosePeople" | "reviewPeople";

export interface StatusState {
  status: Status;
  loading: boolean;
  hidden: boolean;
  searchResults?: {
    user1: UserSearchResult;
    user2: UserSearchResult;
  };
}

export const initialStatusState: StatusState = {
  status: "makeIntro",
  loading: false,
  hidden: true,
};

export default function status(state = initialStatusState, action) {
  const { type, data } = action;
  switch (type) {
    case STATUS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STATUS_UPDATE:
      return {
        ...state,
        ...data,
      };
    default:
      return state;
  }
}
