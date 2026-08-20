# Input — Design Requirements

Source of truth: TapTap Design System (Figma)
File: `lXoWsgMekR00jKGtXIffk0` · Page node: `11:7661`

The Input page is split into seven sibling pages, one per composition. Each page contains one
component set.

| Composition      | Page node  | Component set | Variant axes                                   |
| ---------------- | ---------- | ------------- | ---------------------------------------------- |
| Basic            | `11:7673`  | `11:7949`     | Size × State × Typing × Text Entered × State 2 |
| Left icon        | `11:8260`  | `11:8536`     | Size × State × Typing × Text Entered × State 2 |
| Right icon       | `11:8913`  | `11:9189`     | Size × State × Typing × Text Entered × State 2 |
| Number (stepper) | `11:9533`  | `11:9747`     | Size × State × Text Entered                    |
| Prefix & Suffix  | `11:10115` | `11:10328`    | Size × State × Text Entered                    |
| Prefix only      | `11:10732` | `11:10945`    | Size × State × Text Entered                    |
| Suffix only      | `11:11310` | `11:11523`    | Size × State × Text Entered                    |

## Variant axes → code mapping

| Figma axis     | Values                                               | In code                                                             |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| `Size`         | Large / Medium / Small                               | `Input.Root` `size` prop                                            |
| `State`        | Default / Hover / Pressed & Focus / Disabled / Error | shell `:hover`, `:focus-within`, `disabled`, `Input.Root` `invalid` |
| `Text Entered` | False / True                                         | plain `<input>` value; not tracked by the component                 |
| `Typing`       | False / True                                         | CSS `:focus-within`; not tracked by the component                   |
| `State 2`      | Not Applicable / Clear Hover / Clear Pressed         | caller-composed clear button, styled with `hover:`/`active:`        |

## Public API

`Input` is a namespace of compound components composed by the caller — there is no single `<Input>`
component and no internal state (no `useState` for value/focus/clear-visibility). Styling and
behavior each live in exactly one place: `Input.Root` owns the field shell, `Input.Control` is the
plain native `<input>` (or a composed custom control via `render`), `Input.Adornment` renders icons
or prefix/suffix chips on either side, and `Input.Help`/`Input.Error` render supporting text below
the field.

```tsx
<Input.Root>
  <Input.Control placeholder="Search" />
</Input.Root>

<Input.Root>
  <Input.Adornment side="start"><SearchIcon /></Input.Adornment>
  <Input.Control placeholder="Search" />
</Input.Root>

<Input.Root invalid>
  <Input.Control placeholder="Email" aria-describedby="email-error" />
  <Input.Error id="email-error">This field is required</Input.Error>
</Input.Root>

<Input.Root>
  <Input.Adornment side="start" chip>$</Input.Adornment>
  <Input.Control placeholder="0.00" />
</Input.Root>

<Input.Root>
  <Input.Control placeholder="0.00" />
  <Input.Adornment side="end" chip>USD</Input.Adornment>
</Input.Root>

<Input.Root>
  <Input.Control type="number" placeholder="0" />
</Input.Root>

<Input.Root>
  <Input.Control placeholder="Search" />
  <Input.Adornment side="end">
    <Input.Clear />
  </Input.Adornment>
</Input.Root>
```

```ts
type InputSize = 'large' | 'medium' | 'small';

interface InputRootProps extends React.ComponentPropsWithoutRef<'div'> {
  size?: InputSize; // default 'large'
  invalid?: boolean; // renamed from the Figma "error" axis; propagates aria-invalid to Input.Control
  disabled?: boolean; // default disabled state for Input.Control
}

interface InputControlProps extends Omit<React.ComponentPropsWithRef<'input'>, 'size'> {
  disabled?: boolean; // overrides Input.Root's disabled for this control
  /** Composition of the actual `<input>`. */
  render?: React.ReactElement | ((props: React.ComponentPropsWithRef<'input'>) => React.ReactElement);
}

interface InputAdornmentProps extends React.ComponentPropsWithoutRef<'span'> {
  side: 'start' | 'end';
  chip?: boolean; // shades the adornment as a prefix/suffix pill instead of a bare icon box
}

interface InputClearProps extends React.ComponentPropsWithoutRef<'button'> {
  label?: string; // accessible label; default "Clear input"
}

type InputHelpProps = React.ComponentPropsWithoutRef<'p'>;
type InputErrorProps = React.ComponentPropsWithoutRef<'p'>; // role="alert"
```

### Why compound components

