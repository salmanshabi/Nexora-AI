"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let shootingStars: ShootingStar[] = [];

        // Settings
        const connectionDistance = 150;
        const mouseConnectionDistance = 200;
        const mouseRepelDistance = 100;
        const particleSpeedOptions = [0.15, 0.3, 0.5];

        // Mouse state
        const mouse = {
            x: -1000,
            y: -1000,
            isClicked: false,
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
            mouse.isClicked = false;
        };

        const handleMouseDown = () => { mouse.isClicked = true; };
        const handleMouseUp = () => { mouse.isClicked = false; };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // eslint-disable-next-line react-hooks/unsupported-syntax
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            baseRadius: number;
            angle: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;

                const speed = particleSpeedOptions[Math.floor(Math.random() * particleSpeedOptions.length)];
                const dirAngle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(dirAngle) * speed;
                this.vy = Math.sin(dirAngle) * speed;

                this.baseRadius = Math.random() * 1.5 + 1;
                this.radius = this.baseRadius;
                this.angle = Math.random() * Math.PI * 2; // for pulsing
            }

            update() {
                if (!canvas) return;

                // Move
                this.x += this.vx;
                this.y += this.vy;

                // Pulse effect
                this.angle += 0.05;
                this.radius = this.baseRadius + Math.sin(this.angle) * 0.5;

                // Bounce off edges smoothly
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Repel harder on click, gentle repel normally
                const repelDist = mouse.isClicked ? mouseRepelDistance * 2.5 : mouseRepelDistance;

                if (distance < repelDist) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (repelDist - distance) / repelDist;
                    const repelStrength = mouse.isClicked ? 15 : 3;

                    // Move away from mouse
                    this.x -= forceDirectionX * force * repelStrength;
                    this.y -= forceDirectionY * force * repelStrength;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(34, 211, 238, 0.8)"; // Cyan-400
                ctx.fill();

                // Glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = "rgba(34, 211, 238, 0.6)";
                ctx.shadowBlur = 0; // Reset
            }
        }

        // eslint-disable-next-line react-hooks/unsupported-syntax
        class ShootingStar {
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number;
            maxLife: number;
            history: { x: number, y: number }[];

            constructor(startX: number, startY: number, targetX: number, targetY: number) {
                this.x = startX;
                this.y = startY;
                const dx = targetX - startX;
                const dy = targetY - startY;
                const angle = Math.atan2(dy, dx);
                const speed = Math.random() * 4 + 6; // Fast data packets
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.maxLife = Math.random() * 40 + 30; // Shorter life
                this.life = this.maxLife;
                this.history = [];
            }

            update() {
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 12) {
                    this.history.shift();
                }
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 1.5;
            }

            draw() {
                if (!ctx) return;

                ctx.beginPath();
                for (let i = 0; i < this.history.length; i++) {
                    const point = this.history[i];
                    if (i === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
                }
                ctx.strokeStyle = `rgba(34, 211, 238, ${(this.life / this.maxLife) * 0.9})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Head
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${(this.life / this.maxLife)})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            shootingStars = [];
            const count = Math.floor((window.innerWidth * window.innerHeight) / 12000);
            const finalCount = Math.min(Math.max(count, 40), 100);

            for (let i = 0; i < finalCount; i++) {
                particles.push(new Particle());
            }
        };

        const drawConnections = () => {
            if (!ctx || !canvas) return;

            // Connect particles to each other
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - distance / connectionDistance;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity * 0.3})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Connect particles to mouse
                if (mouse.x > 0 && mouse.y > 0) {
                    const mdx = particles[i].x - mouse.x;
                    const mdy = particles[i].y - mouse.y;
                    const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mDist < mouseConnectionDistance) {
                        const mOpacity = 1 - mDist / mouseConnectionDistance;
                        ctx.beginPath();
                        const colorIntensity = mouse.isClicked ? 0.9 : 0.5;
                        ctx.strokeStyle = `rgba(34, 211, 238, ${mOpacity * colorIntensity})`;
                        ctx.lineWidth = mouse.isClicked ? 1.5 : 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Randomly spawn shooting data packets
            if (Math.random() < 0.03 && particles.length > 2) {
                const p1 = particles[Math.floor(Math.random() * particles.length)];
                const p2 = particles[Math.floor(Math.random() * particles.length)];
                if (p1 !== p2) {
                    shootingStars.push(new ShootingStar(p1.x, p1.y, p2.x, p2.y));
                }
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                shootingStars[i].update();
                shootingStars[i].draw();
                if (shootingStars[i].life <= 0) {
                    shootingStars.splice(i, 1);
                }
            }

            drawConnections();

            // Draw mouse core indicator
            if (mouse.x > 0 && mouse.y > 0) {
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, mouse.isClicked ? 5 : 2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                ctx.fill();
                ctx.shadowBlur = !!mouse.isClicked ? 20 : 10;
                ctx.shadowColor = "rgba(34, 211, 238, 1)";
                ctx.fill(); // Fill again with shadow
                ctx.shadowBlur = 0; // reset
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // Initialize
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: "transparent" }}
        />
    );
}
