import { parseTodoContent } from "./todoParser";

const generateLargeTodoList = (count: number): string => {
	const lines = [];
	for (let i = 0; i < count; i++) {
		const priority = i % 5 === 0 ? "(A) " : i % 7 === 0 ? "(B) " : "";
		const completed = i % 3 === 0 ? "x " : "";
		const project = ` +project${i % 10}`;
		const context = ` @context${i % 5}`;
		const due = i % 4 === 0 ? " due:2025-05-20" : "";
		lines.push(`${completed}${priority}Task ${i}${project}${context}${due}`);
	}
	return lines.map((line) => `<p>${line}</p>`).join("");
};

const runBenchmark = () => {
	console.log("Generating 5000 lines of todo content...");
	const content = generateLargeTodoList(5000);

	console.log("Running parseTodoContent 50 times...");
	const start = performance.now();
	for (let i = 0; i < 50; i++) {
		parseTodoContent(content);
	}
	const end = performance.now();

	const totalTime = end - start;
	const averageTime = totalTime / 50;

	console.log(`Total time: ${totalTime.toFixed(2)}ms`);
	console.log(`Average time: ${averageTime.toFixed(2)}ms per parse`);
};

runBenchmark();
