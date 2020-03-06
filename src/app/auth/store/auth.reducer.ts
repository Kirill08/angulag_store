import { User } from './../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user2: User;
}

const initialState: State = {
  user2: null
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {

  switch (action.type) {
    case AuthActions.LOGIN: {
      const userData = action.payload;
      const user = new User(
        userData.email,
        userData.userId,
        userData.token,
        userData.expirationDate
      );

      const newState = {
        ...state,
        user: user
      };

      return newState;
    }
    case AuthActions.LOGOUT: {
      return {
        ...state,
        user: null
      };
    }
    default: {
      return state;
    }
  }
}
