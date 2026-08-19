# Bulk JFP Generator

A lightweight, browser-based tool for generating bulk Job Field Processor (JFP) JSON objects in the `ManipulateValueConditionalOverwrite` format.

## Features

- **Bulk input** — Paste multiple `value` and `compareValue` entries (one per line) with row-count validation
- **Dropdown fields** — Select `field` and `compareField` from predefined options (title, rawLocation, jobType, company, etc.)
- **Common parameters** — Set `rank`, `sourceId`, and `fuzzyMatch` once; they apply to all rows
- **Instant JSON output** — Generates a formatted JSON array with constant values for `typeName`, `active`, `dynamic`, and `simulatorOnly`
- **Copy to clipboard** — One-click copy of the generated output
- **No dependencies** — Pure HTML, CSS, and JavaScript; no build step or server required

## Output Format

```json
[
  {
    "typeName": "ManipulateValueConditionalOverwrite",
    "active": true,
    "rank": 1,
    "dynamic": true,
    "simulatorOnly": false,
    "parameters": {
      "compareValue": "...",
      "field": "...",
      "compareField": "...",
      "value": "...",
      "fuzzyMatch": false
    },
    "sourceId": 100
  }
]
```

## Usage

1. Open `index.html` in any modern browser
2. Paste values in the **Values** textarea (one per line)
3. Paste corresponding compareValues in the **Compare Values** textarea (must match row count)
4. Set **Rank**, **Field**, **Compare Field**, **Source ID**, and **Fuzzy Match**
5. Click **Generate JSON**
6. Click **Copy to Clipboard** to copy the output

## Project Structure

```
├── index.html   # Main app page
├── about.html   # About page with usage docs
├── app.js       # JSON generation logic
├── styles.css   # Styling (LinkedIn-themed)
└── README.md
```

## Contact

[linkedin.com/in/akashsinghjsr](https://linkedin.com/in/akashsinghjsr)
