import { Rain, Thunder } from "./rain.js";
import { Snow } from "./snow.js";
import Utility from "./utility.js";

const DEFAULT_WEATHER = "snow";
const THUNDER_RATE = 0.001;
let total;
let rains = [];
let snows = [];
let splashDrops = [];
let thunder;
let renderer;

const canvas = document.getElementById("weatherCanvas");
const ctx = canvas.getContext("2d");

let mouse = { x: 0, y: 0, isActive: false };

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const init = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    total = Math.floor((innerWidth * innerHeight) / 15000);
    rains = [];
    splashDrops = [];
    thunder = new Thunder(ctx);

    snows = [];
    for (let i = 0; i < total; i++) {
        const x = Utility.randomBetween(0, innerWidth);
        const y = Utility.randomBetween(0, innerHeight);
        const velocity = {
            y: Utility.randomBetween(13, 17),
        };
        const size = Utility.randomBetween(1, 3);

        snows.push(new Snow(x, y, size, velocity, ctx, mouse));
    }

    for (let i = 0; i < total; i++) {
        const x = Utility.randomBetween(0, innerWidth);
        const y = Utility.randomBetween(0, innerHeight);
        const velocity = {
            // x: Utility.randomBetween(-1, 1),
            y: Utility.randomBetween(13, 17),
        };
        rains.push(new Rain(x, y, velocity, ctx, mouse, splashDrops));
    }
};

const render = (weather) => {
    clearCanvas();

    switch (weather) {
        case "rain":
            if (Math.random() < THUNDER_RATE) thunder.opacity = 1;
            thunder.animate();
            rains.forEach((rain) => rain.animate());
            splashDrops.forEach((drop, index) => {
                if (drop.y > innerHeight) splashDrops.splice(index, 1);
                drop.animate();
            });
            break;
        case "snow":
            snows.forEach((snow) => snow.animate());
            break;
    }

    renderer = requestAnimationFrame(() => {
        render(weather);
    });
};

const weatherButtonHandler = () => {
    const rainButton = document.getElementById("rainButton");
    const snowButton = document.getElementById("snowButton");

    rainButton.addEventListener("click", () => {
        renderer && cancelAnimationFrame(renderer);
        render("rain");
    });

    snowButton.addEventListener("click", () => {
        renderer && cancelAnimationFrame(renderer);
        render("snow");
    });
};

window.addEventListener("resize", (e) => {
    init();
});

canvas.addEventListener("mouseenter", (e) => {
    mouse.isActive = true;
});

canvas.addEventListener("mouseleave", (e) => {
    mouse.isActive = false;
});

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

init();
render(DEFAULT_WEATHER);
weatherButtonHandler();
