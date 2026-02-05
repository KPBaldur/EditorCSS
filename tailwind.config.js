/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#00d6bd",
                "secondary": "#FF9700",
                "accent-purple": "#CC99FF",
                "background-dark": "#101114",
                "panel-dark": "#1F2022",
                "canvas-dark": "#131416",
                "border-muted": "rgba(255, 255, 255, 0.05)"
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"]
            }
        },
    },
    plugins: [],
}
