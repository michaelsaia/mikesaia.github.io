/**
 * Fireflies Particle System
 * Ambient glowing firefly effect - slow and calm
 */
class FireflySystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireflies = [];
        this.fireflyCount = 25; // Fewer for calmer effect

        // Firefly colors - warm yellows and greens
        this.colors = [
            { r: 255, g: 255, b: 100 },  // Bright yellow
            { r: 200, g: 255, b: 100 },  // Yellow-green
            { r: 150, g: 255, b: 100 },  // Lime green
            { r: 255, g: 220, b: 80 },   // Warm yellow
        ];

        this.init();
    }

    init() {
        // Style the canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1'; // Behind content cards
        this.canvas.id = 'fireflies-canvas';

        // Insert at start of body
        document.body.prepend(this.canvas);

        this.resize();
        this.createFireflies();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createFireflies() {
        this.fireflies = [];
        for (let i = 0; i < this.fireflyCount; i++) {
            this.fireflies.push(new Firefly(this));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createFireflies();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw fireflies
        this.fireflies.forEach(firefly => {
            firefly.update();
            firefly.draw();
        });

        requestAnimationFrame(() => this.animate());
    }
}

class Firefly {
    constructor(system) {
        this.system = system;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.system.canvas.width;
        this.y = Math.random() * this.system.canvas.height;

        // SLOWER drifting movement
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = (Math.random() - 0.5) * 0.1;

        // Size varies
        this.baseSize = Math.random() * 2 + 1;
        this.size = this.baseSize;

        // Glow properties - SLOWER pulse
        this.glowSize = this.baseSize * 4;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.005 + Math.random() * 0.01; // Much slower

        // Brightness and visibility
        this.baseBrightness = 0.2 + Math.random() * 0.3; // Dimmer
        this.brightness = this.baseBrightness;

        // Occasional "flash" - fireflies blink on and off (longer durations)
        this.blinkTimer = Math.random() * 400;
        this.isLit = true;
        this.blinkDuration = 100 + Math.random() * 150; // Longer on
        this.offDuration = 150 + Math.random() * 250;   // Longer off

        // Color
        const colorIndex = Math.floor(Math.random() * this.system.colors.length);
        this.color = this.system.colors[colorIndex];

        // Direction change timer (less frequent)
        this.directionTimer = Math.random() * 300;
    }

    update() {
        // Slow drift movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Occasional direction changes for organic movement
        this.directionTimer--;
        if (this.directionTimer <= 0) {
            this.speedX = (Math.random() - 0.5) * 0.1;
            this.speedY = (Math.random() - 0.5) * 0.1;
            this.directionTimer = 300 + Math.random() * 400;
        }

        // Blink/flash behavior
        this.blinkTimer--;
        if (this.isLit && this.blinkTimer <= 0) {
            this.isLit = false;
            this.blinkTimer = this.offDuration;
        } else if (!this.isLit && this.blinkTimer <= 0) {
            this.isLit = true;
            this.blinkTimer = this.blinkDuration;
        }

        // Pulse glow effect (when lit) - gentler
        this.pulsePhase += this.pulseSpeed;
        const pulseFactor = 0.7 + Math.sin(this.pulsePhase) * 0.3;
        this.brightness = this.baseBrightness * pulseFactor;
        this.size = this.baseSize * (0.9 + pulseFactor * 0.2);
        this.glowSize = this.size * (3 + pulseFactor * 1.5);

        // Wrap around screen edges
        if (this.x < -20) this.x = this.system.canvas.width + 20;
        if (this.x > this.system.canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = this.system.canvas.height + 20;
        if (this.y > this.system.canvas.height + 20) this.y = -20;
    }

    draw() {
        if (!this.isLit) return;

        const ctx = this.system.ctx;
        const { r, g, b } = this.color;

        // Draw outer glow
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.glowSize
        );

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.brightness * 0.6})`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${this.brightness * 0.3})`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${this.brightness * 0.08})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw bright core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, this.brightness * 1.5)})`;
        ctx.fill();

        // Extra bright center dot
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness * 0.8})`;
        ctx.fill();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FireflySystem();
});
