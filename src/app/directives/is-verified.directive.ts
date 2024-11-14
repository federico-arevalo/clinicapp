import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[IsVerified]',
  standalone: true,
})
export class IsVerifiedDirective {
  @Input('IsVerified') IsVerified!: boolean;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.IsVerified) {
      this.el.nativeElement.style.backgroundColor = 'green';
    } else this.el.nativeElement.style.backgroundColor = 'red';
  }
}
