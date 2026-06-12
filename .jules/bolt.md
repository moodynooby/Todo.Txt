## 2025-05-15 - [Optimization of Todo Parser]
**Learning:** Replaced $O(N^2)$ array concatenation with $O(N)$ push operations in the todo parser. Using `.concat()` in a loop creates a new array every time, leading to quadratic time complexity. Also hoisted date utility calls and context object creation out of the loop.
**Action:** Always prefer `.push()` over `.concat()` when building large collections in a loop. Hoist constant or semi-constant values (like current dates) and object literals out of hot loops to reduce GC pressure and redundant computations.

## 2025-05-16 - [Advanced Parser Optimizations and UI Responsiveness]
**Learning:** Even $O(N)$ operations can become bottlenecks if they involve expensive regexes or redundant passes over large data. Using `useDeferredValue` is highly effective for keeping text inputs responsive when they drive expensive derived state.
**Action:** Use "fast-path" string checks (`startsWith`, `includes`, `indexOf`) to avoid regex execution in loops. Consolidate multiple passes over the same data into a single loop. Leverage React's concurrent features like `useDeferredValue` for expensive computations triggered by user input.

## 2025-05-18 - [Consolidated Single-Pass Filtering and Parser Date Hoisting]
**Learning:** Consolidating multiple filtering passes (showCompleted, search, active filter) and metadata calculation (completedCount) into a single `for...of` loop reduced overhead significantly compared to chained `.filter()` calls which allocate intermediate arrays. Hoisting `DateContext` out of the line-by-line parser loop reduced parsing time by ~45% for large files.
**Action:** Replace chained array operations with a single pass when multiple filters are applied. Hoist redundant computations (like date string generation) out of hot loops.
