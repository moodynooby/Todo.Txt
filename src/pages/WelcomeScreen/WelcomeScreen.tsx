import {
	ArrowRight,
	BookOpen,
	Clock,
	FilePlus,
	FolderOpen,
	type LucideIcon,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import "./WelcomeScreen.css";

interface QuickAction {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
	action: () => void;
}

interface WelcomeScreenProps {
	onNewFile: () => void;
	onOpenRepo: () => void;
}

const WelcomeScreen = ({ onNewFile, onOpenRepo }: WelcomeScreenProps) => {
	const [hoveredAction, setHoveredAction] = useState<string | null>(null);

	const quickActions: QuickAction[] = [
		{
			id: "new-file",
			icon: FilePlus,
			title: "New File",
			description: "Create a new todo.txt file",
			color: "#a9a5ff",
			action: onNewFile,
		},
		{
			id: "open-repo",
			icon: FolderOpen,
			title: "Open Repository",
			description: "Open an existing todo.txt file",
			color: "#4ade80",
			action: onOpenRepo,
		},
		{
			id: "recent",
			icon: Clock,
			title: "Open Recent",
			description: "Continue from where you left off",
			color: "#fbbf24",
			action: () => {},
		},
		{
			id: "help",
			icon: BookOpen,
			title: "Documentation",
			description: "Learn about todo.txt format",
			color: "#f472b6",
			action: () => {},
		},
	];

	const codePreview = `x 2026-02-16 2026-02-15 Complete UI redesign
(A) Call mom @Personal due:2026-02-17
(B) Review PR #123 @Work
+ groceries @Shopping
Buy milk
Buy eggs
Buy bread
priority:A @Work`;

	return (
		<div className="welcome-screen flex flex-col items-center justify-center min-h-[calc(100vh-76px)] p-8">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-2 gradient-text">
					Welcome to T0do.Txt
				</h1>
				<p className="text-base opacity-70">
					Your minimalist task management companion
				</p>
			</div>

			<div className="quick-actions-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl w-full mb-12">
				{quickActions.map((action) => (
					<button
						key={action.id}
						type="button"
						onClick={action.action}
						onMouseEnter={() => setHoveredAction(action.id)}
						onMouseLeave={() => setHoveredAction(null)}
						className="card bg-base-200 border border-base-300 hover:shadow-xl transition-all text-left p-5"
						style={{
							boxShadow:
								hoveredAction === action.id
									? `var(--shadow-lg), 0 0 0 1px ${action.color}40`
									: undefined,
							transform: hoveredAction === action.id ? "translateY(-2px)" : "",
						}}
					>
						<div
							className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
							style={{
								backgroundColor: `${action.color}20`,
							}}
						>
							<action.icon size={20} style={{ color: action.color }} />
						</div>
						<div className="flex-1">
							<div className="font-semibold text-sm mb-1 flex items-center gap-2">
								{action.title}
								{hoveredAction === action.id && (
									<ArrowRight size={14} className="opacity-60" />
								)}
							</div>
							<div className="text-xs opacity-60">{action.description}</div>
						</div>
					</button>
				))}
			</div>

			<div className="preview-card card bg-base-200 border border-base-300 max-w-2xl w-full p-6 shadow-md">
				<div className="preview-header flex justify-between items-center mb-4">
					<span className="text-xs uppercase tracking-wider opacity-60">
						Preview
					</span>
					<div className="text-primary text-xs flex items-center gap-2">
						<Sparkles size={12} />
						<span>todo.txt format</span>
					</div>
				</div>
				<pre className="code-preview font-mono text-sm leading-relaxed m-0 whitespace-pre-wrap opacity-90">
					<span className="code-preview-text text-primary">{codePreview}</span>
				</pre>
			</div>
		</div>
	);
};

export default WelcomeScreen;
