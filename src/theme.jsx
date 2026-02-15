import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
const Theme = () => {

  const [isdark, setIsdark] = useState(() => {
    const savedValue = localStorage.getItem("isdark");
    if (savedValue !== null) {
      return JSON.parse(savedValue);
    } else {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "checked";
      }
      return "";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("isdark", JSON.stringify(isdark));
    } catch {
      // Silent fail
    }
    document.documentElement.setAttribute(
      "data-theme",
      isdark === "checked" ? "dark" : "light",
    );
  }, [isdark]);

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        value={isdark}
        checked={isdark === "checked"}
        onChange={(e) => setIsdark(e.target.checked ? "checked" : "")}
      />
      <Sun size={20} aria-label="sun" className="swap-off" />
      <Moon size={20} aria-label="moon" className=" swap-on " />
    </label>
  );
};
export default Theme;
