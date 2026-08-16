# Advanced Natural Language & Dependency Parser for Todo.Txt

## Executive Summary

Standard `todo.txt` plain text task formats lack native syntax for relative date scheduling, task dependencies (prerequisites and blocking), sub-task hierarchies, and advanced recurrence semantics [1]. To bridge this gap, we have engineered a deep Abstract Syntax Tree (AST) parsing engine and dependency graph framework directly integrated into the `todo.txt` ecosystem.

This document outlines the formal Parsing Expression Grammar (PEG), the dependency graph validation engine with cycle detection and automatic status propagation, and the enhanced recurrence rules (`rec:strict`, `rec:workdays`, `rec:completion`).

---

## 1. Formal Parsing Expression Grammar (PEG)

The parsing engine uses a formal Parsing Expression Grammar (PEG) to tokenize and parse natural language date expressions, recurring schedules, and task metadata. Below is the EBNF-style specification for the parser grammar:

```ebnf
// Todo.Txt Advanced PEG Grammar Specification
Start           = Expression

Expression      = RelativeDate / RecurringSchedule / DependencyExpr / RecurrenceExpr

RelativeDate    = "in" ws+ Number ws+ TimeUnit
TimeUnit        = "days" / "day" / "weeks" / "week" / "months" / "month" / "years" / "year"

RecurringSchedule = "every" ws+ (NthWeekday / WeekdayList / IntervalSchedule) (ws+ "at" ws+ Time)?
NthWeekday      = Ordinal ws+ Weekday
Ordinal         = [1-9] [0-9]* ("st" / "nd" / "rd" / "th")?
Weekday         = "Monday" / "Tuesday" / "Wednesday" / "Thursday" / "Friday" / "Saturday" / "Sunday"
WeekdayList     = Weekday ("," ws* Weekday)*
IntervalSchedule = Number ws+ TimeUnit

Time            = [0-2][0-3]? ":" [0-5][0-9] (ws* [ap]m)?

DependencyExpr  = AfterExpr / BlocksExpr
AfterExpr       = "after:" IdList
BlocksExpr      = "blocks:" IdList
IdList          = Identifier ("," Identifier)*
Identifier      = [a-zA-Z0-9_-]+

RecurrenceExpr  = "rec:" ("strict" / "workdays" / "completion")
ws              = [ \\t\\n\\r]
Number          = [0-9]+
```

### Supported Natural Language Input Examples

| Input Pattern | AST Node Type | Evaluated Result / Behavior |
| :--- | :--- | :--- |
| `in 3 days` | `RelativeDate` | Current Date + 3 calendar days |
| `every 2nd Tuesday at 3pm` | `RecurringSchedule` | Monthly on the 2nd Tuesday at 15:00 |
| `every Monday, Wednesday, Friday at 10:00` | `RecurringSchedule` | Weekly on Mon, Wed, Fri at 10:00 |
| `id:task1 blocks:task2 after:auth` | `DependencyExpr` | Assigns task ID, declares blocker & prerequisite |
| `rec:workdays` | `RecurrenceExpr` | Skips weekends when calculating next due date |

---

## 2. Task Dependency Graph & Status Propagation

Managing task trees requires robust validation to prevent circular dependencies and ensure proper status inheritance. 

### Core Features
1. **Explicit Identification**: Tasks can be tagged with `id:identifier`.
2. **Prerequisites & Blockers**:
   - `after:id1,id2`: Declares that the task cannot be activated until `id1` and `id2` are completed.
   - `blocks:id3`: Declares that this task blocks downstream task `id3`.
3. **Cycle Detection**: Using Depth First Search (DFS) with a visitation stack, the engine detects circular dependencies in $O(V + E)$ time. If a cycle is detected, graph evaluation flags an error.
4. **Automatic Status Propagation**:
   - **Completed**: If a task is checked off (`completed: true`).
   - **Blocked**: If any prerequisite in `after` is incomplete.
   - **Active**: If all prerequisites are completed and the task is pending.

| Dependency State | Prerequisite Status | Resulting Task Status |
| :--- | :--- | :--- |
| `after:task1` | Incomplete (`active` / `blocked`) | `blocked` |
| `after:task1` | Completed (`completed`) | `active` |
| Task Completed | Any | `completed` |

---

## 3. Enhanced Recurrence Rules

Standard recurrence in `todo.txt` (`rec:1w`) simply adds time to the due date. Our advanced parser introduces three distinct recurrence modes:

| Mode | Behavior & Calculation Formula | Use Case |
| :--- | :--- | :--- |
| **`rec:strict`** | Next Due = Previous Due + Interval | Fixed schedule tasks (e.g., monthly rent due on the 1st regardless of payment date). |
| **`rec:workdays`** | Next Due = Previous Due + Interval (automatically shifts Saturday/Sunday to Monday) | Business operations and weekday reports. |
| **`rec:completion`** | Next Due = Completion Date + Interval | Habits and recurring chores where timing depends on when it was actually finished. |

---

## 4. Verification and Test Suite

All parsing logic, PEG AST builders, cycle detection algorithms, and recurrence rule calculations have been verified through an automated test suite located at `src/utils/advancedParser.test.ts`.

```bash
npx tsx src/utils/advancedParser.test.ts
```

---

## References

[1] Todo.txt Format Specification & Extensions: https://github.com/todotxt/todo.txt
[2] Parsing Expression Grammar (PEG) Formalisms: Bryan Ford, "Parsing Expression Grammars: A Recognition-Based Syntactic Foundation", POPL 2004.
