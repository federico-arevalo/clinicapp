import { Component, ElementRef } from '@angular/core';
import { Turno } from '../../../interfaces/turno/turno';
import { AuthService } from '../../../services/auth/auth.service';
import { DatabaseService } from '../../../services/database/database.service';
import { TurnosService } from '../../../services/turnos/turnos.service';
import { CommonModule } from '@angular/common';
import { AppointmentSchedulerComponentComponent } from '../../../components/appointment-scheduler-component/appointment-scheduler-component.component';
import { TurnosColorDirective } from '../../../directives/turnosColor/turnos-color.directive';
import { ShortDatePipe } from '../../../pipes/short-date.pipe';
import { ModalTextComponent } from '../../../components/modal-text/modal-text.component';

@Component({
  selector: 'app-turnos-admin',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentSchedulerComponentComponent,
    ShortDatePipe,
    TurnosColorDirective,
    ModalTextComponent,
  ],
  templateUrl: './turnos-admin.component.html',
  styleUrl: './turnos-admin.component.scss',
})
export class TurnosAdminComponent {
  showForm: boolean = false;

  currentStep = 1;
  progressBar!: HTMLElement;

  especialidades: any[] = [];
  especialistas: any[] = [];
  pacientes: any[] = [];
  filteredEspecialistas: any[] = [];
  selectedEspecialidad: string = '';
  selectedEspecialista: any;
  selectedPaciente: any;

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

    this.db.getPacientes().subscribe((pacientes: any) => {
      this.pacientes = pacientes.filter(
        (paciente: any) => paciente.rol === 'paciente'
      );
      this.pacientes.map((paciente: any) => {
        this.db.getUserImageById(paciente.uid).then((imagesUrl) => {
          paciente.profilePicture = imagesUrl;
        });
      });
    });

    this.fetchTurnos();
  }

  fetchTurnos() {
    this.turnosService.getTurnos().subscribe((turnos: any) => {
      this.turnos = turnos;
      this.filteredTurnos = this.turnos;
      this.showSpinner = false;
    });
  }

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

  // NEW TURNO METHODS
  showStep(step: any) {
    this.progressBar = this.el.nativeElement.querySelector('#progress-bar');

    // this.progressBar.style.width = `${(step / 3) * 100}%`;
    this.progressBar.style.width =
      step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%';
    for (let i = 1; i <= 4; i++) {
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

    if (this.currentStep === 3) {
      if (!this.selectedPaciente) {
        this.isError = true;
        this.errorMsg = '* Selecciona un paciente';
        return;
      }
    }

    this.filteredEspecialistas = this.especialistas.filter(
      (especialista: any) =>
        especialista.especialidad.includes(this.selectedEspecialidad)
    );

    this.isError = false;
    if (this.currentStep < 4) this.currentStep++;
    this.showStep(this.currentStep);
  }

  prev() {
    if (this.currentStep === 2) {
      this.selectedEspecialista = null;
    }
    if (this.currentStep === 3) {
      this.selectedPaciente = null;
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
  }

  turnoDispatcher(modal: { texto: string | null; accion: string; id: string }) {
    if (modal.accion === 'Cancelar') {
      this.turnosService.modificarTurno(modal.id, 'Cancelado', modal.texto!);
    }
  }
}
