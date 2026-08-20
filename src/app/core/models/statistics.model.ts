export interface Statistics {
  totalPublishedTickets: number;
  activeTickets: number;
  wonTickets: number;
  lostTickets: number;
  voidTickets: number;
  winRatePercent: number;
  averageOdds: number;
}

export interface MonthlyVipProfit {
  month: string;
  settledTicketsCount: number;
  totalStaked: number;
  totalTaxPaid: number;
  /** Already after totalTaxPaid - the 15% winnings tax withheld on every winning ticket. */
  netProfit: number;
}

export interface MonthlyFreeStatistics {
  month: string;
  ticketCount: number;
  won: number;
  lost: number;
  winRatePercent: number;
  averageOdds: number;
  /** Already after the 15% winnings tax; tickets without a recorded stake don't contribute. */
  netProfit: number;
}

export interface PublicMonthlyProfit {
  month: string;
  /** VIP net profit only - no stake/tax detail exposed publicly, the picks stay VIP-exclusive. */
  netProfit: number;
}
