# Dialog — Design Requirements

Source of truth: TapTap Design System (Figma)
File: `lXoWsgMekR00jKGtXIffk0` · Page node: `13:11412`

| Component set | Figma node | Variant axes |
| --- | --- | --- |
| Basic | `13:11504` | Size (3 variants) |

| Variant | Node |
| --- | --- |
| `Size=Small` | `13:11529` |
| `Size=Medium` | `13:11517` |
| `Size=Large` | `13:11505` |

There is a single axis — `Size`. Open/closed is not modeled in Figma; the design shows the open state
including the backdrop.

## Public API

```tsx
function DeleteProjectDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="ghost" />}>Delete project</Dialog.Trigger>
      <Dialog.Content size="small">
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Close aria-label="Close" render={<IconButton />}>
          <CloseIcon />
        </Dialog.Close>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost" size="medium" />}>Cancel</Dialog.Close>
          <Dialog.Close render={<Button variant="primary" size="medium" />} onClick={deleteProject}>
            Delete
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Props

```ts
type DialogSize = 'small' | 'medium' | 'large';

interface DialogRootProps {
  children: React.ReactNode;
  open?: boolean;                          // controlled mode
  defaultOpen?: boolean;                   // uncontrolled mode, default false
  onOpenChange?: (open: boolean) => void;
  closeOnBackdrop?: boolean;                // Figma behavior: true by default
}

interface DialogContentProps extends React.ComponentPropsWithoutRef<'dialog'> {
  size?: DialogSize;                       // default 'small'
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  render?: React.ReactElement;      // e.g. render={<Button variant="primary" />}
}

interface DialogTitleProps extends React.ComponentPropsWithoutRef<'h2'> {}

interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<'p'> {}

interface DialogFooterProps extends React.ComponentPropsWithoutRef<'div'> {}

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  render?: React.ReactElement;      // e.g. render={<Button variant="ghost" size="medium" />}
}
```

###  Figma mapping

| Figma spec | Compound API |
| --- | --- |
| `open` | `Dialog.Root open` |
| `onClose` | `Dialog.Root onOpenChange` |
| `size` | `Dialog.Content size` |
| `title` | `Dialog.Title` |
| body `children` | `Dialog.Description` or arbitrary `Dialog.Content` children |
| `footer` | `Dialog.Footer` children |
| `showClose` | presence/absence of a top `Dialog.Close` |
| backdrop dismissal | `Dialog.Root closeOnBackdrop` |

## Anatomy

```
Dialog.Root
├── Dialog.Trigger
└── Dialog.Content            <dialog>, opened via showModal()
    ├── Dialog.Title
    ├── Dialog.Close          ← X button (optional, top-right)
    ├── Dialog.Description
    └── Dialog.Footer
        ├── Dialog.Close      ← e.g. Cancel
        └── Dialog.Close      ← e.g. Confirm/Delete
```

## Size tokens

| Size | Content width | Position |
| --- | --- | --- |
| Small | 400px | horizontally centered, `top: 100px` |
| Medium | 600px | centered both axes |
| Large | 900px | centered both axes |

## Spacing

| Gap | Value |
| --- | --- |
| Content padding | 24px |
| Title/Close row → Description | 16px |
| Description → Footer | 32px |
| Title text → Close button | 8px |
| Footer button gap | 8px |

## Typography

Named steps from [typography/SPEC.md](../typography/SPEC.md)

| Element | Figma style | Utility | Color |
| --- | --- | --- | --- |
| `Dialog.Title` | Medium/Title (18/26) | `text-title font-medium` | `#1F1F1F` (Neutral/700) |
| `Dialog.Description` | Regular/Body (14/22) | `text-body font-regular` | `#4B4B4B` (Neutral/600) |
| Cancel label | Regular/Body (14/22) | `text-body font-regular` | `#4B4B4B` |
| Confirm label | Medium/Body (14/22) | `text-body font-medium` | `#FFFFFF` |

The title occupies the full row height of 26px and is truncated by its flex container, not wrapped in
the design; the close button sits top-aligned in that 26px row.

## Colors & effects

| Token | Value |
| --- | --- |
| `::backdrop` (Smoke/Default) | `rgba(0, 0, 0, 0.3)` |
| Content background | `#FFFFFF` |
| Elevation/4 shadow | `0 8px 20px rgba(0, 0, 0, 0.06)`, `0 24px 60px rgba(0, 0, 0, 0.12)` |

## Close button

- Box: `14 × 14px`, top-aligned inside the 26px title row, pushed to the right edge.
- Glyph: caller-supplied (an X in the design; `Union` vector, 5.39% inset). Not hardcoded into the
  component — `Dialog.Close`'s `children` is the glyph.
- Must have an accessible label (e.g. `aria-label="Close"`) when used as an icon-only close affordance.

## Footer buttons

Both are **Medium** buttons from the Button component set (`98 × 36`, `8px / 7px` padding, radius 4px,
82px min content width), composed via `render` on `Dialog.Close`:

| Slot | Button variant | Label |
| --- | --- | --- |
| Left | Ghost | Cancel |
| Right | Primary (`bg #15C5CE`) | Confirm |

## Behaviour

- `closeOnBackdrop` maps to the `closedby` content attribute: `true` → `closedby="any"` (close
  requests + light-dismiss on outside click), `false` → `closedby="closerequest"` (Escape/close
  requests only, no light-dismiss).
- `Escape` closes the dialog natively via the close-request mechanism.
- Focus is placed and restored by the browser; the previously focused element is refocused on close.
- Modal `<dialog>` is placed in the browser's top layer and the rest of the document becomes inert
  automatically while open.
- `role="dialog"`/`aria-modal` are implicit for a modally-shown `<dialog>`; label it via
  `aria-labelledby` pointing at `Dialog.Title`.
- **Scroll locking is not solved by `<dialog>`** and remains an implementation concern: lock body
  scroll while `Dialog.Content` is open.
- `Dialog.Root` supports both controlled (`open` + `onOpenChange`) and uncontrolled (`defaultOpen`)
  usage; the common case (`<Dialog.Root>` with no props) starts closed.

## Required design tokens

Additions needed in `libs/faster/src/lib/styles.css` (superset shared with the Button and Input specs):

```css
@theme {
  --color-primary-600: #15c5ce;

  --color-neutral-600: #4b4b4b;
  --color-neutral-700: #1f1f1f;

  --color-smoke: rgb(0 0 0 / 0.3);

  --shadow-elevation-4: 0 8px 20px rgb(0 0 0 / 0.06), 0 24px 60px rgb(0 0 0 / 0.12);
}
```

Type tokens (`--text-body` at weights 400 and 500, `--text-title` at weight 500) are defined in
[typography/SPEC.md](../typography/SPEC.md).
