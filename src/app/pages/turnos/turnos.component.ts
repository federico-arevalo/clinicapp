import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TurnosPacienteComponent } from './turnos-paciente/turnos-paciente.component';
import { TurnosEspecialistaComponent } from './turnos-especialista/turnos-especialista/turnos-especialista.component';
import { TurnosAdminComponent } from './turnos-admin/turnos-admin/turnos-admin.component';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [
    CommonModule,
    TurnosPacienteComponent,
    TurnosEspecialistaComponent,
    TurnosAdminComponent,
  ],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.scss',
})
export class TurnosComponent {
  constructor(public authService: AuthService) {}
}
