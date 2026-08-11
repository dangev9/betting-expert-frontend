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
  readonly instagramUrl = environment.contact.instagramUrl;

  private readonly todayTickets = signal<Ticket[]>([]);
  readonly vipTicket = computed(() => this.todayTickets().find((t) => t.ticketType === 'VIP') ?? null);

  readonly benefits: Benefit[] = [
    { title: 'Целосни VIP тикети', text: 'Секој избор, пазар и коефициент отклучени — не само преглед.' },
    { title: 'Повеќе избори', text: 'Поширока дневна програма што покрива повеќе истражена вредност низ лигите.' },
    { title: 'Приоритетен пристап', text: 'Погледни ги VIP тикетите пред да бидат финализирани на јавната страница.' },
    { title: 'Премиум избори', text: 'Подлабоко истражување стои зад VIP селекциите, вклучувајќи и поризични вредносни аспекти.' },
    { title: 'Директен контакт', text: 'Постави прашања за образложението зад одреден избор, директно преку Instagram.' },
  ];

  ngOnInit(): void {
    this.ticketService.getToday().subscribe({
      next: (tickets) => this.todayTickets.set(tickets),
      error: () => this.todayTickets.set([]),
    });
  }
}
