import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
  ],
  safelist: [ 
    'text-blue-500',
    'text-yellow-500',
    'text-red-500',
    'text-purple-500',
    'text-green-500',
    'text-blue-500',
    'text-purple-500',
    'text-green-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
