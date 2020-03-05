import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdownDirective]'
})
export class DropdownDirective {
  // aria-haspopup="true" aria-expanded="false"
  @HostBinding('class.open') isOpen = false;
  constructor() { }

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
