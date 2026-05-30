import { parseTodoContent } from "./todoParser";

const generateLargeContent = (count: number) => {
	const priorities = ["(A)", "(B)", "(C)", ""];
	const projects = ["+project1", "+project2", "+work", "+home", ""];
	const contexts = ["@office", "@phone", "@computer", ""];
	const dates = ["today", "tomorrow", "2024-12-31", ""];

	let content = "";
	for (let i = 0; i < count; i++) {
		const p = priorities[Math.floor(Math.random() * priorities.length)];
		const prj = projects[Math.floor(Math.random() * projects.length)];
		const ctx = contexts[Math.floor(Math.random() * contexts.length)];
		const due = dates[Math.floor(Math.random() * dates.length)];
		const completed = Math.random() > 0.5 ? "x " : "";

		content += `${completed}${p ? p + " " : ""}Task number ${i} ${prj} ${ctx}${due ? " due:" + due : ""}\n`;
	}
	return content;
};

const runBenchmark = () => {
	console.log("Generating data...");
	const content = generateLargeContent(10000);
	console.log("Starting benchmark for 10,000 lines...");

	const start = performance.now();
	const result = parseTodoContent(content);
	const end = performance.now();

	console.log(`Parsing took: ${(end - start).toFixed(2)}ms`);
	console.log(`Tasks parsed: ${result.tasks.length}`);
	console.log(`Priorities found: ${Object.keys(result.priorities).length}`);
};

runBenchmark();
