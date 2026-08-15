/** Field Notes Ritual: an asymmetric, botanical journal for daily practice and reflection. */

import {
	ActionIcon,
	Badge,
	Box,
	Button,
	ColorSwatch,
	Divider,
	Group,
	Menu,
	Modal,
	Paper,
	Progress,
	RingProgress,
	SimpleGrid,
	Stack,
	Switch,
	Text,
	TextInput,
	ThemeIcon,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	Archive,
	Bell,
	BellRing,
	Check,
	ChevronRight,
	Flame,
	Leaf,
	MoreHorizontal,
	Plus,
	Sparkles,
	Sprout,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useHabitsContext } from "@/context/HabitsContext";
import { HABIT_COLORS, type HabitColor, type HabitDraft } from "@/types/habits";
import {
	formatLocalDate,
	getCompletionRate,
	getHabitStreak,
	getLastDays,
	isHabitCompleteOn,
} from "@/utils/habitUtils";

const defaultDraft: HabitDraft = {
	name: "",
	color: HABIT_COLORS[0],
	reminderEnabled: true,
	reminderTime: "08:00",
};

function shortDay(date: Date): string {
	return new Intl.DateTimeFormat(undefined, { weekday: "short" })
		.format(date)
		.slice(0, 1);
}

function friendlyDate(date: Date): string {
	return new Intl.DateTimeFormat(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
	}).format(date);
}

