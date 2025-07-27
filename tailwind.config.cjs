/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			mainGreen: '#295E56',
  			green: '#93aeaa',
  			lightGreen: '#E9EDEC',
  			mainBlack: '#303030',
  			lightBlack: '#565656',
  			secondaryBlack: '#1E1E1E',
  			mainOrange: '#db8028',
  			mainRed: '#B31717',
  			lightGray: '#e9eeed',
  			flatWhite: '#F8F9FB',
  			mainGray: '#DEE1E5',
  			mainDisabled: '#f2f2f2',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		gridTemplateColumns: {
  			view: 'max-content 1fr'
  		},
  		gridTemplateRows: {
  			view: 'max-content 1fr max-content'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-rtl"),
    require("tailwind-scrollbar"),
      require("tailwindcss-animate")
],
  variants: {
    scrollbar: ["rounded"],
  },
};
//   plugins: [...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {})],
