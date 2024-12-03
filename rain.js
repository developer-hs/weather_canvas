import Utility from "./utility.js";

class Rain {
    constructor(x, y, velocity, ctx, mouse, splashDrops) {
        this.splashDrops = splashDrops;
        this.x = x;
        this.y = y;
        this.rainDropSpeed = 1.3;
        this.velocity = velocity;
        this.ctx = ctx;
        this.splashParticle;
        this.mouse = mouse;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x + this.velocity.x * 2, this.y + this.velocity.y * 2);
        this.ctx.strokeStyle = "#8899a6";
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
    }

    splash() {
        for (let i = 0; i < 5; i++) {
            const velocity = {
                x: -this.velocity.x + Utility.randomBetween(-2, 2),
                y: -this.velocity.y + Utility.randomBetween(5, 10),
            };
            this.splashDrops.push(new SplashDrop(this.x, innerHeight, velocity, this.ctx));
        }
    }

    animate() {
        if (this.y > innerHeight) {
            this.splash();
            this.x = Utility.randomBetween(-innerWidth * 0.2, innerWidth * 1.4);
            this.y = -20;
        }

        this.velocity.x = this.mouse.isActive
            ? Utility.randomBetween(-1, 1) + (-innerWidth / 2 + this.mouse.x) / 100
            : Utility.randomBetween(-1, 1);

        this.x += this.velocity.x;
        this.y += this.velocity.y / this.rainDropSpeed;

        this.draw();
    }
}

class SplashDrop {
    constructor(x, y, velocity, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.gravity = 1.2;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        this.ctx.fillStyle = "#8899a6";
        this.ctx.fill();
    }
    animate() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.draw();
    }
}

class Thunder {
    constructor(ctx) {
        this.ctx = ctx;
        this.opacity = 0;
    }

    draw() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, innerHeight);
        gradient.addColorStop(0, `rgba(66,84,99, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(18, 23, 27, ${this.opacity})`);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, innerWidth, innerHeight);
    }

    animate() {
        if (this.opacity < 0) return;
        this.opacity -= 0.005;
        this.draw();
    }
}

export { Rain, Thunder, SplashDrop };
