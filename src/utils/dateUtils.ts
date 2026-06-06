const formatDate = (d: Date = new Date()): string => {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const getToday = (): string => formatDate();

export const getTomorrow = (): string => {
	const d = new Date();
	d.setDate(d.getDate() + 1);
	return formatDate(d);
};

export const getYesterday = (): string => {
	const d = new Date();
	d.setDate(d.getDate() - 1);
	return formatDate(d);
};

export interface DateContext {
	today: string;
	tomorrow: string;
	yesterday: string;
}

export const getDateContext = (): DateContext => {
	const now = new Date();
	const today = formatDate(now);

	const tom = new Date(now);
	tom.setDate(now.getDate() + 1);
	const tomorrow = formatDate(tom);

	const yes = new Date(now);
	yes.setDate(now.getDate() - 1);
	const yesterday = formatDate(yes);

	return { today, tomorrow, yesterday };
};
