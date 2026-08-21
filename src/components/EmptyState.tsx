import { Stack, Text, ThemeIcon } from "@mantine/core";

/**
 * Shared empty-state surface for all workspaces (DESIGN.md guardrail 5):
 * one icon-in-slot, one bold line, one quiet explanation, and at most a
 * single action. Consumes the shared muted surface so pages stop
 * duplicating the treatment.
 */
interface EmptyStateProps {
	icon: React.ReactNode;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<Stack
			className={`app-empty-state app-surface-muted${className ? ` ${className}` : ""}`}
			align="center"
			justify="center"
			py={60}
			px={20}
			gap="sm"
		>
			<ThemeIcon variant="light" color="evergreen" size={44}>
				{icon}
			</ThemeIcon>
			<Text fw={700}>{title}</Text>
			{description && (
				<Text c="dimmed" size="sm" ta="center">
					{description}
				</Text>
			)}
			{action}
		</Stack>
	);
}
