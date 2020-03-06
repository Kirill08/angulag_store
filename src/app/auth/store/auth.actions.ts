import { Action } from '@ngrx/store';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGOUT2 = 'LOGOUT';

export class Login implements Action {
  readonly type = LOGIN;
  public payload: {
    email: string;
    userId: string;
    token: string;
    expirationDate: Date;
  };

  constructor(payload: {
    email: string,
    userId: string,
    token: string,
    expirationDate: Date
  }) {
    this.payload = payload;
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type AuthActions = Login | Logout;
