import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse, Ticket, TicketRequest, TicketSelection } from '../models/ticket.model';

export interface ArchiveFilters {
  status?: string | null;
  type?: string | null;
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tickets`;
  private readonly adminUrl = `${environment.apiUrl}/admin/tickets`;
  private readonly selectionsUrl = `${environment.apiUrl}/admin/selections`;

  getToday(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/today`);
  }

  getRecent(limit = 6): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/recent`, { params: { limit } });
  }

  getArchive(filters: ArchiveFilters): Observable<PageResponse<Ticket>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 10);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.type) params = params.set('type', filters.type);

    return this.http.get<PageResponse<Ticket>>(`${this.baseUrl}/archive`, { params });
  }

  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
  }

  // --- Admin ---

  getAllForAdmin(page = 0, size = 20): Observable<PageResponse<Ticket>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Ticket>>(this.adminUrl, { params });
  }

  getByIdForAdmin(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.adminUrl}/${id}`);
  }

  create(request: TicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.adminUrl, request);
  }

  update(id: number, request: TicketRequest): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.adminUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  updateTicketStatus(id: number, status: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.adminUrl}/${id}/status`, { status });
  }

  updateSelectionStatus(selectionId: number, status: string): Observable<TicketSelection> {
    return this.http.patch<TicketSelection>(`${this.selectionsUrl}/${selectionId}/status`, { status });
  }
}
