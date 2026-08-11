import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import { Ticket } from '../../core/models/ticket.model';
import { TicketCard } from '../../shared/components/ticket-card/ticket-card';
import { environment } from '../../../environments/environment';

interface Benefit {
  title: string;
  text: string;
}

@Component({
  selector: 'app-vip',
  imports: [RouterLink, TicketCard],
  templateUrl: './vip.html',
  styleUrl: './vip.scss',
})
export class Vip implements OnInit {
  private readonly ticketService = inject(TicketService);

  readonly viberUrl = environment.contact.viberUrl;
  readonly instagramUrl = environment.contact.instagramUrl;

  private readonly todayTickets = signal<Ticket[]>([]);
  readonly vipTicket = computed(() => this.todayTickets().find((t) => t.ticketType === 'VIP') ?? null);

  readonly benefits: Benefit[] = [
    { title: 'Full VIP tickets', text: 'Every selection, market and odds unlocked — not just a teaser.' },
    { title: 'More selections', text: 'A wider daily program covering more researched value across leagues.' },
    { title: 'Priority access', text: "See VIP tickets before they're finalised on the public site." },
    { title: 'Premium picks', text: 'Deeper research goes into VIP selections, including riskier value angles.' },
    { title: 'Direct contact', text: 'Ask questions about the reasoning behind a pick, directly via Viber or Instagram.' },
  ];

  ngOnInit(): void {
    this.ticketService.getToday().subscribe({
      next: (tickets) => this.todayTickets.set(tickets),
      error: () => this.todayTickets.set([]),
    });
  }
}
