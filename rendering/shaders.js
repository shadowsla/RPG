// =========================================
// Ultimate Tower RPG - shaders.js
// =========================================

export class Shaders {

    constructor(game) {

        this.game = game;

        // =====================================
        // Effects
        // =====================================

        this.screenShake = 0;

        this.flashTimer = 0;

        this.flashColor = "#ffffff";

        this.vignetteStrength = 0.35;

        this.chromaticAberration = 0;

        this.hitEffect = 0;

        this.lowHealthPulse = 0;

        this.blurAmount = 0;

        this.darknessOverlay = 0;

        // =====================================
        // Weather
        // =====================================

        this.rainEnabled = false;

        this.snowEnabled = false;

        this.fogEnabled = false;

        // =====================================
        // Particles
        // =====================================

        this.weatherParticles = [];

        this.generateWeatherParticles();
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Timers
        // =====================================

        if (this.screenShake > 0) {

            this.screenShake -=
                deltaTime * 4;
        }

        if (this.flashTimer > 0) {

            this.flashTimer -=
                deltaTime * 3;
        }

        if (this.hitEffect > 0) {

            this.hitEffect -=
                deltaTime * 5;
        }

        // =====================================
        // Low Health Pulse
        // =====================================

        const player =
            this.game.player;

        if (
            player &&
            player.health <
            player.maxHealth * 0.25
        ) {

            this.lowHealthPulse +=
                deltaTime * 5;

        } else {

            this.lowHealthPulse = 0;
        }

        // =====================================
        // Weather
        // =====================================

        this.updateWeather(deltaTime);
    }

    // =========================================
    // Screen Shake
    // =========================================

    applyScreenShake(ctx) {

        if (this.screenShake <= 0) {
            return;
        }

        const intensity =
            this.screenShake * 10;

        const offsetX =
            (Math.random() - 0.5) *
            intensity;

        const offsetY =
            (Math.random() - 0.5) *
            intensity;

        ctx.translate(
            offsetX,
            offsetY
        );
    }

    // =========================================
    // Trigger Shake
    // =========================================

    triggerShake(power = 1) {

        this.screenShake =
            Math.max(
                this.screenShake,
                power
            );
    }

    // =========================================
    // Flash Effect
    // =========================================

    flash(color = "#ffffff") {

        this.flashColor = color;

        this.flashTimer = 1;
    }

    // =========================================
    // Hit Effect
    // =========================================

    triggerHitEffect() {

        this.hitEffect = 1;
    }

    // =========================================
    // Apply Post Processing
    // =========================================

    drawPostProcessing(ctx) {

        this.drawVignette(ctx);

        this.drawFlash(ctx);

        this.drawHitOverlay(ctx);

        this.drawLowHealthOverlay(ctx);

        this.drawDarkness(ctx);

        this.drawWeather(ctx);
    }

    // =========================================
    // Vignette
    // =========================================

    drawVignette(ctx) {

        const gradient =
            ctx.createRadialGradient(

                this.game.width / 2,
                this.game.height / 2,
                200,

                this.game.width / 2,
                this.game.height / 2,
                700
            );

        gradient.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        gradient.addColorStop(
            1,
            `rgba(0,0,0,${this.vignetteStrength})`
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );
    }

    // =========================================
    // Flash
    // =========================================

    drawFlash(ctx) {

        if (this.flashTimer <= 0) {
            return;
        }

        ctx.save();

        ctx.globalAlpha =
            this.flashTimer * 0.5;

        ctx.fillStyle =
            this.flashColor;

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        ctx.restore();
    }

    // =========================================
    // Hit Overlay
    // =========================================

    drawHitOverlay(ctx) {

        if (this.hitEffect <= 0) {
            return;
        }

        ctx.save();

        ctx.globalAlpha =
            this.hitEffect * 0.35;

        ctx.fillStyle =
            "#ff0000";

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        ctx.restore();
    }

    // =========================================
    // Low Health Overlay
    // =========================================

    drawLowHealthOverlay(ctx) {

        if (
            this.lowHealthPulse <= 0
        ) {

            return;
        }

        const alpha =
            (
                Math.sin(
                    this.lowHealthPulse
                ) + 1
            ) * 0.1;

        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.fillStyle =
            "#aa0000";

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        ctx.restore();
    }

    // =========================================
    // Darkness Overlay
    // =========================================

    drawDarkness(ctx) {

        if (
            this.darknessOverlay <= 0
        ) {

            return;
        }

        ctx.save();

        ctx.globalAlpha =
            this.darknessOverlay;

        ctx.fillStyle =
            "#000000";

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        ctx.restore();
    }

    // =========================================
    // Weather Particles
    // =========================================

    generateWeatherParticles() {

        for (
            let i = 0;
            i < 200;
            i++
        ) {

            this.weatherParticles.push({

                x:
                    Math.random() *
                    this.game.width,

                y:
                    Math.random() *
                    this.game.height,

                speed:
                    100 +
                    Math.random() * 200,

                size:
                    1 +
                    Math.random() * 3
            });
        }
    }

    // =========================================
    // Update Weather
    // =========================================

    updateWeather(deltaTime) {

        for (
            const particle of
            this.weatherParticles
        ) {

            if (this.rainEnabled) {

                particle.y +=
                    particle.speed *
                    deltaTime;

            } else if (
                this.snowEnabled
            ) {

                particle.y +=
                    particle.speed *
                    0.25 *
                    deltaTime;

                particle.x +=
                    Math.sin(
                        particle.y * 0.01
                    ) * 20 * deltaTime;
            }

            // Reset
            if (
                particle.y >
                this.game.height
            ) {

                particle.y = -10;

                particle.x =
                    Math.random() *
                    this.game.width;
            }
        }
    }

    // =========================================
    // Draw Weather
    // =========================================

    drawWeather(ctx) {

        if (
            !this.rainEnabled &&
            !this.snowEnabled
        ) {

            return;
        }

        ctx.save();

        for (
            const particle of
            this.weatherParticles
        ) {

            if (this.rainEnabled) {

                ctx.strokeStyle =
                    "rgba(120,170,255,0.55)";

                ctx.lineWidth = 2;

                ctx.beginPath();

                ctx.moveTo(
                    particle.x,
                    particle.y
                );

                ctx.lineTo(
                    particle.x - 4,
                    particle.y + 14
                );

                ctx.stroke();

            } else if (
                this.snowEnabled
            ) {

                ctx.fillStyle =
                    "rgba(255,255,255,0.8)";

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        }

        ctx.restore();
    }

    // =========================================
    // Enable Weather
    // =========================================

    enableRain() {

        this.rainEnabled = true;

        this.snowEnabled = false;
    }

    enableSnow() {

        this.snowEnabled = true;

        this.rainEnabled = false;
    }

    disableWeather() {

        this.rainEnabled = false;

        this.snowEnabled = false;
    }

    // =========================================
    // Boss Mode
    // =========================================

    enableBossEffects() {

        this.vignetteStrength = 0.55;

        this.chromaticAberration = 0.2;

        this.darknessOverlay = 0.1;
    }

    // =========================================
    // Reset Effects
    // =========================================

    resetEffects() {

        this.screenShake = 0;

        this.flashTimer = 0;

        this.hitEffect = 0;

        this.lowHealthPulse = 0;

        this.chromaticAberration = 0;

        this.blurAmount = 0;

        this.darknessOverlay = 0;

        this.vignetteStrength = 0.35;
    }
}
