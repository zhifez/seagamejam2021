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
            '60': '15rem',
            '80': '20rem',
            '1/4': '25%',
            '1/5': '20%',
            '1/6': '33.33%',
            '1/8': '12.5%',
        },
        minHeight: {
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
