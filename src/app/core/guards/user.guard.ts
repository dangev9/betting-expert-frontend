import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

export const userGuard: CanActivateFn = () => {
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);

  if (userAuthService.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};
