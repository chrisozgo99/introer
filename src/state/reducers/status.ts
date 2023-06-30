import { STATUS_LOADING, STATUS_UPDATE } from "../actions/status";

export type Status = "makeIntro" | "choosePeople";

export interface StatusState {
  status: Status;
  loading: boolean;
  hidden: boolean;
}

const initialState: StatusState = {
  status: "makeIntro",
  loading: false,
  hidden: true,
};

export default function status(state = initialState, action) {
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
