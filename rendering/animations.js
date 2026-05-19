// =========================================
// Ultimate Tower RPG - animations.js
// =========================================

export class Animations {

    constructor(game) {

        this.game = game;

        // =====================================
        // Animation Storage
        // =====================================

        this.activeAnimations = [];

        // =====================================
        // Sprite Frames
        // =====================================

        this.frames = {};

        // =====================================
        // Timers
        // =====================================

        this.globalTime = 0;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.globalTime += deltaTime;

        // =====================================
        // Update Active Animations
        // =====================================

        for (
            let i =
                this.activeAnimations.length - 1;
            i >= 0;
            i--
        ) {

            const animation =
                this.activeAnimations[i];

            animation.timer +=
                deltaTime;

            // Advance Frame
            if (
                animation.timer >=
                animation.frameDuration
            ) {

                animation.timer = 0;

                animation.frame++;

                // Finished
                if (
                    animation.frame >=
                    animation.frames.length
                ) {

                    if (
                        animation.loop
                    ) {

                        animation.frame = 0;

                    } else {

                        this.activeAnimations.splice(
                            i,
                            1
                        );

                        continue;
                    }
                }
            }
        }
    }

    // =========================================
    // Play Animation
    // =========================================

    play(
        name,
        x,
        y,
        options = {}
    ) {

        const animation = {

            name,

            x,
            y,

            frame: 0,

            timer: 0,

            frameDuration:
                options.frameDuration ||
                0.08,

            loop:
                options.loop || false,

            scale:
                options.scale || 1,

            rotation:
                options.rotation || 0,

            alpha:
                options.alpha || 1,

            color:
                options.color || "#ffffff",

            frames:
                this.generateFrames(name)
        };

        this.activeAnimations.push(
            animation
        );

        return animation;
    }

    // =========================================
    // Generate Frames
    // =========================================

    generateFrames(name) {

        switch(name) {

            case "slash":

                return [
                    { radius: 20 },
                    { radius: 35 },
                    { radius: 50 },
                    { radius: 65 }
                ];

            case "explosion":

                return [
                    { radius: 10 },
                    { radius: 25 },
                    { radius: 45 },
                    { radius: 70 },
                    { radius: 90 }
                ];

            case "heal":

                return [
                    { radius: 15 },
                    { radius: 25 },
                    { radius: 35 },
                    { radius: 45 }
                ];

            case "levelup":

                return [
                    { radius: 30 },
                    { radius: 60 },
                    { radius: 90 },
                    { radius: 120 }
                ];

            case "fireball":

                return [
                    { radius: 12 },
                    { radius: 14 },
                    { radius: 16 },
                    { radius: 18 }
                ];

            case "lightning":

                return [
                    { radius: 10 },
                    { radius: 30 },
                    { radius: 50 }
                ];

            default:

                return [
                    { radius: 20 }
                ];
        }
    }

    // =========================================
    // Draw All
    // =========================================

    draw(ctx) {

        for (
            const animation of
            this.activeAnimations
        ) {

            this.drawAnimation(
                ctx,
                animation
            );
        }
    }

    // =========================================
    // Draw Animation
    // =========================================

    drawAnimation(
        ctx,
        animation
    ) {

        const frame =
            animation.frames[
                animation.frame
            ];

        if (!frame) {
            return;
        }

        ctx.save();

        ctx.translate(
            animation.x,
            animation.y
        );

        ctx.rotate(
            animation.rotation
        );

        ctx.scale(
            animation.scale,
            animation.scale
        );

        ctx.globalAlpha =
            animation.alpha;

        switch(animation.name) {

            case "slash":

                this.drawSlash(
                    ctx,
                    frame,
                    animation
                );

                break;

            case "explosion":

                this.drawExplosion(
                    ctx,
                    frame,
                    animation
                );

                break;

            case "heal":

                this.drawHeal(
                    ctx,
                    frame,
                    animation
                );

                break;

            case "levelup":

                this.drawLevelUp(
                    ctx,
                    frame,
                    animation
                );

                break;

            case "fireball":

                this.drawFireball(
                    ctx,
                    frame,
                    animation
                );

                break;

            case "lightning":

                this.drawLightning(
                    ctx,
                    frame,
                    animation
                );

                break;
        }

        ctx.restore();
    }

    // =========================================
    // Slash Animation
    // =========================================

    drawSlash(
        ctx,
        frame,
        animation
    ) {

        ctx.strokeStyle =
            animation.color;

        ctx.lineWidth = 8;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            frame.radius,
            Math.PI * 0.2,
            Math.PI * 1.4
        );

        ctx.stroke();
    }

    // =========================================
    // Explosion
    // =========================================

    drawExplosion(
        ctx,
        frame,
        animation
    ) {

        const gradient =
            ctx.createRadialGradient(
                0,
                0,
                5,
                0,
                0,
                frame.radius
            );

        gradient.addColorStop(
            0,
            "#ffffaa"
        );

        gradient.addColorStop(
            0.4,
            "#ff9933"
        );

        gradient.addColorStop(
            1,
            "rgba(255,80,0,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            frame.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Heal Animation
    // =========================================

    drawHeal(
        ctx,
        frame,
        animation
    ) {

        ctx.strokeStyle =
            "#44ff88";

        ctx.lineWidth = 5;

        // Circle
        ctx.beginPath();

        ctx.arc(
            0,
            0,
            frame.radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        // Cross
        ctx.beginPath();

        ctx.moveTo(
            -10,
            0
        );

        ctx.lineTo(
            10,
            0
        );

        ctx.moveTo(
            0,
            -10
        );

        ctx.lineTo(
            0,
            10
        );

        ctx.stroke();
    }

    // =========================================
    // Level Up
    // =========================================

    drawLevelUp(
        ctx,
        frame,
        animation
    ) {

        ctx.strokeStyle =
            "#ffd966";

        ctx.lineWidth = 6;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            frame.radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        // Rays
        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const angle =
                (
                    Math.PI * 2 / 8
                ) * i;

            const x1 =
                Math.cos(angle) *
                frame.radius;

            const y1 =
                Math.sin(angle) *
                frame.radius;

            const x2 =
                Math.cos(angle) *
                (
                    frame.radius + 20
                );

            const y2 =
                Math.sin(angle) *
                (
                    frame.radius + 20
                );

            ctx.beginPath();

            ctx.moveTo(
                x1,
                y1
            );

            ctx.lineTo(
                x2,
                y2
            );

            ctx.stroke();
        }
    }

    // =========================================
    // Fireball
    // =========================================

    drawFireball(
        ctx,
        frame,
        animation
    ) {

        const gradient =
            ctx.createRadialGradient(
                0,
                0,
                2,
                0,
                0,
                frame.radius
            );

        gradient.addColorStop(
            0,
            "#ffffaa"
        );

        gradient.addColorStop(
            0.5,
            "#ff8833"
        );

        gradient.addColorStop(
            1,
            "#ff2200"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            frame.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Lightning
    // =========================================

    drawLightning(
        ctx,
        frame,
        animation
    ) {

        ctx.strokeStyle =
            "#aaddff";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.moveTo(0, -frame.radius);

        ctx.lineTo(
            -10,
            -10
        );

        ctx.lineTo(
            8,
            5
        );

        ctx.lineTo(
            -5,
            frame.radius
        );

        ctx.stroke();
    }

    // =========================================
    // Clear
    // =========================================

    clear() {

        this.activeAnimations = [];
    }
}
