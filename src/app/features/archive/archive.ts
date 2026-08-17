import { Component, OnInit, inject, signal } from '@angular/core';
import { TicketService } from '../../core/services/ticket.service';
import { PageResponse, Ticket, selectionsLabel } from '../../core/models/ticket.model';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { DatePipe } from '@angular/common';

type StatusFilter = 'ALL' | 'WON' | 'LOST' | 'VOID';
type TypeFilter = 'ALL' | 'FREE' | 'VIP';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-archive',
  imports: [StatusBadge, EmptyState, LoadingSpinner, DatePipe],
  templateUrl: './archive.html',
  styleUrl: './archive.scss',
})
export class Archive implements OnInit {
  private readonly ticketService = inject(TicketService);

  readonly statusFilter = signal<StatusFilter>('ALL');
  readonly typeFilter = signal<TypeFilter>('ALL');
  readonly page = signal(0);
  readonly result = signal<PageResponse<Ticket> | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly expandedTicketId = signal<number | null>(null);
  readonly selectionsLabel = selectionsLabel;

  readonly statusOptions: StatusFilter[] = ['ALL', 'WON', 'LOST', 'VOID'];
  readonly typeOptions: TypeFilter[] = ['ALL', 'FREE', 'VIP'];

  private readonly statusLabels: Record<StatusFilter, string> = {
    ALL: 'Сите',
    WON: 'Добиени',
    LOST: 'Изгубени',
    VOID: 'Поништени',
  };

  private readonly typeLabels: Record<TypeFilter, string> = {
    ALL: 'Сите',
    FREE: 'Бесплатно',
    VIP: 'VIP',
  };

  ngOnInit(): void {
    this.load();
  }

  setStatus(status: StatusFilter): void {
    this.statusFilter.set(status);
    this.page.set(0);
    this.load();
  }

  setType(type: TypeFilter): void {
    this.typeFilter.set(type);
    this.page.set(0);
    this.load();
  }

  goToPage(page: number): void {
    this.page.set(page);
    this.load();
  }

  toggleExpand(ticketId: number): void {
    this.expandedTicketId.update((current) => (current === ticketId ? null : ticketId));
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.ticketService
      .getArchive({
        status: this.statusFilter() === 'ALL' ? null : this.statusFilter(),
        type: this.typeFilter() === 'ALL' ? null : this.typeFilter(),
        page: this.page(),
        size: PAGE_SIZE,
      })
      .subscribe({
        next: (response) => {
          this.result.set(response);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  selectionsSummary(ticket: Ticket): string {
    if (ticket.selectionsCount === 1 && ticket.selections[0]) {
      const s = ticket.selections[0];
      return `${s.homeTeam} vs ${s.awayTeam} — ${s.prediction}`;
    }
    return `${ticket.selectionsCount} избори`;
  }

  statusLabel(status: StatusFilter): string {
    return this.statusLabels[status];
  }

  typeLabel(type: TypeFilter): string {
    return this.typeLabels[type];
  }
}
