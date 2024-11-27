import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public get currentUser(): string {
    return JSON.parse(localStorage.getItem('user')!).email;
  }

  constructor(private router: Router, public authService: AuthService) {}

  goToPage(id: string): void {
    this.router.navigate(['/' + id]);
  }
}
