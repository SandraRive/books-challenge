/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Dónde buscar clases Tailwind
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    // 2. Configura el contenedor centrado con padding adaptativo
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
    },
    extend: {
      // 3. Breakpoints extra pequeños si los necesitas
      screens: {
        xs: "480px",
      },
      // 4. Colores personalizados
      colors: {
        primary: "#5A67D8",
        secondary: "#ED64A6",
      },
      // 5. Tipografía
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
