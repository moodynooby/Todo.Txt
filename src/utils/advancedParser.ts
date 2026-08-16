/**
 * Advanced Natural Language, Dependency, and Recurrence Parser for Todo.Txt
 */

export interface ASTNode {
	type: string;
	value?: any;
	children?: ASTNode[];
}

export interface RecurrenceRule {
	freq: "daily" | "weekly" | "monthly" | "yearly";
	interval: number;
	byDay?: number[];
	byMonthDay?: number[];
	nthWeekday?: { n: number; day: number };
	time?: string;
	mode: "strict" | "workdays" | "completion";
}

export interface ParsedTaskMetadata {
	id?: string;
	after: string[];
	blocks: string[];
	recurrence?: RecurrenceRule;
	dueDate?: string;
	dueTime?: string;
	ast?: ASTNode;
}

export const FORMAL_PEG_GRAMMAR = `
Start           = Expression
Expression      = RelativeDate / RecurringSchedule / DependencyExpr / RecurrenceExpr
RelativeDate    = "in" ws+ Number ws+ TimeUnit
TimeUnit        = "days" / "day" / "weeks" / "week" / "months" / "month" / "years" / "year"
RecurringSchedule = "every" ws+ (NthWeekday / WeekdayList / IntervalSchedule) (ws+ "at" ws+ Time)?
NthWeekday      = Ordinal ws+ Weekday
Ordinal         = [1-9] [0-9]* ("st" / "nd" / "rd" / "th")?
Weekday         = "Monday" / "Tuesday" / "Wednesday" / "Thursday" / "Friday" / "Saturday" / "Sunday"
WeekdayList     = Weekday ("," ws* Weekday)*
IntervalSchedule = Number ws+ TimeUnit
Time            = [0-2][0-3]? ":" [0-5][0-9] (ws* [ap]m)?
DependencyExpr  = AfterExpr / BlocksExpr
AfterExpr       = "after:" IdList
BlocksExpr      = "blocks:" IdList
IdList          = Identifier ("," Identifier)*
Identifier      = [a-zA-Z0-9_-]+
RecurrenceExpr  = "rec:" ("strict" / "workdays" / "completion")
ws              = [ \\t\\n\\r]
Number          = [0-9]+
`;

export function parseRelativeDateExpression(
	text: string,
	baseDate = new Date(),
): { date: Date; ast: ASTNode } | null {
	const match = text.match(
		/in\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)/i,
	);
	if (!match) return null;

	const amount = parseInt(match[1], 10);
	const unit = match[2].toLowerCase();
	const targetDate = new Date(baseDate.getTime());

	if (unit.startsWith("day")) targetDate.setDate(targetDate.getDate() + amount);
	else if (unit.startsWith("week"))
		targetDate.setDate(targetDate.getDate() + amount * 7);
	else if (unit.startsWith("month"))
		targetDate.setMonth(targetDate.getMonth() + amount);
	else if (unit.startsWith("year"))
		targetDate.setFullYear(targetDate.getFullYear() + amount);

	return {
		date: targetDate,
		ast: { type: "RelativeDate", value: { amount, unit } },
	};
}

export function parseRecurringScheduleExpression(
	text: string,
): { rule: RecurrenceRule; ast: ASTNode } | null {
	const match = text.match(
		/every\s+([a-zA-Z0-9\s,]+?)(?:\s+at\s+([0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm)?))?(?:\s+rec:(strict|workdays|completion))?$/i,
	);
	if (!match) return null;

	const schedulePart = match[1].trim();
	const timePart = match[2] ? match[2].trim() : undefined;
	const modePart = (
		match[3] ? match[3].toLowerCase() : "strict"
	) as RecurrenceRule["mode"];

	let freq: RecurrenceRule["freq"] = "weekly";
	let interval = 1;
	let nthWeekday: RecurrenceRule["nthWeekday"] | undefined;
	let byDay: number[] | undefined;

	const weekdayMap: Record<string, number> = {
		sunday: 0,
		monday: 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6,
	};

	const nthMatch = schedulePart.match(/^(\d+)(?:st|nd|rd|th)?\s+([a-zA-Z]+)$/i);
	if (nthMatch && weekdayMap[nthMatch[2].toLowerCase()] !== undefined) {
		const n = parseInt(nthMatch[1], 10);
		const dayName = nthMatch[2].toLowerCase();
		freq = "monthly";
		nthWeekday = { n, day: weekdayMap[dayName] };
	} else {
		const parts = schedulePart.split(",").map((s) => s.trim().toLowerCase());
		const matchedDays = parts
			.map((p) => weekdayMap[p])
			.filter((d) => d !== undefined);
		if (matchedDays.length > 0) {
			freq = "weekly";
			byDay = matchedDays;
		} else {
			const intervalMatch = schedulePart.match(
				/(\d+)?\s*(day|days|week|weeks|month|months|year|years)/i,
			);
			if (intervalMatch) {
				interval = intervalMatch[1] ? parseInt(intervalMatch[1], 10) : 1;
				const u = intervalMatch[2].toLowerCase();
				if (u.startsWith("day")) freq = "daily";
				else if (u.startsWith("week")) freq = "weekly";
				else if (u.startsWith("month")) freq = "monthly";
				else if (u.startsWith("year")) freq = "yearly";
			}
		}
	}

	let normalisedTime: string | undefined;
	if (timePart) {
		const tLower = timePart.toLowerCase();
		const isPm = tLower.includes("pm");
		const isAm = tLower.includes("am");
		const cleanTime = tLower.replace(/[ap]m/g, "").trim();
		const timeParts = cleanTime.split(":");
		let hh = parseInt(timeParts[0] || "0", 10);
		const mm = parseInt(timeParts[1] || "0", 10);
		if (isPm && hh < 12) hh += 12;
		if (isAm && hh === 12) hh = 0;
		normalisedTime = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
	}

	const rule: RecurrenceRule = {
		freq,
		interval,
		byDay,
		nthWeekday,
		time: normalisedTime,
		mode: modePart,
	};

	return { rule, ast: { type: "RecurringSchedule", value: rule } };
}

