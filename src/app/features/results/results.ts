import { Component, OnInit, inject, signal } from '@angular/core';
import { TicketService } from '../../core/services/ticket.service';
import { Ticket } from '../../core/models/ticket.model';
import { TicketCard } from '../../shared/components/ticket-card/ticket-card';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-results',
  imports: [TicketCard, EmptyState, LoadingSpinner],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results implements OnInit {
  private readonly ticketService = inject(TicketService);

  readonly tickets = signal<Ticket[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.ticketService.getRecent(20).subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
