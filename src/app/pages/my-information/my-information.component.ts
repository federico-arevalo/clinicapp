import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-information.component.html',
  styleUrl: './my-information.component.scss',
})
export class MyInformationComponent {
  constructor(public auth: AuthService) {}
}
