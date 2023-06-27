import { CombinedState, Reducer, combineReducers } from "redux";

import account, { AccountState } from "./account";

export type RootState = {
  account: AccountState;
};

const reducers: Reducer<CombinedState<RootState>> = combineReducers({
  account,
});

export default reducers;
