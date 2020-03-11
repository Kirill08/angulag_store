import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';

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

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  public payload: {email: string; password: string};

  constructor(payload: {email: string; password: string}) {
    this.payload = payload;
  }
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;
  public payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }

}

export type AuthActions = Login | Logout | LoginStart | LoginFail;
