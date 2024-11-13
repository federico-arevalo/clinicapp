import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TurnosPacienteComponent } from './paciente/turnos-paciente/turnos-paciente.component';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, TurnosPacienteComponent],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.scss',
})
export class TurnosComponent {
  constructor(public authService: AuthService) {}
}
