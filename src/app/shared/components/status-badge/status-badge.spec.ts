import { TestBed } from '@angular/core/testing';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  it('maps a known status to a label and a status-specific badge class', () => {
    const fixture = TestBed.createComponent(StatusBadge);
    fixture.componentRef.setInput('status', 'WON');
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.classList.contains('badge')).toBe(true);
    expect(span.classList.contains('badge-won')).toBe(true);
    expect(span.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('falls back to the raw value for an unmapped status instead of rendering blank', () => {
    const fixture = TestBed.createComponent(StatusBadge);
    fixture.componentRef.setInput('status', 'SOMETHING_UNKNOWN');
    fixture.detectChanges();

    const span: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(span.textContent?.trim()).toBe('SOMETHING_UNKNOWN');
  });
});
