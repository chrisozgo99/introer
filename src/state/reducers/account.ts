import {
  ACCOUNT_AUTH,
  ACCOUNT_PROFILE,
  ACCOUNT_LOGOUT,
} from "../actions/account";

const initialState = {
  token: null,
  user: null,
};

export default function account(state = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case ACCOUNT_AUTH:
      return {
        ...state,
        token: data.token,
      };
    case ACCOUNT_PROFILE:
      return {
        ...state,
        user: data.user,
      };
    case ACCOUNT_LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
}
