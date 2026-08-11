import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <p class="empty-state-title">{{ title() }}</p>
      @if (message()) {
        <p class="empty-state-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    .empty-state {
      text-align: center;
      padding: var(--space-8) var(--space-5);
      border: 1px dashed var(--color-border-strong);
      border-radius: var(--radius-lg);
    }
    .empty-state-title {
      font-weight: 700;
      font-size: 1.05rem;
      margin-bottom: var(--space-2);
    }
    .empty-state-message {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }
  `,
})
export class EmptyState {
  readonly title = input('Сè уште нема ништо тука');
  readonly message = input<string | null>(null);
}
