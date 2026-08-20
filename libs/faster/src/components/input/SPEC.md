# Input — Design Requirements

Source of truth: TapTap Design System (Figma)
File: `lXoWsgMekR00jKGtXIffk0` · Page node: `11:7661`

The Input page is split into seven sibling pages, one per composition. Each page contains one
component set.

| Composition | Page node | Component set | Variant axes |
| --- | --- | --- | --- |
| Basic | `11:7673` | `11:7949` | Size × State × Typing × Text Entered × State 2 |
| Left icon | `11:8260` | `11:8536` | Size × State × Typing × Text Entered × State 2 |
| Right icon | `11:8913` | `11:9189` | Size × State × Typing × Text Entered × State 2 |
| Number (stepper) | `11:9533` | `11:9747` | Size × State × Text Entered |
| Prefix & Suffix | `11:10115` | `11:10328` | Size × State × Text Entered |
| Prefix only | `11:10732` | `11:10945` | Size × State × Text Entered |
| Suffix only | `11:11310` | `11:11523` | Size × State × Text Entered |

## Variant axes → code mapping

| Figma axis | Values | In code |
| --- | --- | --- |
| `Size` | Large / Medium / Small | `size` prop |
| `State` | Default / Hover / Pressed & Focus / Disabled / Error | shell `:hover`, `:focus-within`, native `disabled`, `invalid` prop |
| `Text Entered` | False / True | derived from value → `filled` state |
| `Typing` | False / True | derived from `focused && value` → not a prop |
| `State 2` | Not Applicable / Clear Hover / Clear Pressed | clear-button `:hover` / `:active` |

## Public API

```tsx
<Input name="search" placeholder="Search" size="large" />
<Input leftIcon={<SearchIcon />} placeholder="Search" />
<Input invalid helpText="This field is required" placeholder="Email" />
<Input prefix="$" placeholder="0.00" />
<Input clearable clearIcon={<CircleXIcon />} placeholder="Search" />
```

```ts
type InputSize = 'large' | 'medium' | 'small';

interface InputState {
  disabled: boolean;
  invalid: boolean;
  filled: boolean;
  focused: boolean;
}

interface InputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'prefix'> {
  size?: InputSize;              // default 'large'
  invalid?: boolean;             // renamed from the Figma "error" axis; also sets aria-invalid
  helpText?: React.ReactNode;    // rendered below the field, wired to aria-describedby
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;           // shows a clear control while focused and non-empty
  clearIcon?: React.ReactNode;   // caller-supplied glyph, not hardcoded
  clearLabel?: string;           // accessible label for the clear control; default "Clear input"
  onValueChange?: (value: string) => void;
  onClear?: () => void;

  /** Base UI-style composition of the actual `<input>` (not the visual shell). */
  render?:
    | React.ReactElement
    | ((props: React.ComponentPropsWithoutRef<'input'>, state: InputState) => React.ReactElement);

  /** Styles the visual field shell. `className` still targets the native `<input>`. */
  rootClassName?: string;
}
```

### `className` vs `rootClassName`

Because `InputProps` otherwise behaves like native `<input>` props, `className` (and `style`,
`onFocus`, `onChange`, `aria-*`, `ref`, …) target the **actual `<input>`**, exactly like plain HTML.
`rootClassName` is the one addition — it targets the bordered visual shell:

```tsx
<Input className="..." rootClassName="..." />
```

### `render`

`render` composes the actual `<input>` control, **not** the wrapper shell — the shell (border, icons,
affixes, clear button) is internal anatomy, not something `render` replaces. Given
`<Input render={<MyInput />} leftIcon={<SearchIcon />} />`, the icon still renders in the shell and
`MyInput` receives the native input props/ref in place of the plain `<input>`. This is stricter than
`Button.render`: changing a button's rendered element to another interactive element has legitimate
uses, but changing an input into something that isn't an actual form control usually does not — the
custom component supplied to `render` must forward the provided props and ref to a real
input-compatible control.

### `onValueChange` / `onClear`

`onValueChange?: (value: string) => void` is a convenience alongside the native `onChange`; both work
together (`<Input onChange={...} />` or `<Input value={query} onValueChange={setQuery} />`). `onClear`
fires independently of `onValueChange` when the clear control is activated, useful for side effects
like analytics that shouldn't fire on every keystroke.

