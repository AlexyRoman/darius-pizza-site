'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useHours } from '@/hooks/useHours';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

export function OpeningHoursEditor() {
  const t = useTranslations('dashboard.hours');
  const { data, loading, refetch } = useHours();
  const [form, setForm] = useState<HoursConfig | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const performSave = async () => {
    if (!form) return;
    setConfirmOpen(false);
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || t('error'));
      }
      if (json.config) {
        setForm(structuredClone(json.config));
      }
      setSaveStatus('saved');
      await refetch();
      const googleSync = json.googleSync as
        | 'ok'
        | 'skipped'
        | 'failed'
        | undefined;
      if (googleSync === 'ok') {
        toast.success(t('savedAndSyncedGoogle'));
      } else if (googleSync === 'failed') {
        toast.warning(t('savedSyncFailedGoogle'));
      } else {
        toast.success(t('saved'));
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      const message = err instanceof Error ? err.message : t('error');
      toast.error(message);
    }
  };

  if (loading || !form) {
    return (
      <div className='flex flex-1 items-center justify-center py-12'>
        <p className='text-muted-foreground'>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <p className='text-sm text-muted-foreground'>{t('description')}</p>
      <div className='space-y-1'>
        {DAYS.map(day => (
          <div
            key={day}
            className='flex flex-col gap-3 py-3 px-4 rounded-md hover:bg-muted/50 transition-colors sm:flex-row sm:items-center sm:justify-between'
          >
            <div className='flex items-center gap-3'>
              <Label className='min-w-[100px] font-medium'>
                {t(`days.${day}`)}
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
              <div className='flex flex-1 flex-col gap-2 sm:max-w-xs sm:flex-row sm:flex-wrap sm:items-center'>
                {form.openingHours[day].periods.map((period, idx) => (
                  <div key={idx} className='flex items-center gap-2'>
                    <Input
                      type='time'
                      value={period.open}
                      onChange={e =>
                        updatePeriod(day, idx, 'open', e.target.value)
                      }
                      className='h-9 w-28'
                    />
                    <span className='text-muted-foreground shrink-0'>–</span>
                    <Input
                      type='time'
                      value={period.close}
                      onChange={e =>
                        updatePeriod(day, idx, 'close', e.target.value)
                      }
                      className='h-9 w-28'
                    />
                    {form.openingHours[day].periods.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-9 w-9 shrink-0'
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
      </div>

      <div className='pt-2 flex items-center gap-2'>
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving'
              ? t('saving')
              : saveStatus === 'saved'
                ? t('saved')
                : t('save')}
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('confirmDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
              <AlertDialogAction onClick={performSave}>
                {t('confirmButton')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
