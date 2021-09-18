module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.js',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        minWidth: {
            '10': '2.5rem',
            '20': '5rem',
            '32': '8rem',
            '40': '10rem',
        },
        maxHeight: {
            '1/2': '50vh',
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
