
/* =========================================
   SAURABH TIWARI - CYBER PORTFOLIO
   FIXED 3D CHARACTER + NORMAL SCROLLING
========================================= */

gsap.registerPlugin(ScrollTrigger);

const main = document.querySelector("#main");
const hero = document.querySelector("#page");
const canvas = document.querySelector("#page canvas");

if (!main || !hero || !canvas) {
    throw new Error("Main, hero or canvas element not found!");
}

const context = canvas.getContext("2d");

// Move canvas outside Locomotive Scroll container
document.body.appendChild(canvas);
canvas.id = "character-canvas";


/* =========================================
   1. LOCOMOTIVE SCROLL
========================================= */

const locoScroll = new LocomotiveScroll({
    el: main,
    smooth: true,
    lerp: 0.08,
    multiplier: 1
});

locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy("#main", {

    scrollTop(value) {
        return arguments.length
            ? locoScroll.scrollTo(value, 0, 0)
            : locoScroll.scroll.instance.scroll.y;
    },

    getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    },

    pinType: main.style.transform ? "transform" : "fixed"

});

ScrollTrigger.addEventListener("refresh", () => {
    locoScroll.update();
});


/* =========================================
   2. CANVAS DIMENSIONS
========================================= */

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    2
);

function resizeCanvas() {

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width = Math.round(canvasWidth * pixelRatio);
    canvas.height = Math.round(canvasHeight * pixelRatio);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );

    render();
}


/* =========================================
   3. LOAD 300 CHARACTER FRAMES
========================================= */

const frameCount = 300;

const images = [];

const imageSeq = {
    frame: 0
};

let loadedImages = 0;
let failedImages = 0;

function framePath(index) {

    const number = String(index + 1).padStart(4, "0");

    return `./male${number}.png`;

}

for (let i = 0; i < frameCount; i++) {

    const img = new Image();

    img.onload = () => {

        loadedImages++;

        if (i === Math.round(imageSeq.frame)) {
            render();
        }

    };

    img.onerror = () => {

        failedImages++;

        console.error("Image loading failed:", img.src);

    };

    img.src = framePath(i);

    images.push(img);

}


/* =========================================
   4. RENDER CHARACTER
========================================= */

function render() {

    const index = Math.max(
        0,
        Math.min(
            frameCount - 1,
            Math.round(imageSeq.frame)
        )
    );

    const img = images[index];

    if (!img || !img.complete || !img.naturalWidth) {
        return;
    }

    const scale = Math.max(
        canvasWidth / img.naturalWidth,
        canvasHeight / img.naturalHeight
    );

    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;

    const x = (canvasWidth - drawWidth) / 2;
    const y = (canvasHeight - drawHeight) / 2;

    context.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

    context.drawImage(
        img,
        x,
        y,
        drawWidth,
        drawHeight
    );

}


/* =========================================
   5. CHARACTER ANIMATION
   NO PINNING
   NORMAL PAGE SCROLLING
========================================= */

gsap.to(imageSeq, {

    frame: frameCount - 1,

    snap: "frame",

    ease: "none",

    scrollTrigger: {

        trigger: main,

        scroller: "#main",

        start: "top top",

        end: "bottom bottom",

        scrub: 1,

        pin: false,

        invalidateOnRefresh: true

    },

    onUpdate: render

});


/* =========================================
   6. SCROLL PROGRESS BAR
========================================= */

const progressBar = document.createElement("div");

progressBar.id = "scroll-progress";

Object.assign(progressBar.style, {

    position: "fixed",

    top: "0",

    left: "0",

    height: "3px",

    width: "0%",

    background: "#e50920",

    zIndex: "10000",

    pointerEvents: "none"

});

document.body.appendChild(progressBar);


locoScroll.on("scroll", args => {

    const progress = args.limit.y > 0

        ? (args.scroll.y / args.limit.y) * 100

        : 0;

    progressBar.style.width = `${progress}%`;

});


/* =========================================
   7. WINDOW RESIZE
========================================= */

let resizeTimer;

window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

        resizeCanvas();

        ScrollTrigger.refresh();

        locoScroll.update();

    }, 250);

});


/* =========================================
   8. INITIALIZATION
========================================= */

resizeCanvas();

window.addEventListener("load", () => {

    ScrollTrigger.refresh();

    locoScroll.update();

    console.log("SAURABH TIWARI PORTFOLIO");

    console.log("Total Frames:", frameCount);

    console.log("Loaded Frames:", loadedImages);

    console.log("Failed Frames:", failedImages);

    console.log("Character animation initialized!");

});
