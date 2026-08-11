import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { StatisticsService } from '../../../core/services/statistics.service';
import { PageResponse, SelectionStatus, Ticket, TicketStatus } from '../../../core/models/ticket.model';
import { Statistics } from '../../../core/models/statistics.model';
import { StatTile } from '../../../shared/components/stat-tile/stat-tile';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { DatePipe } from '@angular/common';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatTile, StatusBadge, EmptyState, LoadingSpinner, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly statisticsService = inject(StatisticsService);

  readonly stats = signal<Statistics | null>(null);
  readonly result = signal<PageResponse<Ticket> | null>(null);
  readonly page = signal(0);
  readonly loading = signal(true);
  readonly expandedTicketId = signal<number | null>(null);
  readonly busy = signal(false);

  ngOnInit(): void {
    this.loadStats();
    this.loadTickets();
  }

  toggleExpand(ticketId: number): void {
    this.expandedTicketId.update((current) => (current === ticketId ? null : ticketId));
  }

  markSelection(selectionId: number, status: SelectionStatus): void {
    this.busy.set(true);
    this.ticketService.updateSelectionStatus(selectionId, status).subscribe({
      next: () => {
        this.loadTickets(this.page());
      },
      error: () => this.busy.set(false),
    });
  }

  markTicketStatus(ticketId: number, status: TicketStatus): void {
    this.busy.set(true);
    this.ticketService.updateTicketStatus(ticketId, status).subscribe({
      next: () => {
        this.loadTickets(this.page());
        this.loadStats();
      },
      error: () => this.busy.set(false),
    });
  }

  deleteTicket(ticket: Ticket): void {
    const isSettled = ticket.status === 'WON' || ticket.status === 'LOST' || ticket.status === 'VOID';

    const confirmed = isSettled
      ? confirm(
          `Архивирај „${ticket.title}“? Завршен резултат не може трајно да се избрише - ` +
            `ќе исчезне од страницата, но записот се чува интерно за да остане точна минатата статистика.`,
        )
      : confirm(`Избриши „${ticket.title}“? Ова не може да се врати.`);

    if (!confirmed) {
      return;
    }

    this.ticketService.delete(ticket.id).subscribe({
      next: () => {
        this.loadTickets(this.page());
        this.loadStats();
      },
    });
  }

  goToPage(page: number): void {
    this.loadTickets(page);
  }

  private loadStats(): void {
    this.statisticsService.getStatistics().subscribe({
      next: (stats) => this.stats.set(stats),
    });
  }

  private loadTickets(page = 0): void {
    this.loading.set(true);
    this.ticketService.getAllForAdmin(page, PAGE_SIZE).subscribe({
      next: (response) => {
        this.result.set(response);
        this.page.set(page);
        this.loading.set(false);
        this.busy.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.busy.set(false);
      },
    });
  }
}
