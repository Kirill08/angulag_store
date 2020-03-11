import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageServece } from './../shared/data-storage.serve';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  public isAuthenticated = false;

  private dataStorageServece: DataStorageServece;
  private authService: AuthService;
  private userSub: Subscription;
  private store: Store<fromApp.AppState>;

  constructor(dataStorageServece: DataStorageServece, authService: AuthService, store: Store<fromApp.AppState>) {
    this.dataStorageServece = dataStorageServece;
    this.authService = authService;
    this.store = store;
  }

  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(map(authState => {
      return authState.user;
    })).subscribe((user) => {

      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveDatta() {
    this.dataStorageServece.storeRecipes();
  }

  onFetchData() {
    this.dataStorageServece.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
