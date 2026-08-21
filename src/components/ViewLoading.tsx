import { Box } from "@mantine/core";

/**
 * Shared lazy-view placeholder: a quiet, token-driven skeleton that mirrors
 * a workspace layout (floating toolbar above a raised canvas) so the real
 * view appears to arrive in place instead of replacing a text loader.
 */
const ViewLoading = () => (
	<Box
		className="app-view-loading"
		role="status"
		aria-label="Loading workspace"
	>
		<Box className="app-view-loading-toolbar" />
		<Box className="app-view-loading-canvas" />
	</Box>
);

export default ViewLoading;
