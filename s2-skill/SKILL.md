---
name: react-spectrum-2
description: Use when building or reviewing React components with Adobe React Spectrum S2. Triggers - creating UI components, styling with style macro, fixing Spectrum violations, reviewing React code for design system compliance.
---

# React Spectrum S2 Skill

Apply Spectrum 2 design patterns, use the `style` macro correctly, and ensure components follow S2 guidelines.

## Core Rules

1. **Use S2 components** - Never build custom UI when an S2 component exists
2. **Use the style macro** - Never use inline styles, CSS files, or CSS-in-JS for Spectrum styling
3. **Limit custom styles** - The `styles` prop only accepts layout/spacing properties (see below)
4. **Static macro arguments** - `style()` arguments must be compile-time constants

## Style Macro Import

```tsx
import {style} from '@react-spectrum/s2/style' with {type: 'macro'};
```

## Allowed `styles` Prop Properties

Only these CSS properties work on S2 components:
- Margins: `margin`, `marginStart/End/Top/Bottom`, `marginX/Y`
- Sizing: `width`, `minWidth`, `maxWidth`
- Flex: `flexGrow`, `flexShrink`, `flexBasis`, `justifySelf`, `alignSelf`, `order`
- Grid: `gridArea`, `gridRow`, `gridColumn` (and Start/End variants)
- Position: `position`, `zIndex`, `top`, `bottom`, `inset`, `insetX/Y`, `insetStart/End`
- Other: `visibility`

Colors and internal padding **cannot** be customized.

## Common Violations to Fix

| Violation | Fix |
|-----------|-----|
| `style={{ color: 'red' }}` | Use `style({ color: 'red-600' })` with macro |
| `className="custom-btn"` | Use S2 `Button` component |
| CSS file imports | Remove; use style macro |
| Dynamic macro args | Create static variants, select at runtime |

## Dynamic Styling Pattern

```tsx
// WRONG - dynamic values in macro
style({ color: isActive ? 'blue' : 'gray' })

// CORRECT - static variants
const activeStyle = style({ color: 'blue-600' });
const inactiveStyle = style({ color: 'gray-600' });
<div className={isActive ? activeStyle : inactiveStyle} />
```

## Reference Table

| File | When to Read |
|------|--------------|
| `references/styling.md` | Deep dive on style macro patterns |
| `references/lessons-learned.md` | Build errors, Vite/macro troubleshooting |
| `references/<ComponentName>.md` | API for specific component (66 components) |
| `references/migrating.md` | Converting v3 code to S2 |
| `references/forms.md` | Form validation and submission |

## Component Lookup

66 components available. Read `references/<Name>.md` for props and examples:

- **Layout:** Provider, Divider, Form
- **Buttons:** Button, ActionButton, ToggleButton, LinkButton, ButtonGroup, ActionButtonGroup, ToggleButtonGroup
- **Inputs:** TextField, TextArea, NumberField, SearchField, Checkbox, CheckboxGroup, RadioGroup, Switch, Picker, ComboBox, DateField, DatePicker, TimeField, DateRangePicker
- **Collections:** Menu, ActionMenu, TableView, CardView, TreeView, Tabs, Accordion, TagGroup
- **Overlays:** Dialog, Popover, Tooltip, Toast
- **Feedback:** ProgressBar, ProgressCircle, Meter, StatusLight, Badge, InlineAlert
- **Navigation:** Breadcrumbs, Link, SegmentedControl
- **Media:** Image, Avatar, AvatarGroup, Card
- **Color:** ColorField, ColorSlider, ColorArea, ColorWheel, ColorSwatch, ColorSwatchPicker
- **Other:** Calendar, RangeCalendar, Disclosure, DropZone, IllustratedMessage, Skeleton, ContextualHelp
