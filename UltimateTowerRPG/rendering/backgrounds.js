// =========================================
// Ultimate Tower RPG - background.js
// =========================================

export class Background {

    constructor(game) {

        this.game = game;

        // =====================================
        // Layers
        // =====================================

        this.layers = [];

        // =====================================
        // Particles
        // =====================================

        this.ambientParticles = [];

        // =====================================
        // Environment
        // =====================================

        this.theme = "tower";

        this.time = 0;

        this.dayNightCycle = 0;

        // =====================================
        // Generate
        // =====================================

        this.createLayers();

        this.createAmbientParticles();
    }

    // =========================================
    // Create Layers
    // =========================================

    createLayers() {

        this.layers = [

            {
                speed: 0.1,
                color: "#06070d",
                size: 900
            },

            {
                speed: 0.2,
                color: "#0f1322",
                size: 700
            },

            {
                speed: 0.4,
                color: "#1a2038",
                size: 500
            },

            {
                speed: 0.6,
                color: "#222b45",
                size: 350
            }
        ];
    }

    // =========================================
    // Ambient Particles
    // =========================================

    createAmbientParticles() {

        for (
            let i = 0;
            i < 120;
            i++
        ) {

            this.ambientParticles.push({

                x:
                    Math.random() *
                    this.game.width * 2,

                y:
                    Math.random() *
                    this.game.height * 2,

                size:
                    1 +
                    Math.random() * 3,

                speed:
                    5 +
                    Math.random() * 25,

                alpha:
                    0.1 +
                    Math.random() * 0.4
            });
        }
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.time += deltaTime;

        this.dayNightCycle +=
            deltaTime * 0.02;

        this.updateParticles(deltaTime);
    }

    // =========================================
    // Update Particles
    // =========================================

    updateParticles(deltaTime) {

        for (
            const particle of
            this.ambientParticles
        ) {

            particle.y +=
                particle.speed *
                deltaTime;

            particle.x +=
                Math.sin(
                    particle.y * 0.01
                ) * deltaTime * 10;

            // Reset
            if (
                particle.y >
                this.game.height + 50
            ) {

                particle.y = -50;

                particle.x =
                    Math.random() *
                    this.game.width;
            }
        }
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        this.drawGradient(ctx);

        this.drawParallax(ctx);

        this.drawStars(ctx);

        this.drawAmbientParticles(ctx);

        this.drawFog(ctx);
    }

    // =========================================
    // Gradient Sky
    // =========================================

    drawGradient(ctx) {

        const cycle =
            (
                Math.sin(
                    this.dayNightCycle
                ) + 1
            ) / 2;

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                this.game.height
            );

        // Day/Night Colors
        gradient.addColorStop(
            0,
            this.blendColors(
                "#05070d",
                "#1e3a5f",
                cycle
            )
        );

        gradient.addColorStop(
            1,
            this.blendColors(
                "#101522",
                "#4d6f99",
                cycle
            )
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
    // Parallax Layers
    // =========================================

    drawParallax(ctx) {

        const camera =
            this.game.camera;

        for (
            let i = 0;
            i < this.layers.length;
            i++
        ) {

            const layer =
                this.layers[i];

            const offsetX =
                camera.x *
                layer.speed;

            ctx.fillStyle =
                layer.color;

            // Repeating Tower Shapes
            for (
                let x = -500;
                x <
                this.game.width + 1000;
                x += layer.size
            ) {

                const towerHeight =
                    150 +
                    (
                        Math.sin(
                            x * 0.01 + i
                        ) + 1
                    ) * 180;

                ctx.fillRect(

                    x - offsetX %
                    layer.size,

                    this.game.height -
                    towerHeight,

                    layer.size * 0.5,

                    towerHeight
                );
            }
        }
    }

    // =========================================
    // Stars
    // =========================================

    drawStars(ctx) {

        const starAlpha =
            0.2 +
            (
                Math.sin(
                    this.dayNightCycle
                ) * -0.2
            );

        ctx.save();

        ctx.globalAlpha =
            Math.max(0, starAlpha);

        for (
            let i = 0;
            i < 120;
            i++
        ) {

            const x =
                (i * 157) %
                this.game.width;

            const y =
                (i * 83) %
                (this.game.height * 0.7);

            const size =
                (i % 3) + 1;

            ctx.fillStyle =
                "#ffffff";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                size,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();
    }

    // =========================================
    // Ambient Particles
    // =========================================

    drawAmbientParticles(ctx) {

        ctx.save();

        for (
            const particle of
            this.ambientParticles
        ) {

            ctx.globalAlpha =
                particle.alpha;

            ctx.fillStyle =
                "#99bbff";

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

        ctx.restore();
    }

    // =========================================
    // Fog
    // =========================================

    drawFog(ctx) {

        const fogWave =
            Math.sin(
                this.time * 0.2
            ) * 20;

        const gradient =
            ctx.createLinearGradient(
                0,
                this.game.height - 200,
                0,
                this.game.height
            );

        gradient.addColorStop(
            0,
            "rgba(255,255,255,0)"
        );

        gradient.addColorStop(
            1,
            "rgba(180,200,255,0.08)"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            this.game.height - 220 + fogWave,
            this.game.width,
            260
        );
    }

    // =========================================
    // Theme Changes
    // =========================================

    setTheme(theme) {

        this.theme = theme;

        switch(theme) {

            case "fire":

                this.layers[0].color =
                    "#200808";

                this.layers[1].color =
                    "#331111";

                this.layers[2].color =
                    "#552222";

                break;

            case "ice":

                this.layers[0].color =
                    "#081220";

                this.layers[1].color =
                    "#10253d";

                this.layers[2].color =
                    "#20486a";

                break;

            case "shadow":

                this.layers[0].color =
                    "#040406";

                this.layers[1].color =
                    "#090910";

                this.layers[2].color =
                    "#12121d";

                break;

            default:

                this.createLayers();

                break;
        }
    }

    // =========================================
    // Blend Colors
    // =========================================

    blendColors(
        color1,
        color2,
        factor
    ) {

        const c1 =
            parseInt(
                color1.slice(1),
                16
            );

        const c2 =
            parseInt(
                color2.slice(1),
                16
            );

        const r1 =
            (c1 >> 16) & 255;

        const g1 =
            (c1 >> 8) & 255;

        const b1 =
            c1 & 255;

        const r2 =
            (c2 >> 16) & 255;

        const g2 =
            (c2 >> 8) & 255;

        const b2 =
            c2 & 255;

        const r =
            Math.floor(
                r1 +
                (r2 - r1) * factor
            );

        const g =
            Math.floor(
                g1 +
                (g2 - g1) * factor
            );

        const b =
            Math.floor(
                b1 +
                (b2 - b1) * factor
            );

        return `rgb(${r},${g},${b})`;
    }
}
