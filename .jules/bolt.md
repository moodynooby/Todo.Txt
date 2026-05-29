## 2025-05-15 - [Optimization of Todo Parser]
**Learning:** Replaced $O(N^2)$ array concatenation with $O(N)$ push operations in the todo parser. Using `.concat()` in a loop creates a new array every time, leading to quadratic time complexity. Also hoisted date utility calls and context object creation out of the loop.
**Action:** Always prefer `.push()` over `.concat()` when building large collections in a loop. Hoist constant or semi-constant values (like current dates) and object literals out of hot loops to reduce GC pressure and redundant computations.

## 2025-05-16 - [Advanced Todo Parser Optimization]
**Learning:** Significant performance gains were achieved by implementing prefix-based fast-paths (`startsWith`, `includes`) to bypass expensive regular expressions in hot loops. Additionally, using `useDeferredValue` for heavy parsing logic prevents UI thread blocking, ensuring editor responsiveness even during high-latency computations. Pre-calculating metadata like `completedCount` during a single-pass parse eliminates the need for secondary iterations in the UI.
**Action:** Use string search methods as guards before running regex. Use `useDeferredValue` for non-critical computations triggered by rapid input. Consolidate data aggregation into a single pass whenever possible.
