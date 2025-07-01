import React, { useState, useEffect } from "react";
function IsDark() {
  const [isdark, setIsdark] = useState("");

  useEffect(() => {
    const savedValue = localStorage.getItem("isdark");
    if (savedValue !== null) {
      setIsdark(JSON.parse(savedValue));
    } else {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setIsdark("checked");
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("isdark", JSON.stringify(isdark));
        // Set theme based on isdark value
        document.documentElement.setAttribute(
          "data-theme",
          isdark === "checked" ? "sunset" : "corporate"
        );
    }
  }, [isdark]);

  return [isdark, setIsdark];
}

export default IsDark;
