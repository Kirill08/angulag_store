import { AuthService } from './auth/auth.service';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None //styles are visible throughout the project
})
export class AppComponent implements OnInit {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
