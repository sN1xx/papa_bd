const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const resultDiv = document.getElementById('result');
const attemptsDiv = document.getElementById('attempts');
const ctx = wheel.getContext('2d');
const prize_text_Div = document.getElementById('prize');



let attempts = 3;
const prizes = ['Помыть посуду', '10 рублей', '100 рублей', 'Конфета', 'Банан', 'Батончик', '1 рубль', '10 конфет', 'Главный приз', 'Пропылесосить'];
const prizeColors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50']; // Цвета для каждого сектора
const centerX = wheel.width / 2;
const centerY = wheel.height / 2;
const radius = wheel.width / 2 - 5;
const arc = Math.PI / (prizes.length / 2);
let rotationAngle = 0;


// Определенные призы для каждой попытки
const firstAttemptPrize = '10 рублей';
const secondAttemptPrize = 'Конфета';
const thirdAttemptPrize = 'Главный приз - 5000 рублей';

function drawWheel() {
    for (let i = 0; i < prizes.length; i++) {
        const angle = i * arc;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = prizeColors[i % prizeColors.length];
        ctx.fill();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arc / 2);
        ctx.fillStyle = 'white';
        ctx.font = '14px sans-serif';
        ctx.fillText(prizes[i], radius / 2, 5);
        ctx.restore();
    }
}

function spin() {
    if (attempts > 0) {
        let winningPrize;

        if (attempts === 3) {
            winningPrize = firstAttemptPrize;
        } else if (attempts === 2) {
            winningPrize = secondAttemptPrize;
        } else {
            winningPrize = thirdAttemptPrize;
        }

        const winningIndex = prizes.indexOf(winningPrize);
        const targetRotation = 360 * 5 + winningIndex * (360 / prizes.length); // Вращаем на 5 полных оборотов + нужный сектор
        const animationDuration = 6000; // 5 секунд на анимацию

        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            let progress = timestamp - start;
            let angle = Math.min(progress / animationDuration, 1) * targetRotation; // Угол вращения зависит от прогресса

            rotationAngle = angle;
            drawRotated();

            if (progress < animationDuration) {
                requestAnimationFrame(animate);
            } else {
                resultDiv.textContent = `Вы выиграли: ${winningPrize}!`;
            }
        }

        requestAnimationFrame(animate);

        attempts--;
        attemptsDiv.textContent = `Попыток осталось: ${attempts}`;
        if (attempts === 0) {
            spinButton.disabled = true;
            spinButton.textContent = 'Попытки закончились';
        }
    }
}

function drawRotated() {
    ctx.clearRect(0, 0, wheel.width, wheel.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
    drawWheel();
    ctx.restore();
}

drawWheel();
spinButton.addEventListener('click', spin);
