// =========================================
// Ultimate Tower RPG - craftingUI.js
// =========================================

export class CraftingUI {

    constructor(game, player) {

        this.game = game;

        this.player = player;

        // =====================================
        // State
        // =====================================

        this.visible = false;

        this.selectedRecipe = 0;

        // =====================================
        // Recipes
        // =====================================

        this.recipes = [

            {
                name: "Health Potion",
                type: "potion",
                rarity: "common",

                materials: [
                    { item: "Herb", amount: 3 },
                    { item: "Water", amount: 1 }
                ],

                result: {
                    name: "Health Potion",
                    type: "potion",
                    heal: 50,
                    icon: "🧪",
                    rarity: "common",
                    description:
                        "Restores 50 HP."
                }
            },

            {
                name: "Mana Potion",
                type: "mana",
                rarity: "common",

                materials: [
                    { item: "Mana Crystal", amount: 2 },
                    { item: "Water", amount: 1 }
                ],

                result: {
                    name: "Mana Potion",
                    type: "mana",
                    restore: 40,
                    icon: "🔷",
                    rarity: "common",
                    description:
                        "Restores 40 Mana."
                }
            },

            {
                name: "Iron Sword",
                type: "weapon",
                rarity: "uncommon",

                materials: [
                    { item: "Iron Ore", amount: 5 },
                    { item: "Wood", amount: 2 }
                ],

                result: {
                    name: "Iron Sword",
                    type: "weapon",
                    damage: 18,
                    icon: "⚔",
                    rarity: "uncommon",
                    description:
                        "A strong iron blade."
                }
            },

            {
                name: "Shadow Armor",
                type: "armor",
                rarity: "epic",

                materials: [
                    { item: "Shadow Fragment", amount: 8 },
                    { item: "Dark Cloth", amount: 5 }
                ],

                result: {
                    name: "Shadow Armor",
                    type: "armor",
                    defense: 25,
                    icon: "🛡",
                    rarity: "epic",
                    description:
                        "Armor infused with darkness."
                }
            },

            {
                name: "Phoenix Blade",
                type: "weapon",
                rarity: "legendary",

                materials: [
                    { item: "Phoenix Feather", amount: 5 },
                    { item: "Fire Crystal", amount: 10 },
                    { item: "Ancient Steel", amount: 4 }
                ],

                result: {
                    name: "Phoenix Blade",
                    type: "weapon",
                    damage: 55,
                    fireDamage: 25,
                    icon: "🔥",
                    rarity: "legendary",
                    description:
                        "A legendary burning sword."
                }
            }
        ];
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

            case "ArrowUp":

                this.selectedRecipe--;

                if (this.selectedRecipe < 0) {

                    this.selectedRecipe =
                        this.recipes.length - 1;
                }

                break;

            case "ArrowDown":

                this.selectedRecipe++;

                if (
                    this.selectedRecipe >=
                    this.recipes.length
                ) {

                    this.selectedRecipe = 0;
                }

                break;

            case "Enter":

                this.craftSelectedRecipe();

                break;

            case "Escape":

                this.visible = false;

                break;
        }
    }

    // =========================================
    // Craft Item
    // =========================================

    craftSelectedRecipe() {

        const recipe =
            this.recipes[
                this.selectedRecipe
            ];

        if (
            !this.hasMaterials(recipe)
        ) {

            this.game.notifications?.warning(
                "Missing Materials"
            );

            return;
        }

        // Remove Materials
        for (
            const material of recipe.materials
        ) {

            this.removeMaterial(
                material.item,
                material.amount
            );
        }

        // Add Crafted Item
        this.player.inventory.push({

            ...recipe.result,

            level: this.player.level
        });

        // Notification
        this.game.notifications?.success(
            `${recipe.result.name} Crafted`
        );
    }

    // =========================================
    // Check Materials
    // =========================================

    hasMaterials(recipe) {

        for (
            const material of recipe.materials
        ) {

            const amount =
                this.countMaterial(
                    material.item
                );

            if (
                amount < material.amount
            ) {

                return false;
            }
        }

        return true;
    }

    // =========================================
    // Count Material
    // =========================================

    countMaterial(name) {

        let count = 0;

        for (
            const item of this.player.inventory
        ) {

            if (item.name === name) {

                count++;
            }
        }

        return count;
    }

    // =========================================
    // Remove Material
    // =========================================

    removeMaterial(name, amount) {

        let removed = 0;

        for (
            let i =
                this.player.inventory.length - 1;
            i >= 0;
            i--
        ) {

            const item =
                this.player.inventory[i];

            if (
                item.name === name
            ) {

                this.player.inventory.splice(
                    i,
                    1
                );

                removed++;

                if (removed >= amount) {
                    break;
                }
            }
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
        // Overlay
        // =====================================

        ctx.fillStyle =
            "rgba(0,0,0,0.72)";

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
            "rgba(18,22,40,0.96)";

        ctx.fillRect(
            180,
            80,
            920,
            580
        );

        ctx.strokeStyle =
            "rgba(255,255,255,0.15)";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            180,
            80,
            920,
            580
        );

        // =====================================
        // Title
        // =====================================

        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 48px Arial";

        ctx.fillText(
            "CRAFTING",
            220,
            140
        );

        // =====================================
        // Recipe List
        // =====================================

        this.drawRecipeList(ctx);

        // =====================================
        // Recipe Details
        // =====================================

        this.drawRecipeDetails(ctx);

        // =====================================
        // Footer
        // =====================================

        ctx.fillStyle = "#999999";

        ctx.font = "18px Arial";

        ctx.fillText(
            "ENTER = Craft | ESC = Close",
            220,
            630
        );

        ctx.restore();
    }

    // =========================================
    // Recipe List
    // =========================================

    drawRecipeList(ctx) {

        const startX = 220;
        const startY = 190;

        for (
            let i = 0;
            i < this.recipes.length;
            i++
        ) {

            const recipe =
                this.recipes[i];

            const y =
                startY + i * 80;

            // Selected Highlight
            if (
                i === this.selectedRecipe
            ) {

                ctx.fillStyle =
                    "rgba(120,180,255,0.2)";

                ctx.fillRect(
                    startX - 10,
                    y - 40,
                    320,
                    60
                );
            }

            // Name
            ctx.fillStyle =
                this.getRarityColor(
                    recipe.rarity
                );

            ctx.font = "24px Arial";

            ctx.fillText(
                recipe.name,
                startX,
                y
            );

            // Type
            ctx.fillStyle = "#aaaaaa";

            ctx.font = "18px Arial";

            ctx.fillText(
                recipe.type,
                startX,
                y + 24
            );
        }
    }

    // =========================================
    // Recipe Details
    // =========================================

    drawRecipeDetails(ctx) {

        const recipe =
            this.recipes[
                this.selectedRecipe
            ];

        if (!recipe) {
            return;
        }

        const x = 560;
        const y = 180;

        // Background
        ctx.fillStyle =
            "rgba(255,255,255,0.04)";

        ctx.fillRect(
            x,
            y,
            480,
            390
        );

        // Result Name
        ctx.fillStyle =
            this.getRarityColor(
                recipe.rarity
            );

        ctx.font = "bold 34px Arial";

        ctx.fillText(
            recipe.result.name,
            x + 20,
            y + 50
        );

        // Icon
        ctx.font = "64px Arial";

        ctx.fillText(
            recipe.result.icon,
            x + 20,
            y + 120
        );

        // Description
        ctx.fillStyle = "#cccccc";

        ctx.font = "20px Arial";

        ctx.fillText(
            recipe.result.description,
            x + 20,
            y + 170
        );

        // Stats
        ctx.fillStyle = "#ffffff";

        ctx.font = "20px Arial";

        let statY = y + 230;

        if (recipe.result.damage) {

            ctx.fillText(
                `Damage: ${recipe.result.damage}`,
                x + 20,
                statY
            );

            statY += 32;
        }

        if (recipe.result.defense) {

            ctx.fillText(
                `Defense: ${recipe.result.defense}`,
                x + 20,
                statY
            );

            statY += 32;
        }

        if (recipe.result.heal) {

            ctx.fillText(
                `Heal: ${recipe.result.heal}`,
                x + 20,
                statY
            );

            statY += 32;
        }

        // Materials
        ctx.fillStyle = "#ffd966";

        ctx.font = "bold 24px Arial";

        ctx.fillText(
            "Materials",
            x + 20,
            y + 310
        );

        let materialY = y + 350;

        for (
            const material of recipe.materials
        ) {

            const owned =
                this.countMaterial(
                    material.item
                );

            const enough =
                owned >= material.amount;

            ctx.fillStyle =
                enough
                    ? "#44ff88"
                    : "#ff6666";

            ctx.font = "18px Arial";

            ctx.fillText(
                `${material.item}: ${owned}/${material.amount}`,
                x + 20,
                materialY
            );

            materialY += 28;
        }
    }

    // =========================================
    // Rarity Color
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
