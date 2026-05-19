// =========================================
// Ultimate Tower RPG - screenEffects.js
// =========================================

export class ScreenEffects {

    constructor(game) {

        this.game = game;

        // =====================================
        // Effects
        // =====================================

        this.damageFlash = 0;

        this.levelUpFlash = 0;

        this.bossWarning = 0;

        this.slowMotion = 1;

        this.freezeFrame = 0;

        this.transitionAlpha = 0;

        this.transitionDirection = 0;

        // =====================================
        // Cinematic Bars
        // =====================================

        this.cinematicMode = false;

        this.barHeight = 0;

        // =====================================
        // Floating Text
        // =====================================

        this.floatingTexts = [];
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Timers
        // =====================================

        if (this.damageFlash > 0) {

            this.damageFlash -=
                deltaTime * 4;
        }

        if (this.levelUpFlash > 0) {

            this.levelUpFlash -=
                deltaTime * 2;
        }

        if (this.bossWarning > 0) {

            this.bossWarning -=
                deltaTime;
        }

        if (this.freezeFrame > 0) {

            this.freezeFrame -=
                deltaTime;
        }

        // =====================================
        // Transitions
        // =====================================

        if (
            this.transitionDirection !== 0
        ) {

            this.transitionAlpha +=
                this.transitionDirection *
                deltaTime;

            if (
                this.transitionAlpha >= 1
            ) {

                this.transitionAlpha = 1;

                this.transitionDirection = 0;
            }

            if (
                this.transitionAlpha <= 0
            ) {

                this.transitionAlpha = 0;

                this.transitionDirection = 0;
            }
        }

        // =====================================
        // Cinematic Bars
        // =====================================

        if (
            this.cinematicMode
        ) {

            this.barHeight +=
                (70 - this.barHeight) *
                0.08;

        } else {

            this.barHeight +=
                (0 - this.barHeight) *
                0.08;
        }

        // =====================================
        // Floating Text
        // =====================================

        for (
            let i =
                this.floatingTexts.length - 1;
            i >= 0;
            i--
        ) {

            const text =
                this.floatingTexts[i];

            text.y -=
                40 * deltaTime;

            text.life -=
                deltaTime;

            if (text.life <= 0) {

                this.floatingTexts.splice(
                    i,
                    1
                );
            }
        }
    }

    // =========================================
    // Damage Flash
    // =========================================

    triggerDamageFlash() {

        this.damageFlash = 1;
    }

    // =========================================
    // Level Up Flash
    // =========================================

    triggerLevelUp() {

        this.levelUpFlash = 1;

        this.addFloatingText(
            "LEVEL UP!",
            this.game.width / 2,
            this.game.height / 2,
            "#ffd966",
            42
        );
    }

    // =========================================
    // Boss Warning
    // =========================================

    triggerBossWarning(name = "BOSS") {

        this.bossWarning = 4;

        this.addFloatingText(
            `${name} APPROACHES`,
            this.game.width / 2,
            180,
            "#ff4444",
            50
        );
    }

    // =========================================
    // Slow Motion
    // =========================================

    enableSlowMotion(amount = 0.35) {

        this.slowMotion = amount;
    }

    disableSlowMotion() {

        this.slowMotion = 1;
    }

    // =========================================
    // Freeze Frame
    // =========================================

    freeze(seconds = 0.08) {

        this.freezeFrame = seconds;
    }

    // =========================================
    // Fade In
    // =========================================

    fadeIn() {

        this.transitionAlpha = 1;

        this.transitionDirection = -1;
    }

    // =========================================
    // Fade Out
    // =========================================

    fadeOut() {

        this.transitionAlpha = 0;

        this.transitionDirection = 1;
    }

    // =========================================
    // Cinematic Mode
    // =========================================

    enableCinematicMode() {

        this.cinematicMode = true;
    }

    disableCinematicMode() {

        this.cinematicMode = false;
    }

    // =========================================
    // Floating Text
    // =========================================

    addFloatingText(
        text,
        x,
        y,
        color = "#ffffff",
        size = 24
    ) {

        this.floatingTexts.push({

            text,
            x,
            y,

            color,
            size,

            life: 1.5
        });
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        this.drawDamageFlash(ctx);

        this.drawLevelUpFlash(ctx);

        this.drawBossWarning(ctx);

        this.drawFloatingTexts(ctx);

        this.drawTransitions(ctx);

        this.drawCinematicBars(ctx);
    }

    // =========================================
    // Damage Flash
    // =========================================

    drawDamageFlash(ctx) {

        if (this.damageFlash <= 0) {
            return;
        }

        ctx.save();

        ctx.globalAlpha =
            this.damageFlash * 0.35;

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
    // Level Up Flash
    // =========================================

    drawLevelUpFlash(ctx) {

        if (this.levelUpFlash <= 0) {
            return;
        }

        ctx.save();

        ctx.globalAlpha =
            this.levelUpFlash * 0.25;

        ctx.fillStyle =
            "#ffd966";

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        ctx.restore();
    }

    // =========================================
    // Boss Warning
    // =========================================

    drawBossWarning(ctx) {

        if (this.bossWarning <= 0) {
            return;
        }

        const pulse =
            (
                Math.sin(
                    performance.now() * 0.01
                ) + 1
            ) * 0.5;

        ctx.save();

        ctx.globalAlpha =
            0.6 + pulse * 0.4;

        // Warning Background
        ctx.fillStyle =
            "#660000";

        ctx.fillRect(
            0,
            120,
            this.game.width,
            120
        );

        // Text
        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 56px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "⚠ BOSS WARNING ⚠",
            this.game.width / 2,
            195
        );

        ctx.restore();
    }

    // =========================================
    // Floating Texts
    // =========================================

    drawFloatingTexts(ctx) {

        for (
            const text of
            this.floatingTexts
        ) {

            ctx.save();

            ctx.globalAlpha =
                text.life / 1.5;

            ctx.fillStyle =
                text.color;

            ctx.font =
                `bold ${text.size}px Arial`;

            ctx.textAlign =
                "center";

            ctx.fillText(
                text.text,
                text.x,
                text.y
            );

            ctx.restore();
        }
    }

    // =========================================
    // Screen Transitions
    // =========================================

    drawTransitions(ctx) {

        if (
            this.transitionAlpha <= 0
        ) {

            return;
        }

        ctx.save();

        ctx.globalAlpha =
            this.transitionAlpha;

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
    // Cinematic Bars
    // =========================================

    drawCinematicBars(ctx) {

        if (
            this.barHeight <= 1
        ) {

            return;
        }

        ctx.save();

        ctx.fillStyle =
            "#000000";

        // Top
        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.barHeight
        );

        // Bottom
        ctx.fillRect(
            0,
            this.game.height -
            this.barHeight,
            this.game.width,
            this.barHeight
        );

        ctx.restore();
    }
}
