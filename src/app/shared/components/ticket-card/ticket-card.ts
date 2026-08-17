import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ticket, selectionsLabel } from '../../../core/models/ticket.model';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-ticket-card',
  imports: [CommonModule, RouterLink, StatusBadge],
  templateUrl: './ticket-card.html',
  styleUrl: './ticket-card.scss',
})
export class TicketCard {
  readonly ticket = input.required<Ticket>();

  /** Single-selection tickets get a bigger "hero" match presentation; multi-leg tickets read as a slip. */
  readonly isSingleMatch = computed(() => this.ticket().selectionsCount === 1 && !this.ticket().locked);

  readonly selectionsLabel = selectionsLabel;
}
