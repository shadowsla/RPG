// =========================================
// Ultimate Tower RPG - hud.js
// =========================================

export class HUD {

    constructor(game, player) {

        this.game = game;

        this.player = player;

        // =====================================
        // Animation
        // =====================================

        this.healthLerp =
            player.health;

        this.manaLerp =
            player.mana;

        this.staminaLerp =
            player.stamina;

        // =====================================
        // FPS Counter
        // =====================================

        this.fps = 0;

        this.frameCounter = 0;

        this.frameTimer = 0;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // Smooth Bar Animation
        this.healthLerp +=
            (
                this.player.health -
                this.healthLerp
            ) * 8 * deltaTime;

        this.manaLerp +=
            (
                this.player.mana -
                this.manaLerp
            ) * 8 * deltaTime;

        this.staminaLerp +=
            (
                this.player.stamina -
                this.staminaLerp
            ) * 8 * deltaTime;

        // FPS
        this.frameCounter++;

        this.frameTimer += deltaTime;

        if (this.frameTimer >= 1) {

            this.fps =
                this.frameCounter;

            this.frameCounter = 0;

            this.frameTimer = 0;
        }
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        this.drawBars(ctx);

        this.drawPlayerInfo(ctx);

        this.drawExperienceBar(ctx);

        this.drawSkillBar(ctx);

        this.drawQuestTracker(ctx);

        this.drawNotifications(ctx);

        this.drawMinimapBorder(ctx);

        if (
            this.game.settingsMenu &&
            this.game.settingsMenu.settings.showFPS
        ) {

            this.drawFPS(ctx);
        }
    }

    // =========================================
    // Draw Health / Mana / Stamina
    // =========================================

    drawBars(ctx) {

        const x = 20;
        const y = 20;

        const width = 320;
        const height = 24;

        // =====================================
        // Health
        // =====================================

        this.drawBar(
            ctx,
            x,
            y,
            width,
            height,
            this.healthLerp,
            this.player.maxHealth,
            "#ff4444",
            "HP"
        );

        // =====================================
        // Mana
        // =====================================

        this.drawBar(
            ctx,
            x,
            y + 36,
            width,
            height,
            this.manaLerp,
            this.player.maxMana,
            "#4488ff",
            "MP"
        );

        // =====================================
        // Stamina
        // =====================================

        this.drawBar(
            ctx,
            x,
            y + 72,
            width,
            height,
            this.staminaLerp,
            this.player.maxStamina,
            "#44dd66",
            "STM"
        );
    }

    // =========================================
    // Draw Individual Bar
    // =========================================

    drawBar(
        ctx,
        x,
        y,
        width,
        height,
        value,
        maxValue,
        color,
        label
    ) {

        // Background
        ctx.fillStyle =
            "rgba(0,0,0,0.55)";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // Fill
        const percent =
            value / maxValue;

        ctx.fillStyle = color;

        ctx.fillRect(
            x,
            y,
            width * percent,
            height
        );

        // Border
        ctx.strokeStyle =
            "rgba(255,255,255,0.15)";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );

        // Text
        ctx.fillStyle = "#ffffff";

        ctx.font = "16px Arial";

