import { useTheme } from "../contexts/ThemeContext";

export function DescriptionSvg() {
	const { isDark } = useTheme();
	const textColor = isDark ? "#e8e8e8" : "#000000";

	return (
		<svg xmlns="http://www.w3.org/2000/svg" id="svg2" viewBox="0 0 632.2 281">
			<style>
				{`
					.st0{font-family:Courier;font-size:12px;fill:${textColor};}
					.st1{fill:none;stroke:${textColor};stroke-miterlimit:10;}
					.st2{font-family:Arial;font-size:10px;fill:${textColor};}
				`}
			</style>
			<rect width="100%" height="100%" fill="none" />
			<text className="st0" transform="translate(4.024 172.96)">
				x (A) 2016-05-20 2016-04-30 measure space for +chapelShelving @chapel
				due:2016-05-30
			</text>
			<path
				d="M15.2 159v-6H.5v6m36 0v-6H21.8v6m96.5 0v-6H47.5v6m149.3 0v-6H126v6m483.7.2V153H206v6.1m238.7 22.8v7.2H335V182m274.7-.1v7.2H509V182m-7.5-.1v7.2h-49.1V182"
				className="st1"
			/>
			<text className="st2" transform="rotate(-45 161.175 55.627)">
				Optional — Marks completion
			</text>
			<text className="st2" transform="rotate(-45 171.8 29.976)">
				Optional -- Marks priority
			</text>
			<text className="st2" transform="rotate(-45 198.684 -34.92)">
				Optional -- Completion Date
			</text>
			<text transform="rotate(-45 237.935 -129.68)">
				<tspan x="0" y="0" className="st2">
					Optional -- Creation Date
				</tspan>
				<tspan x="0" y="12" className="st2">
					(must be specified if completion date is)
				</tspan>
			</text>
			<text transform="rotate(-45 352.18 -405.478)">
				<tspan x="0" y="0" className="st2">
					Description; tags (optional)
				</tspan>
				<tspan x="0" y="12" className="st2">
					can be placed anywhere in here
				</tspan>
			</text>
			<text className="st2" transform="rotate(45 -60.77 576.533)">
				Project Tag
			</text>
			<text className="st2" transform="rotate(45 -17.238 681.627)">
				Context tag
			</text>
			<text className="st2" transform="rotate(45 23.978 781.127)">
				Special key/value tag
			</text>
		</svg>
	);
}