## Anatomy

```
Input
├── Field shell                    bordered box; :hover / :focus-within / invalid / disabled
│   ├── Start adornment             prefix, or leftIcon (mutually exclusive)
│   ├── <input>                     render-composable; owns text/placeholder/caret only
│   └── End adornment               clear, or rightIcon, or suffix (one at a time)
└── Help text                       wired to aria-describedby
```

## CVA structure

Styling is split into small variant functions rather than one large CVA, matching the Button
precedent:

- `inputRootVariants({ size, invalid, disabled })` — the bordered shell only (background, border,
  focus ring). Explicit state precedence: default → hover → focus, then **invalid wins** over
  hover/focus, then **disabled wins** over everything (including invalid) — encoded as `compoundVariants`
  rather than relying on CSS cascade order across separate variant keys.
- `inputControlVariants({ size })` — the native `<input>`: text/placeholder/caret color, type step.
  No border/background here. No `disabled:opacity-*` — disabled colors are explicit per the table
  below, same rule as Button.
- `inputIconVariants({ size })` / `inputClearVariants({ size })` — fixed icon boxes.
- `inputAffixVariants({ size })` — prefix/suffix inner padding + typography.

## Size tokens

Fixed field width in the design is `190px` — this is a spec artifact. The component must be fluid
(`width: 100%`) and let the consumer constrain it.

| Size | Field height | Type step | Horizontal padding | Icon box | Clear icon | Help text top offset |
| --- | --- | --- | --- | --- | --- | --- |
| Large | 40px | Subtitle (16/24) | 12px | 18px | 16px | 44px |
| Medium | 36px | Body (14/22) | 12px | 16px | 14px | 40px |
| Small | 24px | Caption (12/18) | 8px | 14px | 12px | 28px |

- Radius: `4px` (all sizes, all compositions).
- Border: `1px solid`.
- Typography: Regular (400) everywhere — including help text and affixes. Use the named steps from
  [typography/SPEC.md](../typography/SPEC.md): `text-subtitle` / `text-body` / `text-caption` with
  `font-regular`.
- Vertical centering: the text line is centered in the field box.

## Color per state

Placeholder (`Text Entered = False`) is `#CACACA` (Neutral/400). Filled value is `#4B4B4B` (Neutral/600).
Caret is `#1F1F1F`.

| State | Background | Border | Value text | Placeholder | Extra |
| --- | --- | --- | --- | --- | --- |
| Default | `#FFFFFF` | `#E1E1E1` (Neutral/300) | `#4B4B4B` | `#CACACA` | — |
| Hover | `#FFFFFF` | `#47CFD6` (Primary/500) | `#4B4B4B` | `#CACACA` | — |
| Pressed & Focus | `#FFFFFF` | `#15C5CE` (Primary/600) | `#4B4B4B` | `#CACACA` | focus ring `0 0 1px 1px rgba(21,197,206,0.16)` |
| Invalid (Figma "Error") | `#FFFFFF` | `#F64C4C` (Danger/600) | `#4B4B4B` | `#CACACA` | help text `#F64C4C` |
| Disabled | `#FAFAFA` (Neutral/50) | `#EEEEEE` (Neutral/200) | `#CACACA` | `#E1E1E1` (Neutral/300) | — |

Notes:
- Disabled uses **two different** muted text colors: filled value `#CACACA`, empty placeholder `#E1E1E1`.
- The focus ring appears only in `Pressed & Focus`; it is not applied to hover or invalid.
- Invalid keeps its red border on hover and focus (invalid wins over interaction states, but disabled
  still wins over invalid — see CVA structure above).

## Help text

- Position: below the field, left-aligned at `x = 0`, at the per-size top offset in the table above.
- Typography: Large/Medium → Body (`text-body font-regular`); Small → Caption (`text-caption font-regular`).
- The only color specified in the design is the error color `#F64C4C` (used when `invalid`). A neutral
  help-text color is not defined by these variants; use `#8E8E8E` (Neutral/500) if a non-invalid hint
  is needed.
