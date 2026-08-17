import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { PageResponse } from '../../../core/models/ticket.model';
import { User } from '../../../core/models/user.model';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

const PAGE_SIZE = 20;

interface VipPreset {
  label: string;
  days: number;
}

@Component({
  selector: 'app-users',
  imports: [EmptyState, LoadingSpinner, DatePipe],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private readonly userService = inject(UserService);
  private readonly searchChanges = new Subject<string>();

  readonly search = signal('');
  readonly page = signal(0);
  readonly result = signal<PageResponse<User> | null>(null);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly grantingUserId = signal<number | null>(null);
  readonly customExpiry = signal('');

  readonly presets: VipPreset[] = [
    { label: '1 недела', days: 7 },
    { label: '1 месец', days: 30 },
    { label: '3 месеци', days: 90 },
    { label: '1 година', days: 365 },
  ];

  ngOnInit(): void {
    this.load();
    this.searchChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.page.set(0);
      this.load();
    });
  }

  onSearchInput(value: string): void {
    this.search.set(value);
    this.searchChanges.next(value);
  }

  goToPage(page: number): void {
    this.page.set(page);
    this.load();
  }

  toggleGrant(userId: number): void {
    this.grantingUserId.update((current) => (current === userId ? null : userId));
    this.customExpiry.set('');
  }

  grantPreset(user: User, days: number): void {
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    this.grant(user, expiresAt);
  }

  grantCustom(user: User): void {
    if (!this.customExpiry()) {
      return;
    }
    this.grant(user, new Date(this.customExpiry()).toISOString());
  }

  /** Always resets the VIP window from now, even if the user already has active VIP. */
  private grant(user: User, expiresAt: string): void {
    this.busy.set(true);
    this.userService.grantVip(user.id, { expiresAt }).subscribe({
      next: (updated) => {
        this.patchUser(updated);
        this.grantingUserId.set(null);
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  revoke(user: User): void {
    if (!confirm(`Одземи VIP пристап за „${user.email}“?`)) {
      return;
    }
    this.busy.set(true);
    this.userService.revokeVip(user.id).subscribe({
      next: (updated) => {
        this.patchUser(updated);
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  /** Patches the affected row in place instead of reloading the whole list - same pattern as the ticket dashboard. */
  private patchUser(updated: User): void {
    this.result.update((current) =>
      current ? { ...current, content: current.content.map((u) => (u.id === updated.id ? updated : u)) } : current,
    );
  }

  private load(): void {
    this.loading.set(true);
    this.userService.getAllForAdmin(this.page(), PAGE_SIZE, this.search() || undefined).subscribe({
      next: (response) => {
        this.result.set(response);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
