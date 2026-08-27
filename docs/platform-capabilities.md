# Platform capabilities

| Capability | Android | Desktop | Wasm browser |
| --- | --- | --- | --- |
| In-app floating timer | Supported across all workspaces | Supported across all workspaces | Supported while the page is open |
| System-level always-on-top timer | Not implied by in-app overlay; requires a separate permission-gated feature | Not implied by in-app overlay; optional future window toggle | Not available |
| Due notifications | OS notification and alarm path | In-process desktop notifier | Notification API while the page is open; closed-tab delivery is not guaranteed |
| Habit reminders | OS scheduling | In-process scheduler | No exact background alarm; page-open limitation applies |
| Encrypted portable backup | Supported by native implementation | Supported by native implementation | Explicitly unavailable until a compatible Web Crypto codec is implemented |
| Drawing synchronization | Supported only through the lossless scene contract | Supported only through the lossless scene contract | Supported only through the lossless scene contract |
| Navigation/menu hiding | Navigation chrome can be hidden with an in-app restore affordance | Navigation chrome and OS menu have reversible controls; tray keeps Quit | Navigation chrome can be hidden with an in-app restore affordance |
| AI credentials | Device-local or platform-secure storage | Device-local or platform-secure storage | Browser-local storage only; never treat the key as a cloud document |

The UI must use these labels when a user reaches a capability boundary. A platform adapter may return an adapted or unavailable state, but it must not silently return success while doing nothing.
