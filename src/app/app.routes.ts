import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { userGuard } from './core/guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        title: 'Betting Expert — Фудбалски тикети засновани на податоци',
      },
      {
        path: 'today',
        loadComponent: () => import('./features/today/today').then((m) => m.Today),
        title: 'Денешни Избори — Betting Expert',
      },
      {
        path: 'results',
        redirectTo: 'archive',
      },
      {
        path: 'archive',
        loadComponent: () => import('./features/archive/archive').then((m) => m.Archive),
        title: 'Архива — Betting Expert',
      },
      {
        path: 'vip',
        loadComponent: () => import('./features/vip/vip').then((m) => m.Vip),
        title: 'VIP — Betting Expert',
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about').then((m) => m.About),
        title: 'За Нас — Betting Expert',
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
        title: 'Најава — Betting Expert',
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/auth/signup/signup').then((m) => m.Signup),
        title: 'Регистрација — Betting Expert',
      },
      {
        path: 'account',
        canActivate: [userGuard],
        loadComponent: () => import('./features/account/account').then((m) => m.Account),
        title: 'Мојата Сметка — Betting Expert',
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/admin-login').then((m) => m.AdminLogin),
    title: 'Најава за Админ — Betting Expert',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
        title: 'Контролна Табла — Betting Expert',
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./features/admin/ticket-form/ticket-form').then((m) => m.TicketFormPage),
        title: 'Креирај Тикет — Betting Expert',
      },
      {
        path: 'tickets/:id/edit',
        loadComponent: () => import('./features/admin/ticket-form/ticket-form').then((m) => m.TicketFormPage),
        title: 'Уреди Тикет — Betting Expert',
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/users').then((m) => m.Users),
        title: 'Корисници — Betting Expert',
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings').then((m) => m.AdminSettings),
        title: 'Поставки — Betting Expert',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
