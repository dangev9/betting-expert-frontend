import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('adminGuard', () => {
  it('allows navigation when the admin is authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => true } },
        { provide: Router, useValue: { navigateByUrl: () => {} } },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('blocks navigation and redirects to /admin/login when not authenticated', () => {
    let navigatedTo: string | undefined;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => false } },
        {
          provide: Router,
          useValue: {
            navigateByUrl: (url: string) => {
              navigatedTo = url;
            },
          },
        },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result).toBe(false);
    expect(navigatedTo).toBe('/admin/login');
  });
});