export function parseTaskMetadata(text: string): ParsedTaskMetadata {
	const after: string[] = [];
	const blocks: string[] = [];
	let recurrence: RecurrenceRule | undefined;

	const idMatch = text.match(/\bid:([a-zA-Z0-9_-]+)/);
	const id = idMatch ? idMatch[1] : undefined;

	const afterMatch = text.match(/\bafter:([a-zA-Z0-9_,-]+)/);
	if (afterMatch)
		after.push(
			...afterMatch[1]
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
		);

	const blocksMatch = text.match(/\bblocks:([a-zA-Z0-9_,-]+)/);
	if (blocksMatch)
		blocks.push(
			...blocksMatch[1]
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
		);

	const recModeMatch = text.match(/\brec:(strict|workdays|completion)/i);
	let recMode: RecurrenceRule["mode"] = recModeMatch
		? (recModeMatch[1].toLowerCase() as any)
		: "strict";

	if (text.includes("every")) {
		const recurringResult = parseRecurringScheduleExpression(text);
		if (recurringResult) {
			recurrence = { ...recurringResult.rule, mode: recMode };
		}
	} else if (recModeMatch) {
		recurrence = { freq: "weekly", interval: 1, mode: recMode };
	}

	return { id, after, blocks, recurrence };
}

export interface DependencyGraphNode {
	id: string;
	taskText: string;
	completed: boolean;
	after: string[];
	blocks: string[];
	status: "active" | "blocked" | "completed";
}

export class DependencyGraph {
	private nodes: Map<string, DependencyGraphNode> = new Map();

	addNode(node: DependencyGraphNode) {
		this.nodes.set(node.id, node);
	}

	detectCycles(): { hasCycle: boolean; cyclePath: string[] } {
		const visited = new Set<string>();
		const visiting = new Set<string>();
		let cyclePath: string[] = [];

		const dfs = (id: string, path: string[]): boolean => {
			visiting.add(id);
			path.push(id);

			const node = this.nodes.get(id);
			if (node) {
				const neighbors = new Set<string>([...node.blocks]);
				for (const [otherId, otherNode] of this.nodes.entries()) {
					if (otherNode.after.includes(id)) neighbors.add(otherId);
				}

				for (const neighbor of neighbors) {
					if (visiting.has(neighbor)) {
						cyclePath = [...path, neighbor];
						return true;
					}
					if (!visited.has(neighbor)) {
						if (dfs(neighbor, [...path])) return true;
					}
				}
			}

			visiting.delete(id);
			visited.add(id);
			return false;
		};

		for (const id of this.nodes.keys()) {
			if (!visited.has(id)) {
				if (dfs(id, [])) return { hasCycle: true, cyclePath };
			}
		}

		return { hasCycle: false, cyclePath: [] };
	}

	propagateStatus(): Map<string, "active" | "blocked" | "completed"> {
		const statuses = new Map<string, "active" | "blocked" | "completed">();

		for (const [id, node] of this.nodes.entries()) {
			if (node.completed) statuses.set(id, "completed");
		}

		let changed = true;
		while (changed) {
			changed = false;
			for (const [id, node] of this.nodes.entries()) {
				if (node.completed) continue;

				let isBlocked = false;
				for (const reqId of node.after) {
					const reqNode = this.nodes.get(reqId);
					if (!reqNode || !reqNode.completed) {
						isBlocked = true;
						break;
					}
				}

				const newStatus = isBlocked ? "blocked" : "active";
				if (statuses.get(id) !== newStatus) {
					statuses.set(id, newStatus);
					changed = true;
				}
			}
		}

		return statuses;
	}
}

export function calculateNextDueDate(
	currentDueDate: string,
	completionDate: string,
	rule: RecurrenceRule,
): string {
	const baseStr = rule.mode === "completion" ? completionDate : currentDueDate;
	const baseDate = new Date(baseStr || new Date().toISOString().split("T")[0]);

	if (rule.freq === "daily")
		baseDate.setDate(baseDate.getDate() + rule.interval);
	else if (rule.freq === "weekly")
		baseDate.setDate(baseDate.getDate() + 7 * rule.interval);
	else if (rule.freq === "monthly")
		baseDate.setMonth(baseDate.getMonth() + rule.interval);
	else if (rule.freq === "yearly")
		baseDate.setFullYear(baseDate.getFullYear() + rule.interval);

	if (rule.mode === "workdays") {
		const dayOfWeek = baseDate.getDay();
		if (dayOfWeek === 6) baseDate.setDate(baseDate.getDate() + 2);
		else if (dayOfWeek === 0) baseDate.setDate(baseDate.getDate() + 1);
	}

	return baseDate.toISOString().split("T")[0];
}
