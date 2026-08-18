# Offline-First Sync Architecture Plan: Todo.Txt Native

This document outlines the architecture for a shared **Kotlin Multiplatform (KMP)** sync engine to enable offline-first synchronization between the Todo.Txt native apps (Android/Desktop) and the existing web infrastructure.

## 1. Core Objectives
The sync engine aims to provide a seamless, conflict-resilient experience across all platforms while maintaining the existing "frontrunner" status of the native application.

*   **Offline-First:** All user actions are performed against a local persistent mirror and queued for background synchronization.
*   **Shared Logic:** The reconciliation and outbox logic will reside in the `native/core` module, ensuring consistent behavior across Android and Desktop.
*   **Web Parity:** The engine will mirror the logic of the existing React web app's `syncEngine.ts` and `syncReconcile.ts`.
*   **Low Latency:** Uses a "Last-Write-Wins" (LWW) strategy with server-side timestamps to minimize reconciliation complexity.

## 2. Shared KMP Sync Engine (`native/core`)

The engine will be implemented as a platform-agnostic core that delegates network and storage operations to platform-specific implementations.

### 2.1 Component Overview

| Component | Responsibility | Implementation |
| :--- | :--- | :--- |
| **SyncOutbox** | Manages a persistent queue of outgoing writes. | `native/core` (logic) + `Storage.kt` |
| **SyncReconciler** | Decides between local and remote snapshots on startup. | `native/core` (Pure function) |
| **SyncAdapter** | Handles the network communication with Firebase REST API. | `native/core` (using Ktor) |
| **SyncManager** | Orchestrates the sync lifecycle (enqueue, flush, reconcile). | `native/core` |

### 2.2 Conflict Resolution Strategy
We will adopt the **Generalized Startup Conflict Resolution** used in the web app:

> **Rule:** Local wins only when its local mirror timestamp (the server-time of the last received snapshot) is strictly greater than the current remote snapshot's timestamp AND the content differs.

| Scenario | Local State | Remote State | Outcome |
| :--- | :--- | :--- | :--- |
| **New User** | Empty | Empty | No-op |
| **Fresh Install** | Empty | Exists | **Pull:** Local seeds from remote |
| **Offline Edits** | Modified (Newer TS) | Stale (Older TS) | **Push:** Local re-queues write |
| **Remote Update** | Stale (Older TS) | Newer TS | **Pull:** Local updates to remote |

## 3. Platform Implementation

### 3.1 Android (WorkManager)
Android will use the system `WorkManager` to ensure sync tasks survive app process death and respect battery/network constraints.

*   **PeriodicSyncWorker:** Fires every 15-60 minutes to flush the outbox.
*   **ImmediateSync:** Triggered on app foreground or significant edits (e.g., task completion).
*   **Constraints:** `NetworkType.CONNECTED` required for all sync operations.

### 3.2 Desktop (Coroutine Scheduler)
Desktop will use a dedicated `CoroutineScope` with a background dispatcher to handle synchronization while the app is running.

*   **Background Loop:** A long-running coroutine that checks the outbox every 5 minutes.
*   **Shutdown Hook:** Ensures a final flush attempt when the application process is terminating.

## 4. Technical Stack

*   **Network:** [Ktor Client](https://ktor.io/) for cross-platform HTTP requests.
*   **Serialization:** [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) for JSON handling (parity with web).
*   **Database:** [SQLDelight](https://cashapp.github.io/sqldelight/) or existing JSON-based `Storage.kt` for the persistent outbox.
*   **API:** Firebase REST API (Firebase Database/Firestore) to avoid bulky JS/Native SDKs.

## 5. Migration Plan

1.  **Phase A:** Implement `SyncOutbox` and `SyncReconciler` in `native/core`.
2.  **Phase B:** Integrate Ktor and implement the Firebase REST adapter.
3.  **Phase C:** Wire `SyncManager` into the existing `Storage.kt` observers.
4.  **Phase D:** Implement `WorkManager` (Android) and Scheduler (Desktop) background tasks.

---
**Author:** Manus AI  
**Date:** August 18, 2026
