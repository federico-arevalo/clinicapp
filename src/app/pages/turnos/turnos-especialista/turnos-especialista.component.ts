import { Component } from '@angular/core';
import { ShortDatePipe } from '../../../pipes/short-date.pipe';
import { CommonModule } from '@angular/common';
import { Turno } from '../../../interfaces/turno/turno';
import { AuthService } from '../../../services/auth/auth.service';
import { DatabaseService } from '../../../services/database/database.service';
import { TurnosService } from '../../../services/turnos/turnos.service';
import { TurnosColorDirective } from '../../../directives/turnosColor/turnos-color.directive';
import { ModalTextComponent } from '../../../components/modal-text/modal-text.component';
import { FormHistoriaClinicaComponent } from '../../../components/form-historia-clinica/form-historia-clinica.component';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [
    ShortDatePipe,
    CommonModule,
    TurnosColorDirective,
    ModalTextComponent,
    FormHistoriaClinicaComponent,
  ],
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

  modalAccion: string = '';
  showModal: boolean = false;
  turnoId: string = '';
  msg: string = '';
  showHistoriaClinicaForm: boolean = false;

  createdTurno!: Turno;

  turnos: any[] = [];
  filteredTurnos: any[] = [];

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

    this.fetchTurnos();
  }

  fetchTurnos() {
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
            historiaClinica: turno.historiaClinica,
          };
        });
      this.showSpinner = false;
      this.filteredTurnos = this.turnos;
    });
  }

  // filtrarTurnos(event: any) {
  //   if (event.target.value === '') {
  //     this.filteredTurnos = this.turnos;
  //   } else {
  //     this.filteredTurnos = this.turnos.filter((turno: any) => {
  //       return (
  //         turno.especialidad
  //           .toLowerCase()
  //           .includes(event.target.value.toLowerCase()) ||
  //         turno.paciente.fullName
  //           .toLowerCase()
  //           .includes(event.target.value.toLowerCase())
  //       );
  //     });
  //   }
  // }

  filtrarTurnos(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm === '') {
      this.filteredTurnos = this.turnos;
      return;
    }

    this.filteredTurnos = this.turnos.filter((turno: any) =>
      this.searchInObject(turno, searchTerm)
    );
  }

  searchInObject(obj: any, searchTerm: string): boolean {
    // Recursively search for the searchTerm in all properties of the object
    for (const key in obj) {
      if (obj[key] != null) {
        const value = obj[key];

        // If the value is an object or array, search recursively
        if (typeof value === 'object') {
          if (this.searchInObject(value, searchTerm)) {
            return true;
          }
        }

        // If the value is a string or number, check if it matches the search term
        else if (typeof value === 'string' || typeof value === 'number') {
          if (value.toString().toLowerCase().includes(searchTerm)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  aceptarTurno(turno: Turno) {
    this.turnosService.aceptarTurno(turno.id);

    this.openDropdownIndex = null;
  }

  finalizarTurno(turno: Turno) {
    this.modalAccion = 'Realizar';
    this.showModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 100);
    this.turnoId = turno.id;

    this.openDropdownIndex = null;
  }

  cancelarTurno(turno: Turno) {
    this.modalAccion = 'Cancelar';
    this.showModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 100);
    this.turnoId = turno.id;

    this.openDropdownIndex = null;
  }

  rechazarTurno(turno: Turno) {
    this.modalAccion = 'Rechazar';
    this.showModal = false;
    setTimeout(() => {
      this.showModal = true;
    }, 100);
    this.turnoId = turno.id;

    this.openDropdownIndex = null;
  }

  turnoDispatcher(modal: { texto: string | null; accion: string; id: string }) {
    if (modal.accion === 'Cancelar') {
      this.turnosService.modificarTurno(modal.id, 'Cancelado', modal.texto!);
    } else if (modal.accion === 'Rechazar') {
      this.turnosService.modificarTurno(modal.id, 'Rechazado', modal.texto!);
    } else if (modal.accion === 'Realizar') {
      this.turnosService.modificarTurno(modal.id, 'Realizado', modal.texto!);
    }
  }

  verReview(turno: Turno) {
    this.modalAccion = 'Ver review';
    this.showModal = false;
    this.msg = turno.review;
    setTimeout(() => {
      this.showModal = true;
    }, 100);

    this.openDropdownIndex = null;
  }

  verComentario(turno: Turno) {
    this.modalAccion = 'Ver comentario';
    this.showModal = false;
    this.msg = turno.comentario;
    setTimeout(() => {
      this.showModal = true;
    }, 100);

    this.openDropdownIndex = null;
  }

  verCalificacion(turno: Turno) {
    this.modalAccion = 'Ver atencion';
    this.showModal = false;
    this.msg = turno.atencion;
    setTimeout(() => {
      this.showModal = true;
    }, 100);

    this.openDropdownIndex = null;
  }

  cargarHistoriaClinica(turno: Turno) {
    this.showHistoriaClinicaForm = false;
    this.turnoId = turno.id;

    setTimeout(() => {
      this.showHistoriaClinicaForm = true;
    }, 100);

    this.openDropdownIndex = null;
  }

  hasHistoriaClinica(turno: Turno) {
    return Object.keys(turno.historiaClinica).length !== 0;
  }
}
