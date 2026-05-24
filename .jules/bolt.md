## 2025-05-15 - [O(N^2) Array Concatenation Anti-pattern]
**Learning:** Using `(arr || []).concat(item)` inside a loop to categorize items creates a new array and copies all elements on every iteration, leading to $O(N^2)$ performance. This is particularly noticeable in parsers handling large text files.
**Action:** Use an existence check and `push()` to mutate the array in-place, achieving $O(N)$ complexity.

## 2025-05-15 - [Hoisting Redundant Computations]
**Learning:** Helper functions like `getToday()` that instantiate `new Date()` and format strings are expensive when called thousands of times in a loop.
**Action:** Hoist these calls out of the loop and pass the result as a parameter to keep the code efficient while maintaining pure-function-like helpers.
