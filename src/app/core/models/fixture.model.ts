import { Sport } from './ticket.model';

export interface FixtureSearchResult {
  id: number;
  sport: Sport;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogoUrl: string | null;
  awayTeamLogoUrl: string | null;
  kickoffTime: string;
}
