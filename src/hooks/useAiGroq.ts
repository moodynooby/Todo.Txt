import { useCallback, useEffect, useRef, useState } from "react";

import { TODO_AI_SYSTEM_PROMPT } from "@/features/ai/aiPrompts";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

interface ChatCompletionResponse {
	choices?: Array<{ message?: { content?: string } }>;
	error?: { message?: string };
}

export const useAiGroq = (apiKey: string, model = DEFAULT_MODEL) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const mountedRef = useRef(true);
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

			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;

			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(GROQ_ENDPOINT, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({
													model,

						messages: [
							{
								role: "system",
								content: systemPrompt || TODO_AI_SYSTEM_PROMPT,
							},
							{ role: "user", content: prompt },
						],
					}),
					signal: controller.signal,
				});

				const data = (await response.json()) as ChatCompletionResponse;

				if (!mountedRef.current || controller.signal.aborted) return null;
				if (!response.ok) {
					throw new Error(
						data.error?.message || `Groq API error (${response.status})`,
					);
				}

				return data.choices?.[0]?.message?.content ?? null;
			} catch (err) {
				if (!mountedRef.current || controller.signal.aborted) return null;
				console.error("Groq API Error:", err);
				const errorMessage = err instanceof Error ? err.message : String(err);
				setError(errorMessage);
				return null;
			} finally {
				if (mountedRef.current && !controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		},
		[apiKey, model],
	);

	return { generate, isLoading, error };
};
