// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // CONFIRMACIÓN DE LA RUTA:
  content: [
    "./index.html",
    // Esta es la ruta estándar, si tu código está en 'src', es correcto.
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'azul-intenso': '#0070F3',    // Azul Intenso [cite: 41]
        'purpura-vibrante': '#7928CA', // Púrpura Vibrante [cite: 40]
        'rojo-ai': '#FF0055',        // Rojo AI (Acento) [cite: 43]
        'azul-oscuro-nodo': '#0A192F', // Azul Oscuro (Nodo Central) [cite: 44]
        
      },
      // Degradados Primarios (para usar con gradientes personalizados)
      // Degradado Púrpura-Magenta, Azul-Cian, Rojo-Escarlata
      backgroundImage: theme => ({
        'flow-gradient-1': 'linear-gradient(135deg, #7928CA, #FF0080)', // Púrpura-Magenta
        'flow-gradient-2': 'linear-gradient(135deg, #0070F3, #00BFFF)', // Azul-Cian
        'flow-gradient-3': 'linear-gradient(135deg, #FF0055, #FF4D4D)', // Rojo-Escarlata
      }),
      fontFamily: {
        // Usando una fuente Sans Serif recomendada [cite: 49]
        sans: ['Montserrat', 'Lato', 'Poppins', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};

