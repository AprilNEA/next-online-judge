/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        'node_modules/daisyui/dist/**/*.js',
        'node_modules/react-daisyui/dist/**/*.js',
    ],
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
