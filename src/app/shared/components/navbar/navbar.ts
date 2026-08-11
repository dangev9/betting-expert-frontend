import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  readonly isMenuOpen = signal(false);

  readonly links: NavLink[] = [
    { label: 'Почетна', path: '/' },
    { label: 'Денешни Избори', path: '/today' },
    { label: 'Резултати', path: '/results' },
    { label: 'Архива', path: '/archive' },
    { label: 'VIP', path: '/vip' },
    { label: 'За Нас', path: '/about' },
  ];

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
