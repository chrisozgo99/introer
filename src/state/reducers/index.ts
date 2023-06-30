import { CombinedState, Reducer, combineReducers } from "redux";

import account, { AccountState } from "./account";
import status, { StatusState } from "./status";

export type RootState = {
  account: AccountState;
  status: StatusState;
};

const reducers: Reducer<CombinedState<RootState>> = combineReducers({
  account,
  status,
});

export default reducers;
