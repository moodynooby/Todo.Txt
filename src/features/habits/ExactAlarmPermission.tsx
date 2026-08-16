/** Field Notes Ritual: exact-alarm permission entry (Tauri/Android only).
 *
 * Battery-restriction policies on modern Android let the OS drift or drop
 * habit reminders scheduled through the standard notification API. The exact-
 * alarm path (`src/lib/exactAlarms.ts`) fixes that, but Android requires the
 * user to grant a runtime permission in system settings. This component
 * surfaces the current state and one tap away from the grant screen; it
 * renders nothing on the web/PWA build where exact alarms do not apply.
 */

import { Box, Button, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { AlarmClock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
	canScheduleExactAlarms,
	openExactAlarmSettings,
} from "@/lib/exactAlarms";

export default function ExactAlarmPermission() {
	const [allowed, setAllowed] = useState<boolean | null>(null);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		let mounted = true;
		void canScheduleExactAlarms().then((result) => {
			if (!mounted) return;
			// `allowed` only means the permission has been granted; we show
			// the card until the user has confirmed either outcome.
			setAllowed(result.allowed);
			setChecked(true);
		});
		return () => {
			mounted = false;
		};
	}, []);

	// Web/PWA builds (or devices that cannot grant the permission) show
	// nothing — reminders work through the standard notification API there.
	if (!checked || allowed !== false) return null;

	return (
		<Paper className="exact-alarm-card" p="lg" withBorder shadow="sm">
			<Group justify="space-between" align="flex-start" wrap="nowrap">
				<ThemeIcon variant="light" color="orange" size={40}>
					<AlarmClock size={20} />
				</ThemeIcon>
				<Box>
					<Text fw={700} size="sm">
						Keep reminders exact
					</Text>
					<Text size="xs" c="dimmed" mt={2}>
						Android may delay habit reminders to save battery. Granting
						exact-alarm access makes them fire at the set time even when the app
						is closed.
					</Text>
				</Box>
				<Button
					size="xs"
					variant="outline"
					leftSection={<ShieldCheck size={15} />}
					onClick={() => void openExactAlarmSettings()}
				>
					Allow
				</Button>
			</Group>
		</Paper>
	);
}
