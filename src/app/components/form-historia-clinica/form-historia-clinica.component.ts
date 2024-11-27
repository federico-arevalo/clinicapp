import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TurnosService } from '../../services/turnos/turnos.service';

@Component({
  selector: 'app-form-historia-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-historia-clinica.component.html',
  styleUrl: './form-historia-clinica.component.scss',
})
export class FormHistoriaClinicaComponent {
  errorMsg: string = '';
  isError: boolean = false;

  @Input() showForm: boolean = false;
  @Input() turnoId: string = '';

  historiaClinicaForm = new FormGroup({
    altura: new FormControl('', Validators.required),
    peso: new FormControl('', Validators.required),
    temperatura: new FormControl('', Validators.required),
    presion: new FormControl('', Validators.required),
    camposDinamicos: new FormArray([]),
    camposEspeciales: new FormArray([]),
  });

  constructor(private turnosService: TurnosService) {}

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  get camposDinamicos(): FormArray {
    return this.historiaClinicaForm.get('camposDinamicos') as FormArray;
  }

  addCampoDinamico(): void {
    if (this.camposDinamicos.length >= 3) {
      return;
    }
    this.camposDinamicos.push(
      new FormGroup({
        key: new FormControl('', Validators.required),
        value: new FormControl('', Validators.required),
      })
    );
  }

  removeCampoDinamico(index: number): void {
    this.camposDinamicos.removeAt(index);
  }

  // Campos especiales

  get camposEspeciales(): FormArray {
    return this.historiaClinicaForm.get('camposEspeciales') as FormArray;
  }

  addCampoEspecial(key: string, type: string): void {
    if (!key) {
      this.isError = true;
      this.errorMsg = 'Es necesario especificar la clave del campo';
      return;
    }
    if (
      this.camposEspeciales.controls.find(
        (control) => control.get('key')?.value === key
      )
    ) {
      this.isError = true;
      this.errorMsg = 'Este tipo de campo ya existe';
      return;
    }
    if (this.camposEspeciales.length >= 3) {
      this.isError = true;
      this.errorMsg =
        'Solo se pueden añadir tres campos. uno por cada tipo de valor';
      return;
    }

    this.isError = false;

    let control: FormControl;

    // Create the correct control type
    switch (type) {
      case 'range':
        control = new FormControl(50, [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ]);
        break;
      case 'number':
        control = new FormControl('', [
          Validators.required,
          Validators.pattern(/^\d+$/),
        ]);
        break;
      case 'switch':
        control = new FormControl(false, Validators.required);
        break;
      default:
        this.isError = true;
        this.errorMsg = 'Tipo de campo invalido';
        return;
    }

    this.camposEspeciales.push(
      new FormGroup({
        key: new FormControl(key, Validators.required),
        value: control,
        type: new FormControl(type, Validators.required), // Keep track of the type for display
      })
    );
  }

  removeCampoEspecial(index: number): void {
    this.camposEspeciales.removeAt(index);
  }

  salir() {
    this.showForm = false;
    this.turnoId = '';
    this.historiaClinicaForm.reset();
  }

  onSubmit(): void {
    if (this.historiaClinicaForm.valid) {
      this.turnosService.guardarHistoriaClinica(
        this.turnoId,
        this.historiaClinicaForm.value
      );
      this.salir();
    }
  }
}
