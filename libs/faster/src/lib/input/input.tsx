import {
  cloneElement,
  useId,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../cn';

export type InputSize = 'large' | 'medium' | 'small';

export interface InputState {
  disabled: boolean;
  invalid: boolean;
  filled: boolean;
  focused: boolean;
}

type RenderProps = ComponentPropsWithRef<'input'>;
type RenderElement = ReactElement<RenderProps>;
type Render = RenderElement | ((props: RenderProps, state: InputState) => RenderElement);

const inputRootVariants = cva(
  ['flex', 'w-full', 'items-center', 'overflow-hidden', 'rounded-[4px]', 'border', 'border-neutral-300', 'bg-white'],
  {
    variants: {
      size: {
        large: 'h-10',
        medium: 'h-9',
        small: 'h-6',
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
      // Default → Hover → Focus, only when neither invalid nor disabled.
      {
        invalid: false,
        disabled: false,
        class: [
          'hover:border-primary-500',
          'focus-within:border-primary-600',
          'focus-within:shadow-[0_0_1px_1px_rgba(21,197,206,0.16)]',
        ],
      },
      // Invalid wins over hover/focus, but not over disabled.
      { invalid: true, disabled: false, class: 'border-danger-600 hover:border-danger-600 focus-within:border-danger-600 focus-within:shadow-none' },
      // Disabled wins over everything.
      { disabled: true, class: 'border-neutral-200 bg-neutral-50 hover:border-neutral-200 focus-within:border-neutral-200 focus-within:shadow-none' },
    ],
    defaultVariants: {
      size: 'large',
      invalid: false,
      disabled: false,
    },
  },
);

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

const inputIconVariants = cva(['inline-flex', 'shrink-0', 'items-center', 'justify-center', '[&>svg]:size-full'], {
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
});

const inputClearVariants = cva(
  ['inline-flex', 'shrink-0', 'cursor-pointer', 'items-center', 'justify-center', '[&>svg]:size-full'],
  {
    variants: {
      size: {
        large: 'w-4 h-4',
        medium: 'w-3.5 h-3.5',
        small: 'w-3 h-3',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  },
);

const inputAffixVariants = cva(
  ['inline-flex', 'h-full', 'shrink-0', 'items-center', 'font-regular', 'text-neutral-500'],
  {
    variants: {
      size: {
        large: 'text-subtitle py-2 px-3',
        medium: 'text-body py-[7px] px-3',
        small: 'text-caption py-[3px] px-2',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  },
);

// Structural row geometry: edge-padding + icon box + gap reproduces the Figma text-left/text-right
// offsets exactly (e.g. large: 12 + 18 + 8 = 38px) instead of hardcoding that 38px directly. When an
// affix occupies an edge, its own inner padding supplies the equivalent spacing, so the row omits its
// edge padding on that side.
const ROW_GAP: Record<InputSize, string> = { large: 'gap-2', medium: 'gap-2', small: 'gap-1' };
const ROW_EDGE_PADDING: Record<InputSize, { start: string; end: string }> = {
  large: { start: 'pl-3', end: 'pr-3' },
  medium: { start: 'pl-3', end: 'pr-3' },
  small: { start: 'pl-2', end: 'pr-2' },
};

const helpTextVariants = cva(['mt-1'], {
  variants: {
    size: {
      large: 'text-body font-regular',
      medium: 'text-body font-regular',
      small: 'text-caption font-regular',
    },
    invalid: {
      true: 'text-danger-600',
      false: 'text-neutral-500',
    },
  },
  defaultVariants: {
    size: 'large',
    invalid: false,
  },
});

// Only one end adornment is design-specified at a time; warn in development so
// unsupported combinations are caught early rather than silently overlapping.
function warnOnUnsupportedAdornments(props: {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
}) {
  if (typeof process !== 'undefined' && process.env?.['NODE_ENV'] === 'production') {
    return;
  }

  const endAdornments = [
    props.rightIcon && 'rightIcon',
    props.suffix && 'suffix',
    props.clearable && 'clearable',
  ].filter(Boolean);

  if (endAdornments.length > 1) {
    console.warn(
      `Input: only one end adornment is design-specified at a time, got [${endAdornments.join(', ')}].`,
    );
  }

  if ((props.leftIcon && props.prefix) || (props.rightIcon && props.suffix)) {
    console.warn('Input: icons and affixes are not combined in the design on the same side.');
  }
}

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'> {
  size?: InputSize;
  /** Marks the field invalid. Also sets `aria-invalid`. */
  invalid?: boolean;
  /** Optional supporting/error message rendered below the field. */
  helpText?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Shows a clear control while focused and non-empty. */
  clearable?: boolean;
  /** Caller-supplied clear glyph. */
  clearIcon?: ReactNode;
  /** Accessible label for the clear control. @default "Clear input" */
  clearLabel?: string;
  /** Called whenever the textual value changes. */
  onValueChange?: (value: string) => void;
  /** Called when the clear control is activated. */
  onClear?: () => void;
  /** Element composition of the actual `<input>`. */
  render?: Render;
  /** Styles the visual field shell (the bordered box), as opposed to `className`, which targets the `<input>`. */
  rootClassName?: string;
}

export function Input({
  size = 'large',
  invalid = false,
  helpText,
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  clearable = false,
  clearIcon,
  clearLabel = 'Clear input',
  onValueChange,
  onClear,
  render,
  rootClassName,
  className,
  disabled,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  'aria-describedby': ariaDescribedBy,
  ...props
}: InputProps) {
  warnOnUnsupportedAdornments({ leftIcon, rightIcon, prefix, suffix, clearable });

  const isDisabled = Boolean(disabled);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const currentValue = isControlled ? value : uncontrolledValue;
  const [focused, setFocused] = useState(false);
  const filled = currentValue !== undefined && currentValue !== null && String(currentValue).length > 0;

  const helpTextId = useId();
  const describedBy = helpText
    ? [ariaDescribedBy, helpTextId].filter(Boolean).join(' ')
    : ariaDescribedBy;

  const state: InputState = { disabled: isDisabled, invalid, filled, focused };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
    onValueChange?.(event.target.value);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleClear = () => {
    if (!isControlled) {
      setUncontrolledValue('');
    }
    onValueChange?.('');
    onClear?.();
  };

  const showClear = clearable && focused && filled && !isDisabled;

  const controlClassName = cn(inputControlVariants({ size }), className);

  // Internally always controlled (via `currentValue`) so `onClear` can reset the field even in the
  // caller-uncontrolled case — an uncontrolled native `<input>` can't be cleared by re-rendering alone.
  const controlProps: RenderProps = {
    ...props,
    value: currentValue,
    disabled: isDisabled,
    className: controlClassName,
    'aria-invalid': invalid || undefined,
    'aria-describedby': describedBy,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const control =
    typeof render === 'function' ? (
      render(controlProps, state)
    ) : render ? (
      cloneElement(render, controlProps)
    ) : (
      <input {...controlProps} />
    );

  const edge = ROW_EDGE_PADDING[size];
  const hasStartAdornment = Boolean(prefix || leftIcon);
  const endAdornment = showClear ? 'clear' : suffix ? 'suffix' : rightIcon ? 'icon' : null;

  return (
    <div>
      <div
        data-disabled={isDisabled || undefined}
        data-invalid={invalid || undefined}
        data-filled={filled || undefined}
        data-focused={focused || undefined}
        className={cn(inputRootVariants({ size, invalid, disabled: isDisabled }), rootClassName)}
      >
        {prefix && <span className={cn(inputAffixVariants({ size }))}>{prefix}</span>}
        {leftIcon && !prefix && (
          <span aria-hidden className={cn(edge.start, inputIconVariants({ size }))}>
            {leftIcon}
          </span>
        )}
        <div
          className={cn(
            'flex min-w-0 flex-1 items-center',
            ROW_GAP[size],
            !hasStartAdornment && edge.start,
            !endAdornment && edge.end,
          )}
        >
          {control}
        </div>
        {endAdornment === 'clear' && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={handleClear}
            className={cn(edge.end, inputClearVariants({ size }))}
          >
            {clearIcon}
          </button>
        )}
        {endAdornment === 'icon' && (
          <span aria-hidden className={cn(edge.end, inputIconVariants({ size }))}>
            {rightIcon}
          </span>
        )}
        {endAdornment === 'suffix' && <span className={cn(inputAffixVariants({ size }))}>{suffix}</span>}
      </div>
      {helpText && (
        <p id={helpTextId} className={cn(helpTextVariants({ size, invalid }))}>
          {helpText}
        </p>
      )}
    </div>
  );
}

export default Input;
