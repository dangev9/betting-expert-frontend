import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MonthlyVipProfit, Statistics } from '../models/statistics.model';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private readonly http = inject(HttpClient);

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${environment.apiUrl}/statistics`);
  }

  getMonthlyVipProfit(): Observable<MonthlyVipProfit[]> {
    return this.http.get<MonthlyVipProfit[]>(`${environment.apiUrl}/admin/statistics/vip-profit`);
  }
}
