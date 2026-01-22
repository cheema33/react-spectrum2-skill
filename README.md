# React Spectrum S2 Skill

A complete AI skill package for React Spectrum 2 with comprehensive component documentation and an automated skill generator.

## What's Included

- **66 React Spectrum S2 Components** with full API documentation
- **11 Guide Files** covering styling, forms, testing, and more
- **Skill Generator Script** to regenerate documentation from React Spectrum source
- **77 Markdown References** ready for AI agent consumption

## Quick Start

### Browse Documentation

```bash
# View the main skill index
cat s2-skill/SKILL.md

# View specific component documentation
cat s2-skill/references/Button.md
cat s2-skill/references/ComboBox.md
cat s2-skill/references/TableView.md

# View guide files
cat s2-skill/references/styling.md
cat s2-skill/references/getting-started.md
cat s2-skill/references/forms.md
```

### Use with AI Agents

Load the skill into your AI context:

```bash
# Load entire skill
cat s2-skill/SKILL.md

# Load specific references as needed
cat s2-skill/references/Button.md
```

## Generator Script

The `generate-s2-skill.mjs` script automates the process of regenerating React Spectrum S2 component documentation.

### Purpose

This script:
1. Regenerates React Spectrum S2 component documentation
2. Organizes the output into a skill-ready folder structure
3. Creates a professional SKILL.md navigation file
4. Handles folder management with user prompts

### Usage

#### Default Behavior
```bash
node generate-s2-skill.mjs
```
Generates `./s2-skill/` folder in the current directory.

#### Custom Paths
```bash
node generate-s2-skill.mjs /path/to/react-spectrum /output/path
```
- First argument: Path to React Spectrum repository
- Second argument: Output path for s2-skill folder

### Requirements

- Node.js 18.0 or higher
- React Spectrum repository with `yarn` installed
- Write permissions for output directory

### How It Works

1. **Validates** React Spectrum repo path
2. **Runs** `generateMarkdownDocs.mjs` from upstream
3. **Parses** skill index to identify relevant documentation files
4. **Filters** out release notes and component-specific testing files
5. **Copies** only referenced `.md` files to `s2-skill/references/`
6. **Generates** token-optimized `SKILL.md` with component and guide listings
7. **Handles** folder overwrites with user confirmation

### Features

- ✅ No external dependencies (uses Node.js built-ins only)
- ✅ Cross-platform compatible
- ✅ Comprehensive error handling
- ✅ Clear status messages
- ✅ Production-quality code

### Error Handling

The script handles:
- Missing repo path
- Missing upstream script
- File system errors
- Invalid user input
- Subprocess execution failures

All errors include clear messages and exit with code 1.

### Output

Clear console output with:
- Progress indicators (dots during file copy)
- Status messages at each step
- Summary statistics
- Next steps guidance

## Documentation Files

All documentation is in `s2-skill/references/`:

**Components (66 files):**
- Accordion, ActionBar, ActionButton, ActionButtonGroup, ActionMenu
- Avatar, AvatarGroup, Badge, Breadcrumbs, Button, ButtonGroup
- Calendar, Card, CardView, Checkbox, CheckboxGroup, ColorArea
- ColorField, ColorSlider, ColorSwatch, ColorSwatchPicker, ColorWheel
- ComboBox, ContextualHelp, DateField, DatePicker, DateRangePicker
- Dialog, Disclosure, Divider, DropZone, Form, IllustratedMessage
- Image, InlineAlert, Link, LinkButton, Menu, Meter, NumberField
- Picker, Popover, ProgressBar, ProgressCircle, Provider, RadioGroup
- RangeCalendar, RangeSlider, SearchField, SegmentedControl, SelectBoxGroup
- Skeleton, Slider, StatusLight, Switch, TableView, Tabs, TagGroup
- TextArea, TextField, TimeField, Toast, ToggleButton, ToggleButtonGroup
- Tooltip, TreeView

**Guides (11 files):**
- collections.md - Collection components
- forms.md - Form patterns
- getting-started.md - Getting started guide
- icons.md - Icons documentation
- illustrations.md - Illustrations guide
- mcp.md - MCP documentation
- migrating.md - Migration guide
- selection.md - Selection patterns
- style-macro.md - Style macro documentation
- styling.md - Styling guide
- testing.md - Testing guide

## File Structure

```
s2-skill/
├── SKILL.md                    # Main navigation index
└── references/
    ├── Button.md               # Component documentation
    ├── ComboBox.md
    ├── ... (66 components)
    ├── styling.md              # Guide documentation
    ├── getting-started.md
    └── ... (11 guides)
```

## Integration

The generated `s2-skill/` folder is optimized for LLM consumption with:
- Token-efficient SKILL.md format (no redundant markdown links)
- Only relevant documentation files (release notes filtered out)
- Component-specific testing files consolidated into single testing guide
- 77 reference files covering 66 components and 11 guides

## License

MIT License - See LICENSE file

## Support

- For questions about components, refer to the specific component documentation
- For styling questions, see `s2-skill/references/styling.md`
- For testing, see `s2-skill/references/testing.md`
- For React Spectrum official documentation, visit https://react-spectrum.adobe.com

## About React Spectrum

React Spectrum is Adobe's design system and component library. This skill provides S2 (Spectrum 2) component documentation optimized for AI agents.

