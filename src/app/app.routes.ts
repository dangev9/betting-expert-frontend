import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        title: 'Betting Expert — Data-Driven Football Betting Tips',
      },
      {
        path: 'today',
        loadComponent: () => import('./features/today/today').then((m) => m.Today),
        title: "Today's Picks — Betting Expert",
      },
      {
        path: 'results',
        loadComponent: () => import('./features/results/results').then((m) => m.Results),
        title: 'Recent Results — Betting Expert',
      },
      {
        path: 'archive',
        loadComponent: () => import('./features/archive/archive').then((m) => m.Archive),
        title: 'Archive — Betting Expert',
      },
      {
        path: 'vip',
        loadComponent: () => import('./features/vip/vip').then((m) => m.Vip),
        title: 'VIP — Betting Expert',
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about').then((m) => m.About),
        title: 'About — Betting Expert',
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/admin-login').then((m) => m.AdminLogin),
    title: 'Admin Sign In — Betting Expert',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
        title: 'Admin Dashboard — Betting Expert',
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./features/admin/ticket-form/ticket-form').then((m) => m.TicketFormPage),
        title: 'Create Ticket — Betting Expert',
      },
      {
        path: 'tickets/:id/edit',
        loadComponent: () => import('./features/admin/ticket-form/ticket-form').then((m) => m.TicketFormPage),
        title: 'Edit Ticket — Betting Expert',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
