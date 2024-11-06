import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { ERROR_MESSAGES } from '../../utils/firebase-errors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet,
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
          .then(() => {
            console.log(localStorage.getItem('user'));
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
}
