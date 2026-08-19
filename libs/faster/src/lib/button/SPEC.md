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

```ts
type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;  // default 'primary'
  size?: ButtonSize;        // default 'large'
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;       // square box, no label
}
```

- Figma models `State` (Default / Hover / Pressed / Disabled) as a variant axis. In code these are CSS
  states: `:hover`, `:active`, `:disabled` — not a prop.
- Figma never has both icon slots true at once. Code allows both, but the design only specifies one.
- Icon-only is not defined for `link`.

## Size tokens

Applies to `primary`, `outline`, `ghost`. Radius is `4px` for every size and variant.

| Size | Height | Padding | Type step | Icon box | Gap | Min content width | Icon-only box |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Large | 40px | `8px` | Subtitle (16/24) | 18px | 4px | 90px | 40 × 40 |
| Medium | 36px | `7px 8px` | Body (14/22) | 16px | 4px | 82px | 36 × 36 |
| Small | 24px | `3px 4px` | Caption (12/18) | 14px | 4px | 54px | 24 × 24 |

`link` has no padding, no background, no border; its box height equals the line-height (24 / 22 / 18).

## Typography

Use the named steps from [typography/SPEC.md](../typography/SPEC.md) — no ad-hoc px pairs.

| Variant | Weight | Utility (Large / Medium / Small) |
| --- | --- | --- |
| primary | Medium (500) | `text-subtitle font-medium` / `text-body font-medium` / `text-caption font-medium` |
| outline / ghost / link | Regular (400) | `text-subtitle font-regular` / `text-body font-regular` / `text-caption font-regular` |

Label is centered, `white-space: nowrap`, no text decoration (link variant is **not** underlined).

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

- `cursor: pointer` on hover only. Disabled is non-interactive: no hover/pressed styling, no pointer cursor.
- Disabled colors are explicit per variant — do not approximate them with `opacity`.
- Icons are caller-supplied `ReactNode`s. The Figma sample glyph is a "Plus" (`Union` vector, 8.33% inset);
  do not hardcode it into the component.
- Icon box dimensions are fixed per size (see table); the icon must not stretch the button.

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
