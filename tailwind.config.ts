import type { Config } from "tailwindcss"

const config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		fontFamily: {
			Andvari: ["andvari"],
		},
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				red: {
					"50": "#fef2f2",
					"100": "#fee2e2",
					"200": "#fecaca",
					"300": "#fca5a5",
					"400": "#f87171",
					"500": "#ef4444",
					"600": "#dc2626",
					"700": "#b91c1c",
					"800": "#991b1b",
					"900": "#7f1d1d",
					"950": "#450a0a",
				},
				blue: {
					"100": "#E5EEFF",
					"200": "#B7D0FF",
					"300": "#8AB2FF",
					"400": "#5C93FF",
					"500": "#2E75FF",
					"600": "#0057FF",
					"700": "#0049D6",
					"800": "#003BAD",
					"900": "#002D85",
					"1000": "#001F5C",
				},
				green: {
					"50": "#f0fdf4",
					"100": "#dcfce7",
					"200": "#bbf7d0",
					"300": "#86efac",
					"400": "#4ade80",
					"500": "#22c55e",
					"600": "#16a34a",
					"700": "#15803d",
					"800": "#166534",
					"900": "#14532d",
					"950": "#052e16",
				},
				yellow: {
					"50": "#fefce8",
					"100": "#fef9c3",
					"200": "#fef088",
					"300": "#fde047",
					"400": "#facc15",
					"500": "#eab308",
					"600": "#ca8a04",
					"700": "#a16207",
					"800": "#854d0e",
					"900": "#713f12",
					"950": "#422006",
				},
				grayText: {
					"100": "#B2B2B2",
					"200": "#6E7C7C",
					"300": "#2C2C2C",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config