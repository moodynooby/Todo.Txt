## 2025-05-15 - [Optimization of Todo Parser]
**Learning:** Replaced $O(N^2)$ array concatenation with $O(N)$ push operations in the todo parser. Using `.concat()` in a loop creates a new array every time, leading to quadratic time complexity. Also hoisted date utility calls and context object creation out of the loop.
**Action:** Always prefer `.push()` over `.concat()` when building large collections in a loop. Hoist constant or semi-constant values (like current dates) and object literals out of hot loops to reduce GC pressure and redundant computations.

## 2025-05-16 - [Advanced Parser Optimizations and UI Responsiveness]
**Learning:** Even $O(N)$ operations can become bottlenecks if they involve expensive regexes or redundant passes over large data. Using `useDeferredValue` is highly effective for keeping text inputs responsive when they drive expensive derived state.
**Action:** Use "fast-path" string checks (`startsWith`, `includes`, `indexOf`) to avoid regex execution in loops. Consolidate multiple passes over the same data into a single loop. Leverage React's concurrent features like `useDeferredValue` for expensive computations triggered by user input.

## 2025-05-17 - [Consolidated Filtering and Date Context Hoisting]
**Learning:** Consolidating multiple $O(N)$ passes (filter by completion, then search, then active filter, then count) into a single $O(N)$ loop in `useSidebarState` significantly reduced overhead. Additionally, hoisting `Date` object creation via a `DateContext` in `parseTodoLine` yielded a ~90% speed boost for the parser when processing lines with 'due:' tags.
**Action:** Always look for opportunities to combine multiple array iterations into a single pass. Export and use context objects for hot functions that require repeated environment data (like current dates) to avoid redundant utility calls.
