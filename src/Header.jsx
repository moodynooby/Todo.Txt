import "./App.scss";
import "./Header.scss";
import { PencilRuler , Sun, Moon } from "lucide-react";
import IsDark from "./theme";
import Fullscreen from "./fullscreen";

const Header = () => {
  const [isdark, setIsdark] = IsDark();
  return (
    <header>
      <div className="logo-cont">
        {" "}
        <h1>T0do.TxT</h1>
      </div>
      <div className="ctrl-cont">
        <div className="tool-cont">
        <a
          href="https://todopng.netlify.app/"
          rel="noopener noreferrer"
        >
          <PencilRuler size={20} />
        </a>
        </div>
        <div className="tool-cont fullscreen">
          <Fullscreen size={20} />
        </div>

        <label className="tool-cont toggle ">
          <input
            type="checkbox"
            className="theme-controller"
            value={isdark}
            checked={isdark === "checked"}
            onChange={(e) => setIsdark(e.target.checked ? "checked" : "")}
          />

          <Sun size={20} aria-label="sun" className="theme-icon"/>

          <Moon size={20} aria-label="moon" className="theme-icon"/>


        </label>
      </div>
    </header>
  );
};

export default Header;
    

