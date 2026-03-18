import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

export const toggleFullscreen = ({
	element = document.documentElement,
} = {}): void => {
	if (!document.fullscreenElement) {
		element.requestFullscreen().catch((err) => {
			console.error(`Error attempting to enable fullscreen: ${err.message}`);
		});
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
	}
};

const FullscreenToggle = () => {
	const [isFullscreen, setIsFullscreen] = useState(false);

	useEffect(() => {
		const handleFullscreenChange = (): void => {
			setIsFullscreen(!!document.fullscreenElement);
		};
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);

	return <>{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}</>;
};

export default FullscreenToggle;
