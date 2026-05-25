## 2025-05-15 - [O(N^2) Pattern in Todo Parser]
**Learning:** Using `Array.prototype.concat()` in a loop to build collections (projects, contexts, etc.) creates O(N^2) complexity because `concat` creates a new array every time.
**Action:** Use `Array.prototype.push()` instead, which is O(1) amortized, reducing parsing time significantly for large datasets.

## 2025-05-15 - [Function Hoisting in Hot Loops]
**Learning:** Repeatedly calling helper functions that perform identical date calculations (like `getToday()`) inside a loop over thousands of items is wasteful.
**Action:** Hoist pure or stable calculations out of the loop and pass them in or use local variables.
