import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserAuthService } from '../../../core/services/user-auth.service';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly userAuthService = inject(UserAuthService);

  readonly isMenuOpen = signal(false);
  readonly isAuthenticated = this.userAuthService.isAuthenticated;

  readonly links: NavLink[] = [
    { label: 'Почетна', path: '/' },
    { label: 'Денешни Избори', path: '/today' },
    { label: 'Архива', path: '/archive' },
    { label: 'За Нас', path: '/about' },
  ];

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.userAuthService.logout();
  }
}
