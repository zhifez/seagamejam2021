module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.js',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        maxHeight: {
            '1/2': '50vh',
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