The previous single `<Input>` accepted `leftIcon`/`rightIcon`/`prefix`/`suffix`/`clearable`/`variant`
props and derived `filled`/`focused`/adornment stacking internally. That pushed all combinatorics
(which adornments coexist, chip vs. plain styling, clear-button visibility) into one component's
logic. The compound API moves each concern to its own component:

- `Input.Root` only owns the shell's visual state (`size`, `invalid`, `disabled`) via context —
  no value tracking, no focus tracking.
- `Input.Control` is a plain `<input>` (or `render`-composed control) that reads `size`/`invalid`
  from context; consumers wire `value`/`onChange` themselves, same as any native input.
- `Input.Adornment side="start" | "end"` replaces `leftIcon`/`rightIcon`/`prefix`/`suffix`/`variant`.
  Multiple adornments per side are just multiple `<Input.Adornment>` children — no internal stacking
  logic. `chip` replaces the `variant="prefix" | "postfix"` axis.
- `Input.Clear` is a built-in end adornment: its visibility is pure CSS (a Tailwind `peer` selector
  reading `Input.Control`'s `:focus`/`:placeholder-shown` state), so it needs no `useState`/
  `useEffect` and works for both controlled and uncontrolled `Input.Control`s without the owning
  component tracking anything itself. Only its click-to-clear behavior touches the DOM (via a
  shared ref in context).
- `Input.Help` / `Input.Error` replace the single `helpText` prop. `aria-describedby` is the caller's
  responsibility (pass the same `id` to `Input.Control`'s `aria-describedby` and to `Input.Help`/
  `Input.Error`), matching how every other prop on `Input.Control` is just a native input prop.

### `render`

`Input.Control`'s `render` composes the actual `<input>` control, exactly as before: the supplied
element or render function must forward the given props/ref onto a real input-compatible control.

## Anatomy

```
Input.Root                          bordered shell; :hover / :focus-within / invalid / disabled
├── Input.Adornment side="start"    zero or more, in document order
├── Input.Control                   plain <input>, render-composable
└── Input.Adornment side="end" / Input.Clear   zero or more, in document order

Input.Help / Input.Error            rendered as siblings after Input.Root, linked via aria-describedby
```

## CVA structure

- `inputRootVariants({ size, invalid, disabled })` — the bordered shell (background, border, focus
  ring, horizontal padding/gap). Explicit state precedence: default → hover → focus, then **invalid
  wins** over hover/focus, then **disabled wins** over everything (including invalid) — encoded as
  `compoundVariants`.
- `inputControlVariants({ size })` — the native `<input>`: text/placeholder/caret color only. No
  border/background/padding here — the shell owns spacing via its `gap`/`px-*`.
- `inputAdornmentVariants({ size, chip })` — icon-sized box when `chip: false`, shaded pill when
  `chip: true`.

## Size tokens

Fixed field width in the design is `190px` — this is a spec artifact. The component must be fluid
(`width: 100%`) and let the consumer constrain it.

| Size   | Field height | Type step        | Horizontal padding | Icon box | Help text top offset |
| ------ | ------------ | ---------------- | ------------------ | -------- | -------------------- |
| Large  | 40px         | Subtitle (16/24) | 12px               | 18px     | 44px                 |
| Medium | 36px         | Body (14/22)     | 12px               | 16px     | 40px                 |
| Small  | 24px         | Caption (12/18)  | 8px                | 14px     | 28px                 |

- Radius: `4px` (all sizes, all compositions).
- Border: `1px solid`.
- Typography: Regular (400) everywhere — including help text and affixes. Use the named steps from
  [typography/SPEC.md](../typography/SPEC.md): `text-subtitle` / `text-body` / `text-caption` with
  `font-regular`.
- Vertical centering: the shell uses `items-center`; adornments and the control are centered by flex,
  not by explicit `top`/`translateY`.

## Color per state

Placeholder is `#CACACA` (Neutral/400). Filled value is `#4B4B4B` (Neutral/600). Caret is `#1F1F1F`.

| State                   | Background             | Border                  | Value text | Placeholder             | Extra                                          |
| ----------------------- | ---------------------- | ----------------------- | ---------- | ----------------------- | ---------------------------------------------- |
| Default                 | `#FFFFFF`              | `#E1E1E1` (Neutral/300) | `#4B4B4B`  | `#CACACA`               | —                                              |
| Hover                   | `#FFFFFF`              | `#47CFD6` (Primary/500) | `#4B4B4B`  | `#CACACA`               | —                                              |
| Pressed & Focus         | `#FFFFFF`              | `#15C5CE` (Primary/600) | `#4B4B4B`  | `#CACACA`               | focus ring `0 0 1px 1px rgba(21,197,206,0.16)` |
| Invalid (Figma "Error") | `#FFFFFF`              | `#F64C4C` (Danger/600)  | `#4B4B4B`  | `#CACACA`               | `Input.Error` text `#F64C4C`                   |
| Disabled                | `#FAFAFA` (Neutral/50) | `#EEEEEE` (Neutral/200) | `#CACACA`  | `#E1E1E1` (Neutral/300) | —                                              |

Notes:

- Disabled uses **two different** muted text colors: filled value `#CACACA`, empty placeholder `#E1E1E1`.
- The focus ring appears only in `Pressed & Focus`; it is not applied to hover or invalid.
- Invalid keeps its red border on hover and focus (invalid wins over interaction states, but disabled
  still wins over invalid — see CVA structure above).

## Help / Error text

- `Input.Help` — neutral supporting text (`#8E8E8E` / Neutral/500).
- `Input.Error` — error text (`#F64C4C` / Danger/600), `role="alert"`. Use when `Input.Root` is
  `invalid`.
- Position: below the field, left-aligned, at the per-size top offset in the table above.
- Typography: Large/Medium → Body (`text-body font-regular`); Small → Caption (`text-caption font-regular`).
- Neither affects field height; both render outside `Input.Root`.
- Linking to the field is the caller's responsibility: pass the same `id` to `Input.Control`'s
  `aria-describedby` and to `Input.Help`/`Input.Error`.

## Composition geometry

### Left/right icon adornments (`Input.Adornment` without `chip`)

| Size   | Edge inset | Icon box |
| ------ | ---------- | -------- |
| Large  | 12px       | 18px     |
| Medium | 12px       | 16px     |
| Small  | 8px        | 14px     |

Spacing between adornments and the control comes from the shell's `gap` (per-size, see CVA
structure), not per-adornment margins.

