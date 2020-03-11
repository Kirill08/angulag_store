import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  idToken: string;
  email:	string;
  refreshToken:	string;
  expiresIn:	string;
  localId:	string;
  registered:	boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  readonly userDataKey = 'userData';
  private tokenExpirationTimer: any;
  private store: Store<fromApp.AppState>;

  constructor( store: Store<fromApp.AppState>) {
    this.store = store;
  }

  setLogoutTimer(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
