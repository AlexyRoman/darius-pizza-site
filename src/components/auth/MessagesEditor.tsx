'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

import { useMessages } from '@/hooks/useMessages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

import type { MessagesConfig, SpecialMessage } from '@/types/restaurant-config';

const MESSAGE_TYPES = ['info', 'warning', 'error', 'success'] as const;

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
      .replace(/^-|-$/g, '') || `message-${Date.now()}`
  );
}

const defaultMessage: Omit<SpecialMessage, 'id'> = {
  type: 'info',
  title: '',
  message: '',
  isActive: true,
  startDate: new Date().toISOString(),
  endDate: null,
  priority: 1,
};

export function MessagesEditor() {
  const t = useTranslations('dashboard.messages');
  const locale = useLocale();
  const { data, loading, refetch } = useMessages(locale);
  const [form, setForm] = useState<MessagesConfig | null>(null);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState<SpecialMessage>({
    ...defaultMessage,
    id: '',
  });

  useEffect(() => {
    if (data) setForm(structuredClone(data));
  }, [data]);

  const updateMessage = (
    index: number,
    updater: (m: SpecialMessage) => SpecialMessage
  ) => {
    if (!form) return;
    setForm({
      ...form,
      specialMessages: form.specialMessages.map((m, i) =>
        i === index ? updater(m) : m
      ),
    });
  };

  const addMessage = () => {
    const id =
      newMessage.id.trim() ||
      slugify(newMessage.title) ||
      `message-${Date.now()}`;
    if (!form) return;
    const exists = form.specialMessages.some(m => m.id === id);
    if (exists) {
      toast.error(t('error'));
      return;
    }
    setForm({
      ...form,
      specialMessages: [...form.specialMessages, { ...newMessage, id }],
    });
    setNewMessage({ ...defaultMessage, id: '' });
    setAddOpen(false);
  };

  const removeItem = () => {
    if (!form || removeIndex === null) return;
    setForm({
      ...form,
      specialMessages: form.specialMessages.filter((_, i) => i !== removeIndex),
    });
    setRemoveIndex(null);
  };

  const performSave = async () => {
    if (!form) return;
    setConfirmOpen(false);
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/messages', {
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
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{t('description')}</p>
        <Button variant='outline' size='sm' onClick={() => setAddOpen(true)}>
          <Plus className='size-4' />
          {t('addMessage')}
        </Button>
      </div>

      <div className='space-y-6'>
        {form.specialMessages.map((item, idx) => (
          <div key={item.id} className='rounded-lg border p-4 space-y-3'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground text-sm font-mono'>
                  {item.id}
                </span>
                <Switch
                  checked={item.isActive}
                  onCheckedChange={v =>
                    updateMessage(idx, m => ({ ...m, isActive: v }))
                  }
                />
                <Label className='text-sm'>{t('isActive')}</Label>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='size-8 text-destructive hover:text-destructive'
                onClick={() => setRemoveIndex(idx)}
                aria-label={t('remove')}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
            <div>
              <Label>{t('title')}</Label>
              <Input
                value={item.title}
                onChange={e =>
                  updateMessage(idx, m => ({ ...m, title: e.target.value }))
                }
                className='mt-1'
              />
            </div>
            <div className='grid gap-2 sm:grid-cols-2'>
              <div>
                <Label>{t('type')}</Label>
                <Select
                  value={item.type}
                  onValueChange={v =>
                    updateMessage(idx, m => ({
                      ...m,
                      type: v as SpecialMessage['type'],
                    }))
                  }
                >
                  <SelectTrigger className='mt-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side='top' className='z-[110]'>
                    {MESSAGE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {t(
                          `type${type.charAt(0).toUpperCase() + type.slice(1)}`
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('priority')}</Label>
                <div className='mt-1 flex items-center gap-1'>
                  <Input
                    type='number'
                    min={0}
                    value={item.priority}
                    onChange={e =>
                      updateMessage(idx, m => ({
                        ...m,
                        priority: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className='h-9 w-14 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                  />
                  <div className='flex h-9 flex-col justify-between'>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='h-[17px] w-6 shrink-0 rounded-b-none border-b-0 p-0'
                      onClick={() =>
                        updateMessage(idx, m => ({
                          ...m,
                          priority: Math.max(0, m.priority + 1),
                        }))
                      }
                      aria-label='Increase priority'
                    >
                      <ChevronUp className='size-3' />
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='h-[17px] w-6 shrink-0 rounded-t-none p-0'
                      onClick={() =>
                        updateMessage(idx, m => ({
                          ...m,
                          priority: Math.max(0, m.priority - 1),
                        }))
                      }
                      aria-label='Decrease priority'
                    >
                      <ChevronDown className='size-3' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label>{t('message')}</Label>
              <Textarea
                value={item.message}
                onChange={e =>
                  updateMessage(idx, m => ({ ...m, message: e.target.value }))
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
                    updateMessage(idx, m => ({
                      ...m,
                      startDate: toISOString(e.target.value) || m.startDate,
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
                    updateMessage(idx, m => ({
                      ...m,
                      endDate: toISOString(e.target.value) || null,
                    }))
                  }
                  className='mt-1 min-w-[14rem] w-full'
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Message Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('addMessageTitle')}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div>
              <Label>{t('idLabel')}</Label>
              <Input
                value={newMessage.id}
                onChange={e =>
                  setNewMessage(m => ({ ...m, id: e.target.value }))
                }
                placeholder={t('idPlaceholder')}
                className='mt-1'
              />
            </div>
            <div>
              <Label>{t('title')}</Label>
              <Input
                value={newMessage.title}
                onChange={e =>
                  setNewMessage(m => ({ ...m, title: e.target.value }))
                }
                className='mt-1'
              />
            </div>
            <div className='grid gap-2 sm:grid-cols-2'>
              <div>
                <Label>{t('type')}</Label>
                <Select
                  value={newMessage.type}
                  onValueChange={v =>
                    setNewMessage(m => ({
                      ...m,
                      type: v as SpecialMessage['type'],
                    }))
                  }
                >
                  <SelectTrigger className='mt-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side='top' className='z-[110]'>
                    {MESSAGE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {t(
                          `type${type.charAt(0).toUpperCase() + type.slice(1)}`
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('priority')}</Label>
                <div className='mt-1 flex items-center gap-1'>
                  <Input
                    type='number'
                    min={0}
                    value={newMessage.priority}
                    onChange={e =>
                      setNewMessage(m => ({
                        ...m,
                        priority: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    className='h-9 w-14 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                  />
                  <div className='flex h-9 flex-col justify-between'>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='h-[17px] w-6 shrink-0 rounded-b-none border-b-0 p-0'
                      onClick={() =>
                        setNewMessage(m => ({
                          ...m,
                          priority: Math.max(0, m.priority + 1),
                        }))
                      }
                      aria-label='Increase priority'
                    >
                      <ChevronUp className='size-3' />
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      className='h-[17px] w-6 shrink-0 rounded-t-none p-0'
                      onClick={() =>
                        setNewMessage(m => ({
                          ...m,
                          priority: Math.max(0, m.priority - 1),
                        }))
                      }
                      aria-label='Decrease priority'
                    >
                      <ChevronDown className='size-3' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label>{t('message')}</Label>
              <Textarea
                value={newMessage.message}
                onChange={e =>
                  setNewMessage(m => ({ ...m, message: e.target.value }))
                }
                className='mt-1 min-h-[80px]'
              />
            </div>
            <div className='grid gap-2 sm:grid-cols-2'>
              <div className='min-w-0'>
                <Label>{t('startDate')}</Label>
                <Input
                  type='datetime-local'
                  value={formatDateForInput(newMessage.startDate)}
                  onChange={e =>
                    setNewMessage(m => ({
                      ...m,
                      startDate: toISOString(e.target.value) || m.startDate,
                    }))
                  }
                  className='mt-1 min-w-[14rem] w-full'
                />
              </div>
              <div className='min-w-0'>
                <Label>{t('endDate')}</Label>
                <Input
                  type='datetime-local'
                  value={formatDateForInput(newMessage.endDate)}
                  onChange={e =>
                    setNewMessage(m => ({
                      ...m,
                      endDate: toISOString(e.target.value) || null,
                    }))
                  }
                  className='mt-1 min-w-[14rem] w-full'
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Switch
                checked={newMessage.isActive}
                onCheckedChange={v =>
                  setNewMessage(m => ({ ...m, isActive: v }))
                }
              />
              <Label>{t('isActive')}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setAddOpen(false)}>
              {t('cancelButton')}
            </Button>
            <Button onClick={addMessage}>{t('add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <AlertDialog
        open={removeIndex !== null}
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
