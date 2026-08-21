import {
  cloneElement,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '#/utils/cn';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'large' | 'medium' | 'small';

export interface ButtonState {
  disabled: boolean;
}

type RenderProps = ComponentPropsWithRef<'button'>;
type RenderElement = ReactElement<{ children?: ReactNode }>;
type Render =
  | RenderElement
  | ((props: RenderProps, state: ButtonState) => RenderElement);

export const buttonVariants = cva(
  [
    'inline-flex',
    'shrink-0',
    'items-center',
    'justify-center',
    'whitespace-nowrap',
    'rounded-[8px]',
    'outline-none',
    'transition-colors',
    'aria-disabled:cursor-default',
    'not-aria-disabled:cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-600',
          'text-white',
          'font-medium',
          'not-aria-disabled:hover:bg-primary-500',
          'not-aria-disabled:active:bg-primary-700',
          'aria-disabled:bg-primary-300',
        ],
        outline: [
          'border',
          'border-neutral-300',
          'bg-white',
          'text-neutral-600',
          'font-regular',
          'not-aria-disabled:hover:border-primary-500',
          'not-aria-disabled:hover:text-primary-500',
          'not-aria-disabled:active:border-primary-700',
          'not-aria-disabled:active:text-primary-700',
          'aria-disabled:border-neutral-200',
          'aria-disabled:text-neutral-400',
        ],
        ghost: [
          'bg-transparent',
          'text-neutral-600',
          'font-regular',
          'not-aria-disabled:hover:bg-neutral-100',
          'not-aria-disabled:active:bg-neutral-300',
          'aria-disabled:text-neutral-400',
        ],
        link: [
          'bg-transparent',
          'p-0',
          'min-w-0',
          'text-primary-600',
          'font-regular',
          'not-aria-disabled:hover:text-primary-500',
          'not-aria-disabled:active:text-primary-700',
          'aria-disabled:text-primary-400',
        ],
      },
      size: {
        large: 'h-10 px-2 rounded-[30px]',
        medium: 'h-9 px-2 rounded-[20px]',
        small: 'h-6 px-1 rounded-[10px]',
      },
    },
    compoundVariants: [
      { variant: 'link', size: 'large', class: 'h-6' },
      { variant: 'link', size: 'medium', class: 'h-5.5' },
      { variant: 'link', size: 'small', class: 'h-4.5' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'large',
    },
  },
);

const buttonContentVariants = cva(
  ['inline-flex', 'items-center', 'justify-center', 'gap-1'],
  {
    variants: {
      size: {
        large: 'text-subtitle',
        medium: 'text-body',
        small: 'text-caption',
      },
      isLink: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { isLink: false, size: 'large', class: 'min-w-22.5' },
      { isLink: false, size: 'medium', class: 'min-w-20.5' },
      { isLink: false, size: 'small', class: 'min-w-13.5' },
    ],
    defaultVariants: {
      size: 'large',
      isLink: false,
    },
  },
);

const buttonIconVariants = cva(
  [
    'inline-flex',
    'shrink-0',
    'items-center',
    'justify-center',
    '[&>svg]:size-full',
  ],
  {
    variants: {
      size: {
        large: 'w-4.5 h-4.5',
        medium: 'w-4 h-4',
        small: 'w-3.5 h-3.5',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  },
);

export interface ButtonProps
  extends Omit<ComponentPropsWithRef<'button'>, 'size'>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Element composition: a `ReactElement` or a `(props, state) => ReactElement`. */
  render?: Render;
  /** Whether the rendered element is a native `<button>`. Set to `false` when `render` isn't a button. */
  nativeButton?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'large',
  leftIcon,
  rightIcon,
  render,
  nativeButton = true,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled);
  const isLink = variant === 'link';
  const state: ButtonState = { disabled: isDisabled };

  const rootClassName = cn(buttonVariants({ variant, size }), className);

  const rootProps: RenderProps = {
    ...props,
    className: rootClassName,
    'aria-disabled': isDisabled || undefined,
    disabled: nativeButton && isDisabled,
    ...(nativeButton ? { type } : {}),
  };

  const content = (
    <span className={cn(buttonContentVariants({ size, isLink }))}>
      {leftIcon && (
        <span aria-hidden className={cn(buttonIconVariants({ size }))}>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span aria-hidden className={cn(buttonIconVariants({ size }))}>
          {rightIcon}
        </span>
      )}
    </span>
  );

  if (typeof render === 'function') {
    return render(rootProps, state);
  }

  if (render) {
    return cloneElement(render, { ...rootProps, children: content });
  }

  return <button {...rootProps}>{content}</button>;
}

export default Button;
