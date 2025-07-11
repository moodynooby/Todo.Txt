import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
const Theme = () => {
  var darkTheme = "dark";
  var lightTheme = "emerald";

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
    localStorage.setItem("isdark", JSON.stringify(isdark));
    // Set theme based on isdark value
    document.documentElement.setAttribute(
      "data-theme",
      isdark === "checked" ? darkTheme : lightTheme,
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
