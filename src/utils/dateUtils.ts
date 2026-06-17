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

export const getDateContext = (): DateContext => ({
	today: getToday(),
	tomorrow: getTomorrow(),
	yesterday: getYesterday(),
});
