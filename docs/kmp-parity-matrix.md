# KMP-first parity matrix

| Capability | Android | Desktop | Wasm browser | Legacy web | Tauri | Source of truth |
| --- | --- | --- | --- | --- | --- | --- |
| Todo.Txt parsing/export | same | same | same | adapted via JS core package | adapted via web | `native/core` |
| Global floating timer | same | same | adapted while page is open | adapted while page is open | adapted | `native/app/ui/timer` |
| Rich notes editing | same minimum Markdown subset | same minimum Markdown subset | same minimum Markdown subset | same contract | same contract | shared Notes Markdown contract |
| Draw scene persistence | same lossless scene contract | same lossless scene contract | same lossless scene contract | same Excalidraw JSON | same contract | versioned scene JSON |
| Drawing cloud sync | supported when codec is lossless | supported when codec is lossless | supported when codec is lossless | supported | supported | shared scene codec |
| Navigation/menu hiding | adapted: navigation chrome | supported: OS menu and navigation chrome | supported: navigation chrome | supported: header chrome | supported: shell menu | shared command registry |
| Keyboard shortcuts | adapted to physical keyboard | supported | supported while page is open | supported | supported | shared command ids |
| Due reminders | supported by OS notification/alarm | supported by desktop notifier | adapted: page-open notifications | adapted: page-open notifications | adapted | capability API |
| Habit reminders | supported | supported where notifier exists | unavailable/adapted with explicit UI | adapted | adapted | capability API |
| Portable encrypted backup | supported | supported | unavailable until Web Crypto codec exists | adapted | supported | BackupManager + capability state |
| AI tools | same tool schema and validation | same | same while key/API available | same | same | shared `AiToolSpec` |
| AI credential storage | device-local/secure | device-local/secure | browser-local only | browser-local only | shell secure storage | settings migration |

## Parity labels

`same` means the concept and interaction contract are shared. `adapted` means the concept is available with an explicit platform limitation. `unavailable` means the UI explains why it cannot be provided and offers the nearest safe alternative. Silent no-ops are not parity.

## Release rule

A feature cannot be called parity-complete until its row has a shared contract, at least one common-core test, and one platform smoke test for every supported surface.
