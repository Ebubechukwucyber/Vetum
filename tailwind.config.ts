import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#07070B",
        ink: "#0C0C12",
        line: "#1C1C28",
        bone: "#F4EFE6",
        mist: "#A7A29A",
        violet: "#7B6CFF",
        allow: "#C8F4D2",
        deny: "#FF5A4F",
        confirm: "#E8B86D",
        paper: "#6E7B8B",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
