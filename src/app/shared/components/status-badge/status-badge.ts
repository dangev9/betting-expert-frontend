import { Component, computed, input } from '@angular/core';

const LABELS: Record<string, string> = {
  ACTIVE: 'Активен',
  WON: 'Добиен',
  LOST: 'Изгубен',
  VOID: 'Поништен',
  DRAFT: 'Нацрт',
  PENDING: 'Во тек',
  FREE: 'Бесплатно',
  VIP: 'VIP',
};

const CLASSES: Record<string, string> = {
  ACTIVE: 'badge-active',
  WON: 'badge-won',
  LOST: 'badge-lost',
  VOID: 'badge-void',
  DRAFT: 'badge-draft',
  PENDING: 'badge-pending',
  FREE: 'badge-free',
  VIP: 'badge-vip',
};

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [class]="badgeClass()">{{ label() }}</span>`,
})
export class StatusBadge {
  readonly status = input.required<string>();

  readonly label = computed(() => LABELS[this.status()] ?? this.status());
  readonly badgeClass = computed(() => CLASSES[this.status()] ?? '');
}
