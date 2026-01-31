'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'sonner';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(locale === 'fr' ? 'Accès autorisé' : 'Access granted', {
          description: locale === 'fr' ? 'Redirection...' : 'Redirecting...',
        });
        onSuccess?.();
        if (redirectTo) {
          // When auth-gate is shown via rewrite, browser URL already equals redirectTo.
          // Navigating to same URL can be cached; force reload so cookie is sent.
          const currentPath = window.location.pathname;
          const targetPath = new URL(redirectTo, window.location.origin)
            .pathname;
          if (currentPath === targetPath) {
            window.location.reload();
          } else {
            window.location.href = redirectTo;
          }
        } else {
          window.location.reload();
        }
      } else {
        const message =
          data.error ||
          (locale === 'fr' ? 'Mot de passe invalide' : 'Invalid password');
        toast.error(
          locale === 'fr' ? 'Échec de la connexion' : 'Login failed',
          {
            description: message,
          }
        );
      }
    } catch {
      toast.error(locale === 'fr' ? 'Erreur' : 'Error', {
        description:
          locale === 'fr'
            ? 'Une erreur est survenue. Veuillez réessayer.'
            : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const t = {
    title: locale === 'fr' ? 'Contenu protégé' : 'Protected Content',
    description:
      locale === 'fr'
        ? 'Veuillez entrer vos identifiants pour accéder à ce contenu.'
        : 'Please enter your credentials to access this content.',
    usernameLabel: locale === 'fr' ? "Nom d'utilisateur" : 'Username',
    passwordLabel: locale === 'fr' ? 'Mot de passe' : 'Password',
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
              <Label htmlFor='username'>{t.usernameLabel}</Label>
              <Input
                id='username'
                type='text'
                autoComplete='username'
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>{t.passwordLabel}</Label>
              <Input
                id='password'
                type='password'
                autoComplete='current-password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {t.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
