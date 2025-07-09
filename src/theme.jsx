import React, { useState, useEffect } from "react";
function IsDark() {
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

  return [isdark, setIsdark];
}

export default IsDark;
