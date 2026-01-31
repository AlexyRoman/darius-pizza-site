'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

import { useClosings } from '@/hooks/useClosings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type {
  ClosingsConfig,
  ScheduledClosing,
  EmergencyClosing,
} from '@/types/restaurant-config';

function formatDateForInput(iso: string | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 16);
  } catch {
    return '';
  }
}

function toISOString(val: string): string | null {
  if (!val.trim()) return null;
  try {
    return new Date(val).toISOString();
  } catch {
    return null;
  }
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `item-${Date.now()}`
  );
}

const defaultScheduled: Omit<ScheduledClosing, 'id'> = {
  title: '',
  description: '',
  date: null,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 86400000).toISOString(),
  isRecurring: false,
  isActive: true,
};

const defaultEmergency: Omit<EmergencyClosing, 'id'> = {
  title: '',
  description: '',
  isActive: false,
  startDate: null,
  endDate: null,
  priority: 1,
};

export function ClosingsEditor() {
  const t = useTranslations('dashboard.closings');
  const locale = useLocale();
  const { data, loading, refetch } = useClosings(locale);
  const [form, setForm] = useState<ClosingsConfig | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [addScheduledOpen, setAddScheduledOpen] = useState(false);
  const [addEmergencyOpen, setAddEmergencyOpen] = useState(false);
  const [removeIndex, setRemoveIndex] = useState<{
    type: 'scheduled' | 'emergency';
    index: number;
  } | null>(null);

  const [newScheduled, setNewScheduled] = useState<ScheduledClosing>({
    ...defaultScheduled,
    id: '',
  });
  const [newEmergency, setNewEmergency] = useState<EmergencyClosing>({
    ...defaultEmergency,
    id: '',
  });

  useEffect(() => {
    if (data) setForm(structuredClone(data));
  }, [data]);

  const updateScheduled = (
    index: number,
    updater: (s: ScheduledClosing) => ScheduledClosing
  ) => {
    if (!form) return;
    setForm({
      ...form,
      scheduledClosings: form.scheduledClosings.map((s, i) =>
        i === index ? updater(s) : s
      ),
    });
  };

  const updateEmergency = (
    index: number,
    updater: (e: EmergencyClosing) => EmergencyClosing
  ) => {
    if (!form) return;
    setForm({
      ...form,
      emergencyClosings: form.emergencyClosings.map((e, i) =>
        i === index ? updater(e) : e
      ),
    });
  };

  const addScheduled = () => {
    const id =
      newScheduled.id.trim() ||
      slugify(newScheduled.title) ||
      `scheduled-${Date.now()}`;
    if (!form) return;
    const exists = form.scheduledClosings.some(s => s.id === id);
    if (exists) {
      toast.error(t('error'));
      return;
    }
    setForm({
      ...form,
      scheduledClosings: [...form.scheduledClosings, { ...newScheduled, id }],
    });
    setNewScheduled({ ...defaultScheduled, id: '' });
    setAddScheduledOpen(false);
  };

  const addEmergency = () => {
    const id =
      newEmergency.id.trim() ||
      slugify(newEmergency.title) ||
      `emergency-${Date.now()}`;
    if (!form) return;
    const exists = form.emergencyClosings.some(e => e.id === id);
    if (exists) {
      toast.error(t('error'));
      return;
    }
    setForm({
      ...form,
      emergencyClosings: [...form.emergencyClosings, { ...newEmergency, id }],
    });
    setNewEmergency({ ...defaultEmergency, id: '' });
    setAddEmergencyOpen(false);
  };

  const removeItem = () => {
    if (!form || !removeIndex) return;
    if (removeIndex.type === 'scheduled') {
      setForm({
        ...form,
        scheduledClosings: form.scheduledClosings.filter(
          (_, i) => i !== removeIndex.index
        ),
      });
    } else {
      setForm({
        ...form,
        emergencyClosings: form.emergencyClosings.filter(
          (_, i) => i !== removeIndex.index
        ),
      });
    }
    setRemoveIndex(null);
  };

  const performSave = async () => {
    if (!form) return;
    setConfirmOpen(false);
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/closings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t('error'));
      setSaveStatus('saved');
      await refetch();
      toast.success(t('saved'));
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
    <div className='space-y-8'>
      <p className='text-sm text-muted-foreground'>{t('description')}</p>

      <div className='space-y-6'>
        <div>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='font-medium'>{t('scheduled')}</h3>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setAddScheduledOpen(true)}
            >
              <Plus className='size-4' />
              {t('addScheduled')}
            </Button>
          </div>
          <div className='space-y-4'>
            {form.scheduledClosings.map((item, idx) => (
              <div key={item.id} className='rounded-lg border p-4 space-y-3'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground text-sm font-mono'>
                      {item.id}
                    </span>
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={v =>
                        updateScheduled(idx, s => ({ ...s, isActive: v }))
                      }
                    />
                    <Label className='text-sm'>{t('isActive')}</Label>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-8 text-destructive hover:text-destructive'
                    onClick={() =>
                      setRemoveIndex({ type: 'scheduled', index: idx })
                    }
                    aria-label={t('remove')}
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
                <div className='grid gap-2 sm:grid-cols-2'>
                  <div>
                    <Label>{t('title')}</Label>
                    <Input
                      value={item.title}
                      onChange={e =>
                        updateScheduled(idx, s => ({
                          ...s,
                          title: e.target.value,
                        }))
                      }
                      className='mt-1'
                    />
                  </div>
                </div>
                <div>
                  <Label>{t('descriptionField')}</Label>
                  <Textarea
                    value={item.description}
                    onChange={e =>
                      updateScheduled(idx, s => ({
                        ...s,
                        description: e.target.value,
                      }))
                    }
                    className='mt-1 min-h-[80px]'
                  />
                </div>
                <div className='grid gap-2 sm:grid-cols-2'>
                  <div className='min-w-0'>
                    <Label>{t('startDate')}</Label>
                    <Input
                      type='datetime-local'
                      value={formatDateForInput(item.startDate)}
                      onChange={e =>
                        updateScheduled(idx, s => ({
                          ...s,
                          startDate: toISOString(e.target.value) || s.startDate,
                        }))
                      }
                      className='mt-1 min-w-[14rem] w-full'
                    />
                  </div>
                  <div className='min-w-0'>
                    <Label>{t('endDate')}</Label>
                    <Input
                      type='datetime-local'
                      value={formatDateForInput(item.endDate)}
                      onChange={e =>
                        updateScheduled(idx, s => ({
                          ...s,
                          endDate: toISOString(e.target.value) || s.endDate,
                        }))
                      }
                      className='mt-1 min-w-[14rem] w-full'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='font-medium'>{t('emergency')}</h3>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setAddEmergencyOpen(true)}
            >
              <Plus className='size-4' />
              {t('addEmergency')}
            </Button>
          </div>
          <div className='space-y-4'>
            {form.emergencyClosings.map((item, idx) => (
              <div key={item.id} className='rounded-lg border p-4 space-y-3'>
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground text-sm font-mono'>
                      {item.id}
                    </span>
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={v =>
                        updateEmergency(idx, e => ({ ...e, isActive: v }))
                      }
                    />
                    <Label className='text-sm'>{t('isActive')}</Label>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-8 text-destructive hover:text-destructive'
                    onClick={() =>
                      setRemoveIndex({ type: 'emergency', index: idx })
                    }
                    aria-label={t('remove')}
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
                <div className='grid gap-2 sm:grid-cols-2'>
                  <div>
                    <Label>{t('title')}</Label>
                    <Input
                      value={item.title}
                      onChange={e =>
                        updateEmergency(idx, s => ({
                          ...s,
                          title: e.target.value,
                        }))
                      }
                      className='mt-1'
                    />
                  </div>
                  <div>
                    <Label>{t('priority')}</Label>
                    <Input
                      type='number'
                      value={item.priority}
                      onChange={e =>
                        updateEmergency(idx, s => ({
                          ...s,
                          priority: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className='mt-1'
                    />
                  </div>
                </div>
                <div>
                  <Label>{t('descriptionField')}</Label>
                  <Textarea
                    value={item.description}
                    onChange={e =>
                      updateEmergency(idx, s => ({
                        ...s,
                        description: e.target.value,
                      }))
                    }
                    className='mt-1 min-h-[80px]'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Scheduled Dialog */}
      <Dialog open={addScheduledOpen} onOpenChange={setAddScheduledOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addScheduledTitle')}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div>
              <Label>{t('idPlaceholder')}</Label>
              <Input
                value={newScheduled.id}
                onChange={e =>
                  setNewScheduled(s => ({ ...s, id: e.target.value }))
                }
                placeholder='e.g. christmas-2025'
                className='mt-1'
              />
            </div>
            <div>
              <Label>{t('title')}</Label>
              <Input
                value={newScheduled.title}
                onChange={e =>
                  setNewScheduled(s => ({ ...s, title: e.target.value }))
                }
                className='mt-1'
              />
            </div>
            <div>
              <Label>{t('descriptionField')}</Label>
              <Textarea
                value={newScheduled.description}
                onChange={e =>
                  setNewScheduled(s => ({ ...s, description: e.target.value }))
                }
                className='mt-1 min-h-[80px]'
              />
            </div>
            <div className='grid gap-2 sm:grid-cols-2'>
              <div className='min-w-0'>
                <Label>{t('startDate')}</Label>
                <Input
                  type='datetime-local'
                  value={formatDateForInput(newScheduled.startDate)}
                  onChange={e =>
                    setNewScheduled(s => ({
                      ...s,
                      startDate: toISOString(e.target.value) || s.startDate,
                    }))
                  }
                  className='mt-1 min-w-[14rem] w-full'
                />
              </div>
              <div className='min-w-0'>
                <Label>{t('endDate')}</Label>
                <Input
                  type='datetime-local'
                  value={formatDateForInput(newScheduled.endDate)}
                  onChange={e =>
                    setNewScheduled(s => ({
                      ...s,
                      endDate: toISOString(e.target.value) || s.endDate,
                    }))
                  }
                  className='mt-1 min-w-[14rem] w-full'
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Switch
                checked={newScheduled.isActive}
                onCheckedChange={v =>
                  setNewScheduled(s => ({ ...s, isActive: v }))
                }
              />
              <Label>{t('isActive')}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setAddScheduledOpen(false)}
            >
              {t('cancelButton')}
            </Button>
            <Button onClick={addScheduled}>{t('add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Emergency Dialog */}
      <Dialog open={addEmergencyOpen} onOpenChange={setAddEmergencyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addEmergencyTitle')}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div>
              <Label>{t('idLabel')}</Label>
              <Input
                value={newEmergency.id}
                onChange={e =>
                  setNewEmergency(s => ({ ...s, id: e.target.value }))
                }
                placeholder={t('idPlaceholder')}
                className='mt-1'
              />
            </div>
            <div>
              <Label>{t('title')}</Label>
              <Input
                value={newEmergency.title}
                onChange={e =>
                  setNewEmergency(s => ({ ...s, title: e.target.value }))
                }
                className='mt-1'
              />
            </div>
            <div>
              <Label>{t('descriptionField')}</Label>
              <Textarea
                value={newEmergency.description}
                onChange={e =>
                  setNewEmergency(s => ({ ...s, description: e.target.value }))
                }
                className='mt-1 min-h-[80px]'
              />
            </div>
            <div>
              <Label>{t('priority')}</Label>
              <Input
                type='number'
                value={newEmergency.priority}
                onChange={e =>
                  setNewEmergency(s => ({
                    ...s,
                    priority: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className='mt-1'
              />
            </div>
            <div className='flex items-center gap-2'>
              <Switch
                checked={newEmergency.isActive}
                onCheckedChange={v =>
                  setNewEmergency(s => ({ ...s, isActive: v }))
                }
              />
              <Label>{t('isActive')}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setAddEmergencyOpen(false)}
            >
              {t('cancelButton')}
            </Button>
            <Button onClick={addEmergency}>{t('add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <AlertDialog
        open={!!removeIndex}
        onOpenChange={open => !open && setRemoveIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('removeConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeItem}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {t('remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
