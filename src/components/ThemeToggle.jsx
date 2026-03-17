import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle = () => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<label className="swap swap-rotate">
			<input type="checkbox" checked={isDark} onChange={toggleTheme} />
			<Sun size={20} aria-label="sun" className="swap-off" />
			<Moon size={20} aria-label="moon" className=" swap-on " />
		</label>
	);
};

export default ThemeToggle;
