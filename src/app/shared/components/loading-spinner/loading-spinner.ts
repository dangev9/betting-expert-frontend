import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `<div class="spinner" role="status" aria-label="Loading"></div>`,
  styles: `
    .spinner {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid var(--color-border-strong);
      border-top-color: var(--color-accent);
      animation: spin 0.7s linear infinite;
      margin: var(--space-6) auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
})
export class LoadingSpinner {}
