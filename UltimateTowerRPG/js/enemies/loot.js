// =========================================
// Ultimate Tower RPG - loot.js
// =========================================

// =========================================
// Loot System
// =========================================

export class LootSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Active Loot Drops
        // =====================================

        this.drops = [];

        // =====================================
        // Loot Radius
        // =====================================

        this.pickupRadius = 80;

        // =====================================
        // Auto Pickup
        // =====================================

        this.autoPickupGold = true;

        this.autoPickupMaterials = false;

        // =====================================
        // Loot Chances
        // =====================================

        this.rarityChances = {

            common: 45,

            uncommon: 25,

            rare: 15,

            epic: 8,

            legendary: 5,

            mythic: 2
        };

        // =====================================
        // Loot Tables
        // =====================================

        this.lootTables = {

            goblin: [

                "gold",

                "wood",

                "dagger",

                "health_potion"
            ],

            skeleton: [

                "bone",

                "iron_sword",

                "shield",

                "mana_potion"
            ],

            dragon: [

                "dragon_scale",

                "dragon_sword",

                "fire_core",

                "legendary_chestplate"
            ],

            boss: [

                "epic_weapon",

                "legendary_artifact",

                "soul_gem",

                "mythic_scroll"
            ]
        };

        // =====================================
        // Item Database
        // =====================================

        this.items = this.createItemDatabase();
    }

    // =========================================
    // Item Database
    // =========================================

    createItemDatabase() {

        return {

            // =================================
            // Materials
            // =================================

            wood: {

                id: "wood",

                name: "Wood",

                type: "material",

                rarity: "common",

                stackable: true,

                maxStack: 999,

                icon: "🪵"
            },

            bone: {

                id: "bone",

                name: "Bone",

                type: "material",

                rarity: "common",

                stackable: true,

                maxStack: 999,

                icon: "🦴"
            },

            dragon_scale: {

                id: "dragon_scale",

                name: "Dragon Scale",

                type: "material",

                rarity: "epic",

                stackable: true,

                maxStack: 99,

                icon: "🐉"
            },

            fire_core: {

                id: "fire_core",

                name: "Fire Core",

                type: "material",

                rarity: "legendary",

                stackable: true,

                maxStack: 25,

                icon: "🔥"
            },

            soul_gem: {

                id: "soul_gem",

                name: "Soul Gem",

                type: "material",

                rarity: "mythic",

                stackable: true,

                maxStack: 10,

                icon: "💎"
            },

            // =================================
            // Weapons
            // =================================

            dagger: {

                id: "dagger",

                name: "Rusty Dagger",

                type: "weapon",

                slot: "weapon",

                rarity: "common",

                stats: {

                    damage: 8,

                    critChance: 5
                },

                value: 50,

                icon: "🗡️"
            },

            iron_sword: {

                id: "iron_sword",

                name: "Iron Sword",

                type: "weapon",

                slot: "weapon",

                rarity: "uncommon",

                stats: {

                    damage: 18,

                    critChance: 3
                },

                value: 120,

                icon: "⚔️"
            },

            dragon_sword: {

                id: "dragon_sword",

                name: "Dragon Slayer",

                type: "weapon",

                slot: "weapon",

                rarity: "legendary",

                element: "fire",

                stats: {

                    damage: 80,

                    critChance: 15,

                    fireDamage: 50
                },

                value: 5000,

                icon: "🔥"
            },

            epic_weapon: {

                id: "epic_weapon",

                name: "Storm Blade",

                type: "weapon",

                slot: "weapon",

                rarity: "epic",

                element: "lightning",

                stats: {

                    damage: 45,

                    attackSpeed: 15,

                    critChance: 10
                },

                value: 2000,

                icon: "⚡"
            },

            // =================================
            // Armor
            // =================================

            shield: {

                id: "shield",

                name: "Knight Shield",

                type: "armor",

                slot: "offhand",

                rarity: "rare",

                stats: {

                    defense: 25,

                    maxHealth: 40
                },

                value: 400,

                icon: "🛡️"
            },

            legendary_chestplate: {

                id: "legendary_chestplate",

                name: "Titan Chestplate",

                type: "armor",

                slot: "chest",

                rarity: "legendary",

                set: "titan",

                stats: {

                    defense: 75,

                    maxHealth: 300
                },

                value: 4500,

                icon: "🛡️"
            },

            // =================================
            // Consumables
            // =================================

            health_potion: {

                id: "health_potion",

                name: "Health Potion",

                type: "consumable",

                rarity: "common",

                heal: 100,

                stackable: true,

                maxStack: 20,

                value: 30,

                icon: "🧪"
            },

            mana_potion: {

                id: "mana_potion",

                name: "Mana Potion",

                type: "consumable",

                rarity: "uncommon",

                mana: 75,

                stackable: true,

                maxStack: 20,

                value: 40,

                icon: "🔷"
            },

            mythic_scroll: {

                id: "mythic_scroll",

                name: "Ancient Scroll",

                type: "consumable",

                rarity: "mythic",

                buff: {

                    duration: 60,

                    stats: {

                        damage: 50,

                        critChance: 20
                    }
                },

                value: 10000,

                icon: "📜"
            },

            // =================================
            // Artifacts
            // =================================

            legendary_artifact: {

                id: "legendary_artifact",

                name: "Orb of Eternity",

                type: "artifact",

                slot: "artifact",

                rarity: "mythic",

                stats: {

                    damage: 100,

                    maxHealth: 500,

                    maxMana: 300,

                    critChance: 25
                },

                value: 25000,

                icon: "🔮"
            }
        };
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.updateDrops(deltaTime);

        this.checkPickup();
    }

    // =========================================
    // Update Drops
    // =========================================

    updateDrops(deltaTime) {

        for (
            const drop of this.drops
        ) {

            // =================================
            // Gravity
            // =================================

            drop.velocityY +=
                0.3;

            drop.x +=
                drop.velocityX;

            drop.y +=
                drop.velocityY;

            // =================================
            // Friction
            // =================================

            drop.velocityX *= 0.92;

            // =================================
            // Ground
            // =================================

            if (
                drop.y >
                this.game.groundLevel
            ) {

                drop.y =
                    this.game.groundLevel;

                drop.velocityY = 0;
            }

            // =================================
            // Lifetime
            // =================================

            drop.life -=
                deltaTime;

            // =================================
            // Flashing
            // =================================

            if (
                drop.life < 5
            ) {

                drop.flash =
                    !drop.flash;
            }
        }

        // =====================================
        // Remove Expired
        // =====================================

        this.drops =
            this.drops.filter(

                drop => drop.life > 0
            );
    }

    // =========================================
    // Drop Loot
    // =========================================

    dropLoot(enemy) {

        if (
            !enemy
        ) {

            return;
        }

        // =====================================
        // Gold
        // =====================================

        this.dropGold(

            enemy.x,

            enemy.y,

            Math.floor(
                Math.random() * 50
            ) + 20
        );

        // =====================================
        // Loot Table
        // =====================================

        const lootTable =

            this.lootTables[
                enemy.type
            ] ||

            this.lootTables.goblin;

        // =====================================
        // Item Count
        // =====================================

        const itemCount =

            Math.floor(
                Math.random() * 3
            ) + 1;

        for (
            let i = 0;
            i < itemCount;
            i++
        ) {

            const itemId =

                lootTable[
                    Math.floor(
                        Math.random() *
                        lootTable.length
                    )
                ];

            const item =
                this.items[itemId];

            if (
                item
            ) {

                this.spawnDrop(

                    enemy.x +
                    (Math.random() - 0.5) * 50,

                    enemy.y,

                    {

                        ...item,

                        uniqueId:
                            `${item.id}_${Date.now()}_${Math.random()}`
                    }
                );
            }
        }

        // =====================================
        // Rare Drop Chance
        // =====================================

        this.rollRareDrop(enemy);
    }

    // =========================================
    // Rare Drops
    // =========================================

    rollRareDrop(enemy) {

        const roll =
            Math.random() * 100;

        // =====================================
        // Mythic
        // =====================================

        if (
            roll <= 1
        ) {

            this.spawnDrop(

                enemy.x,

                enemy.y,

                {

                    ...this.items.legendary_artifact,

                    uniqueId:
                        `artifact_${Date.now()}`
                }
            );

            this.game.ui
                ?.addNotification(

                    "MYTHIC DROP!",

                    "mythic"
                );

            return;
        }

        // =====================================
        // Legendary
        // =====================================

        if (
            roll <= 5
        ) {

            this.spawnDrop(

                enemy.x,

                enemy.y,

                {

                    ...this.items.dragon_sword,

                    uniqueId:
                        `legendary_${Date.now()}`
                }
            );

            this.game.ui
                ?.addNotification(

                    "LEGENDARY DROP!",

                    "legendary"
                );
        }
    }

    // =========================================
    // Spawn Drop
    // =========================================

    spawnDrop(x, y, item) {

        this.drops.push({

            x,

            y,

            width: 32,

            height: 32,

            item,

            velocityX:
                (Math.random() - 0.5) * 8,

            velocityY:
                -6 - Math.random() * 4,

            rotation: 0,

            life: 30,

            flash: false,

            bobOffset:
                Math.random() * Math.PI * 2
        });
    }

    // =========================================
    // Gold
    // =========================================

    dropGold(x, y, amount) {

        this.spawnDrop(x, y, {

            id: "gold",

            name: "Gold",

            type: "currency",

            amount,

            rarity: "common",

            icon: "🪙"
        });
    }

    // =========================================
    // Pickup
    // =========================================

    checkPickup() {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        for (
            let i = this.drops.length - 1;
            i >= 0;
            i--
        ) {

            const drop =
                this.drops[i];

            const distance =
                Math.hypot(

                    player.x - drop.x,

                    player.y - drop.y
                );

            // =================================
            // Magnetic Pull
            // =================================

            if (
                distance <
                this.pickupRadius * 2
            ) {

                const angle =
                    Math.atan2(

                        player.y - drop.y,

                        player.x - drop.x
                    );

                drop.x +=
                    Math.cos(angle) * 4;

                drop.y +=
                    Math.sin(angle) * 4;
            }

            // =================================
            // Pickup
            // =================================

            if (
                distance <
                this.pickupRadius
            ) {

                this.pickup(drop);

                this.drops.splice(i, 1);
            }
        }
    }

    // =========================================
    // Pickup Item
    // =========================================

    pickup(drop) {

        const inventory =
            this.game.inventory;

        const item =
            drop.item;

        // =====================================
        // Gold
        // =====================================

        if (
            item.type === "currency"
        ) {

            inventory.addGold(
                item.amount
            );

            return;
        }

        // =====================================
        // Inventory Add
        // =====================================

        inventory.addItem(item);

        // =====================================
        // Sound
        // =====================================

        this.game.sound
            ?.play("pickup");

        // =====================================
        // Effect
        // =====================================

        this.createPickupEffect(
            drop
        );
    }

    // =========================================
    // Chest Loot
    // =========================================

    openChest(chest) {

        const lootCount =

            chest.lootCount || 3;

        for (
            let i = 0;
            i < lootCount;
            i++
        ) {

            const randomItem =
                this.getRandomLoot(
                    chest.rarity ||
                    "rare"
                );

            this.spawnDrop(

                chest.x +
                (Math.random() - 0.5) * 80,

                chest.y,

                randomItem
            );
        }

        // =====================================
        // Gold Bonus
        // =====================================

        this.dropGold(

            chest.x,

            chest.y,

            Math.floor(
                Math.random() * 300
            ) + 100
        );

        this.game.effects
            ?.shakeScreen(
                8,
                0.3
            );
    }

    // =========================================
    // Random Loot
    // =========================================

    getRandomLoot(rarity = "common") {

        const validItems =

            Object.values(this.items)
                .filter(

                    item =>

                    item.rarity ===
                    rarity
                );

        if (
            validItems.length === 0
        ) {

            return this.items.wood;
        }

        const item =

            validItems[
                Math.floor(
                    Math.random() *
                    validItems.length
                )
            ];

        return {

            ...item,

            uniqueId:
                `${item.id}_${Date.now()}`
        };
    }

    // =========================================
    // Pickup Effects
    // =========================================

    createPickupEffect(drop) {

        for (
            let i = 0;
            i < 10;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x: drop.x,

                    y: drop.y,

                    velocityX:
                        (Math.random() - 0.5) * 8,

                    velocityY:
                        (Math.random() - 0.5) * 8,

                    size:
                        Math.random() * 5 + 2,

                    color: "#ffdd44",

                    life: 0.5
                });
        }
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        for (
            const drop of this.drops
        ) {

            // =================================
            // Flash Skip
            // =================================

            if (
                drop.life < 5 &&
                drop.flash
            ) {

                continue;
            }

            // =================================
            // Floating Animation
            // =================================

            const bob =

                Math.sin(

                    Date.now() * 0.005 +
                    drop.bobOffset
                ) * 5;

            // =================================
            // Glow
            // =================================

            const rarityColors = {

                common: "#aaaaaa",

                uncommon: "#44cc44",

                rare: "#4488ff",

                epic: "#aa44ff",

                legendary: "#ffaa22",

                mythic: "#ff4444"
            };

            ctx.shadowBlur = 20;

            ctx.shadowColor =

                rarityColors[
                    drop.item.rarity
                ] || "#ffffff";

            // =================================
            // Background
            // =================================

            ctx.fillStyle =
                "rgba(0,0,0,0.6)";

            ctx.beginPath();

            ctx.arc(

                drop.x,

                drop.y + bob,

                18,

                0,

                Math.PI * 2
            );

            ctx.fill();

            // =================================
            // Icon
            // =================================

            ctx.font =
                "24px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(

                drop.item.icon || "❓",

                drop.x,

                drop.y + bob + 8
            );

            // =================================
            // Reset Shadow
            // =================================

            ctx.shadowBlur = 0;

            // =================================
            // Name
            // =================================

            ctx.fillStyle =

                rarityColors[
                    drop.item.rarity
                ] || "#ffffff";

            ctx.font =
                "12px Arial";

            ctx.fillText(

                drop.item.name,

                drop.x,

                drop.y + bob + 35
            );
        }

        // =====================================
        // Reset Alignment
        // =====================================

        ctx.textAlign = "left";
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            drops:
                this.drops
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

        this.drops =
            data.drops || [];
    }
}