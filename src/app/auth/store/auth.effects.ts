import { User } from './../user.model';
import { Router } from '@angular/router';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string;
  email:	string;
  refreshToken:	string;
  expiresIn:	string;
  localId:	string;
  registered:	boolean;
}

export const USER_DATA_KEY = 'userData';


const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(
    new Date().getTime() + expiresIn * 1000 // in milliseconds
  );
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess(
    {
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate
    });
};

const hendleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'The email address is already in use by another account.';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Password sign-in is disabled for this project';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid or the user does not have a password.';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled by an administrator.';
      break;
  }

  return of(new AuthActions.AuthenticateFail(errorMessage)); // create a new boservable
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {

      const payload = signupAction.payload;

      return this.http.post<AuthResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDMBpGyL08gkWQVppz3Pz61DxwAwmiPlKo',
        {
          email : payload.email,
          password : payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        }),
        catchError(errorRes => {
          return hendleError(errorRes);
        }),
      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMBpGyL08gkWQVppz3Pz61DxwAwmiPlKo',
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        }),
        catchError(errorRes => {
          return hendleError(errorRes);
      }),
      );
  }));

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHTICATE_SUCCESS), tap(() => {
    this.router.navigate(['/']);
  }));

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem(USER_DATA_KEY);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userDataJsonString = localStorage.getItem(USER_DATA_KEY);
      const userData: {
         email: string
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(userDataJsonString);

      if (!userData) {
        return {type: 'DUMMY'};
      }

      const tokenExpirationDate = new Date(userData._tokenExpirationDate);

      const loadedUser = new User(
        userData.email,
         userData.id,
          userData._token,
           tokenExpirationDate);

      if (loadedUser.token) {
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: tokenExpirationDate
        });
        // this.user.next(loadedUser);
        // Find the time difference between saved and current time
        // const expirationDuration = tokenExpirationDate.getTime() - new Date().getTime();
        // this.autoLogout(expirationDuration);
      }

      return {type: 'DUMMY'};
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

}
