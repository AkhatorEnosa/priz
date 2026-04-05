import confetti, { type Options } from "canvas-confetti";

export const fireConfetti = (seconds: number = 3) : void => {
    const duration = seconds * 1000;
    const animationEnd = Date.now() + duration;
    const defaults: Options = {
        startVelocity: 30,
        spread: 360, 
        ticks: 60, 
        colors: ['#2DD4BF', '#fad410', '#CCFBF1', '#FFFFFF'],
        zIndex: 999,
    };

    function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
    const timeLeft: number = animationEnd - Date.now();

    if (timeLeft <= 0) {
        return clearInterval(interval);
    }

    const particleCount : number = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}
