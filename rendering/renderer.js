// =========================================
// Ultimate Tower RPG - renderer.js
// =========================================

export class Renderer {

    constructor(game) {

        this.game = game;

        this.canvas = game.canvas;

        this.ctx =
            this.canvas.getContext("2d");

        // =====================================
        // Render Settings
        // =====================================

        this.ctx.imageSmoothingEnabled = false;

        this.camera = {

            x: 0,
            y: 0,

            targetX: 0,
            targetY: 0,

            smoothness: 0.08
        };

        // =====================================
        // Lighting
        // =====================================

        this.lights = [];

        // =====================================
        // Layers
        // =====================================

        this.backgroundColor =
            "#0d1020";
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.updateCamera(deltaTime);
    }

    // =========================================
    // Camera
    // =========================================

    updateCamera(deltaTime) {

        const player =
            this.game.player;

        if (!player) {
            return;
        }

        this.camera.targetX =
            player.x -
            this.game.width / 2 +
            player.width / 2;

        this.camera.targetY =
            player.y -
            this.game.height / 2 +
            player.height / 2;

        // Smooth Follow
        this.camera.x +=
            (
                this.camera.targetX -
                this.camera.x
            ) * this.camera.smoothness;

        this.camera.y +=
            (
                this.camera.targetY -
                this.camera.y
            ) * this.camera.smoothness;
    }

    // =========================================
    // Main Render
    // =========================================

    render() {

        const ctx = this.ctx;

        // =====================================
        // Clear Screen
        // =====================================

        ctx.clearRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        // =====================================
        // Background
        // =====================================

        this.drawBackground(ctx);

        // =====================================
        // Apply Camera
        // =====================================

        ctx.save();

        // Screen Shake
        if (
            this.game.shaders
        ) {

            this.game.shaders
                .applyScreenShake(ctx);
        }

        ctx.translate(
            -this.camera.x,
            -this.camera.y
        );

        // =====================================
        // World
        // =====================================

        this.drawWorld(ctx);

        this.drawPlatforms(ctx);

        this.drawDestructibles(ctx);

        this.drawLoot(ctx);

        this.drawEnemies(ctx);

        this.drawPlayer(ctx);

        this.drawProjectiles(ctx);

        this.drawParticles(ctx);

        this.drawEffects(ctx);

        this.drawLighting(ctx);

        ctx.restore();

        // =====================================
        // UI
        // =====================================

        this.drawUI(ctx);

        // =====================================
        // Post Processing
        // =====================================

        if (
            this.game.shaders
        ) {

            this.game.shaders
                .drawPostProcessing(ctx);
        }
    }

    // =========================================
    // Background
    // =========================================

    drawBackground(ctx) {

        ctx.fillStyle =
            this.backgroundColor;

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        // Gradient
        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                this.game.height
            );

        gradient.addColorStop(
            0,
            "#11162a"
        );

