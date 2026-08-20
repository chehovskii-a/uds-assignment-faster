import {
  cloneElement,
  createContext,
  use,
  useRef,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ReactElement,
  type RefObject,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '#/utils/cn';
import { mergeRefs } from '#/utils/mergeRef';
import { ClearIcon } from '#/icons/clear';

export type InputSize = 'large' | 'medium' | 'small';

interface InputContextValue {
  size: InputSize;
  invalid: boolean;
  disabled: boolean;
  controlRef: RefObject<HTMLInputElement | null>;
}

const InputContext = createContext<InputContextValue>({
  size: 'large',
  invalid: false,
  disabled: false,
  controlRef: { current: null },
});

function useInputContext() {
  const context = use(InputContext);
  if (!context) {
    throw new Error('Input components must be used within an Input.Root');
  }
  return context;
}

type RenderProps = ComponentPropsWithRef<'input'>;
type Render =
  | ReactElement<RenderProps>
  | ((props: RenderProps) => ReactElement<RenderProps>);

const inputRootVariants = cva(
  [
    'flex',
    'w-full',
    'items-center',
    'overflow-hidden',
    'rounded-[4px]',
    'border',
    'border-neutral-300',
    'bg-white',
  ],
  {
    variants: {
      size: {
        large: 'h-10 gap-2 px-3',
        medium: 'h-9 gap-2 px-3',
        small: 'h-6 gap-1 px-2',
      },
      invalid: {
        true: '',
        false: '',
      },
      disabled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        invalid: false,
        disabled: false,
        class: [
          'hover:border-primary-500',
          'focus-within:border-primary-600',
          'focus-within:shadow-[0_0_1px_1px_rgba(21,197,206,0.16)]',
        ],
      },
      {
        invalid: true,
        disabled: false,
        class:
          'border-danger-600 hover:border-danger-600 focus-within:border-danger-600 focus-within:shadow-none',
      },
      {
        disabled: true,
        class:
          'border-neutral-200 bg-neutral-50 hover:border-neutral-200 focus-within:border-neutral-200 focus-within:shadow-none',
      },
    ],
    defaultVariants: {
      size: 'large',
      invalid: false,
      disabled: false,
    },
  },
);

export interface InputRootProps extends ComponentPropsWithoutRef<'div'> {
  size?: InputSize;
  /** Also read by `Input.Control` to set `aria-invalid`. */
  invalid?: boolean;
  /** Also read by `Input.Control` as its default `disabled`. */
  disabled?: boolean;
}

