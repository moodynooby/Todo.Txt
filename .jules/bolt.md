## 2025-05-15 - [Optimization of Todo Parser]
**Learning:** Replaced $O(N^2)$ array concatenation with $O(N)$ push operations in the todo parser. Using `.concat()` in a loop creates a new array every time, leading to quadratic time complexity. Also hoisted date utility calls and context object creation out of the loop.
**Action:** Always prefer `.push()` over `.concat()` when building large collections in a loop. Hoist constant or semi-constant values (like current dates) and object literals out of hot loops to reduce GC pressure and redundant computations.

## 2025-05-16 - [Advanced Parser Optimizations and UI Responsiveness]
**Learning:** Even $O(N)$ operations can become bottlenecks if they involve expensive regexes or redundant passes over large data. Using `useDeferredValue` is highly effective for keeping text inputs responsive when they drive expensive derived state.
**Action:** Use "fast-path" string checks (`startsWith`, `includes`, `indexOf`) to avoid regex execution in loops. Consolidate multiple passes over the same data into a single loop. Leverage React's concurrent features like `useDeferredValue` for expensive computations triggered by user input.

## 2026-06-06 - [Date Context Hoisting and Single-Pass Filtering]
**Learning:** Calling `new Date()` and string formatting inside tight loops (like a todo parser or list filter) is a major performance bottleneck. Consolidating multiple `filter` and `map` calls into a single `for...of` loop reduces intermediate array allocations and redundant iterations.
**Action:** Hoist expensive calculations (dates, regex creation, object literals) out of loops by using a context object or predicate factory. Favor single-pass iterations for complex filtering/counting logic in React hooks.
