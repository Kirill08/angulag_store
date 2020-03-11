import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';

import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { AuthService, AuthResponseData } from './auth.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  public isLoginMode = true;
  public isLoading = false;
  public error: string = null;

  public loginForm: FormGroup;
  private authService: AuthService;
  private router: Router;
  private componentFactoryResolver: ComponentFactoryResolver;
  private closeSub: Subscription;
  private storeSub: Subscription;

  @ViewChild(PlaceholderDirective, { static: false}) alertHost: PlaceholderDirective;
  private store: Store<fromApp.AppState>;

  constructor(authService: AuthService,
              router: Router,
              componentFactoryResolver: ComponentFactoryResolver,
              store: Store<fromApp.AppState>
  ) {
    this.authService = authService;
    this.router = router;
    this.componentFactoryResolver = componentFactoryResolver;
    this.store = store;
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email] ),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(
        new AuthActions.LoginStart({email: email, password: password})
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({email: email, password: password})
      );
    }

    this.loginForm.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(message: string) {
    // all elements added through the code must be added to entryComponents (in app.module.ts)
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
