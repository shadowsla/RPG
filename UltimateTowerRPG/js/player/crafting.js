// =========================================
// Ultimate Tower RPG - crafting.js
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
        // Unlocked Recipes
        // =====================================

        this.unlockedRecipes = [];

        // =====================================
        // Crafting Level
        // =====================================

        this.level = 1;

        this.experience = 0;

        this.experienceToNext = 100;

        // =====================================
        // Stations
        // =====================================

        this.stations = [

            "forge",

            "alchemy",

            "enchanting",

            "cooking",

            "workbench"
        ];

        // =====================================
        // Current Station
        // =====================================

        this.currentStation =
            "forge";

        // =====================================
        // Craft Speed
        // =====================================

        this.craftSpeed = 1;

        // =====================================
        // Critical Craft Chance
        // =====================================

        this.criticalCraftChance = 10;

        // =====================================
        // Load Recipes
        // =====================================

        this.loadDefaultRecipes();
    }

    // =========================================
    // Default Recipes
    // =========================================

    loadDefaultRecipes() {

        this.recipes = [

            // =================================
            // Weapons
            // =================================

            {
                id: "iron_sword",

                name: "Iron Sword",

                station: "forge",

                levelRequired: 1,

                craftTime: 3,

                result: {

                    type: "weapon",

                    slot: "weapon",

                    rarity: "common",

                    stats: {

                        damage: 12,

                        critChance: 2
                    },

                    icon: "⚔️"
                },

                materials: [

                    {
                        id: "iron_ore",

                        amount: 5
                    },

                    {
                        id: "wood",

                        amount: 2
                    }
                ],

                xpReward: 25
            },

            // =================================
            // Health Potion
            // =================================

            {
                id: "health_potion",

                name: "Health Potion",

                station: "alchemy",

                levelRequired: 1,

                craftTime: 2,

                result: {

                    type: "consumable",

                    rarity: "common",

                    heal: 100,

                    icon: "🧪"
                },

                materials: [

                    {
                        id: "red_herb",

                        amount: 3
                    },

                    {
                        id: "water",

                        amount: 1
                    }
                ],

                xpReward: 15
            },

            // =================================
            // Fire Staff
            // =================================

            {
                id: "fire_staff",

                name: "Fire Staff",

                station: "forge",

                levelRequired: 5,

                craftTime: 8,

                result: {

                    type: "weapon",

                    slot: "weapon",

                    rarity: "rare",

                    element: "fire",

                    stats: {

                        damage: 35,

                        elementalPower: 20,

                        maxMana: 50
                    },

                    icon: "🔥"
                },

                materials: [

                    {
                        id: "fire_crystal",

                        amount: 4
                    },

                    {
                        id: "magic_wood",

                        amount: 5
                    },

                    {
                        id: "gold_ingot",

                        amount: 2
                    }
                ],

                xpReward: 80
            },

            // =================================
            // Dragon Armor
            // =================================

            {
                id: "dragon_armor",

                name: "Dragon Armor",

                station: "forge",

                levelRequired: 15,

                craftTime: 20,

                result: {

                    type: "armor",

                    slot: "chest",

                    rarity: "legendary",

                    set: "dragon",

                    stats: {

                        defense: 60,

                        maxHealth: 250,

                        fireResistance: 50
                    },

                    icon: "🛡️"
                },

                materials: [

                    {
                        id: "dragon_scale",

                        amount: 10
                    },

                    {
                        id: "mythril_ingot",

                        amount: 8
                    },

                    {
                        id: "fire_core",

                        amount: 2
                    }
                ],

                xpReward: 250
            },

            // =================================
            // Pet Summon
            // =================================

            {
                id: "wolf_pet",

                name: "Wolf Companion",

                station: "enchanting",

                levelRequired: 10,

                craftTime: 12,

                result: {

                    type: "pet",

                    slot: "pet",

                    rarity: "epic",

                    petType: "wolf",

                    petDamage: 20,

                    petHealth: 200,

                    icon: "🐺"
                },

                materials: [

                    {
                        id: "spirit_essence",

                        amount: 5
                    },

                    {
                        id: "wolf_fang",

                        amount: 3
                    },

                    {
                        id: "soul_gem",

                        amount: 1
                    }
                ],

                xpReward: 120
            }
        ];

        // =====================================
        // Starter Recipes
        // =====================================

        this.unlockedRecipes = [

            "iron_sword",

            "health_potion"
        ];
    }

    // =========================================
    // Craft Item
    // =========================================

    craft(recipeId) {

        const recipe =
            this.recipes.find(

                r => r.id === recipeId
            );

        if (
            !recipe
        ) {

            return false;
        }

        // =====================================
        // Locked
        // =====================================

        if (
            !this.unlockedRecipes.includes(
                recipeId
            )
        ) {

            this.game.ui
                ?.addNotification(

                    "Recipe Locked",

                    "danger"
                );

            return false;
        }

        // =====================================
        // Level Requirement
        // =====================================

        if (
            this.level <
            recipe.levelRequired
        ) {

            this.game.ui
                ?.addNotification(

                    "Crafting Level Too Low",

                    "danger"
                );

            return false;
        }

        // =====================================
        // Station Check
        // =====================================

        if (
            this.currentStation !==
            recipe.station
        ) {

            this.game.ui
                ?.addNotification(

                    `Requires ${recipe.station}`,

                    "warning"
                );

            return false;
        }

        // =====================================
        // Materials
        // =====================================

        if (
            !this.hasMaterials(recipe)
        ) {

            this.game.ui
                ?.addNotification(

                    "Missing Materials",

                    "danger"
                );

            return false;
        }

        // =====================================
        // Remove Materials
        // =====================================

        this.consumeMaterials(recipe);

        // =====================================
        // Start Craft
        // =====================================

        this.startCrafting(recipe);

        return true;
    }

    // =========================================
    // Materials Check
    // =========================================

    hasMaterials(recipe) {

        const inventory =
            this.game.inventory;

        for (
            const material of
            recipe.materials
        ) {

            const item =
                inventory.items.find(

                    i =>

                    i.id === material.id
                );

            if (
                !item ||
                item.quantity <
                material.amount
            ) {

                return false;
            }
        }

        return true;
    }

    // =========================================
    // Consume Materials
    // =========================================

    consumeMaterials(recipe) {

        const inventory =
            this.game.inventory;

        for (
            const material of
            recipe.materials
        ) {

            inventory.removeItem(

                material.id,

                material.amount
            );
        }
    }

    // =========================================
    // Start Crafting
    // =========================================

    startCrafting(recipe) {

        const craftTime =

            recipe.craftTime /

            this.craftSpeed;

        this.game.ui
            ?.addNotification(

                `Crafting ${recipe.name}...`,

                "info"
            );

        // =====================================
        // Craft Timer
        // =====================================

        setTimeout(() => {

            this.finishCrafting(recipe);

        }, craftTime * 1000);
    }

    // =========================================
    // Finish Craft
    // =========================================

    finishCrafting(recipe) {

        const inventory =
            this.game.inventory;

        // =====================================
        // Clone Result
        // =====================================

        const craftedItem = {

            ...recipe.result,

            id:
                `${recipe.id}_${Date.now()}`,

            name:
                recipe.name
        };

        // =====================================
        // Critical Craft
        // =====================================

        const criticalRoll =
            Math.random() * 100;

        if (
            criticalRoll <
            this.criticalCraftChance
        ) {

            this.applyCriticalCraft(
                craftedItem
            );

            this.game.ui
                ?.addNotification(

                    "CRITICAL CRAFT!",

                    "legendary"
                );
        }

        // =====================================
        // Add Item
        // =====================================

        inventory.addItem(
            craftedItem
        );

        // =====================================
        // XP
        // =====================================

        this.addExperience(
            recipe.xpReward
        );

        // =====================================
        // Effects
        // =====================================

        this.createCraftEffect();

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `${recipe.name} Crafted`,

                craftedItem.rarity
            );
    }

    // =========================================
    // Critical Craft
    // =========================================

    applyCriticalCraft(item) {

        // =====================================
        // Upgrade Rarity
        // =====================================

        const rarityUpgrade = {

            common: "uncommon",

            uncommon: "rare",

            rare: "epic",

            epic: "legendary",

            legendary: "mythic"
        };

        item.rarity =

            rarityUpgrade[
                item.rarity
            ] || item.rarity;

        // =====================================
        // Increase Stats
        // =====================================

        if (
            item.stats
        ) {

            for (
                const stat in item.stats
            ) {

                item.stats[stat] =

                    Math.floor(

                        item.stats[stat]
                        * 1.5
                    );
            }
        }
    }

    // =========================================
    // XP
    // =========================================

    addExperience(amount) {

        this.experience += amount;

        // =====================================
        // Level Up
        // =====================================

        while (

            this.experience >=
            this.experienceToNext
        ) {

            this.levelUp();
        }
    }

    // =========================================
    // Level Up
    // =========================================

    levelUp() {

        this.level++;

        this.experience -=
            this.experienceToNext;

        this.experienceToNext =

            Math.floor(

                this.experienceToNext
                * 1.4
            );

        // =====================================
        // Rewards
        // =====================================

        this.craftSpeed += 0.05;

        this.criticalCraftChance +=
            1;

        // =====================================
        // Unlock Recipes
        // =====================================

        this.unlockRecipes();

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `Crafting Level ${this.level}`,

                "success"
            );
    }

    // =========================================
    // Unlock Recipes
    // =========================================

    unlockRecipes() {

        for (
            const recipe of
            this.recipes
        ) {

            if (

                recipe.levelRequired <=
                this.level &&

                !this.unlockedRecipes.includes(
                    recipe.id
                )
            ) {

                this.unlockedRecipes.push(
                    recipe.id
                );

                this.game.ui
                    ?.addNotification(

                        `Unlocked ${recipe.name}`,

                        "rare"
                    );
            }
        }
    }

    // =========================================
    // Station
    // =========================================

    setStation(station) {

        if (
            !this.stations.includes(
                station
            )
        ) {

            return false;
        }

        this.currentStation =
            station;

        this.game.ui
            ?.addNotification(

                `Using ${station}`,

                "info"
            );

        return true;
    }

    // =========================================
    // Salvage
    // =========================================

    salvage(itemId) {

        const inventory =
            this.game.inventory;

        const item =
            inventory.items.find(

                i => i.id === itemId
            );

        if (
            !item
        ) {

            return false;
        }

        // =====================================
        // Remove Item
        // =====================================

        inventory.removeItem(
            itemId,
            1
        );

        // =====================================
        // Return Materials
        // =====================================

        const materials = [

            {
                id: "scrap",

                quantity:
                    Math.floor(
                        Math.random() * 5
                    ) + 1
            }
        ];

        // Rare Materials
        if (
            item.rarity === "epic" ||

            item.rarity === "legendary"
        ) {

            materials.push({

                id: "magic_dust",

                quantity: 2
            });
        }

        // =====================================
        // Add Materials
        // =====================================

        for (
            const material of
            materials
        ) {

            inventory.addItem({

                id:
                    material.id,

                name:
                    material.id
                    .replace("_", " "),

                type: "material",

                quantity:
                    material.quantity,

                stackable: true,

                maxStack: 999
            });
        }

        return true;
    }

    // =========================================
    // Enchant
    // =========================================

    enchant(item, enchantType) {

        // =====================================
        // Fire
        // =====================================

        if (
            enchantType === "fire"
        ) {

            item.element = "fire";

            item.stats.damage += 10;
        }

        // =====================================
        // Ice
        // =====================================

        if (
            enchantType === "ice"
        ) {

            item.element = "ice";

            item.stats.critChance += 5;
        }

        // =====================================
        // Lightning
        // =====================================

        if (
            enchantType === "lightning"
        ) {

            item.element = "lightning";

            item.stats.attackSpeed += 10;
        }

        return true;
    }

    // =========================================
    // Effects
    // =========================================

    createCraftEffect() {

        const centerX =
            this.game.canvas.width / 2;

        const centerY =
            this.game.canvas.height / 2;

        // ============