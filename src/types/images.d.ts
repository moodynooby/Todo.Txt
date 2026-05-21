declare module "*.png" {
	const value: string;
	export default value;
}

declare module "*.css" {} // side-effect CSS imports (Mantine, app styles)
