## 2025-05-15 - [Optimization of Todo Parser]
**Learning:** Replaced $O(N^2)$ array concatenation with $O(N)$ push operations in the todo parser. Using `.concat()` in a loop creates a new array every time, leading to quadratic time complexity. Also hoisted date utility calls and context object creation out of the loop.
**Action:** Always prefer `.push()` over `.concat()` when building large collections in a loop. Hoist constant or semi-constant values (like current dates) and object literals out of hot loops to reduce GC pressure and redundant computations.

## 2026-05-28 - [Full-Stack React Optimization for Todo Management]
**Learning:** Implemented a multi-layered optimization: (1) (N)$ single-pass parser with string-prefix fast-paths, (2) UI responsiveness via `useDeferredValue` to decouple typing from heavy analysis, and (3) component memoization with stabilized props (`useMemo` for styles) to prevent redundant re-renders.
**Action:** For document-based apps, always decouple the editor state from heavy analytical derivative state using `useDeferredValue`. Ensure memoization is effective by stabilizing object props. Pre-compute aggregate stats (like `completedCount`) during the initial data transformation pass.
