import { Button, Center, Stack, Text, Title } from "@mantine/core";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("ErrorBoundary caught:", error, info);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			const isDev = import.meta.env.DEV;
			return (
				<Center h="100vh">
					<Stack align="center" gap="md">
						<Title order={2}>Something went wrong</Title>
						<Text c="dimmed" size="sm" maw={400} ta="center">
							{isDev
								? this.state.error?.message || "An unexpected error occurred"
								: "An unexpected error occurred. Please refresh the page or try again later."}
						</Text>
						<Button onClick={this.handleReset}>Try Again</Button>
					</Stack>
				</Center>
			);
		}

		return this.props.children;
	}
}
