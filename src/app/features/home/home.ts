import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { Ticket } from '../../core/models/ticket.model';
import { MonthlyFreeStatistics, PublicMonthlyProfit } from '../../core/models/statistics.model';
import { TicketCard } from '../../shared/components/ticket-card/ticket-card';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { environment } from '../../../environments/environment';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TicketCard, EmptyState, LoadingSpinner, DatePipe, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly statisticsService = inject(StatisticsService);

  readonly todayTickets = signal<Ticket[]>([]);
  readonly recentResults = signal<Ticket[]>([]);
  readonly monthlyFreeStatistics = signal<MonthlyFreeStatistics[]>([]);
  readonly vipMonthlyProfit = signal<PublicMonthlyProfit[]>([]);
  readonly loadingToday = signal(true);
  readonly loadingResults = signal(true);

  readonly instagramUrl = environment.contact.instagramUrl;

  readonly pillars = [
    { title: 'Податоци', text: 'Секој избор започнува со бројки, не со претчувство.' },
    { title: 'Форма', text: 'Неодамнешната форма, домашни/гостински серии и меѓусебни натпревари го обликуваат секој избор.' },
    { title: 'Вредност', text: 'Ги бираме коефициентите кои погрешно ја проценуваат вистинската веројатност, не фаворитите.' },
    { title: 'Дисциплина', text: 'Конзистентен процес, разумно вложување, објавено пред почетокот на натпреварот.' },
    { title: 'Транспарентност', text: 'Секој резултат — победа или пораз — останува во јавната архива.' },
  ];

  ngOnInit(): void {
    this.ticketService.getToday().subscribe({
      next: (tickets) => {
        this.todayTickets.set(tickets.slice(0, 3));
        this.loadingToday.set(false);
      },
      error: () => this.loadingToday.set(false),
    });

    this.ticketService.getRecent(4).subscribe({
      next: (tickets) => {
        this.recentResults.set(tickets);
        this.loadingResults.set(false);
      },
      error: () => this.loadingResults.set(false),
    });

    this.statisticsService.getMonthlyFreeStatistics().subscribe({
      next: (rows) => this.monthlyFreeStatistics.set([...rows].reverse()),
      error: () => this.monthlyFreeStatistics.set([]),
    });

    this.statisticsService.getPublicMonthlyVipProfit().subscribe({
      next: (rows) => this.vipMonthlyProfit.set([...rows].reverse()),
      error: () => this.vipMonthlyProfit.set([]),
    });
  }
}
