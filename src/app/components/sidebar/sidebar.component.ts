import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          transform: 'translate(0)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'translate(-120%)',
        })
      ),
      transition('open => closed', [animate('100ms ease-in')]),
      transition('closed => open', [animate('200ms ease-out')]),
    ]),
  ],
})
export class SidebarComponent {
  protected sidebarState: 'open' | 'closed' = 'closed';
  isOpen = false;
  mobileMenuOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  logout() {
    this.authService.SignOut();
  }
  public get currentUser(): string {
    return JSON.parse(localStorage.getItem('user')!).email;
  }

  get openCloseTrigger() {
    return this.mobileMenuOpen ? 'open' : 'closed';
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  openSidebar() {
    this.sidebarState = 'open';
    console.log(this.authService.userImages);
  }
  closeSidebar() {
    this.sidebarState = 'closed';
  }

  goTo(url: string) {
    this.router.navigate([url]);
    this.closeSidebar();
  }
}
