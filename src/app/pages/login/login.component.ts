import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, AngularFireModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isError: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(public ruteo: Router, private authService: AuthService) {}

  onLogin($event: any) {
    $event.preventDefault();

    const { email, password } = this.loginForm.value;
    this.authService
      .SignIn(email || '', password || '')
      .then(() => {
        console.log(localStorage.getItem('user'));
      })
      .catch((e) => {
        this.isError = true;
        console.log(e);
      });
  }

  closeAlert() {
    this.isError = false;
  }
}
