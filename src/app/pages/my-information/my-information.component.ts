import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-information.component.html',
  styleUrl: './my-information.component.scss',
})
export class MyInformationComponent {
  showMisHorarios: boolean = false;

  horariosForm = new FormGroup({
    lunesInicio: new FormControl('08:00'),
    lunesFin: new FormControl('18:30'),
    martesInicio: new FormControl('08:00'),
    martesFin: new FormControl('18:30'),
    miercolesInicio: new FormControl('08:00'),
    miercolesFin: new FormControl('18:30'),
    juevesInicio: new FormControl('10:00'),
    juevesFin: new FormControl('18:30'),
    viernesInicio: new FormControl('08:00'),
    viernesFin: new FormControl('18:30'),
    sabadoInicio: new FormControl('08:00'),
    sabadoFin: new FormControl('12:00'),
  });

  constructor(public auth: AuthService) {}

  openMisHorarios() {
    this.showMisHorarios = true;
  }

  closeMisHorarios() {
    this.showMisHorarios = false;
  }

  guardarHorarios() {
    console.log(this.horariosForm.value);
    this.closeMisHorarios();
  }
}
