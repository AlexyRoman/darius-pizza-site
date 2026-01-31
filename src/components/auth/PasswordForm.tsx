'use client';

import { useState, FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type PasswordFormProps = {
  onSuccess?: () => void;
  locale?: string;
  /** After successful auth, go here instead of reloading. */
  redirectTo?: string;
};

export function PasswordForm({
  onSuccess,
  locale = 'en',
  redirectTo,
}: PasswordFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess?.();
        if (redirectTo) {
          window.location.href = redirectTo;
        } else {
          window.location.reload();
        }
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const t = {
    title: locale === 'fr' ? 'Contenu protégé' : 'Protected Content',
    description:
      locale === 'fr'
        ? 'Veuillez entrer le mot de passe pour accéder à ce contenu.'
        : 'Please enter the password to access this content.',
    label: locale === 'fr' ? 'Mot de passe' : 'Password',
    submit: loading
      ? locale === 'fr'
        ? 'Vérification...'
        : 'Checking...'
      : locale === 'fr'
        ? 'Accéder'
        : 'Access',
  };

  return (
    <div className='mx-auto flex min-h-[60vh] w-full max-w-md items-center justify-center px-4'>
      <Card className='w-full'>
        <CardHeader className='space-y-2 text-center'>
          <CardTitle className='text-2xl'>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='password'>{t.label}</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
                {error}
              </div>
            )}

            <Button type='submit' className='w-full' disabled={loading}>
              {t.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
