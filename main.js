const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers-container');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

generateBtn.addEventListener('click', () => {
    numbersContainer.innerHTML = '';

    for (let i = 0; i < 6; i++) {
        const gameContainer = document.createElement('div');
        gameContainer.classList.add('game-container');

        const numbers = new Set();
        while (numbers.size < 7) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
        const bonusNumber = sortedNumbers.pop();

        sortedNumbers.forEach(number => {
            const ball = document.createElement('div');
            ball.classList.add('number-ball');
            ball.textContent = number;
            gameContainer.appendChild(ball);
        });

        const bonusBall = document.createElement('div');
        bonusBall.classList.add('number-ball', 'bonus-ball');
        bonusBall.textContent = bonusNumber;
        gameContainer.appendChild(bonusBall);

        numbersContainer.appendChild(gameContainer);
    }
});

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggleBtn.textContent = '🌙';
    } else {
        themeToggleBtn.textContent = '☀️';
    }
});