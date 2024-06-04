import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPass: new FormControl(''),
  });
  isPaciente = true;

  constructor(private authService: AuthService) {}

  onRegister($event: any): void {
    $event.preventDefault();

    if (
      this.registerForm.value.password === this.registerForm.value.confirmPass
    ) {
      const { email, password } = this.registerForm.value;
      this.authService.SignUp(email || '', password || '');
    } else {
      console.log('las contraseñas no coindicen');
    }
  }

  switchTab(type: string) {
    if (type === 'paciente') this.isPaciente = true;
    else this.isPaciente = false;
  }
}
