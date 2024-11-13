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
  showMisHorarios: boolean = false;
  constructor(public auth: AuthService) {}

  openMisHorarios() {
    this.showMisHorarios = true;
  }

  closeMisHorarios() {
    this.showMisHorarios = false;
  }
}
