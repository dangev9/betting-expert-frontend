import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FixtureSearch } from './fixture-search';
import { FixtureService } from '../../../core/services/fixture.service';
import { FixtureSearchResult } from '../../../core/models/fixture.model';

function result(overrides: Partial<FixtureSearchResult> = {}): FixtureSearchResult {
  return {
    id: 1,
    sport: 'FOOTBALL',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeTeamLogoUrl: null,
    awayTeamLogoUrl: null,
    kickoffTime: '2026-08-16T15:00:00Z',
    ...overrides,
  };
}

function createComponent(search: (query: string) => ReturnType<FixtureService['search']>) {
  TestBed.configureTestingModule({
    imports: [FixtureSearch],
    providers: [{ provide: FixtureService, useValue: { search } }],
  });

  const fixture = TestBed.createComponent(FixtureSearch);
  fixture.detectChanges();
  return fixture.componentInstance;
}

describe('FixtureSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not call the backend until the query reaches the minimum length', () => {
    const search = vi.fn(() => of([result()]));
    const component = createComponent(search);

    component.onInput('ar');
    vi.advanceTimersByTime(500);

    expect(search).not.toHaveBeenCalled();
    expect(component.results()).toEqual([]);
  });

  it('searches after the debounce window once the query is long enough', () => {
    const search = vi.fn(() => of([result()]));
    const component = createComponent(search);

    component.onInput('arsenal');
    vi.advanceTimersByTime(300);

    expect(search).toHaveBeenCalledWith('arsenal');
    expect(component.results()).toEqual([result()]);
  });

  it('only fires one search for fast keystrokes within the debounce window', () => {
    const search = vi.fn(() => of([result()]));
    const component = createComponent(search);

    component.onInput('ars');
    vi.advanceTimersByTime(100);
    component.onInput('arse');
    vi.advanceTimersByTime(100);
    component.onInput('arsenal');
    vi.advanceTimersByTime(300);

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('arsenal');
  });

  it('emits the selected fixture, fills the input with the match label, and closes the dropdown', () => {
    const component = createComponent(() => of([]));
    const emitted: FixtureSearchResult[] = [];
    component.fixtureSelected.subscribe((f) => emitted.push(f));

    component.select(result());

    expect(emitted).toEqual([result()]);
    expect(component.open()).toBe(false);
    expect(component.query()).toBe('Arsenal - Chelsea');
  });
});
