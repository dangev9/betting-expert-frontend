import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { StatisticsService } from '../../../core/services/statistics.service';
import { FixtureService } from '../../../core/services/fixture.service';
import { PageResponse, SelectionStatus, Ticket, TicketStatus } from '../../../core/models/ticket.model';
import { MonthlyVipProfit, Statistics } from '../../../core/models/statistics.model';
import { StatTile } from '../../../shared/components/stat-tile/stat-tile';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { DatePipe, DecimalPipe } from '@angular/common';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatTile, StatusBadge, EmptyState, LoadingSpinner, DatePipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly statisticsService = inject(StatisticsService);
  private readonly fixtureService = inject(FixtureService);

  readonly stats = signal<Statistics | null>(null);
  readonly result = signal<PageResponse<Ticket> | null>(null);
  readonly page = signal(0);
  readonly loading = signal(true);
  readonly expandedTicketId = signal<number | null>(null);
  readonly busy = signal(false);
  readonly monthlyVipProfit = signal<MonthlyVipProfit[]>([]);
  readonly syncing = signal(false);
  readonly syncMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadStats();
    this.loadTickets();
    this.loadMonthlyVipProfit();
  }

  syncFixturesNow(): void {
    this.syncing.set(true);
    this.syncMessage.set(null);
    this.fixtureService.syncNow().subscribe({
      next: () => {
        this.syncing.set(false);
        this.syncMessage.set('Синхронизацијата е завршена.');
      },
      error: () => {
        this.syncing.set(false);
        this.syncMessage.set('Синхронизацијата не успеа. Обидете се повторно подоцна.');
      },
    });
  }

  private loadMonthlyVipProfit(): void {
    this.statisticsService.getMonthlyVipProfit().subscribe({
      next: (rows) => this.monthlyVipProfit.set(rows),
    });
  }

  toggleExpand(ticketId: number): void {
    this.expandedTicketId.update((current) => (current === ticketId ? null : ticketId));
  }

  /**
   * Patches the affected ticket in place instead of reloading the whole page - grading a selection
   * only touches one row, so there's no reason to flash the entire table (and lose the expanded
   * Result panel's scroll position) for it. Grading can also silently change the ticket's own
   * status (see backend `TicketService.applyAutoTicketStatus`), so stats are refreshed too.
   */
  markSelection(selectionId: number, status: SelectionStatus): void {
    this.busy.set(true);
    this.ticketService.updateSelectionStatus(selectionId, status).subscribe({
      next: (updatedTicket) => {
        this.patchTicket(updatedTicket);
        this.loadStats();
        this.loadMonthlyVipProfit();
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  markTicketStatus(ticketId: number, status: TicketStatus): void {
    this.busy.set(true);
    this.ticketService.updateTicketStatus(ticketId, status).subscribe({
      next: (updatedTicket) => {
        this.patchTicket(updatedTicket);
        this.loadStats();
        this.loadMonthlyVipProfit();
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  private patchTicket(updated: Ticket): void {
    this.result.update((current) =>
      current ? { ...current, content: current.content.map((t) => (t.id === updated.id ? updated : t)) } : current,
    );
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
        this.loadMonthlyVipProfit();
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
