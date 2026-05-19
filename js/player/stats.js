// =========================================
// Ultimate Tower RPG - stats.js
// =========================================

// =========================================
// Stats System
// =========================================

export class StatsSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Base Stats
        // =====================================

        this.baseStats = {

            // Core
            strength: 10,

            agility: 10,

            intelligence: 10,

            vitality: 10,

            endurance: 10,

            luck: 5,

            // Combat
            damage: 10,

            defense: 5,

            critChance: 5,

            critDamage: 150,

            attackSpeed: 1,

            movementSpeed: 5,

            // Health / Mana
            maxHealth: 100,

            healthRegen: 1,

            maxMana: 100,

            manaRegen: 2,

            // Resistances
            fireResistance: 0,

            iceResistance: 0,

            lightningResistance: 0,

            poisonResistance: 0,

            darkResistance: 0,

            holyResistance: 0,

            // Utility
            dodgeChance: 0,

            lifeSteal: 0,

            cooldownReduction: 0,

            experienceBoost: 0,

            goldBoost: 0
        };

        // =====================================
        // Current Stats
        // =====================================

        this.currentStats = {

            ...this.baseStats
        };

        // =====================================
        // Bonus Stats
        // =====================================

        this.bonusStats = {};

        // =====================================
        // Multipliers
        // =====================================

        this.multipliers = {};

        // =====================================
        // Allocatable Points
        // =====================================

        this.statPoints = 0;

        // =====================================
        // Scaling
        // =====================================

        this.levelScaling = {

            healthPerVitality: 12,

            manaPerIntelligence: 10,

            damagePerStrength: 2,

            critPerAgility: 0.4,

            speedPerAgility: 0.1,

            defensePerEndurance: 1.5
        };
    }

    // =========================================
    // Update
    // =========================================

    update() {

        this.recalculateStats();
    }

    // =========================================
    // Recalculate
    // =========================================

    recalculateStats() {

        const stats = {

            ...this.baseStats
        };

        // =====================================
        // Bonus Stats
        // =====================================

        for (
            const stat in
            this.bonusStats
        ) {

            if (
                stats[stat] ===
                undefined
            ) {

                stats[stat] = 0;
            }

            stats[stat] +=
                this.bonusStats[stat];
        }

        // =====================================
        // Derived Stats
        // =====================================

        stats.maxHealth +=

            stats.vitality *

            this.levelScaling
                .healthPerVitality;

        stats.maxMana +=

            stats.intelligence *

            this.levelScaling
                .manaPerIntelligence;

        stats.damage +=

            stats.strength *

            this.levelScaling
                .damagePerStrength;

        stats.critChance +=

            stats.agility *

            this.levelScaling
                .critPerAgility;

        stats.movementSpeed +=

            stats.agility *

            this.levelScaling
                .speedPerAgility;

        stats.defense +=

            stats.endurance *

            this.levelScaling
                .defensePerEndurance;

        // =====================================
        // Multipliers
        // =====================================

        for (
            const stat in
            this.multipliers
        ) {

            stats[stat] *=
                this.multipliers[stat];
        }

        // =====================================
        // Clamp
        // =====================================

        stats.critChance = Math.min(
            stats.critChance,
            100
        );

        stats.cooldownReduction = Math.min(
            stats.cooldownReduction,
            80
        );

        stats.dodgeChance = Math.min(
            stats.dodgeChance,
            75
        );

        // =====================================
        // Save
        // =====================================

        this.currentStats = stats;

        // =====================================
        // Apply To Player
        // =====================================

        this.applyToPlayer();
    }

    // =========================================
    // Apply To Player
    // =========================================

    applyToPlayer() {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        const stats =
            this.currentStats;

        // =====================================
        // Apply
        // =====================================

        player.damage =
            stats.damage;

        player.defense =
            stats.defense;

        player.critChance =
            stats.critChance;

        player.critDamage =
            stats.critDamage;

        player.attackSpeed =
            stats.attackSpeed;

        player.speed =
            stats.movementSpeed;

        player.maxHealth =
            stats.maxHealth;

        player.healthRegen =
            stats.healthRegen;

        player.maxMana =
            stats.maxMana;

        player.manaRegen =
            stats.manaRegen;

        player.dodgeChance =
            stats.dodgeChance;

        player.lifeSteal =
            stats.lifeSteal;

        player.cooldownReduction =
            stats.cooldownReduction;

        // =====================================
        // Clamp Health
        // =====================================

        if (
            player.health >
            player.maxHealth
        ) {

            player.health =
                player.maxHealth;
        }

        if (
            player.mana >
            player.maxMana
        ) {

            player.mana =
                player.maxMana;
        }
    }

    // =========================================
    // Add Bonus
    // =========================================

    addBonusStat(
        stat,
        value
    ) {

        if (
            !this.bonusStats[stat]
        ) {

            this.bonusStats[stat] = 0;
        }

        this.bonusStats[stat] +=
            value;

        this.recalculateStats();
    }

    // =========================================
    // Remove Bonus
    // =========================================

    removeBonusStat(
        stat,
        value
    ) {

        if (
            !this.bonusStats[stat]
        ) {

            return;
        }

        this.bonusStats[stat] -=
            value;

        this.recalculateStats();
    }

    // =========================================
    // Multiplier
    // =========================================

    setMultiplier(
        stat,
        multiplier
    ) {

        this.multipliers[stat] =
            multiplier;

        this.recalculateStats();
    }

    // =========================================
    // Allocate Point
    // =========================================

    allocateStatPoint(stat) {

        if (
            this.statPoints <= 0
        ) {

            return false;
        }

        if (
            this.baseStats[stat] ===
            undefined
        ) {

            return false;
        }

        this.baseStats[stat]++;

        this.statPoints--;

        this.recalculateStats();

        return true;
    }

    // =========================================
    // Add Points
    // =========================================

    addStatPoints(amount) {

        this.statPoints += amount;
    }

    // =========================================
    // Damage Calc
    // =========================================

    calculateDamage(
        attackerStats,
        defenderStats,
        baseDamage,
        element = null
    ) {

        let damage =

            baseDamage +

            attackerStats.damage;

        // =====================================
        // Critical
        // =====================================

        const critRoll =
            Math.random() * 100;

        const critical =
            critRoll <
            attackerStats.critChance;

        if (
            critical
        ) {

            damage *=

                attackerStats.critDamage / 100;
        }

        // =====================================
        // Defense
        // =====================================

        damage -=
            defenderStats.defense;

        // =====================================
        // Elemental
        // =====================================

        if (
            element
        ) {

            const resistanceStat =
                `${element}Resistance`;

            const resistance =
                defenderStats[
                    resistanceStat
                ] || 0;

            damage *=
                (100 - resistance) / 100;
        }

        // =====================================
        // Minimum
        // =====================================

        damage = Math.max(
            1,
            Math.floor(damage)
        );

        return {

            damage,

            critical
        };
    }

    // =========================================
    // Dodge
    // =========================================

    rollDodge(stats) {

        return (

            Math.random() * 100 <

            stats.dodgeChance
        );
    }

    // =========================================
    // Healing
    // =========================================

    calculateHealing(
        baseHealing,
        stats
    ) {

        return Math.floor(

            baseHealing +

            stats.intelligence * 2
        );
    }

    // =========================================
    // XP Gain
    // =========================================

    calculateExperienceGain(
        baseXP
    ) {

        return Math.floor(

            baseXP *

            (1 +
            this.currentStats
                .experienceBoost / 100)
        );
    }

    // =========================================
    // Gold Gain
    // =========================================

    calculateGoldGain(
        baseGold
    ) {

        return Math.floor(

            baseGold *

            (1 +
            this.currentStats
                .goldBoost / 100)
        );
    }

    // =========================================
    // Full Heal
    // =========================================

    fullyRestore() {

        const player =
            this.game.player;

        player.health =
            player.maxHealth;

        player.mana =
            player.maxMana;
    }

    // =========================================
    // Reset
    // =========================================

    resetStats() {

        this.baseStats = {

            ...this.baseStats
        };

        this.bonusStats = {};

        this.multipliers = {};

        this.recalculateStats();
    }

    // =========================================
    // Get
    // =========================================

    getStat(stat) {

        return this.currentStats[stat];
    }

    // =========================================
    // Has Requirement
    // =========================================

    meetsRequirements(
        requirements
    ) {

        for (
            const stat in
            requirements
        ) {

            if (

                this.currentStats[stat] <

                requirements[stat]
            ) {

                return false;
            }
        }

        return true;
    }

    // =========================================
    // Regen
    // =========================================

    applyRegeneration(
        deltaTime
    ) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        // =====================================
        // Health
        // =====================================

        player.health +=

            this.currentStats
                .healthRegen *

            deltaTime;

        // =====================================
        // Mana
        // =====================================

        player.mana +=

            this.currentStats
                .manaRegen *

            deltaTime;

        // =====================================
        // Clamp
        // =====================================

        player.health = Math.min(

            player.health,

            player.maxHealth
        );

        player.mana = Math.min(

            player.mana,

            player.maxMana
        );
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        const x =
            this.game.canvas.width - 320;

        const y = 40;

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            "rgba(0,0,0,0.7)";

        ctx.fillRect(
            x,
            y,
            280,
            380
        );

        // =====================================
        // Title
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "24px Arial";

        ctx.fillText(
            "STATS",
            x + 90,
            y + 35
        );

        // =====================================
        // Stats
        // =====================================

        ctx.font =
            "18px Arial";

        let offsetY = 80;

        for (
            const stat in
            this.currentStats
        ) {

            const value =
                this.currentStats[stat];

            ctx.fillStyle =
                "#cccccc";

            ctx.fillText(

                `${stat}: ${Math.floor(value)}`,

                x + 20,

                y + offsetY
            );

            offsetY += 24;

            if (
                offsetY > 340
            ) {

                break;
            }
        }

        // =====================================
        // Points
        // =====================================

        ctx.fillStyle =
            "#ffff66";

        ctx.fillText(

            `Points: ${this.statPoints}`,

            x + 20,

            y + 360
        );
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            baseStats:
                this.baseStats,

            bonusStats:
                this.bonusStats,

            multipliers:
                this.multipliers,

            statPoints:
                this.statPoints
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

        this.baseStats =
            data.baseStats ||
            this.baseStats;

        this.bonusStats =
            data.bonusStats || {};

        this.multipliers =
            data.multipliers || {};

        this.statPoints =
            data.statPoints || 0;

        this.recalculateStats();
    }
}