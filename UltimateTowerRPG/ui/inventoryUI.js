// =========================================
// Ultimate Tower RPG - inventoryUI.js
// =========================================

export class InventoryUI {

    constructor(game, player) {

        this.game = game;

        this.player = player;

        // =====================================
        // State
        // =====================================

        this.visible = false;

        this.selectedSlot = 0;

        this.hoveredSlot = -1;

        // =====================================
        // Grid
        // =====================================

        this.columns = 6;

        this.rows = 4;

        this.slotSize = 80;

        this.slotPadding = 12;

        // =====================================
        // Position
        // =====================================

        this.width = 720;

        this.height = 520;

        this.x =
            (this.game.width - this.width) / 2;

        this.y =
            (this.game.height - this.height) / 2;
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

        if (!this.visible) {
            return;
        }
    }

    // =========================================
    // Handle Input
    // =========================================

    handleInput(key) {

        if (!this.visible) {
            return;
        }

        switch(key) {

            case "ArrowLeft":

                this.selectedSlot--;

                if (this.selectedSlot < 0) {

                    this.selectedSlot =
                        this.player.inventory.length - 1;
                }

                break;

            case "ArrowRight":

                this.selectedSlot++;

                if (
                    this.selectedSlot >=
                    this.player.inventory.length
                ) {

                    this.selectedSlot = 0;
                }

                break;

            case "ArrowUp":

                this.selectedSlot -= this.columns;

                if (this.selectedSlot < 0) {

                    this.selectedSlot = 0;
                }

                break;

            case "ArrowDown":

                this.selectedSlot += this.columns;

                if (
                    this.selectedSlot >=
                    this.player.inventory.length
                ) {

                    this.selectedSlot =
                        this.player.inventory.length - 1;
                }

                break;

            case "Enter":

                this.useSelectedItem();

                break;

            case "Delete":

                this.dropSelectedItem();

                break;

            case "Escape":

                this.visible = false;

                break;
        }
    }

    // =========================================
    // Use Item
    // =========================================

    useSelectedItem() {

        const item =
            this.player.inventory[
                this.selectedSlot
            ];

        if (!item) {
            return;
        }

        switch(item.type) {

            case "potion":

                this.player.health =
                    Math.min(
                        this.player.maxHealth,
                        this.player.health +
                        item.heal
                    );

                this.removeItem(
                    this.selectedSlot
                );

                break;

            case "mana":

                this.player.mana =
                    Math.min(
                        this.player.maxMana,
                        this.player.mana +
                        item.restore
                    );

                this.removeItem(
                    this.selectedSlot
                );

                break;

            case "weapon":

                this.player.weapon = item;

                break;

            case "armor":

                this.player.armor +=
                    item.defense;

                break;
        }

        // Notification
        if (
            this.game.notifications
        ) {

            this.game.notifications.success(
                `${item.name} Used`
            );
        }
    }

    // =========================================
    // Drop Item
    // =========================================

    dropSelectedItem() {

        const item =
            this.player.inventory[
                this.selectedSlot
            ];

        if (!item) {
            return;
        }

        // Spawn loot in world
        if (this.game.lootDrops) {

            this.game.lootDrops.push({

                ...item,

                x: this.player.x,

                y: this.player.y
            });
        }

        this.removeItem(
            this.selectedSlot
        );

        if (
            this.game.notifications
        ) {

            this.game.notifications.warning(
                `${item.name} Dropped`
            );
        }
    }

    // =========================================
    // Remove Item
    // =========================================

    removeItem(index) {

        this.player.inventory.splice(
            index,
            1
        );

        if (
            this.selectedSlot >=
            this.player.inventory.length
        ) {

            this.selectedSlot =
                this.player.inventory.length - 1;
        }
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        if (!this.visible) {
            return;
        }

        ctx.save();

        // =====================================
        // Background Overlay
        // =====================================

        ctx.fillStyle =
            "rgba(0,0,0,0.7)";

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        // =====================================
        // Main Panel
        // =====================================

        ctx.fillStyle =
            "rgba(15,18,35,0.96)";

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Border
        ctx.strokeStyle =
            "rgba(255,255,255,0.15)";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // =====================================
        // Title
        // =====================================

        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 42px Arial";

        ctx.fillText(
            "INVENTORY",
            this.x + 25,
            this.y + 55
        );

        // =====================================
        // Gold
        // =====================================

        ctx.fillStyle = "#ffd966";

        ctx.font = "24px Arial";

        ctx.fillText(
            `Gold: ${this.player.gold}`,
            this.x + 500,
            this.y + 55
        );

        // =====================================
        // Draw Slots
        // =====================================

        this.drawSlots(ctx);

        // =====================================
        // Draw Item Info
        // =====================================

        this.drawSelectedItemInfo(ctx);

        // =====================================
        // Controls
        // =====================================

        ctx.fillStyle =
            "#999999";

        ctx.font = "18px Arial";

        ctx.fillText(
            "ENTER = Use | DELETE = Drop | ESC = Close",
            this.x + 20,
            this.y + this.height - 20
        );

        ctx.restore();
    }

