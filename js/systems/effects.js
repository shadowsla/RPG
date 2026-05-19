// =========================================
// Ultimate Tower RPG - effects.js
// =========================================

// =========================================
// Effects System
// =========================================

export class EffectsSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Active Effects
        // =====================================

        this.effects = [];

        // =====================================
        // Screen Effects
        // =====================================

        this.screenShake = {

            active: false,

            intensity: 0,

            duration: 0,

            x: 0,

            y: 0
        };

        // =====================================
        // Flash
        // =====================================

        this.screenFlash = {

            active: false,

            color: "#ffffff",

            alpha: 0,

            duration: 0
        };

        // =====================================
        // Slow Motion
        // =====================================

        this.timeScale = 1;

        this.targetTimeScale = 1;

        // =====================================
        // Chromatic Aberration
        // =====================================

        this.chromaticStrength = 0;

        // =====================================
        // Hit Stop
        // =====================================

        this.hitStopTimer = 0;

        // =====================================
        // Damage Numbers
        // =====================================

        this.damageNumbers = [];
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Effects
        // =====================================

        this.updateEffects(
            deltaTime
        );

        // =====================================
        // Screen Shake
        // =====================================

        this.updateScreenShake(
            deltaTime
        );

        // =====================================
        // Flash
        // =====================================

        this.updateScreenFlash(
            deltaTime
        );

        // =====================================
        // Time Scale
        // =====================================

        this.updateTimeScale(
            deltaTime
        );

        // =====================================
        // Damage Numbers
        // =====================================

        this.updateDamageNumbers(
            deltaTime
        );

        // =====================================
        // Hit Stop
        // =====================================

        if (
            this.hitStopTimer > 0
        ) {

            this.hitStopTimer -=
                deltaTime;
        }
    }

    // =========================================
    // Update Effects
    // =========================================

    updateEffects(
        deltaTime
    ) {

        for (
            let i =
                this.effects.length - 1;
            i >= 0;
            i--
        ) {

            const effect =
                this.effects[i];

            effect.life -=
                deltaTime;

            // Remove
            if (
                effect.life <= 0
            ) {

                this.effects.splice(
                    i,
                    1
                );

                continue;
            }

            // Animation
            effect.age +=
                deltaTime;

            // Movement
            if (
                effect.velocityX
            ) {

                effect.x +=

                    effect.velocityX *
                    deltaTime;
            }

            if (
                effect.velocityY
            ) {

                effect.y +=

                    effect.velocityY *
                    deltaTime;
            }

            // Fade
            effect.alpha =

                effect.life /
                effect.maxLife;
        }
    }

    // =========================================
    // Screen Shake
    // =========================================

    updateScreenShake(
        deltaTime
    ) {

        if (
            !this.screenShake.active
        ) {

            return;
        }

        this.screenShake.duration -=
            deltaTime;

        // Random Offset
        this.screenShake.x =

            (Math.random() - 0.5) *

            this.screenShake.intensity;

        this.screenShake.y =

            (Math.random() - 0.5) *

            this.screenShake.intensity;

        // End
        if (
            this.screenShake.duration <= 0
        ) {

            this.screenShake.active =
                false;

            this.screenShake.x = 0;

            this.screenShake.y = 0;
        }
    }

    // =========================================
    // Screen Flash
    // =========================================

    updateScreenFlash(
        deltaTime
    ) {

        if (
            !this.screenFlash.active
        ) {

            return;
        }

        this.screenFlash.duration -=
            deltaTime;

        this.screenFlash.alpha *=
            0.92;

        // End
        if (
            this.screenFlash.duration <= 0
        ) {

            this.screenFlash.active =
                false;

            this.screenFlash.alpha = 0;
        }
    }

    // =========================================
    // Time Scale
    // =========================================

    updateTimeScale(
        deltaTime
    ) {

        this.timeScale +=

            (this.targetTimeScale -
            this.timeScale) *

            5 *

            deltaTime;
    }

    // =========================================
    // Damage Numbers
    // =========================================

    updateDamageNumbers(
        deltaTime
    ) {

        for (
            let i =
                this.damageNumbers.length - 1;
            i >= 0;
            i--
        ) {

            const number =
                this.damageNumbers[i];

            number.life -=
                deltaTime;

            // Float Up
            number.y -=
                60 * deltaTime;

            // Wiggle
            number.x +=

                Math.sin(
                    number.life * 20
                ) * 20 * deltaTime;

            // Remove
            if (
                number.life <= 0
            ) {

                this.damageNumbers.splice(
                    i,
                    1
                );
            }
        }
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        // =====================================
        // World Effects
        // =====================================

        this.drawEffects(ctx);

        // =====================================
        // Damage Numbers
        // =====================================

        this.drawDamageNumbers(ctx);

        // =====================================
        // Flash
        // =====================================

        this.drawScreenFlash(ctx);
    }

    // =========================================
    // Draw Effects
    // =========================================

    drawEffects(ctx) {

        for (
            const effect of
            this.effects
        ) {

            ctx.save();

            ctx.globalAlpha =
                effect.alpha;

            switch(effect.type) {

                // =============================
                // Slash
                // =============================

                case "slash":

                    this.drawSlashEffect(
                        ctx,
                        effect
                    );

                    break;

                // =============================
                // Explosion
                // =============================

                case "explosion":

                    this.drawExplosionEffect(
                        ctx,
                        effect
                    );

                    break;

                // =============================
                // Shockwave
                // =============================

                case "shockwave":

                    this.drawShockwaveEffect(
                        ctx,
                        effect
                    );

                    break;

                // =============================
                // Aura
                // =============================

                case "aura":

                    this.drawAuraEffect(
                        ctx,
                        effect
                    );

                    break;

                // =============================
                // Portal
                // =============================

                case "portal":

                    this.drawPortalEffect(
                        ctx,
                        effect
                    );

                    break;

                // =============================
                // Heal
                // =============================

                case "heal":

                    this.drawHealEffect(
                        ctx,
                        effect
                    );

                    break;
            }

            ctx.restore();
        }
    }

    // =========================================
    // Slash Effect
    // =========================================

    drawSlashEffect(
        ctx,
        effect
    ) {

        ctx.translate(
            effect.x,
            effect.y
        );

        ctx.rotate(
            effect.rotation || 0
        );

        ctx.strokeStyle =
            effect.color ||
            "#ffffff";

        ctx.lineWidth = 8;

        ctx.beginPath();

        ctx.arc(

            0,
            0,

            effect.size,

            -0.5,

            0.5
        );

        ctx.stroke();
    }

    // =========================================
    // Explosion
    // =========================================

    drawExplosionEffect(
        ctx,
        effect
    ) {

        const radius =

            effect.size *

            (1 -
            effect.life /
            effect.maxLife);

        const gradient =
            ctx.createRadialGradient(

                effect.x,
                effect.y,
                0,

                effect.x,
                effect.y,
                radius
            );

        gradient.addColorStop(
            0,
            "#ffffaa"
        );

        gradient.addColorStop(
            0.5,
            "#ff9933"
        );

        gradient.addColorStop(
            1,
            "transparent"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(

            effect.x,
            effect.y,

            radius,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Shockwave
    // =========================================

    drawShockwaveEffect(
        ctx,
        effect
    ) {

        const radius =

            effect.size *

            (effect.age * 2);

        ctx.strokeStyle =
            effect.color ||
            "#ffffff";

        ctx.lineWidth =

            10 *
            effect.alpha;

        ctx.beginPath();

        ctx.arc(

            effect.x,
            effect.y,

            radius,

            0,

            Math.PI * 2
        );

        ctx.stroke();
    }

    // =========================================
    // Aura
    // =========================================

    drawAuraEffect(
        ctx,
        effect
    ) {

        const pulse =

            Math.sin(
                effect.age * 5
            ) * 10;

        const radius =
            effect.size + pulse;

        const gradient =
            ctx.createRadialGradient(

                effect.x,
                effect.y,
                0,

                effect.x,
                effect.y,
                radius
            );

        gradient.addColorStop(
            0,
            effect.color
        );

        gradient.addColorStop(
            1,
            "transparent"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(

            effect.x,
            effect.y,

            radius,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Portal
    // =========================================

    drawPortalEffect(
        ctx,
        effect
    ) {

        ctx.save();

        ctx.translate(
            effect.x,
            effect.y
        );

        ctx.rotate(
            effect.age * 2
        );

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            ctx.strokeStyle =
                `hsla(${
                    effect.age * 100 +
                    i * 40
                },100%,60%,0.7)`;

            ctx.lineWidth = 4;

            ctx.beginPath();

            ctx.arc(

                0,
                0,

                effect.size -
                i * 10,

                0,

                Math.PI * 2
            );

            ctx.stroke();
        }

        ctx.restore();
    }

    // =========================================
    // Heal
    // =========================================

    drawHealEffect(
        ctx,
        effect
    ) {

        ctx.fillStyle =
            "#66ff99";

        ctx.font =
            `${effect.size}px Arial`;

        ctx.fillText(

            "+",

            effect.x,

            effect.y
        );
    }

    // =========================================
    // Damage Numbers
    // =========================================

    drawDamageNumbers(ctx) {

        for (
            const number of
            this.damageNumbers
        ) {

            ctx.save();

            ctx.globalAlpha =
                number.life /
                number.maxLife;

            ctx.font =

                `${number.size}px Arial`;

            ctx.textAlign =
                "center";

            // Outline
            ctx.strokeStyle =
                "#000000";

            ctx.lineWidth = 4;

            ctx.strokeText(

                number.text,

                number.x,

                number.y
            );

            // Color
            ctx.fillStyle =
                number.color;

            ctx.fillText(

                number.text,

                number.x,

                number.y
            );

            ctx.restore();
        }
    }

    // =========================================
    // Flash
    // =========================================

    drawScreenFlash(ctx) {

        if (
            !this.screenFlash.active
        ) {

            return;
        }

        ctx.save();

        ctx.globalAlpha =
            this.screenFlash.alpha;

        ctx.fillStyle =
            this.screenFlash.color;

        ctx.fillRect(

            0,
            0,

            this.game.canvas.width,

            this.game.canvas.height
        );

        ctx.restore();
    }

    // =========================================
    // Create Effect
    // =========================================

    createEffect(effect) {

        effect.age = 0;

        effect.alpha = 1;

        effect.maxLife =
            effect.life;

        this.effects.push(
            effect
        );

        return effect;
    }

    // =========================================
    // Damage Number
    // =========================================

    showDamageNumber(
        x,
        y,
        damage,
        critical = false
    ) {

        this.damageNumbers.push({

            x,
            y,

            text:
                damage.toString(),

            size:
                critical ? 42 : 30,

            color:
                critical
                ? "#ffcc00"
                : "#ff4444",

            life: 1,

            maxLife: 1
        });
    }

    // =========================================
    // Heal Number
    // =========================================

    showHealNumber(
        x,
        y,
        amount
    ) {

        this.damageNumbers.push({

            x,
            y,

            text:
                `+${amount}`,

            size: 28,

            color:
                "#44ff88",

            life: 1,

            maxLife: 1
        });
    }

    // =========================================
    // Shake Screen
    // =========================================

    shakeScreen(
        intensity = 10,
        duration = 0.3
    ) {

        this.screenShake.active =
            true;

        this.screenShake.intensity =
            intensity;

        this.screenShake.duration =
            duration;
    }

    // =========================================
    // Flash Screen
    // =========================================

    flashScreen(
        color = "#ffffff",
        alpha = 0.7,
        duration = 0.2
    ) {

        this.screenFlash.active =
            true;

        this.screenFlash.color =
            color;

        this.screenFlash.alpha =
            alpha;

        this.screenFlash.duration =
            duration;
    }

    // =========================================
    // Slow Motion
    // =========================================

    setSlowMotion(
        scale = 0.3,
        duration = 0.2
    ) {

        this.timeScale = scale;

        this.targetTimeScale = scale;

        setTimeout(() => {

            this.targetTimeScale = 1;

        }, duration * 1000);
    }

    // =========================================
    // Hit Stop
    // =========================================

    triggerHitStop(
        duration = 0.08
    ) {

        this.hitStopTimer =
            duration;
    }

    // =========================================
    // Is Frozen
    // =========================================

    isGameFrozen() {

        return this.hitStopTimer > 0;
    }

    // =========================================
    // Get Shake Offset
    // =========================================

    getShakeOffset() {

        return {

            x:
                this.screenShake.x,

            y:
                this.screenShake.y
        };
    }

    // =========================================
    // Clear
    // =========================================

    clear() {

        this.effects = [];

        this.damageNumbers = [];
    }
}