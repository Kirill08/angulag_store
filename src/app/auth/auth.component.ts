import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { AuthService, AuthResponseData } from './auth.service';

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
  @ViewChild(PlaceholderDirective, { static: false}) alertHost: PlaceholderDirective;

  constructor(authService: AuthService, router: Router, componentFactoryResolver: ComponentFactoryResolver) {
    this.authService = authService;
    this.router = router;
    this.componentFactoryResolver = componentFactoryResolver;
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email] ),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.sugnup(email, password);
    }

    authObs.subscribe((resData) => {
      console.log(resData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, (errorMessage) => {
      console.log(errorMessage);
      this.isLoading = false;
      this.error = errorMessage;
      this.showErrorAlert(errorMessage);
    });

    this.loginForm.reset();
  }

  onHandleError() {
    this.error = null;
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
  }
}
