import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { useCallback, useState } from "react";

const STORAGE_KEY = "groq_api_key";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export const useAiGroq = () => {
	const [apiKey, setApiKeyState] = useState<string>(
		() => localStorage.getItem(STORAGE_KEY) || "",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const saveApiKey = (key: string) => {
		localStorage.setItem(STORAGE_KEY, key);
		setApiKeyState(key);
	};

	const generate = useCallback(
		async (prompt: string, systemPrompt?: string) => {
			if (!apiKey) {
				setError("API Key is missing. Please set it in settings.");
				return null;
			}

			setIsLoading(true);
			setError(null);

			try {
				const groq = createGroq({
					apiKey: apiKey,
				});

				const { text } = await generateText({
					model: groq(DEFAULT_MODEL),
					system:
						systemPrompt ||
						"You are a helpful assistant for managing todo lists. Return ONLY the processed text without any preamble or explanation.",
					prompt: prompt,
				});

				return text;
			} catch (err) {
				console.error("Groq API Error:", err);
				const errorMessage = err instanceof Error ? err.message : String(err);
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[apiKey],
	);

	return {
		apiKey,
		saveApiKey,
		generate,
		isLoading,
		error,
	};
};
