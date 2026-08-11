export type TicketType = 'FREE' | 'VIP';

export type TicketStatus = 'DRAFT' | 'ACTIVE' | 'WON' | 'LOST' | 'VOID';

export type SelectionStatus = 'PENDING' | 'WON' | 'LOST' | 'VOID';

export type Sport =
  | 'FOOTBALL'
  | 'BASKETBALL'
  | 'TENNIS'
  | 'ICE_HOCKEY'
  | 'VOLLEYBALL'
  | 'HANDBALL'
  | 'OTHER';

export const SPORTS: Sport[] = [
  'FOOTBALL',
  'BASKETBALL',
  'TENNIS',
  'ICE_HOCKEY',
  'VOLLEYBALL',
  'HANDBALL',
  'OTHER',
];

export const SPORT_LABELS: Record<Sport, string> = {
  FOOTBALL: 'Фудбал',
  BASKETBALL: 'Кошарка',
  TENNIS: 'Тенис',
  ICE_HOCKEY: 'Хокеј на мраз',
  VOLLEYBALL: 'Одбојка',
  HANDBALL: 'Ракомет',
  OTHER: 'Друго',
};

export interface TicketSelection {
  id: number;
  sport: Sport;
  league: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  prediction: string;
  odds: number;
  eventTime: string;
  status: SelectionStatus;
}

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  ticketType: TicketType;
  status: TicketStatus;
  totalOdds: number | null;
  stake: number | null;
  potentialReturn: number | null;
  publishedAt: string | null;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  locked: boolean;
  selectionsCount: number;
  selections: TicketSelection[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TicketSelectionRequest {
  sport: Sport;
  league: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  prediction: string;
  odds: number;
  eventTime: string;
}

export interface TicketRequest {
  title: string;
  description: string | null;
  ticketType: TicketType;
  status: 'DRAFT' | 'ACTIVE';
  eventDate: string;
  stake: number | null;
  selections: TicketSelectionRequest[];
}