    // =========================================
    // Draw Slots
    // =========================================

    drawSlots(ctx) {

        for (
            let row = 0;
            row < this.rows;
            row++
        ) {

            for (
                let col = 0;
                col < this.columns;
                col++
            ) {

                const index =
                    row * this.columns + col;

                const slotX =
                    this.x + 30 +
                    col *
                    (
                        this.slotSize +
                        this.slotPadding
                    );

                const slotY =
                    this.y + 100 +
                    row *
                    (
                        this.slotSize +
                        this.slotPadding
                    );

                // Slot Background
                ctx.fillStyle =
                    "rgba(255,255,255,0.06)";

                ctx.fillRect(
                    slotX,
                    slotY,
                    this.slotSize,
                    this.slotSize
                );

                // Highlight Selected
                if (
                    index ===
                    this.selectedSlot
                ) {

                    ctx.strokeStyle =
                        "#7cb8ff";

                    ctx.lineWidth = 4;

                } else {

                    ctx.strokeStyle =
                        "rgba(255,255,255,0.1)";

                    ctx.lineWidth = 2;
                }

                ctx.strokeRect(
                    slotX,
                    slotY,
                    this.slotSize,
                    this.slotSize
                );

                // Item
                const item =
                    this.player.inventory[index];

                if (item) {

                    this.drawItem(
                        ctx,
                        item,
                        slotX,
                        slotY
                    );
                }
            }
        }
    }

    // =========================================
    // Draw Item
    // =========================================

    drawItem(
        ctx,
        item,
        x,
        y
    ) {

        // Rarity Border
        ctx.strokeStyle =
            this.getRarityColor(
                item.rarity
            );

        ctx.lineWidth = 3;

        ctx.strokeRect(
            x + 2,
            y + 2,
            this.slotSize - 4,
            this.slotSize - 4
        );

        // Icon
        ctx.font = "38px Arial";

        ctx.fillStyle = "#ffffff";

        ctx.textAlign = "center";

        ctx.fillText(
            item.icon || "♦",
            x + this.slotSize / 2,
            y + 52
        );

        // Level
        ctx.font = "14px Arial";

        ctx.fillStyle = "#cccccc";

        ctx.fillText(
            `Lv ${item.level || 1}`,
            x + this.slotSize / 2,
            y + 72
        );
    }

    // =========================================
    // Draw Selected Item Info
    // =========================================

    drawSelectedItemInfo(ctx) {

        const item =
            this.player.inventory[
                this.selectedSlot
            ];

        if (!item) {
            return;
        }

        const infoX =
            this.x + 560;

        const infoY =
            this.y + 120;

        // Panel
        ctx.fillStyle =
            "rgba(255,255,255,0.04)";

        ctx.fillRect(
            infoX,
            infoY,
            130,
            260
        );

        // Item Name
        ctx.fillStyle =
            this.getRarityColor(
                item.rarity
            );

        ctx.font = "bold 22px Arial";

        ctx.fillText(
            item.name,
            infoX + 10,
            infoY + 30
        );

        // Type
        ctx.fillStyle = "#aaaaaa";

        ctx.font = "18px Arial";

        ctx.fillText(
            item.type,
            infoX + 10,
            infoY + 60
        );

        // Stats
        ctx.fillStyle = "#ffffff";

        ctx.font = "16px Arial";

        let statY = infoY + 100;

        if (item.damage) {

            ctx.fillText(
                `Damage: ${item.damage}`,
                infoX + 10,
                statY
            );

            statY += 24;
        }

        if (item.defense) {

            ctx.fillText(
                `Defense: ${item.defense}`,
                infoX + 10,
                statY
            );

            statY += 24;
        }

        if (item.heal) {

            ctx.fillText(
                `Heal: ${item.heal}`,
                infoX + 10,
                statY
            );

            statY += 24;
        }

        // Description
        ctx.fillStyle = "#bbbbbb";

        ctx.font = "15px Arial";

        this.wrapText(
            ctx,
            item.description ||
            "No description.",
            infoX + 10,
            statY + 20,
            110,
            18
        );
    }

    // =========================================
    // Wrap Text
    // =========================================

    wrapText(
        ctx,
        text,
        x,
        y,
        maxWidth,
        lineHeight
    ) {

        const words =
            text.split(" ");

        let line = "";

        for (
            let i = 0;
            i < words.length;
            i++
        ) {

            const testLine =
                line +
                words[i] +
                " ";

            const metrics =
                ctx.measureText(
                    testLine
                );

            const testWidth =
                metrics.width;

            if (
                testWidth > maxWidth &&
                i > 0
            ) {

                ctx.fillText(
                    line,
                    x,
                    y
                );

                line =
                    words[i] + " ";

                y += lineHeight;

            } else {

                line = testLine;
            }
        }

        ctx.fillText(
            line,
            x,
            y
        );
    }

    // =========================================
    // Rarity Colors
    // =========================================

    getRarityColor(rarity) {

        switch(rarity) {

            case "common":
                return "#aaaaaa";

            case "uncommon":
                return "#44ff88";

            case "rare":
                return "#55aaff";

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
