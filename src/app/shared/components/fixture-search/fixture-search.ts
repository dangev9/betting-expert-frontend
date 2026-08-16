import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FixtureService } from '../../../core/services/fixture.service';
import { FixtureSearchResult } from '../../../core/models/fixture.model';

const MIN_QUERY_LENGTH = 3;

@Component({
  selector: 'app-fixture-search',
  imports: [DatePipe],
  templateUrl: './fixture-search.html',
  styleUrl: './fixture-search.scss',
})
export class FixtureSearch {
  @Output() readonly fixtureSelected = new EventEmitter<FixtureSearchResult>();

  private readonly fixtureService = inject(FixtureService);
  private readonly queryChanges = new Subject<string>();

  readonly query = signal('');
  readonly open = signal(false);

  readonly results = toSignal(
    this.queryChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => (q.trim().length >= MIN_QUERY_LENGTH ? this.fixtureService.search(q.trim()) : of([]))),
    ),
    { initialValue: [] as FixtureSearchResult[] },
  );

  onInput(value: string): void {
    this.query.set(value);
    this.open.set(true);
    this.queryChanges.next(value);
  }

  select(fixture: FixtureSearchResult): void {
    this.fixtureSelected.emit(fixture);
    this.query.set(`${fixture.homeTeam} - ${fixture.awayTeam}`);
    this.open.set(false);
  }

  /** mousedown on a result fires before this blur, so the click still registers before we close the dropdown. */
  onBlur(): void {
    setTimeout(() => this.open.set(false), 150);
  }
}
