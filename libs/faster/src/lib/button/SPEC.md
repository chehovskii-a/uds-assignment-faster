# Button — Design Requirements

Source of truth: TapTap Design System (Figma)
File: `lXoWsgMekR00jKGtXIffk0` · Page node: `15:12480`

| Component set | Figma node | Variant axes |
| --- | --- | --- |
| Primary | `15:12968` | Size × State × Left Icon × Right Icon (36 variants) |
| Outline | `15:14180` | Size × State × Left Icon × Right Icon (36 variants) |
| Ghost | `15:15392` | Size × State × Left Icon × Right Icon (36 variants) |
| Link | `15:16610` | Size × State × Left Icon × Right Icon (36 variants) |
| Icon-only Primary | `15:20350` | Size × State (12 variants) |
| Icon-only Outline | `15:20577` | Size × State (12 variants) |
| Icon-only Ghost | `15:20824` | Size × State (12 variants) |

## Public API

```tsx
<Button />
```

```ts
type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonState {
  disabled: boolean;
}

interface ButtonProps extends Omit<React.ComponentPropsWithRef<'button'>, 'size'> {
  variant?: ButtonVariant;  // default 'primary'
  size?: ButtonSize;        // default 'large'
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;       // square box, no label; not supported with variant="link"

  /** Element composition. */
  render?: React.ReactElement | ((props: React.ComponentPropsWithRef<'button'>, state: ButtonState) => React.ReactElement);
  /** Whether the rendered element is a native `<button>`. Default true. */
  nativeButton?: boolean;
  /** Keeps the button focusable while `disabled` (async/loading transitions). Default false. */
  focusableWhenDisabled?: boolean;
}
```

### Composition 

`render` accepts either a `ReactElement` (the common path) or a `(props, state) => ReactElement`
function when the rendered element needs to read `state.disabled` (e.g. to set `data-loading`). Button
clones the computed native props (`className`, `aria-disabled`, `disabled`, `type`, …) onto whichever
element `render` supplies, following the same contract as `Dialog.Trigger`/`Dialog.Close`: the custom
component supplied to `render` must forward its ref and spread the given props onto its DOM element.

`nativeButton` (default `true`) declares whether the element `render` produces is an actual
`<button>`. It's an escape hatch, not normal usage — prefer the default `<Button />` over
`<Button render={<div />} nativeButton={false} />`. Anchors are a special case: don't render an `<a>`
through `Button` (`render={<a href=... />} nativeButton={false}`) — navigation should be an anchor with
Button *styling*, not Button semantics. Use the exported `buttonVariants` directly instead:

```tsx
<a href="/settings" className={buttonVariants({ variant: 'primary', size: 'large' })}>
  Settings
</a>
```

`focusableWhenDisabled`: normal `disabled` uses real native `disabled`
(non-focusable, per platform behavior). `focusableWhenDisabled` keeps the rendered element focusable
while `aria-disabled="true"` is applied instead of the native attribute — useful so keyboard focus
isn't dropped when a button transitions into a disabled/loading state
(`<Button disabled={isSaving} focusableWhenDisabled>`).

## Size tokens

Applies to `primary`, `outline`, `ghost`. Radius is `4px` for every size and variant.

| Size | Height | Padding | Type step | Icon box | Gap | Min content width | Icon-only box |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Large | 40px | `8px` | Subtitle (16/24) | 18px | 4px | 90px | 40 × 40 |
| Medium | 36px | `7px 8px` | Body (14/22) | 16px | 4px | 82px | 36 × 36 |
| Small | 24px | `3px 4px` | Caption (12/18) | 14px | 4px | 54px | 24 × 24 |

## Typography

Use the named steps from [typography/SPEC.md](../typography/SPEC.md) — no ad-hoc px pairs.

| Variant | Weight | Utility (Large / Medium / Small) |
| --- | --- | --- |
| primary | Medium (500) | `text-subtitle font-medium` / `text-body font-medium` / `text-caption font-medium` |
| outline / ghost / link | Regular (400) | `text-subtitle font-regular` / `text-body font-regular` / `text-caption font-regular` |

## Layout

- `display: flex`, `align-items: center`, `justify-content: center`.
- Content order: `leftIcon` → label → `rightIcon`, separated by the 4px gap.
- Min content width per size is enforced on the inner content row, not the outer box, so the button
  hugs its padding while never collapsing below the designed width.

## Color per variant × state

### Primary — label always `#FFFFFF`

| State | Background |
| --- | --- |
| Default | `#15C5CE` (Primary/600) |
| Hover | `#47CFD6` (Primary/500) |
| Pressed | `#00ABB6` (Primary/700) |
| Disabled | `#B0EBEC` (Primary/300) |

### Outline — background `#FFFFFF`, 1px solid border

| State | Border | Label |
| --- | --- | --- |
| Default | `#E1E1E1` (Neutral/300) | `#4B4B4B` (Neutral/600) |
| Hover | `#47CFD6` | `#47CFD6` |
| Pressed | `#00ABB6` | `#00ABB6` |
| Disabled | `#EEEEEE` (Neutral/200) | `#CACACA` (Neutral/400) |

### Ghost — transparent, no border

| State | Background | Label |
| --- | --- | --- |
| Default | none | `#4B4B4B` |
| Hover | `#F5F5F5` (Neutral/100) | `#4B4B4B` |
| Pressed | `#E1E1E1` (Neutral/300) | `#4B4B4B` |
| Disabled | none | `#CACACA` |

### Link — no background, no border, no padding

| State | Label |
| --- | --- |
| Default | `#15C5CE` |
| Hover | `#47CFD6` |
| Pressed | `#00ABB6` |
| Disabled | `#7DDDE1` (Primary/400) |

## Behaviour

- `cursor: pointer` on hover only. Disabled is non-interactive: no hover/pressed styling, no pointer
  cursor. All interactive state classes are gated behind `not-aria-disabled:` (rather than relying on
  `:hover`/`:active` alone), so a `focusableWhenDisabled` button that only has `aria-disabled` — not
  the native `disabled` attribute — still gets the correct non-interactive styling.
- Disabled colors are explicit per variant — do not approximate them with `opacity`.
- Icons are caller-supplied `ReactNode`s. The Figma sample glyph is a "Plus" (`Union` vector, 8.33% inset);
  do not hardcode it into the component.
- Icon box dimensions are fixed per size (see table); the icon must not stretch the button. Icons are
  rendered in a fixed-size `aria-hidden` wrapper (`[&>svg]:size-full`) so the caller's SVG (whatever
  its intrinsic size) fills the designed box instead of controlling layout.

## Required design tokens

`libs/faster/src/lib/styles.css` currently ships an indigo `--color-primary-*` ramp and no neutral ramp.
Implementing this spec faithfully requires adding:

```css
@theme {
  --color-primary-300: #b0ebec;
  --color-primary-400: #7ddde1;
  --color-primary-500: #47cfd6;
  --color-primary-600: #15c5ce;
  --color-primary-700: #00abb6;

  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #eeeeee;
  --color-neutral-300: #e1e1e1;
  --color-neutral-400: #cacaca;
  --color-neutral-600: #4b4b4b;
}
```

Type tokens (`--text-caption` / `--text-body` / `--text-subtitle`, weights 400 and 500) are defined in
[typography/SPEC.md](../typography/SPEC.md).
