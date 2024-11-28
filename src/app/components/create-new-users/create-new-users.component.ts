import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ERROR_MESSAGES } from '../../utils/firebase-errors';
import { CaptchaComponent } from '../captcha/captcha.component';
import { ModalComponent } from '../modal/modal.component';
import { MultiselectComponent } from '../multiselect/multiselect.component';
import { AuthAdminService } from '../../services/authAdmin/auth-admin.service';

@Component({
  selector: 'app-create-new-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectComponent,
    ModalComponent,
    CaptchaComponent,
  ],
  templateUrl: './create-new-users.component.html',
  styleUrl: './create-new-users.component.scss',
})
export class CreateNewUsersComponent {
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
    // recaptcha: new FormControl(null, Validators.required),
    captcha: new FormControl(false, [
      Validators.required,
      Validators.requiredTrue,
    ]),
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
    // recaptcha: new FormControl(null, Validators.required),
    captcha: new FormControl(false, [
      Validators.required,
      Validators.requiredTrue,
    ]),
  });

  adminForm = new FormGroup({
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
    // recaptcha: new FormControl(null, Validators.required),
    captcha: new FormControl(false, [
      Validators.required,
      Validators.requiredTrue,
    ]),
  });

  @Output() salir: EventEmitter<any> = new EventEmitter<any>();

  selectedEspecialidades: string[] = [];
  hasSelectedEspecialidades = false;
  formType: string = '';

  errorMsg: string = '';
  showModal: boolean = false;
  showAlert: boolean = false;

  constructor(private authService: AuthAdminService) {}

  executeRecaptcha(token: any) {
    console.log(token);
  }

  onRegister($event: any, type: string): void {
    $event.preventDefault();
    this.showModal = false;

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
        .crearNuevoUsuario(
          email!,
          password!,
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
        .crearNuevoUsuario(
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

    if (type === 'admin') {
      if (
        !(this.adminForm.value.password === this.adminForm.value.repeatPassword)
      ) {
        console.log('las contraseñas no coindicen');
        return;
      }

      const { email, password } = this.adminForm.value;
      this.authService
        .crearNuevoUsuario(
          email || '',
          password || '',
          'admin',
          {
            ...this.adminForm.value,
            especialidad: this.selectedEspecialidades,
          },
          { profilePicture: $event.target.form[7].files[0] }
        )
        .catch((e: any) => {
          this.showModal = true;
          this.errorMsg = ERROR_MESSAGES[e.code as keyof typeof ERROR_MESSAGES];
          console.log(e.code);
        });
    }

    this.adminForm.reset();
    this.especialistaForm.reset();
    this.pacienteForm.reset();
    this.formType = '';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  selectEspecialidades(especialidades: string[]) {
    this.selectedEspecialidades = especialidades;
    this.hasSelectedEspecialidades = true;
    console.log(especialidades);
  }

  switchTab(type: string) {
    this.formType = type;
  }

  onCaptchaEspecialista(resultadoCaptcha: boolean) {
    this.especialistaForm.patchValue({ captcha: resultadoCaptcha });
  }

  onCaptchaPaciente(resultadoCaptcha: boolean) {
    this.pacienteForm.patchValue({ captcha: resultadoCaptcha });
  }

  onCaptchaAdmin(resultadoCaptcha: boolean) {
    this.adminForm.patchValue({ captcha: resultadoCaptcha });
  }

  onCancel() {
    this.adminForm.reset();
    this.especialistaForm.reset();
    this.pacienteForm.reset();
    this.salir.emit('users');
  }
}
