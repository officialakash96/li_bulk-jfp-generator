# Bulk JFP Generator

A lightweight, browser-based tool for generating bulk Job Field Processor (JFP) JSON objects across multiple typeName operations.

## Features

- **Tabbed interface** — Separate tabs for different JFP types with contextual inputs
- **Bulk input** — Paste multiple values (one per line) with row-count validation
- **Dropdown fields** — Select from predefined field options
- **Company URN formatting** — Automatically wraps values as `urn:li:company:<input>` when field is "company"
- **Instant JSON output** — Generates formatted JSON arrays with constant values for `active`, `dynamic`, and `simulatorOnly`
- **Copy to clipboard** — One-click copy of generated output
- **No dependencies** — Pure HTML, CSS, and JavaScript; no build step or server required

## Pages

### Bulk Overwrite JFPs (`index.html`)

| Tab | typeName | Inputs |
|-----|----------|--------|
| Overwrite / Replace | `ManipulateValueConditionalOverwrite` or `ManipulateValueConditionalReplace` | value, compareValue, (search), field, compareField, rank, sourceId, fuzzyMatch |
| Value Replace | `ManipulateValueReplace` | search, value, field, rank, sourceId |
| Replace Empty | `ManipulateValueReplaceEmpty` | value, field, rank, sourceId |

### Bulk Ignore JFPs (`ignore.html`)

| Tab | typeName | Inputs |
|-----|----------|--------|
| IgnoreContains / IgnoreEquals / IgnoreNotContains / IgnoreNotEquals | Selected type | value (bulk), field, rank, sourceId, ignoreCase |
| IgnoreEmpty / IgnoreNotEmpty | Selected type | field, rank, sourceId, rankAbove (optional) |

## Usage

1. Open `index.html` or `ignore.html` in any modern browser
2. Select the appropriate tab for your JFP type
3. Paste values and set common parameters
4. Click **Generate JSON**
5. Click **Copy to Clipboard** to copy the output

## Project Structure

```
├── index.html   # Bulk Overwrite JFPs (tabbed)
├── ignore.html  # Bulk Ignore JFPs (tabbed)
├── about.html   # About page with documentation
├── app.js       # Overwrite page logic
├── ignore.js    # Ignore page logic
├── styles.css   # Shared styling (LinkedIn-themed)
└── README.md
```

## Contact

[linkedin.com/in/akashsinghjsr](https://linkedin.com/in/akashsinghjsr)
