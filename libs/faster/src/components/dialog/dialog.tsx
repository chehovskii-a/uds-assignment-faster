import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '#/utils/cn';

export type DialogSize = 'small' | 'medium' | 'large';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeOnBackdrop: boolean;
  titleId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(component: string): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      `<Dialog.${component}> must be rendered inside <Dialog.Root>.`,
    );
  }
  return context;
}

function composeEventHandlers<E>(
  userHandler: ((event: E) => void) | undefined,
  internalHandler: ((event: E) => void) | undefined,
) {
  return (event: E) => {
    userHandler?.(event);
    internalHandler?.(event);
  };
}

type RenderElement = ReactElement<{
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}>;

function getRenderChildren(render: RenderElement): ReactNode {
  return render.props.children;
}

export interface DialogRootProps {
  children: ReactNode;
  /** Controlled open state. Omit for uncontrolled usage via `defaultOpen`. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma behavior: light-dismiss on backdrop click. Default true. */
  closeOnBackdrop?: boolean;
}

function DialogRoot({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnBackdrop = true,
}: DialogRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const titleId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = useMemo<DialogContextValue>(
    () => ({ open, setOpen, closeOnBackdrop, titleId }),
    [open, setOpen, closeOnBackdrop, titleId],
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export interface DialogTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders the trigger behavior onto this element instead of a plain `<button>`. */
  render?: RenderElement;
}

function DialogTrigger({
  render,
  onClick,
  children,
  ...props
}: DialogTriggerProps) {
  const { setOpen } = useDialogContext('Trigger');
  const handleClick = composeEventHandlers<MouseEvent<HTMLButtonElement>>(
    onClick,
    () => setOpen(true),
  );

  if (render) {
    return cloneElement(render, {
      ...props,
      onClick: handleClick,
      children: children ?? getRenderChildren(render),
    });
  }

  return (
    <button type="button" {...props} onClick={handleClick}>
      {children}
    </button>
  );
}

export interface DialogCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders the close behavior onto this element instead of a plain `<button>`. */
  render?: RenderElement;
}

function DialogClose({
  render,
  onClick,
  children,
  ...props
}: DialogCloseProps) {
  const { setOpen } = useDialogContext('Close');
  const handleClick = composeEventHandlers<MouseEvent<HTMLButtonElement>>(
    onClick,
    () => setOpen(false),
  );

  if (render) {
    return cloneElement(render, {
      ...props,
      onClick: handleClick,
      children: children ?? getRenderChildren(render),
    });
  }

  return (
    <button type="button" {...props} onClick={handleClick}>
      {children}
    </button>
  );
}

const dialogContentVariants = cva(
  [
    'fixed',
    'm-0',
    'bg-white',
    'p-6',
    'rounded-[4px]',
    'shadow-elevation-4',
    'max-w-[calc(100vw-32px)]',
    'backdrop:bg-smoke',
  ],
  {
    variants: {
      size: {
        small: ['w-[400px]', 'left-1/2', 'top-[100px]', '-translate-x-1/2'],
        medium: [
          'w-[600px]',
          'left-1/2',
          'top-1/2',
          '-translate-x-1/2',
          '-translate-y-1/2',
        ],
        large: [
          'w-[900px]',
          'left-1/2',
          'top-1/2',
          '-translate-x-1/2',
          '-translate-y-1/2',
        ],
      },
    },
    defaultVariants: {
      size: 'small',
    },
  },
);

export interface DialogContentProps
  extends Omit<ComponentPropsWithoutRef<'dialog'>, 'closedby'> {
  size?: DialogSize;
  closedby?: 'any' | 'closerequest';
}

function DialogContent({
  size = 'small',
  className,
  onClose,
  ...props
}: DialogContentProps) {
  const { open, setOpen, closeOnBackdrop, titleId } =
    useDialogContext('Content');
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) {
      return;
    }

    // jsdom (used by the unit tests) doesn't implement showModal()/close() yet;
    // fall back to the `open` attribute so rendering still reflects state.
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      closedby={closeOnBackdrop ? 'any' : 'closerequest'}
      className={cn(dialogContentVariants({ size }), className)}
      onClose={composeEventHandlers(onClose, () => setOpen(false))}
      {...props}
    />
  );
}

export type DialogTitleProps = ComponentPropsWithoutRef<'h2'>;

function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  const { titleId } = useDialogContext('Title');

  return (
    <h2
      id={titleId}
      className={cn(
        'pr-6 text-title font-medium text-neutral-700 truncate',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export type DialogDescriptionProps = ComponentPropsWithoutRef<'p'>;

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <p
      className={cn('mt-4 text-body font-regular text-neutral-600', className)}
      {...props}
    />
  );
}

export type DialogFooterProps = ComponentPropsWithoutRef<'div'>;

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div className={cn('mt-8 flex justify-end gap-2', className)} {...props} />
  );
}

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose,
};

export default Dialog;
