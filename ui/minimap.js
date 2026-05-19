// =========================================
// Ultimate Tower RPG - minimap.js
// =========================================

export class Minimap {

    constructor(game, player) {

        this.game = game;

        this.player = player;

        // =====================================
        // Minimap Settings
        // =====================================

        this.width = 220;
        this.height = 220;

        this.padding = 20;

        this.scale = 0.12;

        this.visible = true;

        this.backgroundColor =
            "rgba(0,0,0,0.55)";

        this.borderColor =
            "rgba(255,255,255,0.15)";
    }

    // =========================================
    // Toggle
    // =========================================

    toggle() {

        this.visible = !this.visible;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // Future:
        // animated minimap effects
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        if (!this.visible) {
            return;
        }

        const x =
            this.game.width -
            this.width -
            this.padding;

        const y = this.padding;

        // =====================================
        // Background
        // =====================================

        ctx.save();

        ctx.fillStyle =
            this.backgroundColor;

        ctx.fillRect(
            x,
            y,
            this.width,
            this.height
        );

        // Border
        ctx.strokeStyle =
            this.borderColor;

        ctx.lineWidth = 3;

        ctx.strokeRect(
            x,
            y,
            this.width,
            this.height
        );

        // =====================================
        // Draw Map Grid
        // =====================================

        this.drawGrid(ctx, x, y);

        // =====================================
        // Draw Rooms
        // =====================================

        this.drawRooms(ctx, x, y);

        // =====================================
        // Draw Enemies
        // =====================================

        this.drawEnemies(ctx, x, y);

        // =====================================
        // Draw Loot
        // =====================================

        this.drawLoot(ctx, x, y);

        // =====================================
        // Draw Boss
        // =====================================

        this.drawBoss(ctx, x, y);

        // =====================================
        // Draw Player
        // =====================================

        this.drawPlayer(ctx, x, y);

        // =====================================
        // Draw Title
        // =====================================

        ctx.fillStyle = "#ffffff";

        ctx.font = "18px Arial";

        ctx.fillText(
            "MINIMAP",
            x + 10,
            y - 8
        );

        ctx.restore();
    }

    // =========================================
    // Grid
    // =========================================

    drawGrid(ctx, x, y) {

        ctx.strokeStyle =
            "rgba(255,255,255,0.05)";

        ctx.lineWidth = 1;

        const gridSize = 20;

        for (
            let i = 0;
            i < this.width;
            i += gridSize
        ) {

            ctx.beginPath();

            ctx.moveTo(x + i, y);

            ctx.lineTo(
                x + i,
                y + this.height
            );

            ctx.stroke();
        }

        for (
            let i = 0;
            i < this.height;
            i += gridSize
        ) {

            ctx.beginPath();

            ctx.moveTo(x, y + i);

            ctx.lineTo(
                x + this.width,
                y + i
            );

            ctx.stroke();
        }
    }

    // =========================================
    // Rooms
    // =========================================

    drawRooms(ctx, x, y) {

        if (!this.game.rooms) {
            return;
        }

        for (const room of this.game.rooms) {

            ctx.fillStyle =
                room.cleared
                    ? "rgba(80,200,120,0.4)"
                    : "rgba(120,120,255,0.25)";

            ctx.fillRect(
                x + room.x * this.scale,
                y + room.y * this.scale,
                room.width * this.scale,
                room.height * this.scale
            );
        }
    }

    // =========================================
    // Enemies
    // =========================================

    drawEnemies(ctx, x, y) {

        if (!this.game.enemies) {
            return;
        }

        for (const enemy of this.game.enemies) {

            ctx.fillStyle = "#ff4444";

            ctx.beginPath();

            ctx.arc(
                x + enemy.x * this.scale,
                y + enemy.y * this.scale,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }

    // =========================================
    // Loot
    // =========================================

    drawLoot(ctx, x, y) {

        if (!this.game.lootDrops) {
            return;
        }

        for (const loot of this.game.lootDrops) {

            ctx.fillStyle = "#ffd966";

            ctx.fillRect(
                x + loot.x * this.scale,
                y + loot.y * this.scale,
                4,
                4
            );
        }
    }

    // =========================================
    // Boss
    // =========================================

    drawBoss(ctx, x, y) {

        if (!this.game.boss) {
            return;
        }

        const boss =
            this.game.boss;

        ctx.fillStyle = "#ff0000";

        ctx.beginPath();

        ctx.arc(
            x + boss.x * this.scale,
            y + boss.y * this.scale,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Pulse Ring
        ctx.strokeStyle =
            "rgba(255,80,80,0.6)";

        ctx.lineWidth = 2;

        const pulse =
            9 +
            Math.sin(
                Date.now() * 0.01
            ) * 2;

        ctx.beginPath();

        ctx.arc(
            x + boss.x * this.scale,
            y + boss.y * this.scale,
            pulse,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    // =========================================
    // Player
    // =========================================

    drawPlayer(ctx, x, y) {

        ctx.fillStyle = "#66d9ff";

        ctx.beginPath();

        ctx.arc(
            x + this.player.x * this.scale,
            y + this.player.y * this.scale,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Direction Indicator
        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            x + this.player.x * this.scale,
            y + this.player.y * this.scale
        );

        ctx.lineTo(
            x +
            this.player.x * this.scale +
            Math.cos(this.player.angle || 0) * 10,

            y +
            this.player.y * this.scale +
            Math.sin(this.player.angle || 0) * 10
        );

        ctx.stroke();
    }
}
