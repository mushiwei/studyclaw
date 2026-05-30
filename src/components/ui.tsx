import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] hover:-translate-y-0.5 hover:bg-slate-900',
        secondary:
          'border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50',
        emerald:
          'bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.16)] hover:-translate-y-0.5 hover:bg-emerald-700',
        amber:
          'bg-amber-500 text-white shadow-[0_10px_24px_rgba(217,119,6,0.16)] hover:-translate-y-0.5 hover:bg-amber-600',
        ghost:
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      },
      size: {
        sm: 'min-h-9 px-3 py-2 text-xs',
        md: 'min-h-11 px-4 py-2.5',
        lg: 'min-h-12 px-6 py-3 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function Badge({
  className,
  tone = 'blue',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'blue' | 'emerald' | 'amber' | 'slate';
}) {
  const tones = {
    blue: 'border border-blue-100 bg-blue-50 text-blue-700',
    emerald: 'border border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border border-amber-100 bg-amber-50 text-amber-700',
    slate: 'border border-slate-200 bg-slate-50 text-slate-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.01em]',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }
>(function Card({ className, glow = false, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-[28px] border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02),0_12px_32px_rgba(15,23,42,0.04)]',
        glow && 'shadow-[0_1px_2px_rgba(15,23,42,0.02),0_18px_48px_rgba(15,23,42,0.06)]',
        className
      )}
      {...props}
    />
  );
});

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2 p-6', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cn('space-y-2', align === 'center' && 'text-center')}>
      {eyebrow ? <div>{eyebrow}</div> : null}
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-7 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-[0.01em] text-slate-700', className)} {...props} />;
}

const fieldBase =
  'min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100';

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, className)} {...props}>
      {children}
    </select>
  );
}
