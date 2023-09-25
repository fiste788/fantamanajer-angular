/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      'xs': { 'max': '559.98px' },
      // => @media (min-width: 640px and max-width: 767px) { ... }

      //'sm': { 'min': '600px', 'max': '959.98px' },
      'sm': '600px',
      // => @media (min-width: 640px and max-width: 767px) { ... }

      //'md': { 'min': '960px', 'max': '1279.98px' },
      'md': '960px',
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      //'lg': { 'min': '1280px', 'max': '1919.98px' },
      'lg': '1280px',
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      'xl': '1920px',
    }
  },
};
