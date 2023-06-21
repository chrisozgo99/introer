import { combineReducers } from "redux";

import account, { AccountState } from "./account";

export type RootState = {
  account: AccountState;
};

const reducers = combineReducers({
  account,
});

export default reducers;
