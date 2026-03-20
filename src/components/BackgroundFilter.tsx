'use client';

import { useNavigate } from '@tanstack/react-router';

import { Toggle } from '#/components/ui/toggle';
import type { BackgroundFilter } from '#/lib/filter';

type BackgroundFilterProps = {
  value?: BackgroundFilter;
};

export default function BackgroundFilter({ value }: BackgroundFilterProps) {
  const navigate = useNavigate();
  const selected = value ?? 'any';
  const options: Array<{ value: 'any' | BackgroundFilter; label: string }> = [
    { value: 'any', label: 'any' },
    { value: 'dark', label: 'dark' },
    { value: 'light', label: 'light' },
    { value: 'both', label: 'both' },
  ];

  return (
    <section className="space-y-2" aria-label="Background filter">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Background
      </p>
      <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
        {options.map(option => (
          <Toggle
            key={option.value}
            size="sm"
            className="rounded-md px-3 capitalize aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-xs"
            pressed={selected === option.value}
            onPressedChange={pressed => {
              if (!pressed) {
                return;
              }

              const background =
                option.value === 'any' ? undefined : option.value;

              void navigate({
                to: '/',
                search: background ? { background } : {},
              });
            }}
            aria-label={`${option.label} background`}
          >
            {option.label}
          </Toggle>
        ))}
      </div>
    </section>
  );
}