- Help text does not affect field height; it is laid out outside the bordered box.
- The field and help text are linked via `aria-describedby` (generated id, merged with any
  caller-supplied `aria-describedby` rather than overwritten).

## Composition geometry

### Left icon (`11:8536`) — icon is a Search glyph, 8.33% inset

| Size | Icon left | Icon box | Text left | Text right |
| --- | --- | --- | --- | --- |
| Large | 12px | 18px | 38px | 12px |
| Medium | 12px | 16px | 36px | 16px |
| Small | 8px | 14px | 26px | 8px |

### Right icon (`11:9189`)

| Size | Icon right | Icon box | Text left | Text right |
| --- | --- | --- | --- | --- |
| Large | 12px | 18px | 12px | 38px |
| Medium | 12px | 16px | 12px | 36px |
| Small | 8px | 14px | 8px | 26px |

Icons are vertically centered (`top: 50%`, `translateY(-50%)`).

### Clear button (Basic / icon compositions, `Typing = True`)

| Size | Right | Box | Text right |
| --- | --- | --- | --- |
| Large | 12px | 16px | 36px |
| Medium | 12px | 14px | 34px |
| Small | 8px | 12px | 24px |

- Vertically centered, `cursor: pointer`.
- Glyph is a filled circle-x (`Subtract` vector, 4.17% inset).
- Visible only while focused and the field is non-empty. Hover / pressed are the `State 2` values.

### Number stepper (`11:9747`) — not implemented on `Input`

Right-edge column, full height, rounded on the right corners only (`4px`), `overflow: hidden`.

| Size | Column width | Arrow box | Arrow top / bottom inset | Text right |
| --- | --- | --- | --- | --- |
| Large | 26px | 14px | 5px | 34px |
| Medium | 24px | 12px | 5px | 32px |
| Small | 18px | 10px | 2px | 22px |

Two stacked chevrons (up top, down bottom), each an SVG stroke path; the down arrow is the up arrow
mirrored. Text padding-left stays at the standard per-size horizontal padding.

### Prefix / Suffix (`11:10328`, `11:10945`, `11:11523`)

Affixes are full-height flex columns pinned to the left/right edge of the field, vertically centered,
with the right corners rounded `4px` and `overflow: hidden`. Affix text color is `#8E8E8E` (Neutral/500),
same font size and line-height as the field value.

| Size | Affix inner padding | Text left (prefix present) | Text right (suffix present) |
| --- | --- | --- | --- |
| Large | `8px 12px` | 30px | 54px |
| Medium | `7px 12px` | 29px | 50px |
| Small | `3px 8px` | 20px | 38px |

The prefix/suffix-only sets use the same offsets, applied to whichever side is present.

## Behaviour

- Field is fluid width; the `190px` in Figma is only the spec canvas width.
- Placeholder text does not wrap (`white-space: nowrap` in the design); with a fluid width, allow the
  native input to clip instead.
- Disabled is non-interactive: no hover border change, no focus ring, no clear button.
- The clear control must be a real focusable control (`type="button"`), not a decorative div, with an
  accessible label (`clearLabel`, default `"Clear input"`).
- Icons/affixes/the clear glyph are caller-supplied `ReactNode`s. The Figma sample glyphs (Search,
  circle-x) must not be hardcoded into the component.

## Required design tokens

`libs/faster/src/lib/styles.css` currently ships an indigo `--color-primary-*` ramp and no neutral or
danger ramps. This spec needs (superset shared with the Button spec):

```css
@theme {
  --color-primary-500: #47cfd6;
  --color-primary-600: #15c5ce;

  --color-neutral-50: #fafafa;
  --color-neutral-200: #eeeeee;
  --color-neutral-300: #e1e1e1;
  --color-neutral-400: #cacaca;
  --color-neutral-500: #8e8e8e;
  --color-neutral-600: #4b4b4b;

  --color-danger-600: #f64c4c;

  --color-foreground: #1f1f1f; /* caret */
}
```

Type tokens (`--text-caption` / `--text-body` / `--text-subtitle` at weight 400) are defined in
[typography/SPEC.md](../typography/SPEC.md).
Focus ring: `0 0 1px 1px rgba(21, 197, 206, 0.16)`.
