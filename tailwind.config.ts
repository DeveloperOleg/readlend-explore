import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				roboto: ['Roboto', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				neon: 'hsl(var(--neon))',
				autumn: {
					'gradient-start': 'hsl(var(--autumn-gradient-start))',
					'gradient-end': 'hsl(var(--autumn-gradient-end))',
					'button': 'hsl(var(--autumn-button))',
					'button-text': 'hsl(var(--autumn-button-text))',
					'accent': 'hsl(var(--autumn-accent))',
					'leaf-brown': 'hsl(var(--autumn-leaf-brown))',
					'fog': 'hsl(var(--autumn-fog))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(20px)', opacity: '0' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'search-expand': {
          '0%': { width: '40px', borderRadius: '9999px' },
          '100%': { width: '100%', borderRadius: 'calc(var(--radius) - 2px)' }
        },
        'search-collapse': {
          '0%': { width: '100%', borderRadius: 'calc(var(--radius) - 2px)' },
          '100%': { width: '40px', borderRadius: '9999px' }
        },
        'pulse-neon': {
          '0%, 100%': { 
            boxShadow: '0 0 8px 2px hsl(var(--neon))',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 16px 4px hsl(var(--neon))',
            transform: 'scale(1.05)' 
          }
        },
        'autumn-fall': {
          '0%': {
            transform: 'translateY(-100vh) rotate(0deg)',
            opacity: '0'
          },
          '10%': {
            opacity: '0.7'
          },
          '90%': {
            opacity: '0.7'
          },
          '100%': {
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0'
          }
        },
        'autumn-fog-drift': {
          '0%, 100%': {
            transform: 'translateX(-10px)'
          },
          '50%': {
            transform: 'translateX(10px)'
          }
        },
        'autumn-click-burst': {
          '0%': {
            transform: 'scale(0.5) rotate(0deg)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(1.5) rotate(180deg)',
            opacity: '0'
          }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in': 'slide-in 0.4s ease-out',
        'slide-out': 'slide-out 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'search-expand': 'search-expand 0.3s ease-out forwards',
        'search-collapse': 'search-collapse 0.3s ease-out forwards',
        'pulse-neon': 'pulse-neon 4s infinite',
        'autumn-fall': 'autumn-fall linear infinite',
        'autumn-fog-drift': 'autumn-fog-drift 10s ease-in-out infinite',
        'autumn-click-burst': 'autumn-click-burst 0.6s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
