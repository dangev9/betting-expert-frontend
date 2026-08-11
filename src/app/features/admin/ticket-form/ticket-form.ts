import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { SPORTS, SPORT_LABELS, Sport, Ticket, TicketRequest } from '../../../core/models/ticket.model';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

function toDateTimeLocal(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinner, DecimalPipe],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.scss',
})
export class TicketFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly sports = SPORTS;
  readonly sportLabels = SPORT_LABELS;

  readonly editingId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    ticketType: ['FREE' as 'FREE' | 'VIP', Validators.required],
    eventDate: ['', Validators.required],
    stake: this.fb.control<number | null>(null),
    selections: this.fb.array([this.buildSelectionGroup()]),
  });

  get selectionsArray(): FormArray {
    return this.form.controls.selections;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.editingId.set(id);
      this.loadTicket(id);
    }
  }

  get totalOdds(): number {
    return this.selectionsArray.controls.reduce((total, control) => {
      const odds = Number(control.get('odds')?.value) || 0;
      return odds > 0 ? total * odds : total;
    }, 1);
  }

  addSelection(): void {
    this.selectionsArray.push(this.buildSelectionGroup());
  }

  removeSelection(index: number): void {
    if (this.selectionsArray.length > 1) {
      this.selectionsArray.removeAt(index);
    }
  }

  saveDraft(): void {
    this.submit('DRAFT');
  }

  publish(): void {
    this.submit('ACTIVE');
  }

  private submit(status: 'DRAFT' | 'ACTIVE'): void {
    if (this.form.invalid || this.selectionsArray.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Please fill in every required field before saving.');
      return;
    }

    this.errorMessage.set(null);
    this.saving.set(true);

    const value = this.form.getRawValue();
    const request: TicketRequest = {
      title: value.title,
      description: value.description || null,
      ticketType: value.ticketType,
      status,
      eventDate: value.eventDate,
      stake: value.stake,
      selections: value.selections.map((s) => ({
        sport: s.sport as Sport,
        league: s.league,
        homeTeam: s.homeTeam,
        awayTeam: s.awayTeam,
        market: s.market,
        prediction: s.prediction,
        odds: Number(s.odds),
        eventTime: new Date(s.eventTime).toISOString(),
      })),
    };

    const id = this.editingId();
    const request$ = id ? this.ticketService.update(id, request) : this.ticketService.create(request);

    request$.subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: () => {
        this.errorMessage.set('Could not save this ticket. Please check the fields and try again.');
        this.saving.set(false);
      },
    });
  }

  private loadTicket(id: number): void {
    this.loading.set(true);
    this.ticketService.getByIdForAdmin(id).subscribe({
      next: (ticket) => {
        this.patchForm(ticket);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load this ticket.');
        this.loading.set(false);
      },
    });
  }

  private patchForm(ticket: Ticket): void {
    this.form.patchValue({
      title: ticket.title,
      description: ticket.description ?? '',
      ticketType: ticket.ticketType,
      eventDate: ticket.eventDate,
      stake: ticket.stake,
    });

    this.selectionsArray.clear();
    for (const selection of ticket.selections) {
      this.selectionsArray.push(
        this.buildSelectionGroup({
          sport: selection.sport,
          league: selection.league,
          homeTeam: selection.homeTeam,
          awayTeam: selection.awayTeam,
          market: selection.market,
          prediction: selection.prediction,
          odds: selection.odds,
          eventTime: toDateTimeLocal(selection.eventTime),
        }),
      );
    }
    if (this.selectionsArray.length === 0) {
      this.selectionsArray.push(this.buildSelectionGroup());
    }
  }

  private buildSelectionGroup(initial?: {
    sport?: string;
    league?: string;
    homeTeam?: string;
    awayTeam?: string;
    market?: string;
    prediction?: string;
    odds?: number;
    eventTime?: string;
  }) {
    return this.fb.nonNullable.group({
      sport: [initial?.sport ?? 'FOOTBALL', Validators.required],
      league: [initial?.league ?? '', Validators.required],
      homeTeam: [initial?.homeTeam ?? '', Validators.required],
      awayTeam: [initial?.awayTeam ?? '', Validators.required],
      market: [initial?.market ?? '', Validators.required],
      prediction: [initial?.prediction ?? '', Validators.required],
      odds: [initial?.odds ?? 1.5, [Validators.required, Validators.min(1.01)]],
      eventTime: [initial?.eventTime ?? '', Validators.required],
    });
  }
}
