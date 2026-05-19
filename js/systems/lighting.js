// =========================================
// Ultimate Tower RPG - lighting.js
// =========================================

// =========================================
// Lighting System
// =========================================

export class LightingSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Lights
        // =====================================

        this.lights = [];

        // =====================================
        // Darkness
        // =====================================

        this.ambientDarkness = 0.55;

        // =====================================
        // Day/Night
        // =====================================

        this.timeOfDay = 12;

        this.dayLength = 900;

        this.dayTimer = 0;

        // =====================================
        // Weather
        // =====================================

        this.weatherDarkness = 0;

        // =====================================
        // Torch Flicker
        // =====================================

        this.flickerTimer = 0;

        // =====================================
        // Shadows
        // =====================================

        this.enableShadows = true;

        // =====================================
        // Canvas
        // =====================================

        this.lightCanvas =
            document.createElement("canvas");

        this.lightCtx =
            this.lightCanvas.getContext("2d");

        this.resizeCanvas();
    }

    // =========================================
    // Resize
    // =========================================

    resizeCanvas() {

        this.lightCanvas.width =
            this.game.canvas.width;

        this.lightCanvas.height =
            this.game.canvas.height;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Day/Night Cycle
        // =====================================

        this.updateDayNight(
            deltaTime
        );

        // =====================================
        // Flickering
        // =====================================

        this.flickerTimer +=
            deltaTime * 10;

        // =====================================
        // Dynamic Lights
        // =====================================

        this.updateDynamicLights(
            deltaTime
        );

        // =====================================
        // Remove Dead Lights
        // =====================================

        this.cleanupLights();
    }

    // =========================================
    // Day Night Cycle
    // =========================================

    updateDayNight(
        deltaTime
    ) {

        this.dayTimer +=
            deltaTime;

        if (
            this.dayTimer >=
            this.dayLength
        ) {

            this.dayTimer = 0;
        }

        // =====================================
        // Time
        // =====================================

        this.timeOfDay =

            (this.dayTimer /
            this.dayLength) * 24;

        // =====================================
        // Brightness
        // =====================================

        if (

            this.timeOfDay >= 6 &&

            this.timeOfDay <= 18
        ) {

            // Day
            const middayDistance =

                Math.abs(
                    this.timeOfDay - 12
                );

            this.ambientDarkness =

                0.2 +

                (middayDistance / 6) * 0.2;
        }

        else {

            // Night
            this.ambientDarkness = 0.75;
        }
    }

    // =========================================
    // Dynamic Lights
    // =========================================

    updateDynamicLights(
        deltaTime
    ) {

        for (
            const light of
            this.lights
        ) {

            // =================================
            // Flicker
            // =================================

            if (
                light.flicker
            ) {

                light.currentRadius =

                    light.radius +

                    Math.sin(
                        this.flickerTimer *
                        light.flickerSpeed
                    ) *

                    light.flickerAmount;
            }

            else {

                light.currentRadius =
                    light.radius;
            }

            // =================================
            // Pulse
            // =================================

            if (
                light.pulse
            ) {

                light.intensity =

                    light.baseIntensity +

                    Math.sin(
                        performance.now() *
                        0.003
                    ) *

                    0.2;
            }

            // =================================
            // Lifetime
            // =================================

            if (
                light.life !== undefined
            ) {

                light.life -=
                    deltaTime;

                if (
                    light.life <= 0
                ) {

                    light.dead = true;
                }
            }
        }
    }

    // =========================================
    // Draw Lighting
    // =========================================

    draw(ctx) {

        const lightCtx =
            this.lightCtx;

        // =====================================
        // Clear
        // =====================================

        lightCtx.clearRect(

            0,
            0,

            this.lightCanvas.width,

            this.lightCanvas.height
        );

        // =====================================
        // Darkness Layer
        // =====================================

        lightCtx.fillStyle =

            `rgba(0,0,0,${
                this.ambientDarkness +
                this.weatherDarkness
            })`;

        lightCtx.fillRect(

            0,
            0,

            this.lightCanvas.width,

            this.lightCanvas.height
        );

        // =====================================
        // Lights
        // =====================================

        lightCtx.globalCompositeOperation =
            "destination-out";

        for (
            const light of
            this.lights
        ) {

            this.drawLight(
                lightCtx,
                light
            );
        }

        // =====================================
        // Player Light
        // =====================================

        this.drawPlayerLight(
            lightCtx
        );

        // =====================================
        // Reset
        // =====================================

        lightCtx.globalCompositeOperation =
            "source-over";

        // =====================================
        // Draw To Main Canvas
        // =====================================

        ctx.drawImage(

            this.lightCanvas,

            0,

            0
        );
    }

    // =========================================
    // Draw Light
    // =========================================

    drawLight(
        ctx,
        light
    ) {

        const radius =

            light.currentRadius ||
            light.radius;

        const gradient =
            ctx.createRadialGradient(

                light.x,
                light.y,
                0,

                light.x,
                light.y,
                radius
            );

        gradient.addColorStop(

            0,

            `rgba(255,255,255,${
                light.intensity || 1
            })`
        );

        gradient.addColorStop(

            0.5,

            `rgba(255,255,255,${
                (light.intensity || 1) * 0.5
            })`
        );

        gradient.addColorStop(

            1,

            "rgba(255,255,255,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(

            light.x,
            light.y,

            radius,

            0,

            Math.PI * 2
        );

        ctx.fill();

        // =====================================
        // Colored Glow
        // =====================================

        if (
            light.color
        ) {

            ctx.globalCompositeOperation =
                "lighter";

            const colorGradient =
                ctx.createRadialGradient(

                    light.x,
                    light.y,
                    0,

                    light.x,
                    light.y,
                    radius
                );

            colorGradient.addColorStop(

                0,

                light.color
            );

            colorGradient.addColorStop(

                1,

                "transparent"
            );

            ctx.fillStyle =
                colorGradient;

            ctx.beginPath();

            ctx.arc(

                light.x,
                light.y,

                radius,

                0,

                Math.PI * 2
            );

            ctx.fill();

            ctx.globalCompositeOperation =
                "destination-out";
        }
    }

    // =========================================
    // Player Light
    // =========================================

    drawPlayerLight(ctx) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        // =====================================
        // Base Light
        // =====================================

        const radius =

            player.lightRadius ||

            180;

        const gradient =
            ctx.createRadialGradient(

                player.x +
                player.width / 2,

                player.y +
                player.height / 2,

                0,

                player.x +
                player.width / 2,

                player.y +
                player.height / 2,

                radius
            );

        gradient.addColorStop(

            0,

            "rgba(255,255,255,1)"
        );

        gradient.addColorStop(

            0.5,

            "rgba(255,255,255,0.6)"
        );

        gradient.addColorStop(

            1,

            "rgba(255,255,255,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(

            player.x +
            player.width / 2,

            player.y +
            player.height / 2,

            radius,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Add Light
    // =========================================

    addLight(light) {

        // Defaults
        light.radius ??= 150;

        light.intensity ??= 1;

        light.baseIntensity ??=
            light.intensity;

        light.color ??= null;

        light.flicker ??= false;

        light.flickerAmount ??= 10;

        light.flickerSpeed ??= 8;

        this.lights.push(
            light
        );

        return light;
    }

    // =========================================
    // Remove Light
    // =========================================

    removeLight(light) {

        const index =
            this.lights.indexOf(
                light
            );

        if (
            index !== -1
        ) {

            this.lights.splice(
                index,
                1
            );
        }
    }

    // =========================================
    // Torch
    // =========================================

    createTorch(
        x,
        y
    ) {

        return this.addLight({

            x,
            y,

            radius: 180,

            intensity: 1,

            color:
                "rgba(255,140,40,0.4)",

            flicker: true,

            flickerAmount: 20,

            flickerSpeed: 12
        });
    }

    // =========================================
    // Magic Orb
    // =========================================

    createMagicLight(
        x,
        y,
        color = "rgba(100,120,255,0.5)"
    ) {

        return this.addLight({

            x,
            y,

            radius: 120,

            intensity: 0.8,

            color,

            pulse: true
        });
    }

    // =========================================
    // Explosion Flash
    // =========================================

    createExplosionFlash(
        x,
        y
    ) {

        return this.addLight({

            x,
            y,

            radius: 350,

            intensity: 2,

            color:
                "rgba(255,180,80,0.8)",

            life: 0.2
        });
    }

    // =========================================
    // Lightning Flash
    // =========================================

    lightningFlash() {

        this.weatherDarkness = -0.5;

        setTimeout(() => {

            this.weatherDarkness = 0;

        }, 100);
    }

    // =========================================
    // Shadows
    // =========================================

    drawShadow(
        ctx,
        object,
        lightX,
        lightY
    ) {

        if (
            !this.enableShadows
        ) {

            return;
        }

        const dx =
            object.x - lightX;

        const dy =
            object.y - lightY;

        const length =

            Math.hypot(dx, dy);

        const shadowLength =
            length * 0.5;

        ctx.save();

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";

        ctx.beginPath();

        ctx.moveTo(
            object.x,
            object.y
        );

        ctx.lineTo(
            object.x +
            object.width,
            object.y
        );

        ctx.lineTo(

            object.x +
            object.width +

            dx / length *
            shadowLength,

            object.y +

            dy / length *
            shadowLength
        );

        ctx.lineTo(

            object.x +

            dx / length *
            shadowLength,

            object.y +

            dy / length *
            shadowLength
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();
    }

    // =========================================
    // Weather Darkness
    // =========================================

    setWeather(type) {

        switch(type) {

            case "rain":

                this.weatherDarkness = 0.1;

                break;

            case "storm":

                this.weatherDarkness = 0.25;

                break;

            case "fog":

                this.weatherDarkness = 0.15;

                break;

            case "snow":

                this.weatherDarkness = 0.05;

                break;

            default:

                this.weatherDarkness = 0;

                break;
        }
    }

    // =========================================
    // Cleanup
    // =========================================

    cleanupLights() {

        this.lights =
            this.lights.filter(

                light => !light.dead
            );
    }

    // =========================================
    // Fullscreen Darkness
    // =========================================

    setDarkness(amount) {

        this.ambientDarkness =

            Math.max(
                0,
                Math.min(1, amount)
            );
    }

    // =========================================
    // Get Time
    // =========================================

    getFormattedTime() {

        const hours =
            Math.floor(
                this.timeOfDay
            );

        const minutes =
            Math.floor(

                (this.timeOfDay % 1) *
                60
            );

        return

            `${String(hours).padStart(2, "0")}:` +

            `${String(minutes).padStart(2, "0")}`;
    }
}