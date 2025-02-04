/**
 * This is a minimal config.
 *
 * If you need the full config, get it from here:
 * https://unpkg.com/browse/tailwindcss@latest/stubs/defaultConfig.stub.js
 */
const colors = require('tailwindcss/colors')
module.exports = {
    content: [
        /**
         * HTML. Paths to Django template files that will contain Tailwind CSS classes.
         */

        /*  Templates within theme app (<tailwind_app_name>/templates), e.g. base.html. */
        '../templates/**/*.html',

        /*
         * Main templates directory of the project (BASE_DIR/templates).
         * Adjust the following line to match your project structure.
         */
        '../../templates/**/*.html',

        /*
         * Templates in other django apps (BASE_DIR/<any_app_name>/templates).
         * Adjust the following line to match your project structure.
         */
        '../../**/templates/**/*.html',

        /**
         * JS: If you use Tailwind CSS in JavaScript, uncomment the following lines and make sure
         * patterns match your project structure.
         */
        /* JS 1: Ignore any JavaScript in node_modules folder. */
        // '!../../**/node_modules',
        /* JS 2: Process all JavaScript files in the project. */
        // '../../**/*.js',

        /**
         * Python: If you use Tailwind CSS classes in Python, uncomment the following line
         * and make sure the pattern below matches your project structure.
         */
        // '../../**/*.py'
    ],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'dark-main': '#18191A',
                'dark-second': '#242526',
                'dark-third': '#3A3B3C',
                'dark-txt': '#B8BBBF',
                sky: colors.sky,
                teal: colors.teal,
                rose: colors.rose,
            },
            maxWidth: {
                '120': '27rem',
                '50': '10rem',
            },
            minWidth: {
                '50': '5rem',
            },
            keyframes: {
                customPing: {
                  '75%, 100%': { transform: 'scale(2)',  opacity: '0' },
                }
            },
            animation: {
                'custom-ping': 'customPing 1s cubic-bezier(0, 0, 0.2, 1)',
            }
            
        },
    },
    variants: {
        extend: {
            display: ['group-hover'],
            transform: ['group-hover'],
            scale: ['group-hover'],
            textOpacity: ['dark'],
        },
    },
    plugins: [
        /**
         * '@tailwindcss/forms' is the forms plugin that provides a minimal styling
         * for forms. If you don't like it or have own styling for forms,
         * comment the line below to disable '@tailwindcss/forms'.
         */
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
        require('tailwind-scrollbar-hide'),
    ],
}
