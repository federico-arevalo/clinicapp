import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { DatabaseService } from '../../../services/database/database.service';
import { AppointmentSchedulerComponentComponent } from '../../../components/appointment-scheduler-component/appointment-scheduler-component.component';
import { Turno } from '../../../interfaces/turno/turno';
import { TurnosService } from '../../../services/turnos/turnos.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ShortDatePipe } from '../../../pipes/short-date.pipe';
import { TurnosColorDirective } from '../../../directives/turnosColor/turnos-color.directive';
import { ModalTextComponent } from '../../../components/modal-text/modal-text.component';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentSchedulerComponentComponent,
    ShortDatePipe,
    TurnosColorDirective,
    ModalTextComponent,
  ],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.scss',
})
export class TurnosPacienteComponent implements OnInit {
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

  createdTurno!: Turno;

  turnos: any[] = [];
  filteredTurnos: any[] = [];

  constructor(
    private el: ElementRef,
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
            turno.paciente.uid === this.authService.currentUser.uid
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
      this.filteredTurnos = this.turnos;
      this.showSpinner = false;
    });
  }

  filtrarTurnos(event: any) {
    if (event.target.value === '') {
      this.filteredTurnos = this.turnos;
    } else {
      this.filteredTurnos = this.turnos.filter((turno: any) => {
        return (
          turno.especialidad
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          turno.especialista.fullName
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        );
      });
    }
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  // NEW TURNO METHODS
  showStep(step: any) {
    this.progressBar = this.el.nativeElement.querySelector('#progress-bar');

    // this.progressBar.style.width = `${(step / 3) * 100}%`;
    this.progressBar.style.width =
      step === 1 ? '0%' : step === 2 ? '50%' : '100%';
    for (let i = 1; i <= 3; i++) {
      const stepIndicator = document.getElementById(`step${i}`);
      if (i <= step) {
        stepIndicator?.classList.remove('opacity-50');
      } else {
        stepIndicator?.classList.add('opacity-50');
      }
    }
  }

  next() {
    if (this.currentStep === 1) {
      if (this.selectedEspecialidad === '') {
        this.isError = true;
        this.errorMsg = '* Selecciona una especialidad';
        return;
      }
    }

    if (this.currentStep === 2) {
      if (!this.selectedEspecialista) {
        this.isError = true;
        this.errorMsg = '* Selecciona un especialista';
        return;
      }
    }

    this.filteredEspecialistas = this.especialistas.filter(
      (especialista: any) =>
        especialista.especialidad.includes(this.selectedEspecialidad)
    );

    this.isError = false;
    if (this.currentStep < 3) this.currentStep++;
    this.showStep(this.currentStep);
  }

  prev() {
    if (this.currentStep === 2) {
      this.selectedEspecialista = null;
    }
    if (this.currentStep === 3) {
    }

    if (this.currentStep > 1) this.currentStep--;
    this.showStep(this.currentStep);
  }

  openForm() {
    this.showForm = true;
  }

  cerrarForm() {
    this.showForm = false;
    this.currentStep = 1;
    this.selectedEspecialidad = '';
    this.selectedEspecialista = null;
  }

  crearTurno(turno: Turno) {
    if (this.currentStep === 3) {
      if (!this.createdTurno) {
        this.isError = true;
        this.errorMsg = '* Selecciona un turno';
        return;
      }
    }

    this.isError = false;
    this.cerrarForm();
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);

    this.turnosService.saveTurno(turno);
  }

  // ALL TURNOS METHODS
  cancelarTurno(id: string) {
    this.modalAccion = 'Cancelar';
    this.showModal = false;
    this.turnoId = id;
    setTimeout(() => {
      this.showModal = true;
    }, 100);

    this.openDropdownIndex = null;
  }

  turnoDispatcher(modal: { texto: string | null; accion: string; id: string }) {
    if (modal.accion === 'Cancelar') {
      this.turnosService.modificarTurno(modal.id, 'Cancelado', modal.texto!);
    } else if (modal.accion === 'Rechazar') {
      this.turnosService.modificarTurno(modal.id, 'Rechazado', modal.texto!);
    } else if (modal.accion === 'Calificar atencion') {
      this.turnosService.calificarAtencion(modal.id, modal.texto!);
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

  calificarAtencion(turno: Turno) {
    this.modalAccion = 'Calificar atencion';
    this.showModal = false;
    this.msg = turno.comentario;
    this.turnoId = turno.id;
    setTimeout(() => {
      this.showModal = true;
    }, 100);

    this.openDropdownIndex = null;
  }
}
