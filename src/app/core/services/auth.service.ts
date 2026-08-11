import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'be_admin_token';
const EMAIL_KEY = 'be_admin_email';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly emailSignal = signal<string | null>(localStorage.getItem(EMAIL_KEY));

  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);
  readonly adminEmail = computed(() => this.emailSignal());

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(EMAIL_KEY, response.email);
        this.tokenSignal.set(response.token);
        this.emailSignal.set(response.email);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    this.tokenSignal.set(null);
    this.emailSignal.set(null);
    this.router.navigateByUrl('/admin/login');
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
