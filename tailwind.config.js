// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'angola-red': '#EF4444', // Um vermelho forte
        'angola-black': '#1A202C', // Um preto quase carvão
        'angola-yellow': '#FBBF24', // Um amarelo dourado
        'angola-green': '#10B981', // Um verde vibrante
        'angola-brown': '#7C2D12', // Um marrom terroso
        'primary-brand': '#FFD700', // Exemplo de um dourado para destaque
        'secondary-brand': '#DC2626', // Exemplo de um vermelho para ação
        'text-dark': '#2D3748', // Para textos escuros
        'bg-light': '#F3F4F6', // Para fundos claros
      },
      fontFamily: {
        // Se você quiser uma fonte específica que remeta à cultura angolana
        // Ex: 'ubuntu', 'poppins' ou uma fonte customizada (ver abaixo)
      },
    },
  },
  plugins: [],
}

