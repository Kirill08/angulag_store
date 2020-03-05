import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceHolder]'
})
export class PlaceholderDirective {
  public viewContainerRef: ViewContainerRef;

  constructor(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }
}
