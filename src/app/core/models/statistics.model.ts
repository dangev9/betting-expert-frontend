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
