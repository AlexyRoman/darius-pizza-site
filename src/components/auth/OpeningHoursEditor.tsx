'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { useHours } from '@/hooks/useHours';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import type { HoursConfig } from '@/types/restaurant-config';
import type { DayHours } from '@/types/opening-hours';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export function OpeningHoursEditor() {
  const t = useTranslations('dashboard.hours');
  const { data, loading, refetch } = useHours();
  const [form, setForm] = useState<HoursConfig | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (data) setForm(structuredClone(data));
  }, [data]);

  const updateDay = (
    day: (typeof DAYS)[number],
    updater: (d: DayHours) => DayHours
  ) => {
    if (!form) return;
    setForm({
      ...form,
      openingHours: {
        ...form.openingHours,
        [day]: updater(form.openingHours[day]),
      },
    });
  };

  const setDayOpen = (day: (typeof DAYS)[number], isOpen: boolean) => {
    updateDay(day, d => ({
      ...d,
      isOpen,
      periods:
        isOpen && d.periods.length === 0
          ? [{ open: '18:00', close: '21:30' }]
          : d.periods,
    }));
  };

  const addPeriod = (day: (typeof DAYS)[number]) => {
    updateDay(day, d => ({
      ...d,
      periods: [...d.periods, { open: '18:00', close: '21:30' }],
    }));
  };

  const removePeriod = (day: (typeof DAYS)[number], index: number) => {
    updateDay(day, d => ({
      ...d,
      periods: d.periods.filter((_, i) => i !== index),
    }));
  };

  const updatePeriod = (
    day: (typeof DAYS)[number],
    index: number,
    field: 'open' | 'close',
    value: string
  ) => {
    updateDay(day, d => ({
      ...d,
      periods: d.periods.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleSave = async () => {
    if (!form) return;
    setSaveStatus('saving');
    setErrorMsg('');
    try {
      const res = await fetch('/api/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save');
      }
      setSaveStatus('saved');
      await refetch();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  if (loading || !form) {
    return (
      <Card>
        <CardContent className='py-8'>
          <p className='text-center text-muted-foreground'>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {DAYS.map(day => (
          <div
            key={day}
            className='flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between'
          >
            <div className='flex items-center gap-3'>
              <Label className='min-w-[100px] font-medium capitalize'>
                {DAY_LABELS[day]}
              </Label>
              <Switch
                checked={form.openingHours[day].isOpen}
                onCheckedChange={checked => setDayOpen(day, checked)}
              />
              <span className='text-sm text-muted-foreground'>
                {form.openingHours[day].isOpen ? t('open') : t('closed')}
              </span>
            </div>
            {form.openingHours[day].isOpen && (
              <div className='flex flex-1 flex-col gap-2 sm:max-w-xs'>
                {form.openingHours[day].periods.map((period, idx) => (
                  <div key={idx} className='flex items-center gap-2'>
                    <Input
                      type='time'
                      value={period.open}
                      onChange={e =>
                        updatePeriod(day, idx, 'open', e.target.value)
                      }
                      className='h-9'
                    />
                    <span className='text-muted-foreground'>–</span>
                    <Input
                      type='time'
                      value={period.close}
                      onChange={e =>
                        updatePeriod(day, idx, 'close', e.target.value)
                      }
                      className='h-9'
                    />
                    {form.openingHours[day].periods.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removePeriod(day, idx)}
                        aria-label={t('removePeriod')}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => addPeriod(day)}
                >
                  {t('addPeriod')}
                </Button>
              </div>
            )}
          </div>
        ))}

        {errorMsg && <p className='text-sm text-destructive'>{errorMsg}</p>}

        <div className='flex items-center gap-2'>
          <Button onClick={handleSave} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving'
              ? t('saving')
              : saveStatus === 'saved'
                ? t('saved')
                : t('save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
