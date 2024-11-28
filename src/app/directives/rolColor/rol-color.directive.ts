import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appRolColor]',
  standalone: true,
})
export class RolColorDirective {
  @Input('appRolColor') rol!: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    switch (this.rol) {
      case 'paciente':
        this.el.nativeElement.style.color = 'green';
        break;
      case 'especialista':
        this.el.nativeElement.style.color = 'blue';
        break;
      default:
        this.el.nativeElement.style.color = 'red';
        break;
    }
  }
}
