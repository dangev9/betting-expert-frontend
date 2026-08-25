import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TicketFormPage } from './ticket-form';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket, TicketSelection } from '../../../core/models/ticket.model';

function baseSelection(overrides: Partial<TicketSelection> = {}): TicketSelection {
  return {
    id: 1,
    sport: 'FOOTBALL',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    prediction: 'Over 2.5 Goals',
    odds: 1.8,
    eventTime: '2026-01-01T18:00:00Z',
    status: 'PENDING',
    ...overrides,
  };
}

function baseTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 5,
    title: 'Some Ticket',
    description: null,
    ticketType: 'FREE',
    status: 'ACTIVE',
    totalOdds: 1.8,
    stake: null,
    potentialReturn: null,
    publishedAt: null,
    eventDate: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    locked: false,
    selectionsCount: 1,
    selections: [baseSelection()],
    ...overrides,
  };
}

function createComponent(routeId: string | null, ticketForEdit?: Ticket) {
  TestBed.configureTestingModule({
    imports: [TicketFormPage],
    providers: [
      {
        provide: TicketService,
        useValue: {
          getByIdForAdmin: () => of(ticketForEdit as Ticket),
          create: () => of(baseTicket()),
          update: () => of(baseTicket()),
        },
      },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => routeId } } },
      },
    ],
  });

  const fixture = TestBed.createComponent(TicketFormPage);
  fixture.detectChanges();
  return fixture.componentInstance;
}

describe('TicketFormPage', () => {
  it('calculates total odds as the product of every selection odds, live', () => {
    const component = createComponent(null);

    component.selectionsArray.at(0).patchValue({ odds: 1.5 });
    expect(component.totalOdds).toBeCloseTo(1.5);

    component.addSelection();
    component.selectionsArray.at(1).patchValue({ odds: 2 });
    expect(component.totalOdds).toBeCloseTo(3.0);
  });

  it('stays fully editable while every selection is still pending', () => {
    const component = createComponent('5', baseTicket());

    expect(component.locked()).toBe(false);
    expect(component.selectionsArray.disabled).toBe(false);
    expect(component.form.controls.ticketType.disabled).toBe(false);
  });

  it('locks structural fields once a selection has been graded, but leaves title/description open', () => {
    const settled = baseTicket({
      status: 'WON',
      selections: [baseSelection({ status: 'WON' })],
    });

    const component = createComponent('5', settled);

    expect(component.locked()).toBe(true);
    expect(component.selectionsArray.disabled).toBe(true);
    expect(component.form.controls.ticketType.disabled).toBe(true);
    expect(component.form.controls.eventDate.disabled).toBe(true);
    expect(component.form.controls.stake.disabled).toBe(true);
    expect(component.form.controls.title.disabled).toBe(false);
    expect(component.form.controls.description.disabled).toBe(false);
  });

  it('does not add or remove selections once locked', () => {
    const settled = baseTicket({
      status: 'WON',
      selections: [baseSelection({ status: 'WON' })],
    });

    const component = createComponent('5', settled);
    const initialLength = component.selectionsArray.length;

    component.addSelection();

    expect(component.selectionsArray.length).toBe(initialLength);
  });
});