function InputRoot({
  size = 'large',
  invalid = false,
  disabled = false,
  className,
  children,
  ...props
}: InputRootProps) {
  const controlRef = useRef<HTMLInputElement>(null);

  return (
    <InputContext.Provider value={{ size, invalid, disabled, controlRef }}>
      <div
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          inputRootVariants({ size, invalid, disabled }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </InputContext.Provider>
  );
}

const inputControlVariants = cva(
  [
    'min-w-0',
    'flex-1',
    'bg-transparent',
    'font-regular',
    'text-neutral-600',
    'outline-none',
    'placeholder:text-neutral-400',
    'caret-foreground',
    'disabled:text-neutral-400',
    'disabled:placeholder:text-neutral-300',
  ],
  {
    variants: {
      size: {
        large: 'text-subtitle',
        medium: 'text-body',
        small: 'text-caption',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  },
);

export interface InputControlProps
  extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  /** Element composition of the actual `<input>`. */
  render?: Render;
}

function InputControl({
  render,
  className,
  disabled,
  ref,
  ...props
}: InputControlProps) {
  const {
    size,
    invalid,
    disabled: rootDisabled,
    controlRef,
  } = useInputContext();
  const controlProps: RenderProps = {
    ...props,
    ref: mergeRefs(controlRef, ref),
    disabled: disabled ?? rootDisabled,
    'aria-invalid': invalid || undefined,
    className: cn(inputControlVariants({ size }), 'peer', className),
  };

  if (typeof render === 'function') {
    return render(controlProps);
  }
  if (render) {
    return cloneElement(render, controlProps);
  }
  return <input {...controlProps} />;
}

const inputAdornmentVariants = cva(
  ['inline-flex', 'shrink-0', 'items-center', 'justify-center', 'font-regular'],
  {
    variants: {
      size: {
        large: 'text-subtitle',
        medium: 'text-body',
        small: 'text-caption',
      },
      chip: {
        true: 'h-full rounded-[4px] bg-neutral-50 text-neutral-500',
        false: '[&>svg]:size-full text-neutral-500',
      },
      side: {
        start: '',
        end: '',
      },
    },
    compoundVariants: [
      { chip: false, size: 'large', class: 'h-4.5 w-4.5' },
      { chip: false, size: 'medium', class: 'h-4 w-4' },
      { chip: false, size: 'small', class: 'h-3.5 w-3.5' },
      {
        chip: true,
        side: 'start',
        size: 'large',
        class: '-ml-3 px-3 rounded-r-none',
      },
      {
        chip: true,
        side: 'start',
        size: 'medium',
        class: '-ml-3 px-3 rounded-r-none',
      },
      {
        chip: true,
        side: 'start',
        size: 'small',
        class: '-ml-2 px-2 rounded-r-none',
      },
      {
        chip: true,
        side: 'end',
        size: 'large',
        class: '-mr-3 px-3 rounded-l-none',
      },
      {
        chip: true,
        side: 'end',
        size: 'medium',
        class: '-mr-3 px-3 rounded-l-none',
      },
      {
        chip: true,
        side: 'end',
        size: 'small',
        class: '-mr-2 px-2 rounded-l-none',
      },
    ],
    defaultVariants: {
      size: 'large',
      chip: false,
      side: 'start',
    },
  },
);

export interface InputAdornmentProps extends ComponentPropsWithoutRef<'span'> {
  side: 'start' | 'end';
  /** Renders the adornment as a shaded pill, for prefix/suffix content. */
  chip?: boolean;
}

function InputAdornment({
  side,
  chip = false,
  className,
  ...props
}: InputAdornmentProps) {
  const { size } = useInputContext();
  return (
    <span
      data-side={side}
      className={cn(inputAdornmentVariants({ size, chip, side }), className)}
      {...props}
    />
  );
}

export interface InputClearProps extends ComponentPropsWithoutRef<'button'> {
  /** Accessible label for the clear control. @default "Clear input" */
  label?: string;
}

function resetControlValue(control: HTMLInputElement) {
  const setValue = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set;
  setValue?.call(control, '');
  control.dispatchEvent(new Event('input', { bubbles: true }));
}

function InputClear({
  label = 'Clear input',
  className,
  onClick,
  children,
  ...props
}: InputClearProps) {
  const { size, controlRef } = useInputContext();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const control = controlRef.current;
    if (control) {
      resetControlValue(control);
      control.focus();
    }
    onClick?.(event);
  }

  return (
    <button
      type="button"
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={handleClick}
      className={cn(
        inputAdornmentVariants({ size, chip: false, side: 'end' }),
        'hidden cursor-pointer text-neutral-400 hover:text-neutral-500 active:text-neutral-600 peer-[&:focus:not(:placeholder-shown)]:inline-flex',
        className,
      )}
      {...props}
    >
      {children ?? <ClearIcon />}
    </button>
  );
}

export type InputHelpProps = ComponentPropsWithoutRef<'p'>;

function InputHelp({ className, ...props }: InputHelpProps) {
  return (
    <p
      className={cn('mt-1 text-body font-regular text-neutral-500', className)}
      {...props}
    />
  );
}

export type InputErrorProps = ComponentPropsWithoutRef<'p'>;

function InputError({ className, ...props }: InputErrorProps) {
  return (
    <p
      role="alert"
      className={cn('mt-1 text-body font-regular text-danger-600', className)}
      {...props}
    />
  );
}

export const Input = {
  Root: InputRoot,
  Control: InputControl,
  Adornment: InputAdornment,
  Clear: InputClear,
  Help: InputHelp,
  Error: InputError,
};

export default Input;
