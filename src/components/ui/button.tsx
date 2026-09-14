'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-primary text-background hover:bg-primary-dim active:scale-98 shadow-card',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-98',
        outline: 'border border-border text-text-secondary hover:text-text-primary hover:bg-background-lift',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-background-lift',
        link: 'text-primary underline-offset-4 hover:underline',
        gold: 'bg-primary text-background font-bold hover:bg-primary-dim active:scale-98 shadow-card',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-14 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
