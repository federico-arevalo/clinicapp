import { Component } from '@angular/core';
import { ShortDatePipe } from '../../../../pipes/short-date.pipe';
import { CommonModule } from '@angular/common';
import { Turno } from '../../../../interfaces/turno/turno';
import { AuthService } from '../../../../services/auth/auth.service';
import { DatabaseService } from '../../../../services/database/database.service';
import { TurnosService } from '../../../../services/turnos/turnos.service';
import { TurnosColorDirective } from '../../../../directives/turnosColor/turnos-color.directive';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [ShortDatePipe, CommonModule, TurnosColorDirective],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.scss',
})
export class TurnosEspecialistaComponent {
  showForm: boolean = false;

  openDropdownIndex: number | null = null;

  currentStep = 1;
  form = document.getElementById('multi-step-form');
  prevBtn = document.getElementById('prevBtn');
  nextBtn = document.getElementById('nextBtn');
  submitBtn = document.getElementById('submitBtn');
  progressBar!: HTMLElement;

  especialidades: any[] = [];
  especialistas: any[] = [];
  filteredEspecialistas: any[] = [];
  selectedEspecialidad: string = '';
  selectedEspecialista: any;

  isError: boolean = false;
  errorMsg: string = '';
  showSpinner: boolean = true;
  showToast: boolean = false;

  createdTurno!: Turno;

  turnos: any[] = [];

  constructor(
    private db: DatabaseService,
    private turnosService: TurnosService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.db.getEspecialidades().subscribe((respuesta: any) => {
      this.especialidades = respuesta[0].especialidades;
    });

    this.db.getEspecialistas().subscribe((respuesta: any) => {
      this.especialistas = respuesta.filter(
        (user: any) => user.rol === 'especialista'
      );
      this.especialistas.map((user: any) => {
        this.db.getUserImageById(user.uid).then((imagesUrl) => {
          user.profilePicture = imagesUrl;
        });
      });
    });

    this.turnosService.getTurnos().subscribe((turnos: any) => {
      this.turnos = turnos
        .filter(
          (turno: any) =>
            turno.especialista.uid === this.authService.currentUser.uid
        )
        .map((turno: any) => {
          return {
            id: turno.id,
            date: turno.date,
            time: turno.time,
            review: turno.review,
            atencion: turno.atencion,
            estado: turno.estado,
            especialista: {
              uid: turno.especialista.uid,
              fullName: turno.especialista.fullName,
            },
            paciente: turno.paciente,
            especialidad: turno.especialidad,
            comentario: turno.comentario,
          };
        });
      this.showSpinner = false;
    });
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  cancelarTurno(id: string) {
    console.log(id);
    this.openDropdownIndex = null;
  }

  verReview(turno: Turno) {
    console.log(turno);
    this.openDropdownIndex = null;
  }

  verComentario(turno: Turno) {
    console.log(turno);
    this.openDropdownIndex = null;
  }

  calificarAtencion(id: string) {
    console.log(id);
    this.openDropdownIndex = null;
  }
}
