// =========================================
// Ultimate Tower RPG - uiSystem.js
// =========================================

// =========================================
// UI System
// =========================================

export class UISystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // UI States
        // =====================================

        this.showInventory = false;

        this.showMap = false;

        this.showSkills = false;

        this.showStats = false;

        this.showPauseMenu = false;

        this.showSettings = false;

        this.showQuestLog = false;

        this.showChat = false;

        // =====================================
        // Messages
        // =====================================

        this.messages = [];

        // =====================================
        // Damage Numbers
        // =====================================

        this.damageNumbers = [];

        // =====================================
        // Notifications
        // =====================================

        this.notifications = [];

        // =====================================
        // Crosshair
        // =====================================

        this.crosshair = {

            x: 0,

            y: 0,

            size: 14
        };

        // =====================================
        // Minimap
        // =====================================

        this.minimapScale = 0.08;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Damage Numbers
        // =====================================

        for (
            let i =
                this.damageNumbers.length - 1;
            i >= 0;
            i--
        ) {

            const damage =
                this.damageNumbers[i];

            damage.y -=
                40 * deltaTime;

            damage.life -=
                deltaTime;

            if (
                damage.life <= 0
            ) {

                this.damageNumbers.splice(
                    i,
                    1
                );
            }
        }

        // =====================================
        // Notifications
        // =====================================

        for (
            let i =
                this.notifications.length - 1;
            i >= 0;
            i--
        ) {

            const notification =
                this.notifications[i];

            notification.life -=
                deltaTime;

            if (
                notification.life <= 0
            ) {

                this.notifications.splice(
                    i,
                    1
                );
            }
        }
    }

    // =========================================
    // Toggle Menu
    // =========================================

    toggleMenu(menu) {

        this[menu] =
            !this[menu];

        // Pause
        if (
            menu === "showPauseMenu"
        ) {

            this.game.paused =
                this[menu];
        }
    }

    // =========================================
    // Damage Number
    // =========================================

    addDamageNumber(
        x,
        y,
        damage,
        critical = false
    ) {

        this.damageNumbers.push({

            x,

            y,

            damage,

            critical,

            life: 1.2
        });
    }

    // =========================================
    // Notification
    // =========================================

    addNotification(
        text,
        type = "info"
    ) {

        this.notifications.push({

            text,

            type,

            life: 4
        });
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        // =====================================
        // Main HUD
        // =====================================

        this.drawHUD(ctx);

        // =====================================
        // Damage Numbers
        // =====================================

        this.drawDamageNumbers(ctx);

        // =====================================
        // Notifications
        // =====================================

        this.drawNotifications(ctx);

        // =====================================
        // Minimap
        // =====================================

        this.drawMinimap(ctx);

        // =====================================
        // Menus
        // =====================================

        if (
            this.showInventory
        ) {

            this.drawInventory(ctx);
        }

        if (
            this.showMap
        ) {

            this.drawMap(ctx);
        }

        if (
            this.showSkills
        ) {

            this.drawSkills(ctx);
        }

        if (
            this.showStats
        ) {

            this.drawStats(ctx);
        }

        if (
            this.showPauseMenu
        ) {

            this.drawPauseMenu(ctx);
        }

        if (
            this.showSettings
        ) {

            this.drawSettings(ctx);
        }

        if (
            this.showQuestLog
        ) {

            this.drawQuestLog(ctx);
        }

        // =====================================
        // Crosshair
        // =====================================

        this.drawCrosshair(ctx);
    }

    // =========================================
    // HUD
    // =========================================

    drawHUD(ctx) {

        const player =
            this.game.player;

        ctx.save();

        // =====================================
        // Health Bar
        // =====================================

        this.drawBar(

            ctx,

            20,
            20,

            320,
            30,

            player.health /
            player.maxHealth,

            "#ff3333",

            "HP"
        );

        // =====================================
        // Mana Bar
        // =====================================

        this.drawBar(

            ctx,

            20,
            60,

            320,
            22,

            player.mana /
            player.maxMana,

            "#3399ff",

            "MP"
        );

        // =====================================
        // Stamina Bar
        // =====================================

        this.drawBar(

            ctx,

            20,
            92,

            320,
            18,

            player.stamina /
            player.maxStamina,

            "#33ff66",

            "ST"
        );

        // =====================================
        // XP Bar
        // =====================================

        this.drawBar(

            ctx,

            20,
            122,

            400,
            14,

            player.exp /
            player.nextLevelExp,

            "#bb66ff",

            `LV ${player.level}`
        );

        // =====================================
        // Gold
        // =====================================

        ctx.fillStyle =
            "#ffcc33";

        ctx.font =
            "24px Arial";

        ctx.fillText(

            `Gold: ${this.game.gold}`,

            20,

            175
        );

        // =====================================
        // Score
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(

            `Score: ${this.game.score}`,

            20,

            205
        );

        // =====================================
        // Floor
        // =====================================

        ctx.fillStyle =
            "#ffaa33";

        ctx.font =
            "28px Arial";

        ctx.fillText(

            `Floor ${this.game.floor}`,

            20,

            245
        );

        // =====================================
        // Active Class
        // =====================================

        ctx.fillStyle =
            "#66ddff";

        ctx.font =
            "22px Arial";

        ctx.fillText(

            `Class: ${player.className}`,

            20,

            280
        );

        // =====================================
        // FPS
        // =====================================

        ctx.fillStyle =
            "#cccccc";

        ctx.font =
            "16px Arial";

        ctx.fillText(

            `FPS: ${Math.round(this.game.fps || 60)}`,

            20,

            310
        );

        ctx.restore();
    }

    // =========================================
    // Generic Bar
    // =========================================

    drawBar(
        ctx,
        x,
        y,
        width,
        height,
        percent,
        color,
        label
    ) {

        // Background
        ctx.fillStyle =
            "#222222";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // Fill
        ctx.fillStyle =
            color;

        ctx.fillRect(

            x,

            y,

            width *
            Math.max(
                0,
                percent
            ),

            height
        );

        // Border
        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );

        // Text
        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "16px Arial";

        ctx.fillText(
            label,
            x + 8,
            y + height - 6
        );
    }

    // =========================================
    // Damage Numbers
    // =========================================

    drawDamageNumbers(ctx) {

        ctx.save();

        for (
            const damage of
            this.damageNumbers
        ) {

            ctx.globalAlpha =
                damage.life;

            ctx.fillStyle =
                damage.critical
                ? "#ffcc00"
                : "#ff4444";

            ctx.font =
                damage.critical
                ? "bold 32px Arial"
                : "24px Arial";

            ctx.fillText(

                Math.floor(
                    damage.damage
                ),

                damage.x,

                damage.y
            );
        }

        ctx.restore();
    }

    // =========================================
    // Notifications
    // =========================================

    drawNotifications(ctx) {

        ctx.save();

        let y = 20;

        for (
            const notification of
            this.notifications
        ) {

            ctx.globalAlpha =

                Math.min(
                    1,
                    notification.life
                );

            let color =
                "#ffffff";

            switch(notification.type) {

                case "success":
                    color = "#33ff66";
                    break;

                case "warning":
                    color = "#ffaa33";
                    break;

                case "danger":
                    color = "#ff4444";
                    break;
            }

            // Background
            ctx.fillStyle =
                "rgba(0,0,0,0.6)";

            ctx.fillRect(
                1400,
                y,
                420,
                42
            );

            // Text
            ctx.fillStyle =
                color;

            ctx.font =
                "22px Arial";

            ctx.fillText(

                notification.text,

                1420,

                y + 28
            );

            y += 52;
        }

        ctx.restore();
    }

    // =========================================
    // Minimap
    // =========================================

    drawMinimap(ctx) {

        const size = 220;

        const x =

            ctx.canvas.width -
            size - 20;

        const y =
            ctx.canvas.height -
            size - 20;

        ctx.save();

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            "rgba(0,0,0,0.7)";

        ctx.fillRect(
            x,
            y,
            size,
            size
        );

        // Border
        ctx.strokeStyle =
            "#ffffff";

        ctx.strokeRect(
            x,
            y,
            size,
            size
        );

        // =====================================
        // Rooms
        // =====================================

        ctx.fillStyle =
            "#666666";

        for (
            const room of
            this.game.rooms || []
        ) {

            ctx.fillRect(

                x +
                room.x *
                this.minimapScale,

                y +
                room.y *
                this.minimapScale,

                room.width *
                this.minimapScale,

                room.height *
                this.minimapScale
            );
        }

        // =====================================
        // Player
        // =====================================

        ctx.fillStyle =
            "#33ff66";

        ctx.beginPath();

        ctx.arc(

            x +
            this.game.player.x *
            this.minimapScale,

            y +
            this.game.player.y *
            this.minimapScale,

            5,

            0,

            Math.PI * 2
        );

        ctx.fill();

        // =====================================
        // Enemies
        // =====================================

        ctx.fillStyle =
            "#ff3333";

        for (
            const enemy of
            this.game.enemies
        ) {

            ctx.fillRect(

                x +
                enemy.x *
                this.minimapScale,

                y +
                enemy.y *
                this.minimapScale,

                3,

                3
            );
        }

        ctx.restore();
    }

    // =========================================
    // Inventory
    // =========================================

    drawInventory(ctx) {

        this.drawMenuBackground(
            ctx,
            "Inventory"
        );

        const inventory =
            this.game.player.inventory || [];

        let slot = 0;

        for (
            let row = 0;
            row < 5;
            row++
        ) {

            for (
                let col = 0;
                col < 8;
                col++
            ) {

                const x =
                    420 + col * 90;

                const y =
                    220 + row * 90;

                // Slot
                ctx.fillStyle =
                    "#333333";

                ctx.fillRect(
                    x,
                    y,
                    72,
                    72
                );

                ctx.strokeStyle =
                    "#ffffff";

                ctx.strokeRect(
                    x,
                    y,
                    72,
                    72
                );

                // Item
                const item =
                    inventory[slot];

                if (item) {

                    ctx.fillStyle =
                        item.color ||
                        "#ffaa33";

                    ctx.fillText(

                        item.name,

                        x + 5,

                        y + 40
                    );
                }

                slot++;
            }
        }
    }

    // =========================================
    // Map
    // =========================================

    drawMap(ctx) {

        this.drawMenuBackground(
            ctx,
            "World Map"
        );

        ctx.save();

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "28px Arial";

        ctx.fillText(

            `Current Floor: ${this.game.floor}`,

            500,

            220
        );

        ctx.fillText(

            `Rooms: ${(this.game.rooms || []).length}`,

            500,

            270
        );

        ctx.restore();
    }

    // =========================================
    // Skills
    // =========================================

    drawSkills(ctx) {

        this.drawMenuBackground(
            ctx,
            "Skills"
        );

        const skills =
            this.game.player.skills || [];

        ctx.save();

        ctx.font =
            "24px Arial";

        let y = 220;

        for (
            const skill of skills
        ) {

            ctx.fillStyle =
                "#66ccff";

            ctx.fillText(

                `${skill.name} - Lv ${skill.level}`,

                450,

                y
            );

            y += 50;
        }

        ctx.restore();
    }

    // =========================================
    // Stats
    // =========================================

    drawStats(ctx) {

        this.drawMenuBackground(
            ctx,
            "Player Stats"
        );

        const player =
            this.game.player;

        const stats = [

            `Level: ${player.level}`,

            `Health: ${player.maxHealth}`,

            `Mana: ${player.maxMana}`,

            `Strength: ${player.strength}`,

            `Defense: ${player.defense}`,

            `Speed: ${player.speed}`,

            `Crit Chance: ${player.critChance}%`,

            `Gold: ${this.game.gold}`
        ];

        ctx.save();

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "28px Arial";

        let y = 220;

        for (
            const stat of stats
        ) {

            ctx.fillText(
                stat,
                500,
                y
            );

            y += 50;
        }

        ctx.restore();
    }

    // =========================================
    // Pause Menu
    // =========================================

    drawPauseMenu(ctx) {

        ctx.save();

        ctx.fillStyle =
            "rgba(0,0,0,0.8)";

        ctx.fillRect(

            0,
            0,

            ctx.canvas.width,

            ctx.canvas.height
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 72px Arial";

        ctx.fillText(

            "PAUSED",

            700,

            250
        );

        ctx.font =
            "32px Arial";

        ctx.fillText(

            "Press ESC to Resume",

            620,

            340
        );

        ctx.restore();
    }

    // =========================================
    // Settings
    // =========================================

    drawSettings(ctx) {

        this.drawMenuBackground(
            ctx,
            "Settings"
        );

        ctx.save();

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "26px Arial";

        const settings = [

            "Music Volume",

            "SFX Volume",

            "Graphics Quality",

            "Fullscreen",

            "Keybinds"
        ];

        let y = 240;

        for (
            const setting of settings
        ) {

            ctx.fillText(
                setting,
                500,
                y
            );

            y += 60;
        }

        ctx.restore();
    }

    // =========================================
    // Quest Log
    // =========================================

    drawQuestLog(ctx) {

        this.drawMenuBackground(
            ctx,
            "Quest Log"
        )
    };

    // =========================================
    // Menu Background
    // =========================================

    drawMenuBackground(ctx, title) {

        ctx.save();

        ctx.fillStyle =
            "rgba(0,0,0,0.9)";

        ctx.fillRect(

            400,
            150,

            800,
            500
        );

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 4;

        ctx.strokeRect(

            400,
            150,

            800,
            500
        );

        ctx.fillStyle =
            "#66ccff";

        ctx.font =
            "bold 36px Arial";

        ctx.fillText(

            title,

            500,

            200
        );

        ctx.restore();
    }

    // =========================================
    // Crosshair
    // =========================================

    drawCrosshair(ctx) {

        const x =
            this.crosshair.x;

        const y =
            this.crosshair.y;

        const size =
            this.crosshair.size;

        ctx.save();

        ctx.strokeStyle =
            "#ff3333";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            x - size,
            y
        );

        ctx.lineTo(
            x + size,
            y
        );

        ctx.moveTo(
            x,
            y - size
        );

        ctx.lineTo(
            x,
            y + size
        );

        ctx.stroke();

        ctx.restore();
    }
}