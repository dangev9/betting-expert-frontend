import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FixtureSearchResult } from '../models/fixture.model';

@Injectable({ providedIn: 'root' })
export class FixtureService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/fixtures`;

  search(query: string): Observable<FixtureSearchResult[]> {
    return this.http.get<FixtureSearchResult[]>(`${this.baseUrl}/search`, { params: { q: query } });
  }

  syncNow(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/sync`, {});
  }
}
