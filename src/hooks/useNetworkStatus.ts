import { useCallback, useEffect, useState } from "react";

interface NetworkStatusReturn {
	isOnline: boolean;
}

export const useNetworkStatus = (): NetworkStatusReturn => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	const handleOnline = useCallback(() => setIsOnline(true), []);
	const handleOffline = useCallback(() => setIsOnline(false), []);

	useEffect(() => {
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [handleOnline, handleOffline]);

	return { isOnline };
};
