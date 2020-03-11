import { Store } from '@ngrx/store';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None //styles are visible throughout the project
})
export class AppComponent implements OnInit {
  private store: Store<fromApp.AppState>;

  constructor(store: Store<fromApp.AppState>) {
    this.store = store;
  }
  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
