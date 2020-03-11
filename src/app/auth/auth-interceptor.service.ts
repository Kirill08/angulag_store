import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, exhaustMap, map } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  authService: AuthService;
  private store: Store<fromApp.AppState>;

  constructor(authService: AuthService, store: Store<fromApp.AppState>) {
    this.authService = authService;
    this.store = store;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<fromApp.AppState>> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });

        return next.handle(modifiedReq);
      }));
  }

}
