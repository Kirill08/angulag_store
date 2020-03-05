import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStorageServece } from './../shared/data-storage.serve';
import { Component, OnInit, OnDestroy } from '@angular/core';

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

  constructor(dataStorageServece: DataStorageServece, authService: AuthService) {
    this.dataStorageServece = dataStorageServece;
    this.authService = authService;
   }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {

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
