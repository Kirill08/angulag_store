import { User } from './../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  console.log(state);
  switch (action.type) {
    case AuthActions.AUTHTICATE_SUCCESS: {
      const userData = action.payload;
      const user = new User(
        userData.email,
        userData.userId,
        userData.token,
        userData.expirationDate
      );

      const newState = {
        ...state,
        authError: null,
        user: user,
        loading: false
      };

      return newState;
    }
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START: {
      return {
        ...state,
        authError: null,
        loading: true
      };
    }
    case AuthActions.AUTHTICATE_FAIL: {
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false
      };
    }
    case AuthActions.LOGOUT: {
      return {
        ...state,
        user: null
      };
    }
    case AuthActions.CLEAR_ERROR: {
      return {
        ...state,
        authError: null
      }
    }
    default: {
      return state;
    }
  }
}
