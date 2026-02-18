const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');

// 캔버스 크기 설정
canvas.width = 800;
canvas.height = 600;

// 게임 상태
let score = 0;
let timeLeft = 30;
let gameActive = false;
let bears = [];
const mouse = { x: 0, y: 0 };

// 이미지 및 사운드 로드
const assets = {
    background: new Image(),
    bear: new Image(),
    scope: new Image(),
    shotSound: new Audio('shot.mp3')
};

assets.background.src = 'background.jpg';
assets.bear.src = 'bear.png';
assets.scope.src = 'scope.png';

// 곰 클래스
class Bear {
    constructor() {
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.spawnTime = Date.now();
        this.lifeTime = 1500; // 1.5초 동안 나타남
        this.isHit = false;
    }

    draw() {
        if (!this.isHit) {
            ctx.drawImage(assets.bear, this.x, this.y, this.width, this.height);
        }
    }

    update() {
        return Date.now() - this.spawnTime < this.lifeTime && !this.isHit;
    }
}

// 이벤트 리스너
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', () => {
    if (!gameActive) return;

    // 사격 소리
    assets.shotSound.currentTime = 0;
    assets.shotSound.play().catch(e => console.log("Sound play failed"));

    // 충돌 검사
    for (let i = bears.length - 1; i >= 0; i--) {
        const bear = bears[i];
        if (mouse.x > bear.x && mouse.x < bear.x + bear.width &&
            mouse.y > bear.y && mouse.y < bear.y + bear.height) {
            bear.isHit = true;
            score += 10;
            scoreElement.textContent = score;
            break; // 한 번에 한 마리만
        }
    }
});

startBtn.addEventListener('click', startGame);

function startGame() {
    score = 0;
    timeLeft = 30;
    bears = [];
    gameActive = true;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    startScreen.style.display = 'none';
    
    const gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);

    animate();
}

function endGame() {
    gameActive = false;
    startScreen.style.display = 'flex';
    startScreen.querySelector('h1').textContent = `게임 종료! 최종 점수: ${score}`;
    startScreen.querySelector('p').textContent = '다시 시작하려면 버튼을 누르세요.';
}

function animate() {
    if (!gameActive) return;

    // 배경 그리기
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);

    // 곰 생성 및 관리
    if (Math.random() < 0.03 && bears.length < 5) {
        bears.push(new Bear());
    }

    bears = bears.filter(bear => {
        bear.draw();
        return bear.update();
    });

    // 조준경 그리기 (마우스 중심)
    const scopeSize = 100;
    ctx.drawImage(assets.scope, mouse.x - scopeSize/2, mouse.y - scopeSize/2, scopeSize, scopeSize);

    requestAnimationFrame(animate);
}
