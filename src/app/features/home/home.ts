import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { Ticket } from '../../core/models/ticket.model';
import { Statistics } from '../../core/models/statistics.model';
import { TicketCard } from '../../shared/components/ticket-card/ticket-card';
import { StatTile } from '../../shared/components/stat-tile/stat-tile';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TicketCard, StatTile, EmptyState, LoadingSpinner],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly statisticsService = inject(StatisticsService);

  readonly todayTickets = signal<Ticket[]>([]);
  readonly recentResults = signal<Ticket[]>([]);
  readonly statistics = signal<Statistics | null>(null);
  readonly loadingToday = signal(true);
  readonly loadingResults = signal(true);

  readonly viberUrl = environment.contact.viberUrl;
  readonly instagramUrl = environment.contact.instagramUrl;

  readonly pillars = [
    { title: 'Data', text: 'Every selection starts with the numbers, not a hunch.' },
    { title: 'Form', text: 'Recent form, home/away splits and matchups shape each pick.' },
    { title: 'Value', text: 'We back odds that misprice the true probability, not favourites.' },
    { title: 'Discipline', text: 'A consistent process, staked sensibly, published before kickoff.' },
    { title: 'Transparency', text: 'Every result — win or lose — stays in the public archive.' },
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

    this.statisticsService.getStatistics().subscribe({
      next: (stats) => this.statistics.set(stats),
      error: () => this.statistics.set(null),
    });
  }
}
