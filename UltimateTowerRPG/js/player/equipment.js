// =========================================
// Ultimate Tower RPG - equipment.js
// =========================================

// =========================================
// Equipment System
// =========================================

export class EquipmentSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Equipment Slots
        // =====================================

        this.slots = {

            weapon: null,

            offhand: null,

            helmet: null,

            chest: null,

            leggings: null,

            boots: null,

            gloves: null,

            ring1: null,

            ring2: null,

            necklace: null,

            artifact: null,

            pet: null,

            mount: null
        };

        // =====================================
        // Set Bonuses
        // =====================================

        this.activeSets = [];

        // =====================================
        // Total Stats
        // =====================================

        this.totalStats = {

            damage: 0,

            defense: 0,

            maxHealth: 0,

            maxMana: 0,

            critChance: 0,

            critDamage: 0,

            speed: 0,

            attackSpeed: 0,

            dodgeChance: 0,

            lifeSteal: 0,

            elementalPower: 0
        };

        // =====================================
        // Element Types
        // =====================================

        this.elements = [

            "fire",

            "ice",

            "lightning",

            "poison",

            "shadow",

            "holy"
        ];

        // =====================================
        // Rarity Multipliers
        // =====================================

        this.rarityScaling = {

            common: 1,

            uncommon: 1.2,

            rare: 1.5,

            epic: 2,

            legendary: 3,

            mythic: 5
        };
    }

    // =========================================
    // Equip Item
    // =========================================

    equip(item) {

        if (
            !item
        ) {

            return false;
        }

        // =====================================
        // Invalid Slot
        // =====================================

        if (
            !item.slot
        ) {

            return false;
        }

        const slot =
            item.slot;

        // =====================================
        // Unequip Existing
        // =====================================

        if (
            this.slots[slot]
        ) {

            this.unequip(slot);
        }

        // =====================================
        // Equip
        // =====================================

        this.slots[slot] =
            item;

        // =====================================
        // Apply Stats
        // =====================================

        this.applyStats(item);

        // =====================================
        // Set Bonuses
        // =====================================

        this.checkSetBonuses();

        // =====================================
        // Special Effects
        // =====================================

        this.applySpecialEffects(item);

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `Equipped ${item.name}`,

                item.rarity
            );

        return true;
    }

    // =========================================
    // Unequip
    // =========================================

    unequip(slot) {

        const item =
            this.slots[slot];

        if (
            !item
        ) {

            return false;
        }

        // =====================================
        // Remove Stats
        // =====================================

        this.removeStats(item);

        // =====================================
        // Remove Effects
        // =====================================

        this.removeSpecialEffects(item);

        // =====================================
        // Remove Item
        // =====================================

        this.slots[slot] =
            null;

        // =====================================
        // Recalculate Sets
        // =====================================

        this.checkSetBonuses();

        return item;
    }

    // =========================================
    // Apply Stats
    // =========================================

    applyStats(item) {

        const player =
            this.game.player;

        if (
            !player ||
            !item.stats
        ) {

            return;
        }

        // =====================================
        // Add Stats
        // =====================================

        for (
            const stat in item.stats
        ) {

            const value =
                item.stats[stat];

            // Player Stat
            if (
                player[stat] !== undefined
            ) {

                player[stat] +=
                    value;
            }

            // Total Stat Tracker
            if (
                this.totalStats[stat] !== undefined
            ) {

                this.totalStats[stat] +=
                    value;
            }
        }
    }

    // =========================================
    // Remove Stats
    // =========================================

    removeStats(item) {

        const player =
            this.game.player;

        if (
            !player ||
            !item.stats
        ) {

            return;
        }

        for (
            const stat in item.stats
        ) {

            const value =
                item.stats[stat];

            if (
                player[stat] !== undefined
            ) {

                player[stat] -=
                    value;
            }

            if (
                this.totalStats[stat] !== undefined
            ) {

                this.totalStats[stat] -=
                    value;
            }
        }
    }

    // =========================================
    // Set Bonuses
    // =========================================

    checkSetBonuses() {

        // =====================================
        // Clear Old Sets
        // =====================================

        this.removeAllSetBonuses();

        const setCounts = {};

        // =====================================
        // Count Set Pieces
        // =====================================

        for (
            const slot in this.slots
        ) {

            const item =
                this.slots[slot];

            if (
                item &&
                item.set
            ) {

                if (
                    !setCounts[item.set]
                ) {

                    setCounts[item.set] = 0;
                }

                setCounts[item.set]++;
            }
        }

        // =====================================
        // Activate Bonuses
        // =====================================

        for (
            const setName in setCounts
        ) {

            const pieces =
                setCounts[setName];

            this.activateSetBonus(
                setName,
                pieces
            );
        }
    }

    // =========================================
    // Activate Set Bonus
    // =========================================

    activateSetBonus(
        setName,
        pieces
    ) {

        const player =
            this.game.player;

        // =====================================
        // Dragon Set
        // =====================================

        if (
            setName === "dragon"
        ) {

            if (
                pieces >= 2
            ) {

                player.damage += 15;
            }

            if (
                pieces >= 4
            ) {

                player.fireResistance =
                    50;
            }

            if (
                pieces >= 6
            ) {

                player.fireDamage =
                    100;

                this.game.ui
                    ?.addNotification(

                        "Dragon Set Complete",

                        "legendary"
                    );
            }
        }

        // =====================================
        // Shadow Set
        // =====================================

        if (
            setName === "shadow"
        ) {

            if (
                pieces >= 2
            ) {

                player.speed += 2;
            }

            if (
                pieces >= 4
            ) {

                player.dodgeChance += 15;
            }

            if (
                pieces >= 6
            ) {

                player.invisible =
                    true;
            }
        }

        // =====================================
        // Titan Set
        // =====================================

        if (
            setName === "titan"
        ) {

            if (
                pieces >= 2
            ) {

                player.defense += 20;
            }

            if (
                pieces >= 4
            ) {

                player.maxHealth += 200;
            }

            if (
                pieces >= 6
            ) {

                player.damageReduction =
                    30;
            }
        }
    }

    // =========================================
    // Remove Set Bonuses
    // =========================================

    removeAllSetBonuses() {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        // Reset Special Stats
        player.fireResistance = 0;

        player.fireDamage = 0;

        player.damageReduction = 0;
    }

    // =========================================
    // Special Effects
    // =========================================

    applySpecialEffects(item) {

        const player =
            this.game.player;

        // =====================================
        // Elemental Effects
        // =====================================

        if (
            item.element
        ) {

            player.element =
                item.element;
        }

        // =====================================
        // Pet
        // =====================================

        if (
            item.slot === "pet"
        ) {

            this.summonPet(item);
        }

        // =====================================
        // Mount
        // =====================================

        if (
            item.slot === "mount"
        ) {

            player.speed += 5;
        }

        // =====================================
        // Glow
        // =====================================

        if (
            item.rarity === "mythic"
        ) {

            player.glowEffect =
                true;
        }
    }

    // =========================================
    // Remove Effects
    // =========================================

    removeSpecialEffects(item) {

        const player =
            this.game.player;

        if (
            item.slot === "mount"
        ) {

            player.speed -= 5;
        }

        if (
            item.rarity === "mythic"
        ) {

            player.glowEffect =
                false;
        }
    }

    // =========================================
    // Pet Summon
    // =========================================

    summonPet(item) {

        const player =
            this.game.player;

        const pet = {

            name:
                item.name,

            x:
                player.x - 50,

            y:
                player.y,

            damage:
                item.petDamage || 10,

            health:
                item.petHealth || 100,

            type:
                item.petType || "wolf"
        };

        player.pet = pet;

        this.game.ui
            ?.addNotification(

                `${pet.name} Summoned`,

                "rare"
            );
    }

    // =========================================
    // Damage Calculation
    // =========================================

    calculateDamage(baseDamage) {

        const player =
            this.game.player;

        let damage =
            baseDamage;

        // =====================================
        // Weapon Damage
        // =====================================

        if (
            this.slots.weapon
        ) {

            damage +=

                this.slots.weapon
                    .stats.damage || 0;
        }

        // =====================================
        // Critical
        // =====================================

        const critRoll =
            Math.random() * 100;

        if (
            critRoll <
            player.critChance
        ) {

            damage *=

                player.critDamage / 100;

            this.game.effects
                ?.createFloatingText({

                    text: "CRITICAL!",

                    x: player.x,

                    y: player.y,

                    color: "#ffff44"
                });
        }

        // =====================================
        // Elemental
        // =====================================

        if (
            player.element
        ) {

            damage *= 1.2;
        }

        return Math.floor(damage);
    }

    // =========================================
    // Durability
    // =========================================

    damageEquipment(amount = 1) {

        for (
            const slot in this.slots
        ) {

            const item =
                this.slots[slot];

            if (
                item &&
                item.durability !== undefined
            ) {

                item.durability -=
                    amount;

                // Broken
                if (
                    item.durability <= 0
                ) {

                    this.breakItem(item);
                }
            }
        }
    }

    // =========================================
    // Break Item
    // =========================================

    breakItem(item) {

        this.game.ui
            ?.addNotification(

                `${item.name} Broke!`,

                "danger"
            );

        this.unequip(item.slot);
    }

    // =========================================
    // Repair
    // =========================================

    repairItem(item) {

        const cost =
            item.level * 50;

        const inventory =
            this.game.inventory;

        if (
            inventory.gold < cost
        ) {

            return false;
        }

        inventory.gold -= cost;

        item.durability =
            item.maxDurability;

        return true;
    }

    // =========================================
    // Random Equipment
    // =========================================

    generateEquipment(
        level,
        slot
    ) {

        // =====================================
        // Rarity Roll
        // =====================================

        const roll =
            Math.random() * 100;

        let rarity =
            "common";

        if (
            roll > 99
        ) rarity = "mythic";

        else if (
            roll > 95
        ) rarity = "legendary";

        else if (
            roll > 85
        ) rarity = "epic";

        else if (
            roll > 70
        ) rarity = "rare";

        else if (
            roll > 45
        ) rarity = "uncommon";

        // =====================================
        // Scaling
        // =====================================

        const scale =
            this.rarityScaling[
                rarity
            ];

        return {

            id:
                `${slot}_${Date.now()}`,

            name:
                `${rarity.toUpperCase()} ${slot}`,

            slot,

            level,

            rarity,

            durability: 100,

            maxDurability: 100,

            stats: {

                damage:
                    slot === "weapon"
                    ? Math.floor(level * 8 * scale)
                    : 0,

                defense:
                    slot !== "weapon"
                    ? Math.floor(level * 5 * scale)
                    : 0,

                maxHealth:
                    Math.floor(level * 12 * scale),

                critChance:
                    Math.floor(scale * 2)
            }
        };
    }

    // =========================================
    // Total Gear Score
    // =========================================

    getGearScore() {

        let score = 0;

        for (
            const slot in this.slots
        ) {

            const item =
                this.slots[slot];

            if (
                item
            ) {

                score +=

                    item.level *

                    this.rarityScaling[
                        item.rarity
                    ];
            }
        }

        return Math.floor(score);
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        const startX =
            this.game.canvas.width - 250;

        const startY = 100;

        // =====================================
        // Title
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "22px Arial";

        ctx.fillText(
            "Equipment",
            startX,
            startY
        );

        let offsetY = 40;

        // =====================================
        // Slots
        // =====================================

        for (
            const slot in this.slots
        ) {

            const item =
                this.slots[slot];

            // Background
            ctx.fillStyle =
                "#222222";

            ctx.fillRect(

                startX,
                startY + offsetY,

                200,
                32
            );

            ctx.strokeStyle =
                "#ffffff";

            ctx.strokeRect(

                startX,
                startY + offsetY,

                200,
                32
            );

            // Slot Name
            ctx.fillStyle =
                "#aaaaaa";

            ctx.font =
                "14px Arial";

            ctx.fillText(

                slot.toUpperCase(),

                startX + 8,

                startY + offsetY + 20
            );

            // Item
            if (
                item
            ) {

                ctx.fillStyle =

                    this.game.inventory
                        ?.rarities[
                            item.rarity
                        ]?.color ||

                    "#ffffff";

                ctx.fillText(

                    item.name,

                    startX + 80,

                    startY + offsetY + 20
                );
            }

            offsetY += 40;
        }

        // =====================================
        // Gear Score
        // =====================================

        ctx.fillStyle =
            "#ffcc44";

        ctx.font =
            "18px Arial";

        ctx.fillText(

            `Gear Score: ${this.getGearScore()}`,

            startX,

            startY + offsetY + 20
        );
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            slots:
                this.slots,

            totalStats:
                this.totalStats
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

        this.slots =
            data.slots ||
            this.slots;

        this.totalStats =
            data.totalStats ||
            this.totalStats;
    }
}