### `Input.Clear`

A built-in end adornment, placed as a sibling of `Input.Control`:

```tsx
<Input.Root>
  <Input.Control placeholder="Search" />
  <Input.Clear />
</Input.Root>
```

- Visibility maps to the Figma `Typing` axis: hidden while the field is unfocused; visible while
  focused **and** non-empty. This is CSS-only — `Input.Control` carries the Tailwind `peer` class,
  and `Input.Clear` is `hidden` by default with `peer-[&:focus:not(:placeholder-shown)]:inline-flex`
  turning it on. `Input.Control` therefore needs a non-empty `placeholder` (even a space) for the
  `:placeholder-shown` check to accurately mean "empty" — this is a real DOM-state selector, not a
  React state mirror, so it stays correct through controlled and uncontrolled value changes alike
  without a value-tracking effect.
- Clicking resets the control's value through the native `HTMLInputElement` setter + a dispatched
  `input` event, so it works for both controlled `value`/`onChange` and uncontrolled
  `defaultValue` usage, then refocuses the control. `onMouseDown` is prevented so the click doesn't
  blur the field first (which would otherwise unmount the button before the click fires).
- Renders the Figma glyph (`Subtract`, a filled circle-x) by default; override with children for a
  custom icon.
- Color maps to the Figma `State 2` axis via `text-*`/`hover:text-*`/`active:text-*` (progressive
  neutral, not the field border colors):

  | State                  | Color                   |
  | ---------------------- | ----------------------- |
  | Field not focused      | hidden                  |
  | Typing / field focused | `#CACACA` (Neutral/400) |
  | Clear hover            | `#8E8E8E` (Neutral/500) |
  | Clear pressed          | `#4B4B4B` (Neutral/600) |

### Number stepper (`11:9747`) — not implemented

Deferred to a future separate `NumberField` primitive per the design doc, not an
`<Input.Control type="number" />` composition detail.

### Prefix / Suffix (`Input.Adornment chip`)

Affixes are rendered via `<Input.Adornment side="start" chip>` / `<Input.Adornment side="end" chip>`:
full field height, rounded `4px`, background Neutral/50, text Neutral/500, horizontal padding per the
shared adornment CVA.

## Behaviour

- Field is fluid width; the `190px` in Figma is only the spec canvas width.
- Placeholder text does not wrap (`white-space: nowrap` in the design); with a fluid width, allow the
  native input to clip instead.
- Disabled is non-interactive: no hover border change, no focus ring.
- Icons/affixes are caller-supplied children of `Input.Adornment`. The Figma sample glyphs (Search,
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
