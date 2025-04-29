/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,ts}",
	],
	theme: {
		extend: {
		keyframes: {
			"fade-in": {
              "0%": {
                  opacity: 0
              },
              "100%": {
                  opacity: 1
              },
          	},
			"fade-out-left": {
				"0%": {
					opacity: 1,
				},
				"100%": {
					opacity: 0,
					transform: "translate3d(-100%, 0, 0)",
				},
			},
			"fade-in-right": {
				"0%": {
					opacity: 0,
					transform: "translate3d(100%, 0, 0)",
				},
				"100%": {
					opacity: 1,
					transform: "translate3d(0, 0, 0)",
				},
			},
			"fade-out": {
				"0%": {
					opacity: 1
				},
				"100%": {
					opacity: 0
				},
			},
			"slide-down": {
				"0%": {
					transform: "translate3d(0, 0, 0)",
				},
				"100%": {
					transform: "translate3d(0, 100%, 0)",
				},
			},
			"slide-in-up": {
				"0%": {
					visibility: "visible",
					transform: "translate3d(0, 20%, 0)",
				},
				"100%": {
					transform: "translate3d(0, 0, 0)",
				},
			},
			"slide-out-down": {
				"0%": {
					transform: "translate3d(0, 0, 0)",
				},
				"100%": {
					visibility: "hidden",
					transform: "translate3d(0, 100%, 0)",
				},
			},

		},
		animation: {
			fadein: 'fade-in 2s ease-in-out 0s 1',
			fadeoutleft: 'fade-out-left 2s ease-in-out 1',
			fadeinright: 'fade-in-right 2s ease-in-out 1',
			slidedown: 'slide-down 2s ease-in-out 1',
			slideinup: 'slide-in-up 0.5s ease-in-out 1',
			slideoutdown: 'slide-out-down 2s ease-in-out 1',
			fadeout: 'fade-out 2s ease-out 1',
		},
		},
	},
  plugins: [],
}

