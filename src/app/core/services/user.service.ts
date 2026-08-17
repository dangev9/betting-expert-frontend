import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../models/auth.model';
import { PageResponse } from '../models/ticket.model';
import { ChangePasswordRequest, SignupRequest, User, VipGrantRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly usersUrl = `${environment.apiUrl}/users`;
  private readonly adminUrl = `${environment.apiUrl}/admin/users`;

  signup(request: SignupRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/signup`, request);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/me`);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(`${this.usersUrl}/me/password`, request);
  }

  // --- Admin ---

  getAllForAdmin(page = 0, size = 20, search?: string): Observable<PageResponse<User>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<PageResponse<User>>(this.adminUrl, { params });
  }

  grantVip(id: number, request: VipGrantRequest): Observable<User> {
    return this.http.patch<User>(`${this.adminUrl}/${id}/vip`, request);
  }

  revokeVip(id: number): Observable<User> {
    return this.http.delete<User>(`${this.adminUrl}/${id}/vip`);
  }
}
