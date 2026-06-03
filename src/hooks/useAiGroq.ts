import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export const useAiGroq = (apiKey: string) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const mountedRef = useRef(true);
	// Holds the abort controller for the current in-flight request
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			abortRef.current?.abort();
		};
	}, []);

	const generate = useCallback(
		async (prompt: string, systemPrompt?: string) => {
			if (!apiKey) {
				setError("API Key is missing. Please set it in settings.");
				return null;
			}

			// Abort any previous in-flight request
			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;

			setIsLoading(true);
			setError(null);

			try {
				const groq = createGroq({ apiKey });

				const { text } = await generateText({
					model: groq(DEFAULT_MODEL),
					system:
						systemPrompt ||
						"You are a helpful assistant for managing todo lists. Return ONLY the processed text without any preamble or explanation.",
					prompt,
					abortSignal: controller.signal,
				});

				if (!mountedRef.current || controller.signal.aborted) return null;
				return text;
			} catch (err) {
				if (!mountedRef.current || controller.signal.aborted) return null;
				console.error("Groq API Error:", err);
				const errorMessage =
					import.meta.env.DEV && err instanceof Error
						? err.message
						: "An error occurred while communicating with the AI service.";
				setError(errorMessage);
				return null;
			} finally {
				if (mountedRef.current && !controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		},
		[apiKey],
	);

	return { generate, isLoading, error };
};
