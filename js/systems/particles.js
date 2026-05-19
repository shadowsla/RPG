// =========================================
// Ultimate Tower RPG - particles.js
// =========================================

// =========================================
// Particle System
// =========================================

export class ParticleSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Particles
        // =====================================

        this.particles = [];

        // =====================================
        // Max Particles
        // =====================================

        this.maxParticles = 5000;

        // =====================================
        // Quality
        // =====================================

        this.quality = "high";
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        for (
            let i =
                this.particles.length - 1;
            i >= 0;
            i--
        ) {

            const particle =
                this.particles[i];

            // =================================
            // Life
            // =================================

            particle.life -=
                deltaTime;

            // Dead
            if (
                particle.life <= 0
            ) {

                this.particles.splice(
                    i,
                    1
                );

                continue;
            }

            // =================================
            // Movement
            // =================================

            particle.x +=
                particle.velocityX *
                deltaTime;

            particle.y +=
                particle.velocityY *
                deltaTime;

            // =================================
            // Gravity
            // =================================

            if (
                particle.gravity
            ) {

                particle.velocityY +=

                    particle.gravity *
                    deltaTime;
            }

            // =================================
            // Friction
            // =================================

            if (
                particle.friction
            ) {

                particle.velocityX *=
                    particle.friction;

                particle.velocityY *=
                    particle.friction;
            }

            // =================================
            // Fade
            // =================================

            if (
                particle.fade
            ) {

                particle.alpha =

                    particle.life /
                    particle.maxLife;
            }

            // =================================
            // Rotation
            // =====================================

            if (
                particle.rotationSpeed
            ) {

                particle.rotation +=

                    particle.rotationSpeed *
                    deltaTime;
            }

            // =================================
            // Scale
            // =====================================

            if (
                particle.shrink
            ) {

                particle.size *=
                    0.99;
            }
        }
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        ctx.save();

        for (
            const particle of
            this.particles
        ) {

            ctx.globalAlpha =
                particle.alpha ?? 1;

            ctx.translate(
                particle.x,
                particle.y
            );

            ctx.rotate(
                particle.rotation || 0
            );

            switch(
                particle.type
            ) {

                // =============================
                // Circle
                // =============================

                case "circle":

                    this.drawCircleParticle(
                        ctx,
                        particle
                    );

                    break;

                // =============================
                // Square
                // =============================

                case "square":

                    this.drawSquareParticle(
                        ctx,
                        particle
                    );

                    break;

                // =============================
                // Spark
                // =============================

                case "spark":

                    this.drawSparkParticle(
                        ctx,
                        particle
                    );

                    break;

                // =============================
                // Smoke
                // =============================

                case "smoke":

                    this.drawSmokeParticle(
                        ctx,
                        particle
                    );

                    break;

                // =============================
                // Fire
                // =============================

                case "fire":

                    this.drawFireParticle(
                        ctx,
                        particle
                    );

                    break;

                // =============================
                // Magic
                // =============================

                case "magic":

                    this.drawMagicParticle(
                        ctx,
                        particle
                    );

                    break;

                // =============================
                // Debris
                // =============================

                case "debris":

                    this.drawDebrisParticle(
                        ctx,
                        particle
                    );

                    break;
            }

            ctx.resetTransform();
        }

        ctx.restore();
    }

    // =========================================
    // Circle Particle
    // =========================================

    drawCircleParticle(
        ctx,
        particle
    ) {

        ctx.fillStyle =
            particle.color;

        ctx.beginPath();

        ctx.arc(

            0,
            0,

            particle.size,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Square Particle
    // =========================================

    drawSquareParticle(
        ctx,
        particle
    ) {

        ctx.fillStyle =
            particle.color;

        ctx.fillRect(

            -particle.size / 2,

            -particle.size / 2,

            particle.size,

            particle.size
        );
    }

    // =========================================
    // Spark Particle
    // =========================================

    drawSparkParticle(
        ctx,
        particle
    ) {

        ctx.strokeStyle =
            particle.color;

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.lineTo(

            particle.size * 2,

            0
        );

        ctx.stroke();
    }

    // =========================================
    // Smoke Particle
    // =========================================

    drawSmokeParticle(
        ctx,
        particle
    ) {

        const gradient =
            ctx.createRadialGradient(

                0,
                0,
                0,

                0,
                0,

                particle.size
            );

        gradient.addColorStop(

            0,

            "rgba(120,120,120,0.8)"
        );

        gradient.addColorStop(

            1,

            "rgba(120,120,120,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(

            0,
            0,

            particle.size,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Fire Particle
    // =========================================

    drawFireParticle(
        ctx,
        particle
    ) {

        const gradient =
            ctx.createRadialGradient(

                0,
                0,
                0,

                0,
                0,

                particle.size
            );

        gradient.addColorStop(
            0,
            "#ffff66"
        );

        gradient.addColorStop(
            0.5,
            "#ff9933"
        );

        gradient.addColorStop(
            1,
            "#ff3300"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(

            0,
            0,

            particle.size,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Magic Particle
    // =========================================

    drawMagicParticle(
        ctx,
        particle
    ) {

        ctx.shadowBlur = 15;

        ctx.shadowColor =
            particle.color;

        ctx.fillStyle =
            particle.color;

        ctx.beginPath();

        ctx.arc(

            0,
            0,

            particle.size,

            0,

            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
    }

    // =========================================
    // Debris Particle
    // =========================================

    drawDebrisParticle(
        ctx,
        particle
    ) {

        ctx.fillStyle =
            particle.color ||
            "#888888";

        ctx.fillRect(

            -particle.size / 2,

            -particle.size / 2,

            particle.size,

            particle.size
        );
    }

    // =========================================
    // Explosion
    // =========================================

    createExplosion(
        x,
        y,
        color = "#ff6600",
        amount = 50
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const angle =

                Math.random() *
                Math.PI * 2;

            const speed =

                200 +
                Math.random() * 600;

            this.addParticle({

                type: "fire",

                x,
                y,

                velocityX:
                    Math.cos(angle) *
                    speed,

                velocityY:
                    Math.sin(angle) *
                    speed,

                size:
                    4 +
                    Math.random() * 8,

                color,

                life:
                    0.5 +
                    Math.random(),

                maxLife: 1,

                gravity: 500,

                friction: 0.97,

                fade: true,

                shrink: true
            });
        }

        // Smoke
        for (
            let i = 0;
            i < amount / 2;
            i++
        ) {

            this.addParticle({

                type: "smoke",

                x,
                y,

                velocityX:
                    (Math.random() - 0.5) * 300,

                velocityY:
                    (Math.random() - 0.5) * 300,

                size:
                    20 +
                    Math.random() * 20,

                life:
                    1 +
                    Math.random() * 2,

                maxLife: 2,

                fade: true,

                grow: true
            });
        }
    }

    // =========================================
    // Hit Effect
    // =========================================

    createHitEffect(
        x,
        y,
        critical = false
    ) {

        const amount =
            critical ? 30 : 15;

        const color =
            critical
            ? "#ffcc00"
            : "#ff3333";

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const angle =

                Math.random() *
                Math.PI * 2;

            const speed =

                100 +
                Math.random() * 400;

            this.addParticle({

                type: "spark",

                x,
                y,

                velocityX:
                    Math.cos(angle) *
                    speed,

                velocityY:
                    Math.sin(angle) *
                    speed,

                size:
                    2 +
                    Math.random() * 4,

                color,

                life:
                    0.3 +
                    Math.random() * 0.5,

                maxLife: 0.8,

                friction: 0.94,

                fade: true,

                rotation:
                    angle
            });
        }
    }

    // =========================================
    // Jump Effect
    // =========================================

    createJumpEffect(
        x,
        y
    ) {

        for (
            let i = 0;
            i < 10;
            i++
        ) {

            this.addParticle({

                type: "smoke",

                x:
                    x +
                    (Math.random() - 0.5) * 40,

                y,

                velocityX:
                    (Math.random() - 0.5) * 200,

                velocityY:
                    -50 -
                    Math.random() * 100,

                size:
                    8 +
                    Math.random() * 10,

                life:
                    0.5 +
                    Math.random(),

                maxLife: 1,

                fade: true
            });
        }
    }

    // =========================================
    // Dash Effect
    // =========================================

    createDashEffect(
        x,
        y,
        direction
    ) {

        for (
            let i = 0;
            i < 20;
            i++
        ) {

            this.addParticle({

                type: "magic",

                x:
                    x +
                    (Math.random() - 0.5) * 20,

                y:
                    y +
                    (Math.random() - 0.5) * 20,

                velocityX:
                    -direction * (
                        100 +
                        Math.random() * 200
                    ),

                velocityY:
                    (Math.random() - 0.5) * 100,

                size:
                    3 +
                    Math.random() * 5,

                color:
                    "#66ccff",

                life:
                    0.3 +
                    Math.random() * 0.3,

                maxLife: 0.6,

                fade: true,

                shrink: true
            });
        }
    }

    // =========================================
    // Level Up Effect
    // =========================================

    createLevelUpEffect(
        x,
        y
    ) {

        for (
            let i = 0;
            i < 100;
            i++
        ) {

            const angle =

                Math.random() *
                Math.PI * 2;

            const speed =

                100 +
                Math.random() * 500;

            this.addParticle({

                type: "magic",

                x,
                y,

                velocityX:
                    Math.cos(angle) *
                    speed,

                velocityY:
                    Math.sin(angle) *
                    speed,

                size:
                    4 +
                    Math.random() * 8,

                color:
                    Math.random() > 0.5
                    ? "#ffcc00"
                    : "#ffffff",

                life:
                    1 +
                    Math.random(),

                maxLife: 2,

                gravity: 100,

                fade: true,

                shrink: true
            });
        }
    }

    // =========================================
    // Weather
    // =========================================

    createRainDrop() {

        this.addParticle({

            type: "spark",

            x:
                Math.random() *
                this.game.canvas.width,

            y: -20,

            velocityX: -50,

            velocityY:
                600 +
                Math.random() * 300,

            size: 6,

            color: "#66aaff",

            life: 2,

            maxLife: 2
        });
    }

    createSnowFlake() {

        this.addParticle({

            type: "circle",

            x:
                Math.random() *
                this.game.canvas.width,

            y: -20,

            velocityX:
                (Math.random() - 0.5) * 40,

            velocityY:
                50 +
                Math.random() * 80,

            size:
                2 +
                Math.random() * 4,

            color: "#ffffff",

            life: 10,

            maxLife: 10,

            fade: false
        });
    }

    // =========================================
    // Add Particle
    // =========================================

    addParticle(particle) {

        // Limit
        if (
            this.particles.length >=
            this.maxParticles
        ) {

            this.particles.shift();
        }

        // Defaults
        particle.alpha ??= 1;

        particle.rotation ??= 0;

        particle.maxLife ??=
            particle.life;

        this.particles.push(
            particle
        );
    }

    // =========================================
    // Clear
    // =========================================

    clear() {

        this.particles = [];
    }

    // =========================================
    // Quality
    // =========================================

    setQuality(level) {

        this.quality = level;

        switch(level) {

            case "low":

                this.maxParticles = 1000;

                break;

            case "medium":

                this.maxParticles = 2500;

                break;

            case "high":

                this.maxParticles = 5000;

                break;

            case "ultra":

                this.maxParticles = 10000;

                break;
        }
    }
}
