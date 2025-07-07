type AppIconItem = {
  src: string;
  size: number;
  target?: "apple-touch-icon" | "web-app-manifest";
};

type AppIcon = {
  name?: string;
  icons: AppIconItem[];
  filename?: string;
};
