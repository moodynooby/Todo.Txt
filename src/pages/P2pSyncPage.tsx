import { Box, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { ArrowLeft, RefreshCw, Wifi } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHabitsContext } from "@/context/HabitsContext";
import { useViewContext } from "@/context/ViewContext";
import { mergeHabits } from "@/lib/core";
import type { Habit } from "@/types/habits";

/**
 * P2P Sync page for the web app.
 *
 * Protocol (same as native app):
 * 1. "Host" starts a local WebSocket server and shows a QR code
 * 2. "Join" scans the QR -> connects via WebSocket -> bidirectional sync
 * 3. Both devices merge habits using shared core LWW rules
 *    (newer wins, completed-date union)
 *
 * Note: Browsers cannot listen on arbitrary ports, so the web app acts as
 * the "client" that joins a native app's sync server. The native app must
 * be the host (showing the QR code).
 */

interface SyncPayload {
	deviceId: string;
	timestamp: number;
	habits: Habit[];
}

export default function P2pSyncPage() {
	const [status, setStatus] = useState<
		"idle" | "connecting" | "connected" | "error"
	>("idle");
	const [error, setError] = useState("");
	const [qrUrl, setQrUrl] = useState("");
	const wsRef = useRef<WebSocket | null>(null);
	const { state: habitsState, dispatchHabits } = useHabitsContext();
	const { dispatchView } = useViewContext();
	const habitsRef = useRef<Habit[]>([]);

	const connectToHost = useCallback(
		(url: string) => {
			if (wsRef.current?.readyState === WebSocket.OPEN) return;

			setStatus("connecting");
			setError("");
			habitsRef.current = habitsState.habits;

			// Convert http:// to ws://
			const wsUrl = url.replace("http://", "ws://").replace("/sync", "/ws");

			const ws = new WebSocket(wsUrl);
			wsRef.current = ws;

			ws.onopen = () => {
				console.log("[P2P] Connected to host");
				setStatus("connected");
				ws.send(
					JSON.stringify({
						deviceId: `web-${Date.now().toString(36)}`,
						timestamp: Date.now(),
						habits: habitsRef.current,
					}),
				);
			};

			ws.onmessage = (event) => {
				try {
					const payload: SyncPayload & { habits: unknown[] } = JSON.parse(
						event.data,
					);
					const next = mergeHabits(
						habitsRef.current,
						payload.habits as Habit[],
					);
					if (next.length === 0 && habitsRef.current.length === 0) {
						throw new Error("empty merge result");
					}
					habitsRef.current = next;
					dispatchHabits({ type: "SET_HABITS", payload: next });
				} catch (e) {
					console.error("[P2P] Merge error:", e);
					setError("Received data could not be merged.");
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
		},
		[dispatchHabits, habitsState.habits],
	);

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
				<Button
					variant="subtle"
					color="gray"
					leftSection={<ArrowLeft size={16} />}
					onClick={() =>
						dispatchView({ type: "SET_VIEW_MODE", payload: "todo" })
					}
				>
					Back
				</Button>
				<Wifi size={24} />
				<Title order={3}>P2P Sync</Title>
			</Group>

			<Text c="dimmed" mb="lg">
				Sync your habits with a native app on your local network. No internet
				server needed.
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
						Enter the URL shown on the other device, or scan its QR code with a
						QR reader app and paste the URL here.
					</Text>
					<Group>
						<input
							style={{
								flex: 1,
								padding: "8px",
								borderRadius: "4px",
								border: "1px solid #ccc",
							}}
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