        ctx.fillText(
            `${label}: ${Math.floor(value)} / ${maxValue}`,
            x + 10,
            y + 17
        );
    }

    // =========================================
    // Draw Player Info
    // =========================================

    drawPlayerInfo(ctx) {

        const x = 20;
        const y = 120;

        ctx.fillStyle =
            "rgba(0,0,0,0.45)";

        ctx.fillRect(
            x,
            y,
            320,
            170
        );

        ctx.strokeStyle =
            "rgba(255,255,255,0.12)";

        ctx.strokeRect(
            x,
            y,
            320,
            170
        );

        ctx.fillStyle = "#ffffff";

        ctx.font = "22px Arial";

        ctx.fillText(
            this.player.name || "Hunter",
            x + 15,
            y + 35
        );

        ctx.font = "18px Arial";

        ctx.fillStyle = "#cccccc";

        ctx.fillText(
            `Class: ${this.player.class}`,
            x + 15,
            y + 70
        );

        ctx.fillText(
            `Subclass: ${this.player.subclass}`,
            x + 15,
            y + 100
        );

        ctx.fillText(
            `Rank: ${this.player.rank}`,
            x + 15,
            y + 130
        );

        ctx.fillText(
            `Level: ${this.player.level}`,
            x + 15,
            y + 160
        );

        ctx.fillStyle = "#ffd966";

        ctx.fillText(
            `Gold: ${this.player.gold}`,
            x + 15,
            y + 190
        );

        ctx.fillStyle = "#66d9ff";

        ctx.fillText(
            `Weapon: ${this.player.weapon?.name || "None"}`,
            x + 15,
            y + 220
        );
    }

    // =========================================
    // Experience Bar
    // =========================================

    drawExperienceBar(ctx) {

        const width = 500;
        const height = 20;

        const x =
            (this.game.width - width) / 2;

        const y =
            this.game.height - 35;

        // Background
        ctx.fillStyle =
            "rgba(0,0,0,0.6)";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // Fill
        const percent =
            this.player.exp /
            this.player.nextLevelExp;

        ctx.fillStyle = "#aa66ff";

        ctx.fillRect(
            x,
            y,
            width * percent,
            height
        );

        // Border
        ctx.strokeStyle =
            "rgba(255,255,255,0.2)";

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );

        // Text
        ctx.fillStyle = "#ffffff";

        ctx.font = "14px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            `EXP ${this.player.exp} / ${this.player.nextLevelExp}`,
            x + width / 2,
            y + 15
        );

        ctx.textAlign = "left";
    }

    // =========================================
    // Skill Bar
    // =========================================

    drawSkillBar(ctx) {

        const size = 64;

        const spacing = 16;

        const totalWidth =
            5 * size + 4 * spacing;

        const startX =
            (this.game.width - totalWidth) / 2;

        const y =
            this.game.height - 110;

        const labels = [
            "Q",
            "E",
            "R",
            "F",
            "ULT"
        ];

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const x =
                startX +
                i * (size + spacing);

            // Background
            ctx.fillStyle =
                "rgba(0,0,0,0.6)";

            ctx.fillRect(
                x,
                y,
                size,
                size
            );

            // Border
            ctx.strokeStyle =
                "rgba(255,255,255,0.15)";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                x,
                y,
                size,
                size
            );

            // Label
            ctx.fillStyle = "#ffffff";

            ctx.font = "20px Arial";

            ctx.textAlign = "center";

            ctx.fillText(
                labels[i],
                x + size / 2,
                y + size / 2 + 7
            );

            // Cooldown Overlay
            const cooldown =
                this.player.cooldowns?.[
                    labels[i]
                ];

            if (cooldown > 0) {

                ctx.fillStyle =
                    "rgba(0,0,0,0.6)";

                ctx.fillRect(
                    x,
                    y,
                    size,
                    size
                );

                ctx.fillStyle =
                    "#ff6666";

                ctx.font =
                    "bold 22px Arial";

                ctx.fillText(
                    Math.ceil(cooldown),
                    x + size / 2,
                    y + size / 2 + 7
                );
            }
        }

        ctx.textAlign = "left";
    }

    // =========================================
    // Quest Tracker
    // =========================================

    drawQuestTracker(ctx) {

        if (
            !this.player.quests ||
            this.player.quests.length === 0
        ) {

            return;
        }

        const quest =
            this.player.quests[0];

        const x =
            this.game.width - 360;

        const y = 20;

        ctx.fillStyle =
            "rgba(0,0,0,0.5)";

        ctx.fillRect(
            x,
            y,
            340,
            90
        );

        ctx.strokeStyle =
            "rgba(255,255,255,0.12)";

        ctx.strokeRect(
            x,
            y,
            340,
            90
        );

        ctx.fillStyle = "#cc99ff";

        ctx.font = "bold 22px Arial";

        ctx.fillText(
            "QUEST",
            x + 15,
            y + 30
        );

        ctx.fillStyle = "#ffffff";

        ctx.font = "18px Arial";

        ctx.fillText(
            quest.name,
            x + 15,
            y + 58
        );

        ctx.fillStyle = "#aaaaaa";

        ctx.font = "16px Arial";

        ctx.fillText(
            `${quest.progress} / ${quest.goal}`,
            x + 15,
            y + 82
        );
    }

    // =========================================
    // Notifications
    // =========================================

    drawNotifications(ctx) {

        if (
            this.game.notifications
        ) {

            this.game.notifications.draw(ctx);
        }
    }

    // =========================================
    // Minimap Border Decoration
    // =========================================

    drawMinimapBorder(ctx) {

        ctx.strokeStyle =
            "rgba(120,180,255,0.2)";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            this.game.width - 245,
            15,
            230,
            230
        );
    }

    // =========================================
    // FPS Counter
    // =========================================

    drawFPS(ctx) {

        ctx.fillStyle = "#00ff88";

        ctx.font = "18px Arial";

        ctx.fillText(
            `FPS: ${this.fps}`,
            this.game.width - 120,
            this.game.height - 20
        );
    }
}
