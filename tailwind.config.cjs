module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.js',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        minHeight: {
            '1/4': '25%',
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
