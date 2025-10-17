import * as React from 'react';
import { cn } from '@/lib/utils';

type ItemProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'outline' | 'muted';
  size?: 'default' | 'sm';
  asChild?: boolean;
};

export function Item(props: ItemProps) {
  const {
    className,
    children,
    variant = 'default',
    size = 'default',
    ...rest
  } = props;
  const base = 'flex items-center gap-3 rounded-md border bg-background';
  const variantClasses =
    variant === 'outline'
      ? 'border-border bg-transparent'
      : variant === 'muted'
        ? 'border-transparent bg-muted'
        : 'border-border';
  const sizeClasses = size === 'sm' ? 'px-2 py-2 text-sm' : 'px-3 py-3';

  return (
    <div className={cn(base, variantClasses, sizeClasses, className)} {...rest}>
      {children}
    </div>
  );
}

export function ItemMedia({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function ItemContent({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex min-w-0 flex-1 flex-col', className)} {...rest}>
      {children}
    </div>
  );
}

export function ItemTitle({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('font-medium', className)} {...rest}>
      {children}
    </div>
  );
}

export function ItemDescription({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-sm text-muted-foreground', className)} {...rest}>
      {children}
    </div>
  );
}

export function ItemActions({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('ml-auto flex items-center gap-2', className)} {...rest}>
      {children}
    </div>
  );
}

export function ItemHeader({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'text-xs uppercase tracking-wide text-muted-foreground',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function ItemFooter({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('pt-2 text-xs text-muted-foreground', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function ItemGroup({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-2', className)} {...rest}>
      {children}
    </div>
  );
}

export function ItemSeparator({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('h-px w-full bg-border', className)} {...rest} />;
}
