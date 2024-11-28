import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { ERROR_MESSAGES } from '../../utils/firebase-errors';
import { USERS } from '../../utils/users';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularFireModule,
    ModalComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isError: boolean = false;
  errorMsg: string = '';
  showModal: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(public ruteo: Router, private authService: AuthService) {}

  onLogin($event: any) {
    $event.preventDefault();
    this.showModal = false;
    this.isError = false;

    const { email, password } = this.loginForm.value;

    this.authService.verifyIsAdminVerified(email || '').then((result: any) => {
      if (result) {
        this.authService
          .SignIn(email || '', password || '')
          .then((result: any) => {
            if (!result) {
              this.showModal = true;
              this.errorMsg =
                'Usuario sin email verificado. Revisa tu casilla de email';
            }
          })
          .catch((e: any) => {
            this.isError = true;
            this.errorMsg =
              ERROR_MESSAGES[e.code as keyof typeof ERROR_MESSAGES];
            console.log(e.code);
          });
      } else {
        console.log('error');
        this.showModal = true;
        this.errorMsg = 'Usuario no verificado por un admin';
      }
    });
  }

  closeMessage() {
    this.isError = false;
  }

  autoComplete(user: string) {
    this.loginForm.controls.email.setValue(
      USERS[user as keyof typeof USERS].email
    );
    this.loginForm.controls.password.setValue(
      USERS[user as keyof typeof USERS].password
    );
  }
}
