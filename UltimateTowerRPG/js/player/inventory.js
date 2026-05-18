// =========================================
// Ultimate Tower RPG - inventory.js
// =========================================

// =========================================
// Inventory System
// =========================================

export class InventorySystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Inventory
        // =====================================

        this.slots = 40;

        this.items = [];

        // =====================================
        // Equipment
        // =====================================

        this.equipment = {

            weapon: null,

            helmet: null,

            chest: null,

            gloves: null,

            boots: null,

            ring1: null,

            ring2: null,

            necklace: null,

            artifact: null
        };

        // =====================================
        // Gold
        // =====================================

        this.gold = 0;

        // =====================================
        // Consumables
        // =====================================

        this.quickSlots = [

            null,
            null,
            null,
            null,
            null
        ];

        // =====================================
        // Filters
        // =====================================

        this.currentFilter = "all";

        // =====================================
        // Dragging
        // =====================================

        this.draggedItem = null;

        // =====================================
        // Sorting
        // =====================================

        this.sortMode = "rarity";

        // =====================================
        // Loot Rarities
        // =====================================

        this.rarities = {

            common: {

                color: "#aaaaaa",

                multiplier: 1
            },

            uncommon: {

                color: "#44cc44",

                multiplier: 1.2
            },

            rare: {

                color: "#4488ff",

                multiplier: 1.5
            },

            epic: {

                color: "#aa44ff",

                multiplier: 2
            },

            legendary: {

                color: "#ffaa22",

                multiplier: 3
            },

            mythic: {

                color: "#ff4444",

                multiplier: 5
            }
        };

        // =====================================
        // Item Types
        // =====================================

        this.itemTypes = [

            "weapon",

            "armor",

            "consumable",

            "material",

            "quest",

            "artifact"
        ];
    }

    // =========================================
    // Add Item
    // =========================================

    addItem(item) {

        // =====================================
        // Stack Existing
        // =====================================

        if (
            item.stackable
        ) {

            const existing =
                this.items.find(

                    i =>

                    i.id === item.id &&

                    i.quantity <
                    i.maxStack
                );

            if (
                existing
            ) {

                existing.quantity +=
                    item.quantity || 1;

                return true;
            }
        }

        // =====================================
        // Inventory Full
        // =====================================

        if (
            this.items.length >=
            this.slots
        ) {

            this.game.ui
                ?.addNotification(

                    "Inventory Full",

                    "danger"
                );

            return false;
        }

        // =====================================
        // Add Item
        // =====================================

        this.items.push({

            ...item,

            quantity:
                item.quantity || 1
        });

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `Obtained ${item.name}`,

                item.rarity || "common"
            );

        return true;
    }

    // =========================================
    // Remove Item
    // =========================================

    removeItem(itemId, amount = 1) {

        const item =
            this.items.find(

                i => i.id === itemId
            );

        if (
            !item
        ) {

            return false;
        }

        // =====================================
        // Stack
        // =====================================

        if (
            item.quantity > amount
        ) {

            item.quantity -= amount;
        }

        else {

            this.items =
                this.items.filter(

                    i => i.id !== itemId
                );
        }

        return true;
    }

    // =========================================
    // Equip
    // =========================================

    equipItem(itemId) {

        const item =
            this.items.find(

                i => i.id === itemId
            );

        if (
            !item
        ) {

            return false;
        }

        if (
            !item.equipSlot
        ) {

            return false;
        }

        const slot =
            item.equipSlot;

        const oldItem =
            this.equipment[slot];

        // =====================================
        // Unequip Old
        // =====================================

        if (
            oldItem
        ) {

            this.unequipItem(slot);
        }

        // =====================================
        // Equip
        // =====================================

        this.equipment[slot] =
            item;

        // =====================================
        // Remove From Inventory
        // =====================================

        this.items =
            this.items.filter(

                i => i.id !== itemId
            );

        // =====================================
        // Apply Stats
        // =====================================

        this.applyItemStats(item);

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

    unequipItem(slot) {

        const item =
            this.equipment[slot];

        if (
            !item
        ) {

            return false;
        }

        // =====================================
        // Inventory Space
        // =====================================

        if (
            this.items.length >=
            this.slots
        ) {

            return false;
        }

        // =====================================
        // Remove Stats
        // =====================================

        this.removeItemStats(item);

        // =====================================
        // Add Back
        // =====================================

        this.items.push(item);

        this.equipment[slot] =
            null;

        return true;
    }

    // =========================================
    // Apply Stats
    // =========================================

    applyItemStats(item) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        // =====================================
        // Generic Stats
        // =====================================

        for (
            const stat in item.stats
        ) {

            if (
                player[stat] !== undefined
            ) {

                player[stat] +=
                    item.stats[stat];
            }
        }
    }

    // =========================================
    // Remove Stats
    // =========================================

    removeItemStats(item) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        for (
            const stat in item.stats
        ) {

            if (
                player[stat] !== undefined
            ) {

                player[stat] -=
                    item.stats[stat];
            }
        }
    }

    // =========================================
    // Use Consumable
    // =========================================

    useItem(itemId) {

        const item =
            this.items.find(

                i => i.id === itemId
            );

        if (
            !item
        ) {

            return false;
        }

        const player =
            this.game.player;

        // =====================================
        // Heal
        // =====================================

        if (
            item.heal
        ) {

            player.heal?.(
                item.heal
            );
        }

        // =====================================
        // Mana
        // =====================================

        if (
            item.mana
        ) {

            player.mana +=
                item.mana;

            if (
                player.mana >
                player.maxMana
            ) {

                player.mana =
                    player.maxMana;
            }
        }

        // =====================================
        // Buffs
        // =====================================

        if (
            item.buff
        ) {

            this.applyBuff(
                item.buff
            );
        }

        // =====================================
        // Remove Item
        // =====================================

        this.removeItem(
            itemId,
            1
        );

        return true;
    }

    // =========================================
    // Buff
    // =========================================

    applyBuff(buff) {

        const player =
            this.game.player;

        for (
            const stat in buff.stats
        ) {

            if (
                player[stat] !== undefined
            ) {

                player[stat] +=
                    buff.stats[stat];
            }
        }

        // =====================================
        // Remove Buff Later
        // =====================================

        setTimeout(() => {

            for (
                const stat in buff.stats
            ) {

                if (
                    player[stat] !== undefined
                ) {

                    player[stat] -=
                        buff.stats[stat];
                }
            }

        }, buff.duration * 1000);
    }

    // =========================================
    // Add Gold
    // =========================================

    addGold(amount) {

        this.gold += amount;

        this.game.ui
            ?.addNotification(

                `+${amount} Gold`,

                "gold"
            );
    }

    // =========================================
    // Spend Gold
    // =========================================

    spendGold(amount) {

        if (
            this.gold < amount
        ) {

            return false;
        }

        this.gold -= amount;

        return true;
    }

    // =========================================
    // Sort
    // =========================================

    sortInventory() {

        switch (
            this.sortMode
        ) {

            // =================================
            // Rarity
            // =================================

            case "rarity":

                this.items.sort(
                    (a, b) => {

                        const rarityOrder = {

                            common: 1,

                            uncommon: 2,

                            rare: 3,

                            epic: 4,

                            legendary: 5,

                            mythic: 6
                        };

                        return (

                            rarityOrder[b.rarity]
                            -

                            rarityOrder[a.rarity]
                        );
                    }
                );

                break;

            // =================================
            // Name
            // =================================

            case "name":

                this.items.sort(
                    (a, b) =>

                    a.name.localeCompare(
                        b.name
                    )
                );

                break;

            // =================================
            // Type
            // =================================

            case "type":

                this.items.sort(
                    (a, b) =>

                    a.type.localeCompare(
                        b.type
                    )
                );

                break;
        }
    }

    // =========================================
    // Filter
    // =========================================

    getFilteredItems() {

        if (
            this.currentFilter ===
            "all"
        ) {

            return this.items;
        }

        return this.items.filter(

            item =>

            item.type ===
            this.currentFilter
        );
    }

    // =========================================
    // Generate Loot
    // =========================================

    generateLoot(level) {

        // =====================================
        // Rarity Roll
        // =====================================

        const roll =
            Math.random() * 100;

        let rarity =
            "common";

        if (
            roll > 99
        ) {

            rarity = "mythic";
        }

        else if (
            roll > 95
        ) {

            rarity = "legendary";
        }

        else if (
            roll > 85
        ) {

            rarity = "epic";
        }

        else if (
            roll > 65
        ) {

            rarity = "rare";
        }

        else if (
            roll > 40
        ) {

            rarity = "uncommon";
        }

        // =====================================
        // Weapon Example
        // =====================================

        const multiplier =
            this.rarities[
                rarity
            ].multiplier;

        return {

            id:
                `sword_${Date.now()}`,

            name:
                `${rarity.toUpperCase()} Sword`,

            type: "weapon",

            equipSlot: "weapon",

            rarity,

            value:
                Math.floor(
                    100 * multiplier
                ),

            stats: {

                damage:
                    Math.floor(
                        level * 5 * multiplier
                    ),

                critChance:
                    Math.floor(
                        multiplier * 2
                    )
            },

            icon: "⚔️"
        };
    }

    // =========================================
    // Drop Loot
    // =========================================

    dropLoot(enemy) {

        const chance =
            Math.random();

        // =====================================
        // Gold
        // =====================================

        this.addGold(

            Math.floor(
                Math.random() * 50
            ) + 10
        );

        // =====================================
        // Item Drop
        // =====================================

        if (
            chance > 0.45
        ) {

            const loot =
                this.generateLoot(
                    enemy.level || 1
                );

            this.addItem(loot);
        }
    }

    // =========================================
    // Quick Slot
    // =========================================

    assignQuickSlot(index, itemId) {

        const item =
            this.items.find(

                i => i.id === itemId
            );

        if (
            !item
        ) {

            return;
        }

        this.quickSlots[index] =
            item;
    }

    // =========================================
    // Use Quick Slot
    // =========================================

    useQuickSlot(index) {

        const item =
            this.quickSlots[index];

        if (
            !item
        ) {

            return;
        }

        this.useItem(item.id);
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        // =====================================
        // Gold
        // =====================================

        ctx.fillStyle =
            "#ffcc44";

        ctx.font =
            "22px Arial";

        ctx.fillText(

            `Gold: ${this.gold}`,

            20,
            40
        );

        // =====================================
        // Quick Slots
        // =====================================

        const startX = 20;

        const y =
            this.game.canvas.height - 80;

        for (
            let i = 0;
            i < this.quickSlots.length;
            i++
        ) {

            const slotX =
                startX + (i * 70);

            // Background
            ctx.fillStyle =
                "#222222";

            ctx.fillRect(
                slotX,
                y,
                60,
                60
            );

            ctx.strokeStyle =
                "#ffffff";

            ctx.strokeRect(
                slotX,
                y,
                60,
                60
            );

            // Item
            const item =
                this.quickSlots[i];

            if (
                item
            ) {

                ctx.fillStyle =
                    "#ffffff";

                ctx.font =
                    "30px Arial";

                ctx.fillText(

                    item.icon || "?",

                    slotX + 15,

                    y + 40
                );
            }

            // Key
            ctx.fillStyle =
                "#aaaaaa";

            ctx.font =
                "14px Arial";

            ctx.fillText(

                `${i + 1}`,

                slotX + 4,

                y + 14
            );
        }
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            items:
                this.items,

            equipment:
                this.equipment,

            gold:
                this.gold,

            quickSlots:
                this.quickSlots
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

        this.items =
            data.items || [];

        this.equipment =
            data.equipment ||
            this.equipment;

        this.gold =
            data.gold || 0;

        this.quickSlots =
            data.quickSlots ||
            this.quickSlots;
    }
}