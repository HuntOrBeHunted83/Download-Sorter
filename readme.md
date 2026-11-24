# Download Sorter: Project Plan

## Rule Format

```js
{
  id: "rule-images",
  name: "Images",
  enabled: true,
  matchType: "extension" | "domain",
  pattern: ["png", "jpg", "jpeg"] | ["github.com", "youtube.com", "reddit.com"],
  folder: "Images"
}
```

## Phase 1: Basics

- [ ] `manifest.json` and `background.js`
- [ ] Hard-coded default rules: documents, images, video, archives
- [ ] Match by file extension
- [ ] Fallback folder

**Done condition:** a PNG, PDF, ZIP and unknown file each land in the right folder.

## Phase 2: Custom Rules

- [ ] Save default rules to storage on install
- [x] Options page:
  - [x] Add, edit, delete rules (No edit, just delete and re add the rule)
  - [x] Reorder rules (Priority System Instead)
  - [x] Turn rules on or off 
  - [x] Set the fallback folder
  - [x] Global on/off toggle
- [x] Short guide on how to write rules
- [x] Validate folder names 
- [x] Add domain matching

**Done condition:** you can add a domain rule, move it above another rule, and downloads follow it.

## Phase 3: Popup and More Polish

- [ ] Popup with the on/off toggle and a link to options
- [ ] Log of the 10 most recent sorted downloads (stored in `chrome.storage.local`)
- [ ] Empty states and basic styling
- [ ] Optional: preset rulesets, import/export

**Done condition:** the popup shows recent downloads, and the toggle stops or resumes sorting.