import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-tile',
  template: `
    <div class="stat-tile card">
      <p class="stat-tile__value">{{ value() }}</p>
      <p class="stat-tile__label">{{ label() }}</p>
    </div>
  `,
  styles: `
    .stat-tile {
      text-align: center;
      padding: var(--space-5) var(--space-3);
    }
    .stat-tile__value {
      font-size: 1.9rem;
      font-weight: 800;
      font-family: var(--font-mono);
      color: var(--color-accent-text);
    }
    .stat-tile__label {
      margin-top: var(--space-2);
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `,
})
export class StatTile {
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
}
