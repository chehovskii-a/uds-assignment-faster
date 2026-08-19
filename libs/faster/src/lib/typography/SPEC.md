# Typography — Design Requirements

Source of truth: TapTap Design System (Figma)
File: `lXoWsgMekR00jKGtXIffk0` · Page node: `4:1418` (Style Guide → Typography)

Reference nodes: type scale table `4:1493`, font weight row `4:1534`, font stack callout `4:1488`.

This is the shared foundation for every component spec in this library. Component specs
([button](../button/SPEC.md), [input](../input/SPEC.md), [dialog](../dialog/SPEC.md)) reference these
named styles instead of restating raw px values.

## Font family

Primary: **PingFang SC**. The design system uses the Apple system stack with PingFang SC for CJK.

```css
--font-sans: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, Arial,
  sans-serif;
```

> The exact declaration in the Figma callout (`4:1488`) starts with `font-family: -apple-`; the full
> string was not retrievable before the MCP read limit was reached. Verify the tail of the stack
> against Figma before treating the value above as final.

## Font weights

Only two weights are used:

| Name | Weight |
| --- | --- |
| Regular | 400 |
| Medium | 500 |

There is no Bold / Semibold in the system. Style names combine weight and scale step, e.g.
`Regular/Body`, `Medium/Title`.

## Type scale

| Step | Font size | Line height | Available weights |
| --- | --- | --- | --- |
| H1 | 30px | 38px | Regular, Medium |
| H2 | 24px | 32px | Regular, Medium |
| H3 | 20px | 28px | Regular, Medium |
| Title | 18px | 26px | Regular, Medium |
| Subtitle | 16px | 24px | Regular, Medium |
| Body | 14px | 22px | Regular, Medium |
| Caption | 12px | 18px | Regular, Medium |

Letter spacing is `0` for every step.

## Tailwind tokens

Add to `libs/faster/src/lib/styles.css`. Line heights are paired with each step, so define them as
`--text-*` / `--text-*--line-height` pairs (Tailwind v4 theme syntax):

```css
@theme {
  --font-sans: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;

  --text-h1: 30px;
  --text-h1--line-height: 38px;
  --text-h2: 24px;
  --text-h2--line-height: 32px;
  --text-h3: 20px;
  --text-h3--line-height: 28px;
  --text-title: 18px;
  --text-title--line-height: 26px;
  --text-subtitle: 16px;
  --text-subtitle--line-height: 24px;
  --text-body: 14px;
  --text-body--line-height: 22px;
  --text-caption: 12px;
  --text-caption--line-height: 18px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
}
```

This yields utilities `text-h1` … `text-caption` (each carrying its line height) plus
`font-regular` / `font-medium`.

## Component alignment

Every component must use the named steps above — no ad-hoc `text-[14px] leading-[22px]` pairs.

| Component | Element | Figma style | Utility |
| --- | --- | --- | --- |
| Button | Large label | Medium/Subtitle (primary), Regular/Subtitle (outline · ghost · link) | `text-subtitle font-medium` / `text-subtitle font-regular` |
| Button | Medium label | Medium/Body, Regular/Body | `text-body font-medium` / `text-body font-regular` |
| Button | Small label | Medium/Caption, Regular/Caption | `text-caption font-medium` / `text-caption font-regular` |
| Input | Large field | Regular/Subtitle | `text-subtitle font-regular` |
| Input | Medium field | Regular/Body | `text-body font-regular` |
| Input | Small field | Regular/Caption | `text-caption font-regular` |
| Input | Help text (Large · Medium) | Regular/Body | `text-body font-regular` |
| Input | Help text (Small) | Regular/Caption | `text-caption font-regular` |
| Input | Prefix / Suffix | matches the field step for that size | same as field |
| Dialog | Title | Medium/Title | `text-title font-medium` |
| Dialog | Body | Regular/Body | `text-body font-regular` |
| Dialog | Cancel label | Regular/Body | `text-body font-regular` |
| Dialog | Confirm label | Medium/Body | `text-body font-medium` |

Size-step mapping shared by Button and Input:

| Component size | Type step |
| --- | --- |
| Large | Subtitle (16/24) |
| Medium | Body (14/22) |
| Small | Caption (12/18) |

Weight rule: `primary` Button uses Medium (500); every other Button variant and all Input text use
Regular (400). Dialog mixes both — Title and the Confirm label are Medium, everything else Regular.

H1 / H2 / H3 are documentation-page steps; no current component uses them, but they belong in the
token set.
