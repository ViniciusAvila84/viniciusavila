document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const player = document.getElementById('player');
    const scoreElement = document.getElementById('score');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const startOverlay = document.getElementById('start-overlay');
    const finalScoreElement = document.getElementById('final-score');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    if (!canvas || !player) return;

    let isJumping = false;
    let isGameOver = true;
    let score = 0;
    let gameSpeed = 5;
    let obstacleTimeout;
    let scoreInterval;

    function jump() {
        if (isJumping || isGameOver) return;
        isJumping = true;
        player.classList.add('jumping');
        setTimeout(() => {
            player.classList.remove('jumping');
            isJumping = false;
        }, 500);
    }

    function createObstacle() {
        if (isGameOver) return;

        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.classList.add('asteroid');
        obstacle.innerHTML = '<i class="fa-solid fa-bug"></i>'; // Bugs to dodge!
        canvas.appendChild(obstacle);

        let obstaclePosition = canvas.offsetWidth || 800;

        function moveObstacle() {
            if (isGameOver) {
                obstacle.remove();
                return;
            }

            obstaclePosition -= gameSpeed;
            obstacle.style.left = obstaclePosition + 'px';

            // Collision detection
            const playerRect = player.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            if (
                playerRect.right > obstacleRect.left + 10 &&
                playerRect.left < obstacleRect.right - 10 &&
                playerRect.bottom > obstacleRect.top + 10
            ) {
                endGame();
            }

            if (obstaclePosition < -50) {
                obstacle.remove();
                return;
            }

            requestAnimationFrame(moveObstacle);
        }

        moveObstacle();

        // Schedule next obstacle
        const nextTime = Math.random() * 2000 + 1000;
        obstacleTimeout = setTimeout(createObstacle, nextTime / (gameSpeed / 5));
    }

    function startGame() {
        isGameOver = false;
        score = 0;
        gameSpeed = 5;
        scoreElement.innerText = 'Score: 0';
        startOverlay.classList.add('hidden');
        gameOverOverlay.classList.add('hidden');

        // Clear any existing obstacles
        const existingObstacles = document.querySelectorAll('.obstacle');
        existingObstacles.forEach(obs => obs.remove());

        createObstacle();

        scoreInterval = setInterval(() => {
            if (!isGameOver) {
                score++;
                scoreElement.innerText = `Score: ${score}`;
                // Increase difficulty
                if (score % 500 === 0) {
                    gameSpeed += 0.5;
                }
            }
        }, 10);
    }

    function endGame() {
        isGameOver = true;
        gameOverOverlay.classList.remove('hidden');
        finalScoreElement.innerText = `Pontuação: ${score}`;
        clearTimeout(obstacleTimeout);
        clearInterval(scoreInterval);
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (!isGameOver) {
                e.preventDefault(); // Prevent scrolling ONLY when playing
                jump();
            }
        }
    });

    const handleJumpEvent = (e) => {
        if (!isGameOver) {
            e.preventDefault();
            jump();
        }
    };

    canvas.addEventListener('mousedown', handleJumpEvent);
    canvas.addEventListener('touchstart', handleJumpEvent, { passive: false });

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startGame();
    });

    restartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startGame();
    });
});