export default function HabitsPage() {
	const { state, dispatchHabits } = useHabitsContext();
	const [opened, { open, close }] = useDisclosure(false);
	const [draft, setDraft] = useState<HabitDraft>(defaultDraft);
	const [notificationHint, setNotificationHint] = useState("");
	const today = formatLocalDate(new Date());
	const week = useMemo(() => getLastDays(7), []);
	const habits = state.habits.filter((habit) => !habit.archived);
	const doneToday = habits.filter((habit) => isHabitCompleteOn(habit, today));
	const dailyProgress = habits.length
		? Math.round((doneToday.length / habits.length) * 100)
		: 0;
	const strongestHabit = useMemo(
		() =>
			habits
				.map((habit) => ({ habit, streak: getHabitStreak(habit) }))
				.sort((a, b) => b.streak - a.streak)[0],
		[habits],
	);
	const weeklyCompletion = week.map((date) => {
		const key = formatLocalDate(date);
		const count = habits.filter((habit) =>
			isHabitCompleteOn(habit, key),
		).length;
		return {
			date,
			key,
			count,
			percent: habits.length ? (count / habits.length) * 100 : 0,
		};
	});

	const openNewHabit = () => {
		setDraft(defaultDraft);
		setNotificationHint("");
		open();
	};

	const requestNotificationPermission = async (): Promise<boolean> => {
		if (!("Notification" in window)) {
			setNotificationHint(
				"This browser does not support notification reminders.",
			);
			return false;
		}
		if (Notification.permission === "granted") return true;
		const result = await Notification.requestPermission();
		if (result !== "granted") {
			setNotificationHint(
				"Notifications are off. You can enable them in your browser settings later.",
			);
			return false;
		}
		return true;
	};

	const addHabit = async () => {
		if (!draft.name.trim()) return;
		let reminderEnabled = draft.reminderEnabled;
		if (reminderEnabled)
			reminderEnabled = await requestNotificationPermission();
		dispatchHabits({
			type: "ADD_HABIT",
			payload: { ...draft, reminderEnabled },
		});
		close();
	};

	const toggleReminder = async (id: string, enabled: boolean) => {
		const reminderEnabled = enabled
			? await requestNotificationPermission()
			: false;
		dispatchHabits({
			type: "UPDATE_HABIT",
			payload: { id, updates: { reminderEnabled } },
		});
	};

	return (
		<Box className="habits-page">
			<Box className="habits-texture" />
			<Stack className="habits-shell" gap="xl">
				<header className="habits-header">
					<Box>
						<Group gap="xs" mb={4}>
							<ThemeIcon className="habits-mark" size={30}>
								<Leaf size={16} />
							</ThemeIcon>
							<Text className="habits-eyebrow">YOUR DAILY PRACTICE</Text>
						</Group>
						<Text className="habits-title">Make today count, softly.</Text>
						<Text className="habits-subtitle">{friendlyDate(new Date())}</Text>
					</Box>
					<Button
						className="habits-add-button"
						leftSection={<Plus size={17} />}
						onClick={openNewHabit}
					>
						New habit
					</Button>
				</header>

				<SimpleGrid cols={{ base: 1, lg: 12 }} spacing="xl">
					<Paper className="today-panel" p="xl" withBorder>
						<Box className="today-panel-art" />
						<Group
							justify="space-between"
							align="flex-start"
							mb="xl"
							className="today-panel-heading"
						>
							<Box>
								<Text className="habits-kicker">TODAY’S RITUAL</Text>
								<Text className="today-panel-title">A few small promises.</Text>
							</Box>
							<RingProgress
								size={82}
								thickness={8}
								sections={[{ value: dailyProgress, color: "#d9784f" }]}
								label={
									<Text ta="center" fw={700} size="xs">
										{dailyProgress}%
									</Text>
								}
							/>
						</Group>

						{habits.length === 0 ? (
							<Stack align="center" gap="sm" className="habits-empty">
								<ThemeIcon variant="light" color="green" size={44}>
									<Sprout size={22} />
								</ThemeIcon>
								<Text fw={700}>Start with one small promise.</Text>
								<Text c="dimmed" size="sm" ta="center">
									Choose something you want to notice every day.
								</Text>
								<Button variant="subtle" color="dark" onClick={openNewHabit}>
									Plant your first habit
								</Button>
							</Stack>
						) : (
							<Stack gap="sm">
								{habits.map((habit, index) => {
									const complete = isHabitCompleteOn(habit, today);
									return (
										<Paper
											key={habit.id}
											className={`habit-row ${complete ? "habit-row-complete" : ""}`}
											withBorder
											style={
												{
													"--habit-color": habit.color,
													animationDelay: `${index * 45}ms`,
												} as React.CSSProperties
											}
										>
											<button
												type="button"
												className="habit-check"
												onClick={() =>
													dispatchHabits({
														type: "TOGGLE_COMPLETION",
														payload: { id: habit.id, date: today },
													})
												}
												aria-label={`${complete ? "Undo" : "Complete"} ${habit.name}`}
											>
												{complete && <Check size={17} strokeWidth={3} />}
											</button>
											<Box className="habit-row-copy">
												<Text fw={700} className="habit-name">
													{habit.name}
												</Text>
												<Group gap={6} mt={3}>
													{habit.reminderEnabled ? (
														<BellRing size={13} />
													) : (
														<Bell size={13} />
													)}
													<Text size="xs" c="dimmed">
														{habit.reminderEnabled
															? habit.reminderTime
															: "No reminder"}
													</Text>
													<Text size="xs" c="dimmed">
														·
													</Text>
													<Text size="xs" c="dimmed">
														{getHabitStreak(habit)} day streak
													</Text>
												</Group>
											</Box>
											<Menu shadow="md" width={188} position="bottom-end">
												<Menu.Target>
													<ActionIcon
														variant="subtle"
														color="gray"
														aria-label={`Actions for ${habit.name}`}
													>
														<MoreHorizontal size={18} />
													</ActionIcon>
												</Menu.Target>
												<Menu.Dropdown>
													<Menu.Label>{habit.name}</Menu.Label>
													<Menu.Item
														leftSection={
															habit.reminderEnabled ? (
																<Bell size={14} />
															) : (
																<BellRing size={14} />
															)
														}
														onClick={() =>
															toggleReminder(habit.id, !habit.reminderEnabled)
														}
													>
														{habit.reminderEnabled
															? "Pause reminder"
															: "Enable reminder"}
													</Menu.Item>
													<Menu.Item
														leftSection={<Archive size={14} />}
														onClick={() =>
															dispatchHabits({
																type: "ARCHIVE_HABIT",
																payload: habit.id,
															})
														}
													>
														Archive habit
													</Menu.Item>
													<Menu.Divider />
													<Menu.Item
														color="red"
														leftSection={<Trash2 size={14} />}
														onClick={() =>
															dispatchHabits({
																type: "DELETE_HABIT",
																payload: habit.id,
															})
														}
													>
														Delete habit
													</Menu.Item>
												</Menu.Dropdown>
											</Menu>
										</Paper>
									);
								})}
							</Stack>
						)}
					</Paper>

					<Paper className="insight-panel" p="xl" withBorder>
						<Group justify="space-between" mb="lg">
							<Box>
								<Text className="habits-kicker">YOUR MOMENTUM</Text>
								<Text className="insight-panel-title">
									The rhythm is building.
								</Text>
							</Box>
							<ThemeIcon variant="light" color="orange" size={36}>
								<Sparkles size={18} />
							</ThemeIcon>
						</Group>
						{strongestHabit ? (
							<>
								<Box className="streak-callout">
									<Flame size={22} fill="#d9784f" color="#d9784f" />
									<Box>
										<Text className="streak-number">
											{strongestHabit.streak} days
										</Text>
										<Text size="sm" c="dimmed">
											longest current streak
										</Text>
									</Box>
								</Box>
								<Divider my="lg" />
								<Text size="sm" c="dimmed">
									Your strongest current practice is{" "}
									<Text span fw={700} c="dark">
										{strongestHabit.habit.name}
									</Text>
									. Keep protecting the tiny repeatable action.
								</Text>
							</>
						) : (
							<Text c="dimmed" size="sm">
								Your first check-in will begin a story worth noticing.
							</Text>
						)}
						<Box className="habit-garden-mini" mt="xl">
							<Sprout size={38} />
							<Sprout size={50} />
							<Leaf size={34} />
						</Box>
					</Paper>
				</SimpleGrid>

				<SimpleGrid cols={{ base: 1, md: 12 }} spacing="xl">
					<Paper className="analytics-panel" p="xl" withBorder>
						<Group justify="space-between" align="end" mb="xl">
							<Box>
								<Text className="habits-kicker">WEEKLY CHECK-IN</Text>
								<Text className="analytics-title">
									A view of your recent rhythm.
								</Text>
							</Box>
							<Badge className="week-badge" variant="light">
								{doneToday.length} of {habits.length || 0} today
							</Badge>
						</Group>
						<Box
							className="weekly-chart"
							aria-label="Habit completion activity for the last seven days"
						>
							{weeklyCompletion.map(({ date, key, count, percent }) => (
								<Box key={key} className="weekly-column">
									<Tooltip label={`${count} habits completed`}>
										<Box className="weekly-bar-track">
											<Box
												className="weekly-bar"
												style={{
													height: `${Math.max(percent, count ? 12 : 0)}%`,
												}}
											/>
										</Box>
									</Tooltip>
									<Text
										className={`weekly-label ${key === today ? "weekly-label-today" : ""}`}
									>
										{shortDay(date)}
									</Text>
								</Box>
							))}
						</Box>
					</Paper>

					<Paper className="consistency-panel" p="xl" withBorder>
						<Text className="habits-kicker" mb="sm">
							CONSISTENCY NOTE
						</Text>
						<Text className="consistency-title">
							The details show the direction.
						</Text>
						<Stack gap="md" mt="xl">
							{habits.slice(0, 3).map((habit) => {
								const rate = getCompletionRate(habit);
								return (
									<Box key={habit.id}>
										<Group justify="space-between" mb={5}>
											<Group gap={7}>
												<ColorSwatch color={habit.color} size={8} />
												<Text size="sm" fw={700}>
													{habit.name}
												</Text>
											</Group>
											<Text size="xs" c="dimmed">
												{rate}%
											</Text>
										</Group>
										<Progress value={rate} color={habit.color} size={7} />
									</Box>
								);
							})}
							{habits.length === 0 && (
								<Text size="sm" c="dimmed">
									When you add habits, their 28-day consistency will appear
									here.
								</Text>
							)}
						</Stack>
						<Button
							variant="subtle"
							color="dark"
							px={0}
							mt="lg"
							rightSection={<ChevronRight size={15} />}
							onClick={openNewHabit}
						>
							Add a practice
						</Button>
					</Paper>
				</SimpleGrid>
			</Stack>

			<Modal
				opened={opened}
				onClose={close}
				title={<Text className="modal-title">Plant a new habit</Text>}
				centered
			>
				<Stack gap="lg">
					<Text size="sm" c="dimmed">
						Keep it small, specific, and easy to recognise when you’ve done it.
					</Text>
					<TextInput
						label="What will you practise?"
						placeholder="For example: Read for ten minutes"
						value={draft.name}
						onChange={(event) => {
							const name = event.currentTarget.value;
							setDraft((value) => ({ ...value, name }));
						}}
						autoFocus
					/>
					<Box>
						<Text size="sm" fw={600} mb={8}>
							A color for this practice
						</Text>
						<Group gap="sm">
							{HABIT_COLORS.map((color) => (
								<button
									key={color}
									type="button"
									className={`habit-color-choice ${draft.color === color ? "habit-color-selected" : ""}`}
									style={{ backgroundColor: color }}
									onClick={() =>
										setDraft((value) => ({
											...value,
											color: color as HabitColor,
										}))
									}
									aria-label={`Choose ${color} as the habit color`}
								>
									{draft.color === color && <Check size={15} color="white" />}
								</button>
							))}
						</Group>
					</Box>
					<Switch
						label="Send me a daily reminder"
						checked={draft.reminderEnabled}
						onChange={(event) => {
							const reminderEnabled = event.currentTarget.checked;
							setDraft((value) => ({ ...value, reminderEnabled }));
						}}
						color="teal"
					/>
					{draft.reminderEnabled && (
						<TextInput
							label="Reminder time"
							type="time"
							value={draft.reminderTime}
							onChange={(event) => {
								const reminderTime = event.currentTarget.value;
								setDraft((value) => ({ ...value, reminderTime }));
							}}
						/>
					)}
					{notificationHint && (
						<Text size="xs" c="orange">
							{notificationHint}
						</Text>
					)}
					<Button
						className="habits-add-button"
						onClick={addHabit}
						disabled={!draft.name.trim()}
						leftSection={<Sprout size={16} />}
					>
						Create habit
					</Button>
				</Stack>
			</Modal>
		</Box>
	);
}
