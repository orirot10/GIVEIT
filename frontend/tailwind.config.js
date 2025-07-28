import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
};
