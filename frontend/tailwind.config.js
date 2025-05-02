module.exports = {
    content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // ודא שאתה סורק את כל הקבצים של ה-React
    ],
    plugins: [
    require('daisyui'), // הוסף את הפלאגין כאן
    ],
    daisyui: {
    themes: ["light", "dark", "cupcake"], // תוכל להוסיף את הנושאים שברצונך להשתמש בהם
    },
}