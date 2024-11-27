import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MultiselectComponent } from '../../components/multiselect/multiselect.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ERROR_MESSAGES } from '../../utils/firebase-errors';
import {
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaV3Module,
} from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectComponent,
    ModalComponent,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module,
  ],
})
export class RegisterComponent {
  pacienteForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(60),
    ]),
    dni: new FormControl('', [Validators.required, Validators.max(99999999)]),
    obraSocial: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    firstProfilePicture: new FormControl('', [Validators.required]),
    secondProfilePicture: new FormControl('', [Validators.required]),
    recaptcha: new FormControl(null, Validators.required),
  });

  especialistaForm = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('', [
      Validators.required,
      Validators.min(18),
      Validators.max(60),
    ]),
    dni: new FormControl('', [Validators.required, Validators.max(99999999)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    profilePicture: new FormControl('', [Validators.required]),
    recaptcha: new FormControl(null, Validators.required),
  });

  selectedEspecialidades: string[] = [];
  hasSelectedEspecialidades = false;
  isPaciente = false;

  errorMsg: string = '';
  showModal: boolean = false;

  constructor(private authService: AuthService) {}

  executeRecaptcha(token: any) {
    console.log(token);
  }

  onRegister($event: any, type: string): void {
    $event.preventDefault();
    this.showModal = false;
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
      this.authService
        .SignUp(
          email || '',
          password || '',
          'paciente',
          this.pacienteForm.value,
          {
            firstProfilePicture: $event.target.form[8].files[0],
            secondProfilePicture: $event.target.form[9].files[0],
          }
        )
        .catch((e: any) => {
          this.showModal = true;
          this.errorMsg = ERROR_MESSAGES[e.code as keyof typeof ERROR_MESSAGES];
          console.log(e.code);
        });
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
      this.authService
        .SignUp(
          email || '',
          password || '',
          'especialista',
          {
            ...this.especialistaForm.value,
            especialidad: this.selectedEspecialidades,
          },
          { profilePicture: $event.target.form[9].files[0] }
        )
        .catch((e: any) => {
          this.showModal = true;
          this.errorMsg = ERROR_MESSAGES[e.code as keyof typeof ERROR_MESSAGES];
          console.log(e.code);
        });
    }
  }

  selectEspecialidades(especialidades: string[]) {
    this.selectedEspecialidades = especialidades;
    this.hasSelectedEspecialidades = true;
    console.log(especialidades);
  }

  switchTab(type: string) {
    if (type === 'paciente') this.isPaciente = true;
    else this.isPaciente = false;
  }
}
