import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public get currentUser(): string {
    return JSON.parse(localStorage.getItem('user')!).email;
  }

  constructor(private router: Router) {}

  goToPage(id: string): void {
    this.router.navigate(['/' + id]);
  }
}
