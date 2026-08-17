import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserAuthService } from '../services/user-auth.service';

/**
 * Attaches the admin token to /admin/ calls (unchanged from before). For shared "any authenticated
 * user" endpoints (e.g. /api/users/me, /api/users/me/password) reachable from both the admin panel
 * and the public site, the choice is based on which panel the request is actually happening from
 * (the current page's URL) - not "whichever token happens to be in localStorage". That distinction
 * matters: an admin browsing /admin/settings must use their admin session even if an old, unrelated
 * site-visitor session token is still sitting in localStorage from earlier browsing - picking
 * "whichever token exists" could silently authenticate the request as the wrong account entirely.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);

  const isAdminApiCall = req.url.includes('/admin/');
  const isAdminPage = window.location.pathname.startsWith('/admin');
  let authorizedReq = req;

  if (isAdminApiCall || isAdminPage) {
    const adminToken = authService.getToken();
    if (adminToken) {
      authorizedReq = req.clone({ setHeaders: { Authorization: `Bearer ${adminToken}` } });
    }
  } else {
    const userToken = userAuthService.getToken();
    if (userToken) {
      authorizedReq = req.clone({ setHeaders: { Authorization: `Bearer ${userToken}` } });
    }
  }

  return next(authorizedReq).pipe(
    catchError((error) => {
      if (error.status === 401 && isAdminApiCall) {
        authService.logout();
        router.navigateByUrl('/admin/login');
      }
      return throwError(() => error);
    }),
  );
};
