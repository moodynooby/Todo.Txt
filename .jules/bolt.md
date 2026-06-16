## 2025-05-15 - [Optimization of Todo Parser]
**Learning:** Replaced $O(N^2)$ array concatenation with $O(N)$ push operations in the todo parser. Using `.concat()` in a loop creates a new array every time, leading to quadratic time complexity. Also hoisted date utility calls and context object creation out of the loop.
**Action:** Always prefer `.push()` over `.concat()` when building large collections in a loop. Hoist constant or semi-constant values (like current dates) and object literals out of hot loops to reduce GC pressure and redundant computations.

## 2025-05-16 - [Advanced Parser Optimizations and UI Responsiveness]
**Learning:** Even $O(N)$ operations can become bottlenecks if they involve expensive regexes or redundant passes over large data. Using `useDeferredValue` is highly effective for keeping text inputs responsive when they drive expensive derived state.
**Action:** Use "fast-path" string checks (`startsWith`, `includes`, `indexOf`) to avoid regex execution in loops. Consolidate multiple passes over the same data into a single loop. Leverage React's concurrent features like `useDeferredValue` for expensive computations triggered by user input.

## 2025-05-17 - [Date and Regex Hoisting in Hot Paths]
**Learning:** Redundant calls to date formatting utilities (e.g., `getToday()`) and recreation of regex objects in document traversal loops (Prosemirror `descendants`) significantly impact performance as the document size grows. Hoisting these to a single calculation per render/pass and reusing regexes with `lastIndex = 0` provides a massive speedup.
**Action:** Always hoist date-related calculations outside of loops. For Prosemirror extensions or any document traversal, define regexes outside the visitor function and reset `lastIndex` for global regexes to balance memory and execution speed.
