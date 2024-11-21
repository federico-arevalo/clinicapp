import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { DatabaseService } from '../../../../services/database/database.service';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [CommonModule],
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
  selectedEspecialidad: string = '';
  selectedEspecialista: any;

  isError: boolean = false;
  errorMsg: string = '';

  constructor(private el: ElementRef, private db: DatabaseService) {}

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

  ngOnInit() {
    this.db.getEspecialidades().subscribe((respuesta: any) => {
      this.especialidades = respuesta[0].especialidades;
    });

    this.db.getUsers().subscribe((respuesta: any) => {
      this.especialistas = respuesta.filter(
        (user: any) => user.rol === 'especialista'
      );
    });
  }

  next() {
    if (this.currentStep === 1) {
      if (this.selectedEspecialidad === '') {
        this.isError = true;
        this.errorMsg = '* Selecciona una especialidad';
        return;
      }
    }

    this.isError = false;
    if (this.currentStep < 3) this.currentStep++;
    this.showStep(this.currentStep);
  }

  prev() {
    if (this.currentStep > 1) this.currentStep--;
    this.showStep(this.currentStep);
  }

  openForm() {
    this.showForm = true;
  }

  cancelarTurno(id: string) {
    console.log(id);
    this.openDropdownIndex = null;
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  cerrarForm() {
    this.showForm = false;
    this.currentStep = 1;
  }

  crearTurno() {}
}
