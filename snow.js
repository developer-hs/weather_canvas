import Utility from "./utility.js";

class Snow {
    constructor(x, y, size, velocity, ctx, mouse) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocity = velocity;
        this.ctx = ctx;
        this.mouse = mouse;
        this.snowDropSpeed = 4;
        this.piles = [];
        this.meltSpeed = 0.005;
        this.maxPileSize = 40;
        this.opacity = 0.8;
    }

    draw() {
        // 빛나는 효과를 위한 그라데이션 생성
        const gradient = this.ctx.createRadialGradient(this.x, this.y, this.size, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        // 빛나는 효과 그리기
        this.ctx.beginPath();
        this.ctx.fillStyle = gradient;
        this.ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        this.ctx.fill();

        // 눈송이 그리기
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        this.ctx.fill();
    }

    pileUp() {
        // 현재 눈송이 위치 아래에 있는 눈더미 찾기
        const nearbyPile = this.piles.find((pile) => {
            const isWithinWidth = Math.abs(pile.x - this.x) < pile.width / 2;
            const pileTop = pile.y - pile.height;
            const isAtPileHeight = Math.abs(this.y - pileTop) < 5;
            return isWithinWidth && isAtPileHeight && pile.opacity > 0.5;
        });

        if (nearbyPile) {
            // 기존 눈더미 위에 쌓기

            nearbyPile.height = Math.min(nearbyPile.height + 1.5, this.maxPileSize);
            nearbyPile.width = Math.min(nearbyPile.width + 0.5, this.maxPileSize * 1.5);
            nearbyPile.opacity = 1;

            // 눈송이 재설정
            this.x = Utility.randomBetween(-innerWidth * 0.2, innerWidth * 1.4);
            this.y = -20;
        } else if (this.y > innerHeight) {
            // 바닥에 새로운 눈더미 만들기
            this.piles.push({
                x: this.x,
                y: innerHeight,
                width: 15 + Utility.randomBetween(0, 10),
                height: 10 + Utility.randomBetween(0, 5),
                opacity: 1,
                meltSpeed: this.meltSpeed * (0.5 + Utility.randomBetween(0, 0.5)),
            });

            // 눈송이 재설정
            this.x = Utility.randomBetween(-innerWidth * 0.2, innerWidth * 1.4);
            this.y = -20;
        }
    }

    drawPiles() {
        for (let i = this.piles.length - 1; i >= 0; i--) {
            const pile = this.piles[i];

            // 현재 크기 계산 (opacity에 따라 조절)
            const currentWidth = pile.width + Math.sin(pile.opacity * Math.PI) * 3;
            const currentHeight = pile.height * pile.opacity;

            // 부드러운 빛나는 효과를 위한 그라데이션
            const glowGradient = this.ctx.createRadialGradient(
                pile.x,
                pile.y - currentHeight / 2,
                0,
                pile.x,
                pile.y - currentHeight / 2,
                currentWidth * 1.5 // 현재 크기에 비례하여 빛나는 효과 조절
            );
            glowGradient.addColorStop(0, `rgba(255, 255, 255, ${pile.opacity * 0.2})`);
            glowGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

            // 빛나는 효과 그리기
            this.ctx.beginPath();
            this.ctx.fillStyle = glowGradient;
            this.ctx.ellipse(
                pile.x,
                pile.y,
                currentWidth * 1.5, // 현재 크기에 비례
                currentHeight * 1.2,
                0,
                0,
                Math.PI,
                true
            );
            this.ctx.fill();

            // 눈더미 본체 그리기
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${pile.opacity})`;
            this.ctx.ellipse(pile.x, pile.y, currentWidth, currentHeight, 0, 0, Math.PI, true);
            this.ctx.fill();

            // 눈더미 표면 하이라이트 효과
            const surfaceGradient = this.ctx.createRadialGradient(
                pile.x,
                pile.y - currentHeight / 2,
                0,
                pile.x,
                pile.y - currentHeight / 2,
                currentWidth
            );
            surfaceGradient.addColorStop(0, `rgba(255, 255, 255, ${pile.opacity})`);
            surfaceGradient.addColorStop(1, `rgba(255, 255, 255, ${pile.opacity * 0.5})`);

            this.ctx.beginPath();
            this.ctx.fillStyle = surfaceGradient;
            this.ctx.ellipse(pile.x, pile.y, currentWidth, currentHeight, 0, 0, Math.PI, true);
            this.ctx.fill();

            // 눈더미 녹이기
            pile.opacity -= pile.meltSpeed;

            if (pile.opacity <= 0) {
                this.piles.splice(i, 1);
            }
        }
    }

    animate() {
        // 눈송이가 눈더미에 닿았는지 확인
        const hitPile = this.piles.find((pile) => {
            const isWithinWidth = Math.abs(pile.x - this.x) < pile.width / 2;
            const pileTop = pile.y - pile.height;
            return isWithinWidth && this.y > pileTop && pile.opacity > 0.5;
        });

        if (hitPile || this.y > innerHeight) {
            // 눈송이가 눈더미에 닿았거나 바닥에 떨어졌으면 눈더미 위에 쌓기
            this.pileUp();
        }

        this.velocity.x = this.mouse.isActive
            ? Utility.randomBetween(-0.05, 0.05) + (-innerWidth / 2 + this.mouse.x) / 300
            : Utility.randomBetween(-0.05, 0.05);

        this.x += this.velocity.x;
        this.y += this.velocity.y / this.snowDropSpeed;
        this.drawPiles();
        this.draw();
    }
}

export { Snow };
