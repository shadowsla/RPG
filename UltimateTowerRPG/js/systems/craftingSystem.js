// =========================================
// Ultimate Tower RPG - craftingSystem.js
// =========================================

// =========================================
// Crafting System
// =========================================

export class CraftingSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Recipes
        // =====================================

        this.recipes = [];

        // =====================================
        // Crafting Queue
        // =====================================

        this.craftingQueue = [];

        // =====================================
        // Crafting Stations
        // =====================================

        this.stations = {

            forge: false,

            alchemy: false,

            enchanting: false,

            cooking: false,

            engineering: false
        };

        // =====================================
        // Levels
        // =====================================

        this.levels = {

            blacksmithing: 1,

            alchemy: 1,

            enchanting: 1,

            cooking: 1,

            engineering: 1
        };

        // =====================================
        // Experience
        // =====================================

        this.experience = {

            blacksmithing: 0,

            alchemy: 0,

            enchanting: 0,

            cooking: 0,

            engineering: 0
        };

        // =====================================
        // Initialize Recipes
        // =====================================

        this.initializeRecipes();
    }

    // =========================================
    // Recipes
    // =========================================

    initializeRecipes() {

        // =====================================
        // Weapons
        // =====================================

        this.addRecipe({

            id: "iron_sword",

            name: "Iron Sword",

            category: "blacksmithing",

            station: "forge",

            level: 1,

            craftTime: 5,

            ingredients: [

                {
                    item: "Iron Ore",
                    amount: 5
                },

                {
                    item: "Wood",
                    amount: 2
                }
            ],

            result: {

                item: "Iron Sword",

                amount: 1,

                rarity: "common"
            }
        });

        // =====================================
        // Armor
        // =====================================

        this.addRecipe({

            id: "steel_armor",

            name: "Steel Armor",

            category: "blacksmithing",

            station: "forge",

            level: 3,

            craftTime: 12,

            ingredients: [

                {
                    item: "Steel Ingot",
                    amount: 10
                },

                {
                    item: "Leather",
                    amount: 5
                }
            ],

            result: {

                item: "Steel Armor",

                amount: 1,

                rarity: "rare"
            }
        });

        // =====================================
        // Potions
        // =====================================

        this.addRecipe({

            id: "health_potion",

            name: "Health Potion",

            category: "alchemy",

            station: "alchemy",

            level: 1,

            craftTime: 3,

            ingredients: [

                {
                    item: "Herb",
                    amount: 3
                },

                {
                    item: "Water",
                    amount: 1
                }
            ],

            result: {

                item: "Health Potion",

                amount: 1,

                rarity: "common"
            }
        });

        // =====================================
        // Mana Potion
        // =====================================

        this.addRecipe({

            id: "mana_potion",

            name: "Mana Potion",

            category: "alchemy",

            station: "alchemy",

            level: 2,

            craftTime: 4,

            ingredients: [

                {
                    item: "Mana Herb",
                    amount: 2
                },

                {
                    item: "Crystal Dust",
                    amount: 1
                }
            ],

            result: {

                item: "Mana Potion",

                amount: 1,

                rarity: "uncommon"
            }
        });

        // =====================================
        // Enchantment
        // =====================================

        this.addRecipe({

            id: "fire_enchant",

            name: "Fire Enchantment",

            category: "enchanting",

            station: "enchanting",

            level: 5,

            craftTime: 10,

            ingredients: [

                {
                    item: "Fire Crystal",
                    amount: 2
                },

                {
                    item: "Magic Essence",
                    amount: 4
                }
            ],

            result: {

                item: "Fire Enchantment",

                amount: 1,

                rarity: "epic"
            }
        });

        // =====================================
        // Food
        // =====================================

        this.addRecipe({

            id: "meat_stew",

            name: "Meat Stew",

            category: "cooking",

            station: "cooking",

            level: 1,

            craftTime: 6,

            ingredients: [

                {
                    item: "Raw Meat",
                    amount: 2
                },

                {
                    item: "Vegetable",
                    amount: 3
                }
            ],

            result: {

                item: "Meat Stew",

                amount: 1,

                rarity: "common"
            }
        });

        // =====================================
        // Bomb
        // =====================================

        this.addRecipe({

            id: "bomb",

            name: "Bomb",

            category: "engineering",

            station: "engineering",

            level: 2,

            craftTime: 5,

            ingredients: [

                {
                    item: "Gunpowder",
                    amount: 3
                },

                {
                    item: "Iron Fragment",
                    amount: 2
                }
            ],

            result: {

                item: "Bomb",

                amount: 2,

                rarity: "uncommon"
            }
        });
    }

    // =========================================
    // Add Recipe
    // =========================================

    addRecipe(recipe) {

        this.recipes.push(recipe);
    }

    // =========================================
    // Craft
    // =========================================

    craft(recipeId) {

        const recipe =
            this.getRecipe(recipeId);

        if (
            !recipe
        ) {

            return false;
        }

        // =====================================
        // Check Level
        // =====================================

        if (
            this.levels[
                recipe.category
            ] < recipe.level
        ) {

            this.notify(

                "Crafting level too low",

                "danger"
            );

            return false;
        }

        // =====================================
        // Check Station
        // =====================================

        if (

            recipe.station &&

            !this.stations[
                recipe.station
            ]
        ) {

            this.notify(

                `${recipe.station} required`,

                "danger"
            );

            return false;
        }

        // =====================================
        // Check Materials
        // =====================================

        if (
            !this.hasIngredients(
                recipe
            )
        ) {

            this.notify(

                "Missing materials",

                "danger"
            );

            return false;
        }

        // =====================================
        // Consume
        // =====================================

        this.consumeIngredients(
            recipe
        );

        // =====================================
        // Queue
        // =====================================

        const craftJob = {

            recipe,

            progress: 0,

            maxProgress:
                recipe.craftTime
        };

        this.craftingQueue.push(
            craftJob
        );

        this.notify(

            `Crafting ${recipe.name}`,

            "info"
        );

        return true;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        for (
            let i =
                this.craftingQueue.length - 1;
            i >= 0;
            i--
        ) {

            const job =
                this.craftingQueue[i];

            job.progress +=
                deltaTime;

            // =================================
            // Finished
            // =================================

            if (
                job.progress >=
                job.maxProgress
            ) {

                this.finishCraft(
                    job.recipe
                );

                this.craftingQueue.splice(
                    i,
                    1
                );
            }
        }
    }

    // =========================================
    // Finish Craft
    // =========================================

    finishCraft(recipe) {

        // =====================================
        // Add Item
        // =====================================

        this.game.inventory?.addItem({

            name:
                recipe.result.item,

            quantity:
                recipe.result.amount,

            rarity:
                recipe.result.rarity
        });

        // =====================================
        // XP
        // =====================================

        this.addExperience(

            recipe.category,

            recipe.level * 25
        );

        // =====================================
        // Notify
        // =====================================

        this.notify(

            `${recipe.name} crafted!`,

            "success"
        );

        // =====================================
        // Effects
        // =====================================

        this.game.effects?.flashScreen(

            "#ffffff",

            0.15,

            0.15
        );
    }

    // =========================================
    // Ingredients
    // =========================================

    hasIngredients(recipe) {

        for (
            const ingredient of
            recipe.ingredients
        ) {

            const amount =
                this.game.inventory
                ?.getItemCount(

                    ingredient.item
                );

            if (
                amount <
                ingredient.amount
            ) {

                return false;
            }
        }

        return true;
    }

    // =========================================
    // Consume
    // =========================================

    consumeIngredients(recipe) {

        for (
            const ingredient of
            recipe.ingredients
        ) {

            this.game.inventory
                ?.removeItem(

                    ingredient.item,

                    ingredient.amount
                );
        }
    }

    // =========================================
    // XP
    // =========================================

    addExperience(
        category,
        amount
    ) {

        this.experience[
            category
        ] += amount;

        // =====================================
        // Level Up
        // =====================================

        const requiredXP =

            this.levels[
                category
            ] * 100;

        if (

            this.experience[
                category
            ] >= requiredXP
        ) {

            this.experience[
                category
            ] -= requiredXP;

            this.levels[
                category
            ]++;

            this.notify(

                `${category} leveled up!`,

                "success"
            );
        }
    }

    // =========================================
    // Unlock Station
    // =========================================

    unlockStation(station) {

        this.stations[
            station
        ] = true;

        this.notify(

            `${station} unlocked!`,

            "success"
        );
    }

    // =========================================
    // Recipes By Category
    // =========================================

    getRecipesByCategory(
        category
    ) {

        return this.recipes.filter(

            recipe =>

                recipe.category ===
                category
        );
    }

    // =========================================
    // Recipe
    // =========================================

    getRecipe(recipeId) {

        return this.recipes.find(

            recipe =>

                recipe.id ===
                recipeId
        );
    }

    // =========================================
    // Craftable
    // =========================================

    getCraftableRecipes() {

        return this.recipes.filter(

            recipe =>

                this.hasIngredients(
                    recipe
                )
        );
    }

    // =========================================
    // Random Recipe
    // =========================================

    unlockRandomRecipe() {

        const locked =
            this.recipes.filter(

                recipe =>

                    !recipe.unlocked
            );

        if (
            locked.length <= 0
        ) {

            return;
        }

        const recipe =
            locked[
                Math.floor(
                    Math.random() *
                    locked.length
                )
            ];

        recipe.unlocked = true;

        this.notify(

            `Learned recipe: ${recipe.name}`,

            "success"
        );
    }

    // =========================================
    // Rare Craft Bonus
    // =========================================

    calculateCraftBonus() {

        return Math.random() < 0.1;
    }

    // =========================================
    // Enhanced Item
    // =========================================

    applyCraftBonus(item) {

        if (
            !this.calculateCraftBonus()
        ) {

            return item;
        }

        item.enhanced = true;

        item.damage =
            (item.damage || 10) + 5;

        item.defense =
            (item.defense || 0) + 3;

        item.name =
            `Enhanced ${item.name}`;

        return item;
    }

    // =========================================
    // Salvage
    // =========================================

    salvageItem(itemName) {

        const salvageRewards = {

            "Iron Sword": [

                {
                    item: "Iron Ore",
                    amount: 3
                }
            ],

            "Steel Armor": [

                {
                    item: "Steel Ingot",
                    amount: 5
                }
            ]
        };

        const rewards =
            salvageRewards[itemName];

        if (
            !rewards
        ) {

            return false;
        }

        // =====================================
        // Remove Item
        // =====================================

        this.game.inventory
            ?.removeItem(
                itemName,
                1
            );

        // =====================================
        // Give Materials
        // =====================================

        for (
            const reward of
            rewards
        ) {

            this.game.inventory
                ?.addItem({

                    name:
                        reward.item,

                    quantity:
                        reward.amount
                });
        }

        this.notify(

            `${itemName} salvaged`,

            "info"
        );

        return true;
    }

    // =========================================
    // Draw Queue
    // =========================================

    draw(ctx) {

        let y = 120;

        for (
            const job of
            this.craftingQueue
        ) {

            const progress =

                job.progress /
                job.maxProgress;

            // Background
            ctx.fillStyle =
                "#222222";

            ctx.fillRect(
                20,
                y,
                240,
                30
            );

            // Progress
            ctx.fillStyle =
                "#33cc66";

            ctx.fillRect(

                20,
                y,

                240 * progress,

                30
            );

            // Text
            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "18px Arial";

            ctx.fillText(

                job.recipe.name,

                30,

                y + 20
            );

            y += 45;
        }
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            levels:
                this.levels,

            experience:
                this.experience,

            stations:
                this.stations
        };
    }

    // =========================================
    // Load
    // =========================================

    load(data) {

        if (
            !data
        ) {

            return;
        }

        this.levels =
            data.levels ||
            this.levels;

        this.experience =
            data.experience ||
            this.experience;

        this.stations =
            data.stations ||
            this.stations;
    }

    // =========================================
    // Notifications
    // =========================================

    notify(
        message,
        type = "info"
    ) {

        this.game.ui?.addNotification(

            message,

            type
        );
    }
}