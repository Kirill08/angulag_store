import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { User } from './user.model';
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

  private http: HttpClient;
  private router: Router;
  readonly userDataKey = 'userData';
  private tokenExpirationTimer: any;
  private store: Store<fromApp.AppState>;

  constructor(http: HttpClient, router: Router, store: Store<fromApp.AppState>) {
    this.http = http;
    this.router = router;
    this.store = store;
  }

  autoLogin() {
    const userDataJsonString = localStorage.getItem(this.userDataKey);
    const userData: {
       email: string
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userDataJsonString);

    if (!userData) {
      return;
    }

    const tokenExpirationDate = new Date(userData._tokenExpirationDate);

    const loadedUser = new User(
      userData.email,
       userData.id,
        userData._token,
         tokenExpirationDate);

    if (loadedUser.token) {
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate: tokenExpirationDate
      }));
      // Find the time difference between saved and current time
      const expirationDuration = tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem(this.userDataKey);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
  //   const expirationDate = new Date(
  //     new Date().getTime() + expiresIn * 1000 // in milliseconds
  //   );
  //   const user = new User(
  //     email,
  //     userId,
  //     token,
  //     expirationDate
  //   );

  //   this.store.dispatch(new AuthActions.AuthenticateSuccess({email, userId, token, expirationDate}));
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem(this.userDataKey, JSON.stringify(user));
  // }

  // private handlerError(errorRes: HttpErrorResponse) {

  //   let errorMessage = 'An unknown error occurred!';
  //   if (!errorRes.error || !errorRes.error.error) {
  //     return throwError(errorMessage);
  //   }

  //   switch (errorRes.error.error.message) {
  //     case 'EMAIL_EXISTS':
  //       errorMessage = 'The email address is already in use by another account.';
  //       break;
  //     case 'OPERATION_NOT_ALLOWED':
  //       errorMessage = 'Password sign-in is disabled for this project';
  //       break;
  //     case 'TOO_MANY_ATTEMPTS_TRY_LATER':
  //       errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
  //       break;
  //     case 'EMAIL_NOT_FOUND':
  //       errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
  //       break;
  //     case 'INVALID_PASSWORD':
  //       errorMessage = 'The password is invalid or the user does not have a password.';
  //       break;
  //     case 'USER_DISABLED':
  //       errorMessage = 'The user account has been disabled by an administrator.';
  //       break;
  //     // default:
  //     //   break;
  //   }

  //   return throwError(errorMessage);
  // }
}
