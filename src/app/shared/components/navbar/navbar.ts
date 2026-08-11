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
    { label: 'Home', path: '/' },
    { label: "Today's Picks", path: '/today' },
    { label: 'Results', path: '/results' },
    { label: 'Archive', path: '/archive' },
    { label: 'VIP', path: '/vip' },
    { label: 'About', path: '/about' },
  ];

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