        gradient.addColorStop(
            1,
            "#05070f"
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
    // World
    // =========================================

    drawWorld(ctx) {

        if (!this.game.rooms) {
            return;
        }

        for (
            const room of this.game.rooms
        ) {

            ctx.fillStyle =
                room.color ||
                "#1a1f38";

            ctx.fillRect(
                room.x,
                room.y,
                room.width,
                room.height
            );

            // Borders
            ctx.strokeStyle =
                "rgba(255,255,255,0.06)";

            ctx.lineWidth = 4;

            ctx.strokeRect(
                room.x,
                room.y,
                room.width,
                room.height
            );
        }
    }

    // =========================================
    // Platforms
    // =========================================

    drawPlatforms(ctx) {

        if (!this.game.platforms) {
            return;
        }

        for (
            const platform of
            this.game.platforms
        ) {

            ctx.fillStyle =
                platform.color ||
                "#4a5568";

            ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                platform.height
            );

            // Top Highlight
            ctx.fillStyle =
                "rgba(255,255,255,0.15)";

            ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                4
            );
        }
    }

    // =========================================
    // Destructibles
    // =========================================

    drawDestructibles(ctx) {

        if (
            !this.game.destructibles
        ) {

            return;
        }

        for (
            const object of
            this.game.destructibles
        ) {

            ctx.fillStyle =
                object.color ||
                "#886644";

            ctx.fillRect(
                object.x,
                object.y,
                object.width,
                object.height
            );

            // HP Bar
            if (
                object.health <
                object.maxHealth
            ) {

                const percent =
                    object.health /
                    object.maxHealth;

                ctx.fillStyle =
                    "#ff4444";

                ctx.fillRect(
                    object.x,
                    object.y - 10,
                    object.width *
                    percent,
                    5
                );
            }
        }
    }

    // =========================================
    // Loot
    // =========================================

    drawLoot(ctx) {

        if (
            !this.game.lootDrops
        ) {

            return;
        }

        for (
            const loot of
            this.game.lootDrops
        ) {

            // Glow
            ctx.shadowBlur = 15;

            ctx.shadowColor =
                this.getRarityColor(
                    loot.rarity
                );

            // Item
            ctx.font = "32px Arial";

            ctx.fillStyle =
                "#ffffff";

            ctx.fillText(
                loot.icon || "♦",
                loot.x,
                loot.y
            );

            ctx.shadowBlur = 0;
        }
    }

    // =========================================
    // Enemies
    // =========================================

    drawEnemies(ctx) {

        if (!this.game.enemies) {
            return;
        }

        for (
            const enemy of
            this.game.enemies
        ) {

            enemy.draw(ctx);

            this.drawEnemyHealth(
                ctx,
                enemy
            );
        }
    }

    // =========================================
    // Enemy HP
    // =========================================

    drawEnemyHealth(
        ctx,
        enemy
    ) {

        const width = 60;
        const height = 6;

        const x =
            enemy.x -
            width / 2;

        const y =
            enemy.y - 30;

        // Background
        ctx.fillStyle =
            "rgba(0,0,0,0.5)";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // Fill
        ctx.fillStyle =
            "#ff4444";

        ctx.fillRect(
            x,
            y,
            width *
            (
                enemy.health /
                enemy.maxHealth
            ),
            height
        );
    }

    // =========================================
    // Player
    // =========================================

    drawPlayer(ctx) {

        if (!this.game.player) {
            return;
        }

        this.game.player.draw(ctx);
    }

    // =========================================
    // Projectiles
    // =========================================

    drawProjectiles(ctx) {

        if (
            !this.game.projectiles
        ) {

            return;
        }

        for (
            const projectile of
            this.game.projectiles
        ) {

            projectile.draw(ctx);
        }
    }

    // =========================================
    // Particles
    // =========================================

    drawParticles(ctx) {

        if (
            !this.game.particles
        ) {

            return;
        }

        for (
            const particle of
            this.game.particles
        ) {

            particle.draw(ctx);
        }
    }

    // =========================================
    // Effects
    // =========================================

    drawEffects(ctx) {

        if (
            !this.game.effects
        ) {

            return;
        }

        for (
            const effect of
            this.game.effects
        ) {

            effect.draw(ctx);
        }
    }

    // =========================================
    // Lighting
    // =========================================

    drawLighting(ctx) {

        if (
            !this.game.settingsMenu ||
            !this.game.settingsMenu
                .settings.shadows
        ) {

            return;
        }

        ctx.save();

        ctx.globalCompositeOperation =
            "multiply";

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";

        ctx.fillRect(
            this.camera.x,
            this.camera.y,
            this.game.width,
            this.game.height
        );

        ctx.globalCompositeOperation =
            "screen";

        // Player Light
        const player =
            this.game.player;

        if (player) {

            const gradient =
                ctx.createRadialGradient(

                    player.x,
                    player.y,

                    20,

                    player.x,
                    player.y,

                    200
                );

            gradient.addColorStop(
                0,
                "rgba(255,255,200,0.7)"
            );

            gradient.addColorStop(
                1,
                "rgba(255,255,200,0)"
            );

            ctx.fillStyle = gradient;

            ctx.beginPath();

            ctx.arc(
                player.x,
                player.y,
                200,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();
    }

    // =========================================
    // UI
    // =========================================

    drawUI(ctx) {

        // HUD
        this.game.hud?.draw(ctx);

        // Inventory
        this.game.inventoryUI?.draw(ctx);

        // Crafting
        this.game.craftingUI?.draw(ctx);

        // Settings
        this.game.settingsMenu?.draw(ctx);

        // Menus
        this.game.menus?.draw(ctx);

        // Tower UI
        this.game.towerUI?.draw(ctx);

        // Minimap
        this.game.minimap?.draw(ctx);
    }

    // =========================================
    // Rarity Colors
    // =========================================

    getRarityColor(rarity) {

        switch(rarity) {

            case "common":
                return "#cccccc";

            case "uncommon":
                return "#44ff88";

            case "rare":
                return "#5599ff";

            case "epic":
                return "#bb66ff";

            case "legendary":
                return "#ffaa33";

            case "mythic":
                return "#ff4444";

            default:
                return "#ffffff";
        }
    }
}
