import { useCallback, useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Card,
	Group,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Wifi, RefreshCw } from "lucide-react";
// @ts-ignore — Kotlin/JS compiled module (no TypeScript declarations yet)
import { mergeHabitsJs } from "@todotxt/core";

/**
 * P2P Sync page for the web app.
 *
 * Protocol (same as native app):
 * 1. "Host" starts a local WebSocket server and shows a QR code
 * 2. "Join" scans the QR → connects via WebSocket → bidirectional sync
 * 3. Both devices merge habits using LWW rules (newer wins, dates union)
 *
 * Note: Browsers cannot listen on arbitrary ports, so the web app acts as
 * the "client" that joins a native app's sync server. The native app must
 * be the host (showing the QR code).
 */
interface SyncPayload {
	deviceId: string;
	timestamp: number;
	habits: {
		id: string;
		name: string;
		color: string;
		reminderEnabled: boolean;
		reminderTime: string;
		completedDates: string[];
		archived: boolean;
		createdAt: number;
		updatedAt: number;
	}[];
}

export default function P2pSyncPage() {
	const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
	const [error, setError] = useState("");
	const [qrUrl, setQrUrl] = useState("");
	const wsRef = useRef<WebSocket | null>(null);
	const habitsRef = useRef<any[]>([]);

	const mergeHabits = useCallback((remoteHabits: any[]) => {
		const local = habitsRef.current;

		// Try shared Kotlin/JS core first (same LWW logic as native app)
		try {
			const localJson = JSON.stringify(local);
			const remoteJson = JSON.stringify(remoteHabits);
			const mergedJson = mergeHabitsJs(localJson, remoteJson);
			habitsRef.current = JSON.parse(mergedJson);
			return;
		} catch (e) {
			console.warn("[P2P] Shared core merge failed, using web fallback:", e);
		}

		// Fallback: use web app's existing reconcile logic
		const merged = new Map<string, any>();
		local.forEach((h: any) => merged.set(h.id, h));
		remoteHabits.forEach((remote: any) => {
			const localHabit = merged.get(remote.id);
			if (!localHabit) {
				merged.set(remote.id, remote);
			} else {
				const mergedDates = Array.from(
					new Set([...localHabit.completedDates, ...remote.completedDates]),
				);
				const base = remote.updatedAt >= localHabit.updatedAt ? remote : localHabit;
				merged.set(remote.id, {
					...base,
					completedDates: mergedDates,
					updatedAt: Math.max(localHabit.updatedAt, remote.updatedAt),
				});
			}
		});
		habitsRef.current = Array.from(merged.values());
	}, []);

	const connectToHost = useCallback((url: string) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) return;

		setStatus("connecting");
		setError("");

		// Convert http:// to ws://
		const wsUrl = url.replace("http://", "ws://").replace("/sync", "/ws");

		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => {
			console.log("[P2P] Connected to host");
			setStatus("connected");
		};

		ws.onmessage = (event) => {
			try {
				const payload: SyncPayload = JSON.parse(event.data);
				console.log(`[P2P] Received ${payload.habits.length} habits`);
				mergeHabits(payload.habits);
				// TODO: Write merged habits back to localStorage/context
			} catch (e) {
				console.error("[P2P] Parse error:", e);
			}
		};

		ws.onclose = () => {
			setStatus("idle");
			wsRef.current = null;
		};

		ws.onerror = () => {
			setError("Failed to connect to host device");
			setStatus("error");
		};
	}, [mergeHabits]);

	const disconnect = useCallback(() => {
		wsRef.current?.close();
		wsRef.current = null;
		setStatus("idle");
	}, []);

	useEffect(() => {
		return () => {
			wsRef.current?.close();
		};
	}, []);

	return (
		<Box p="md">
			<Group mb="md">
				<Wifi size={24} />
				<Title order={3}>P2P Sync</Title>
			</Group>

			<Text c="dimmed" mb="lg">
				Sync your habits with a native app on your local network.
				No internet server needed.
			</Text>

			<Card shadow="sm" radius="md" mb="md">
				<Stack>
					<Text fw={500}>How it works</Text>
					<Text size="sm" c="dimmed">
						1. Open the native app (Android/Desktop) on another device
						<br />
						2. Tap &quot;Show QR&quot; in the Sync tab
						<br />
						3. Both devices must be on the same WiFi network
						<br />
						4. Your data merges automatically (newer changes win)
					</Text>
				</Stack>
			</Card>

			<Card shadow="sm" radius="md" mb="md">
				<Stack>
					<Text fw={500}>Connect to host</Text>
					<Text size="sm" c="dimmed">
						Enter the URL shown on the other device, or scan its QR code
						with a QR reader app and paste the URL here.
					</Text>
					<Group>
						<input
							style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
							placeholder="http://192.168.1.100:8899/sync?device=abc123"
							value={qrUrl}
							onChange={(e) => setQrUrl(e.target.value)}
						/>
						{status === "connected" ? (
							<Button variant="light" color="red" onClick={disconnect}>
								Disconnect
							</Button>
						) : (
							<Button
								onClick={() => connectToHost(qrUrl)}
								disabled={!qrUrl || status === "connecting"}
							>
								{status === "connecting" ? "Connecting..." : "Connect"}
							</Button>
						)}
					</Group>
				</Stack>
			</Card>

			{status === "connected" && (
				<Card shadow="sm" radius="md" bg="#e8f5e9">
					<Group>
						<RefreshCw size={16} />
						<Text size="sm" c="#2e7d32">
							Connected — syncing continuously
						</Text>
					</Group>
				</Card>
			)}

			{error && (
				<Text size="sm" c="red" mt="sm">
					{error}
				</Text>
			)}
		</Box>
	);
}
