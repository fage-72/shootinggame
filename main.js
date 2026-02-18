const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers-container');
const bonusContainer = document.getElementById('bonus-container');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

generateBtn.addEventListener('click', () => {
    numbersContainer.innerHTML = '';
    bonusContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const ball = document.createElement('div');
        ball.classList.add('number-ball');
        ball.textContent = number;
        numbersContainer.appendChild(ball);
    });
});

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.textContent = '🌙';
    } else {
        themeToggleBtn.textContent = '☀️';
    }
});