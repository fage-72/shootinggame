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
    shotSound: new Audio('shot.wav')
};

assets.background.src = 'background.svg';
assets.bear.src = 'bear.svg';
assets.scope.src = 'scope.svg';

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

// 조준 및 사격 위치 계산 함수
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // CSS로 인해 캔버스 크기가 변해도 내부 좌표(800x600)로 변환
    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

// 이벤트 리스너
const handleMove = (e) => {
    const pos = getPosition(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
};

const handleShoot = (e) => {
    if (!gameActive) return;
    
    // 모바일에서는 터치 지점으로 조준경 이동 후 발사
    const pos = getPosition(e.touches ? e.touches[0] : e);
    mouse.x = pos.x;
    mouse.y = pos.y;

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
            break; 
        }
    }
};

canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleMove(e);
}, { passive: false });

canvas.addEventListener('mousedown', handleShoot);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleShoot(e);
}, { passive: false });

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
