import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('combines class names correctly', () => {
    expect(cn('bg-ink', 'text-bone')).toBe('bg-ink text-bone');
  });

  it('handles conditional classes properly', () => {
    const isPrimary = true;
    const isSecondary = false;
    expect(cn('btn', isPrimary && 'btn-primary', isSecondary && 'btn-secondary')).toBe('btn btn-primary');
  });

  it('resolves conflicting tailwind classes using tailwind-merge', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6');
    expect(cn('text-ash', 'text-crimson-text')).toBe('text-crimson-text');
  });
});
