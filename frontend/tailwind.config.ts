import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        brand: {
          bg:       "var(--bg-app)",      // app background
          surface:  "var(--bg-card)",     // card/modal surface
          panel:    "var(--bg-card)",     // deep card panel
          card:     "var(--bg-card)",     // standard card
          sidebar:  "var(--bg-sidebar)",  // sidebar background
          // Accents
          primary:  "var(--brand)",       // primary theme accent
          secondary:"var(--brand-secondary)", // secondary theme accent
          success:  "#10B981",      // emerald green for success
          warning:  "#F59E0B",      // amber yellow for warning
          danger:   "#EF4444",      // red danger
          // Text
          text:     "var(--text-main)",
          muted:    "var(--text-muted)",
        }
      },
      backgroundImage: {
        // Page background: blurred warm purple-mauve
        'hero-gradient':  'linear-gradient(135deg, #6B5B80 0%, #7A6B90 25%, #8B7AA0 50%, #6A5B80 75%, #5A4D70 100%)',
        // Glassmorphism card surface
        'glass-card':     'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
        'glass-card-hover': 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))',
        // Metric card hazes
        'card-orange-haze': 'radial-gradient(ellipse at top right, rgba(240,112,64,0.30) 0%, rgba(240,112,64,0.08) 50%, transparent 70%)',
        'card-lime-haze':   'radial-gradient(ellipse at top right, rgba(200,230,80,0.28) 0%, rgba(200,230,80,0.06) 50%, transparent 70%)',
        'card-mixed-haze':  'radial-gradient(ellipse at top right, rgba(240,112,64,0.22) 0%, rgba(200,230,80,0.10) 55%, transparent 72%)',
        // Sidebar
        'sidebar-active': 'linear-gradient(90deg, rgba(240,112,64,0.22), rgba(240,112,64,0.08))',
        // Chart fills
        'chart-area':     'linear-gradient(180deg, rgba(240,112,64,0.40) 0%, rgba(240,112,64,0.04) 100%)',
        // Glow spots
        'card-glow':      'radial-gradient(ellipse at top right, rgba(240,112,64,0.18), transparent 65%)',
        'metric-glow':    'radial-gradient(ellipse at top right, rgba(240,112,64,0.20), transparent 70%)',
        'success-card':   'linear-gradient(135deg, rgba(200,230,80,0.12), transparent)',
        'warning-card':   'linear-gradient(135deg, rgba(245,166,35,0.12), transparent)',
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
} satisfies Config;

export default config;

