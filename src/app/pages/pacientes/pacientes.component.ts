import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { AuthService } from '../../services/auth/auth.service';
import { TurnosService } from '../../services/turnos/turnos.service';
import { DownloadHistoriaClinicaComponent } from '../../components/download-historia-clinica/download-historia-clinica.component';
import { ShortDatePipe } from '../../pipes/short-date.pipe';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, DownloadHistoriaClinicaComponent, ShortDatePipe],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss',
})
export class PacientesComponent implements OnInit {
  pacientes: any;
  turnos: any;
  updatedPacientes: any;

  constructor(
    private db: DatabaseService,
    private turnosService: TurnosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((respuesta: any) => {
      this.turnos = respuesta;

      this.db.getPacientes().subscribe((respuesta: any) => {
        this.pacientes = respuesta.filter((paciente: any) =>
          this.turnos.some(
            (turno: any) =>
              turno.especialista.uid === this.authService.currentUser.uid &&
              turno.paciente.uid === paciente.uid &&
              turno.estado === 'Realizado'
          )
        );

        this.updatedPacientes = this.pacientes.map((paciente: any) => {
          // Filter appointments for the current patient
          const pacienteTurnos = this.turnos
            .filter(
              (turno: any) =>
                turno.paciente.uid === paciente.uid &&
                turno.estado === 'Realizado'
            )
            .sort((a: any, b: any) => {
              // Sort by date and time
              const dateTimeA = new Date(`${a.date} ${a.time}`);
              const dateTimeB = new Date(`${b.date} ${b.time}`);
              return dateTimeB.getTime() - dateTimeA.getTime(); // Most recent first
            })
            .slice(0, 3); // Get the last three appointments

          // Add ultimasAtenciones field
          return { ...paciente, ultimasAtenciones: pacienteTurnos };
        });
      });
    });
  }
}
