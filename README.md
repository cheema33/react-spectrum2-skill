# React Spectrum S2 Skill

A complete AI skill package for React Spectrum 2 with comprehensive component documentation and an automated reference updater.

## What's Included

- **Hand-crafted SKILL.md** with actionable rules and component lookup
- **66 React Spectrum S2 Components** with full API documentation
- **11 Guide Files** covering styling, forms, testing, and more
- **Reference Updater Script** to sync documentation from upstream React Spectrum

## Quick Start

### Use with Claude Code

Copy `s2-skill/` to your Claude Code skills directory:

```bash
cp -r s2-skill ~/.claude/skills/react-spectrum-2
```

The skill will auto-trigger when building React components with Spectrum S2.

### Browse Documentation

```bash
# View the skill instructions
cat s2-skill/SKILL.md

# View specific component documentation
cat s2-skill/references/Button.md
cat s2-skill/references/ComboBox.md
cat s2-skill/references/TableView.md

# View guide files
cat s2-skill/references/styling.md
cat s2-skill/references/forms.md
```

## Skill Structure

```
s2-skill/
├── SKILL.md                    # Hand-maintained skill instructions
└── references/                 # Auto-generated from upstream
    ├── Button.md               # Component documentation (66 files)
    ├── ComboBox.md
    ├── ...
    ├── styling.md              # Guide documentation (11 files)
    └── ...
```

**SKILL.md** - Hand-maintained. Contains:
- YAML frontmatter for skill discovery
- Core rules for S2 compliance
- Style macro usage patterns
- Reference table for progressive disclosure
- Component lookup by category

**references/** - Auto-generated from Adobe's React Spectrum repo. Update when upstream changes.

## Reference Updater Script

The `generate-s2-skill.mjs` script syncs the `references/` folder with the latest React Spectrum S2 documentation. It does **not** modify SKILL.md.

### Usage

```bash
# Update references from local react-spectrum clone
node generate-s2-skill.mjs ~/repos/react-spectrum

# Update to a different output location
node generate-s2-skill.mjs ~/repos/react-spectrum /path/to/skill
```

### Requirements

- Node.js 18.0 or higher
- React Spectrum repository with `yarn` installed
- Write permissions for output directory

### How It Works

1. **Validates** React Spectrum repo path
2. **Runs** Adobe's `yarn workspace @react-spectrum/s2-docs generate:md`
3. **Parses** llms.txt to identify relevant documentation files
4. **Filters** out release notes and component-specific testing files
5. **Copies** referenced `.md` files to `references/`
6. **Preserves** hand-crafted SKILL.md

### Features

- Only updates `references/` - SKILL.md is preserved
- Filters out release notes and version history
- Consolidates component-specific testing into single guide
- Interactive confirmation before overwriting

## Documentation Files

**Components (66 files):**
Accordion, ActionBar, ActionButton, ActionButtonGroup, ActionMenu, Avatar, AvatarGroup, Badge, Breadcrumbs, Button, ButtonGroup, Calendar, Card, CardView, Checkbox, CheckboxGroup, ColorArea, ColorField, ColorSlider, ColorSwatch, ColorSwatchPicker, ColorWheel, ComboBox, ContextualHelp, DateField, DatePicker, DateRangePicker, Dialog, Disclosure, Divider, DropZone, Form, IllustratedMessage, Image, InlineAlert, Link, LinkButton, Menu, Meter, NumberField, Picker, Popover, ProgressBar, ProgressCircle, Provider, RadioGroup, RangeCalendar, RangeSlider, SearchField, SegmentedControl, SelectBoxGroup, Skeleton, Slider, StatusLight, Switch, TableView, Tabs, TagGroup, TextArea, TextField, TimeField, Toast, ToggleButton, ToggleButtonGroup, Tooltip, TreeView

**Guides (11 files):**
- collections.md - Collection components and data loading
- forms.md - Form patterns and validation
- getting-started.md - Installation and setup
- icons.md - Icon usage
- illustrations.md - Illustrations guide
- mcp.md - MCP server documentation
- migrating.md - v3 to S2 migration
- selection.md - Selection patterns
- style-macro.md - Style macro reference
- styling.md - Styling guide and best practices
- testing.md - Testing guide

## License

MIT License - See LICENSE file

## About React Spectrum

React Spectrum is Adobe's design system and component library. This skill provides Spectrum 2 component documentation optimized for AI agents.

For official documentation, visit https://react-spectrum.adobe.com
