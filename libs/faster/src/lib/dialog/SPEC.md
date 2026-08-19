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

```ts
type DialogSize = 'small' | 'medium' | 'large';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  size?: DialogSize;          // default 'small'
  title?: React.ReactNode;
  children?: React.ReactNode; // body
  footer?: React.ReactNode;   // defaults to Cancel + Confirm
  showClose?: boolean;        // default true
}
```

## Anatomy

```
Backdrop (Smoke)          full viewport, rgba(0, 0, 0, 0.3)
└── Modal                 white panel, radius 4px, padding 24px, Elevation/4 shadow
    ├── Content           column, gap 16px
    │   ├── Title row     row, gap 8px, title flex-1 + close button
    │   └── Body          14px / 22px text
    └── Button Grid       row, gap 8px, right-aligned
```

Vertical gap between `Content` and `Button Grid` is **32px**.

## Size tokens

| Size | Modal width | Content width | Position |
| --- | --- | --- | --- |
| Small | 400px | 352px | horizontally centered, `top: 100px` |
| Medium | 600px | 552px | centered both axes |
| Large | 900px | 852px | centered both axes |

- Content width is always modal width − 48px (the 24px padding on both sides).
- Modal height is content-driven (202px in the design with the sample two-line body); do not fix it.
- Radius: `4px` on the modal. Backdrop has no radius (the `8px` on the spec frame is a canvas artifact).

## Spacing

| Gap | Value |
| --- | --- |
| Modal padding | 24px |
| Content → Button Grid | 32px |
| Title row → Body | 16px |
| Title text → Close button | 8px |
| Cancel → Confirm button | 8px |

## Typography

Family: `PingFang SC`.

| Element | Style | Size / line-height | Weight | Color |
| --- | --- | --- | --- | --- |
| Title | Medium/Title | 18px / 26px | 500 | `#1F1F1F` (Neutral/700) |
| Body | Regular/Body | 14px / 22px | 400 | `#4B4B4B` (Neutral/600) |
| Cancel label | Regular/Body | 14px / 22px | 400 | `#4B4B4B` |
| Confirm label | Medium/Body | 14px / 22px | 500 | `#FFFFFF` |

The title occupies the full row height of 26px and is truncated by its flex container, not wrapped in
the design; the close button sits top-aligned in that 26px row.

## Colors & effects

| Token | Value |
| --- | --- |
| Backdrop (Smoke/Default) | `rgba(0, 0, 0, 0.3)` |
| Modal background | `#FFFFFF` |
| Elevation/4 shadow | `0 8px 20px rgba(0, 0, 0, 0.06)`, `0 24px 60px rgba(0, 0, 0, 0.12)` |

The MCP export flattens Elevation/4 to `0 8px 10px rgba(0,0,0,0.06), 0 24px 30px rgba(0,0,0,0.12)`;
prefer the published style values above.

## Close button

- Box: `14 × 14px`, top-aligned inside the 26px title row, pushed to the right edge.
- Glyph: an X (`Union` vector, 5.39% inset). Present in all three sizes.
- Must be a real `<button type="button">` with an accessible label, not a decorative div.

## Footer buttons

Both are **Medium** buttons from the Button component set (`98 × 36`, `8px / 7px` padding, radius 4px,
82px min content width):

| Slot | Button variant | Label |
| --- | --- | --- |
| Left | Ghost | Cancel |
| Right | Primary (`bg #15C5CE`) | Confirm |

Reuse the project `Button` component for these — see
[libs/faster/src/lib/button/REQUIREMENTS.md](../button/REQUIREMENTS.md). The footer must be overridable
via a `footer` prop; the Cancel/Confirm pair is only the default.

## Behaviour

- Backdrop covers the viewport and closes the dialog on click (design shows the smoke layer but no
  interaction states for it — treat dismiss-on-backdrop as the default, overridable).
- `Escape` closes the dialog.
- Focus is trapped inside the modal while open and restored to the trigger on close.
- Render in a portal with `role="dialog"` and `aria-modal="true"`, labelled by the title.
- Body scroll is locked while open.
- Modal widths are fixed per size in the design; add a viewport-relative max-width so the Large size
  does not overflow small screens.

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

Type ramp needed: 14/22 at weights 400 and 500, plus 18/26 at weight 500.
