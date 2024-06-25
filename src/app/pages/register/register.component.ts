import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MultiselectComponent } from '../../components/multiselect/multiselect.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    ReactiveFormsModule,
    MultiselectComponent,
  ],
})
export class RegisterComponent {
  pacienteForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('', [Validators.required, Validators.min(18)]),
    dni: new FormControl('', [Validators.required, Validators.maxLength(6)]),
    obraSocial: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    firstProfilePicture: new FormControl('', [Validators.required]),
    secondProfilePicture: new FormControl('', [Validators.required]),
  });

  especialistaForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('', [Validators.required, Validators.min(18)]),
    dni: new FormControl('', [Validators.required, Validators.maxLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    profilePicture: new FormControl('', [Validators.required]),
  });

  selectedEspecialidades: string[] = [];
  isPaciente = false;

  constructor(private authService: AuthService) {}

  onRegister($event: any, type: string): void {
    $event.preventDefault();
    console.log(this.especialistaForm);
    console.log($event.target.form[9].files[0]);

    if (type === 'paciente') {
      if (
        !(
          this.pacienteForm.value.password ===
          this.pacienteForm.value.repeatPassword
        )
      ) {
        console.log('las contraseñas no coindicen');
        return;
      }
      const { email, password } = this.pacienteForm.value;
      this.authService.SignUp(
        email || '',
        password || '',
        'paciente',
        this.pacienteForm.value,
        {
          firstProfilePicture: $event.target.form[8].files[0],
          secondProfilePicture: $event.target.form[9].files[0],
        }
      );
    }

    if (type === 'especialista') {
      if (
        !(
          this.especialistaForm.value.password ===
          this.especialistaForm.value.repeatPassword
        )
      ) {
        console.log('las contraseñas no coindicen');
        return;
      }

      if (this.selectEspecialidades.length < 1) {
        console.log('debe seleccionar al menos una especialidad');
        return;
      }

      const { email, password } = this.especialistaForm.value;
      this.authService.SignUp(
        email || '',
        password || '',
        'especialista',
        {
          ...this.especialistaForm.value,
          especialidad: this.selectedEspecialidades,
        },
        { profilePicture: $event.target.form[9].files[0] }
      );
    }
  }

  selectEspecialidades(especialidades: string[]) {
    this.selectedEspecialidades = especialidades;
    console.log(especialidades);
  }

  switchTab(type: string) {
    if (type === 'paciente') this.isPaciente = true;
    else this.isPaciente = false;
  }
}
