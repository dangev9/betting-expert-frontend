import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MonthlyFreeStatistics, MonthlyVipProfit, PublicMonthlyProfit, Statistics } from '../models/statistics.model';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private readonly http = inject(HttpClient);

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${environment.apiUrl}/statistics`);
  }

  getMonthlyFreeStatistics(): Observable<MonthlyFreeStatistics[]> {
    return this.http.get<MonthlyFreeStatistics[]>(`${environment.apiUrl}/statistics/monthly`);
  }

  getPublicMonthlyVipProfit(): Observable<PublicMonthlyProfit[]> {
    return this.http.get<PublicMonthlyProfit[]>(`${environment.apiUrl}/statistics/vip-profit`);
  }

  getMonthlyVipProfit(): Observable<MonthlyVipProfit[]> {
    return this.http.get<MonthlyVipProfit[]>(`${environment.apiUrl}/admin/statistics/vip-profit`);
  }
}
