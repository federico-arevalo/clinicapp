import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTurnosColor]',
  standalone: true,
})
export class TurnosColorDirective {
  @Input('state') state!: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    console.log(this.state);
    switch (this.state) {
      case 'Pendiente':
        this.el.nativeElement.style.backgroundColor = 'yellow';
        break;
      case 'Realizado':
        this.el.nativeElement.style.backgroundColor = 'limegreen';
        break;
      case 'Cancelado':
        this.el.nativeElement.style.backgroundColor = 'darkorange';
        break;
      case 'Aceptado':
        this.el.nativeElement.style.backgroundColor = 'cyan';
        break;
      case 'Rechazado':
        this.el.nativeElement.style.backgroundColor = 'red';
        break;
      default:
        this.el.nativeElement.style.backgroundColor = 'red';
        break;
    }
  }
}
