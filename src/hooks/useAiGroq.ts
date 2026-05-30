import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { useCallback, useState } from "react";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export const useAiGroq = (apiKey: string) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
				const errorMessage =
					import.meta.env.DEV && err instanceof Error
						? err.message
						: "AI service encountered an error. Please check your API key and try again.";
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[apiKey],
	);

	return {
		generate,
		isLoading,
		error,
	};
};
