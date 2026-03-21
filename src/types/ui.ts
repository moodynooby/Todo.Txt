import type { LucideIcon } from "lucide-react";

export interface QuickAction {
	id: string;
	icon: LucideIcon;
	title: string;
	description: string;
	action: () => void;
}
