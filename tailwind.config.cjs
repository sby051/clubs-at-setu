module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    plugins: [
        require('@tailwindcss/typography')
    ],
    theme: {
        extend: {
            colors: {
                offwhite: "#f2f2f2",
                offblack: "#15181d"
            },
            fontFamily: {
                sans: ["Inter var", "sans-serif"],
            },
        },
    }
};
