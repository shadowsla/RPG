// =========================================
// Ultimate Tower RPG - leveling.js
// =========================================

// =========================================
// Leveling System
// =========================================

export class LevelingSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // XP Curve
        // =====================================

        this.baseXP = 100;

        this.xpMultiplier = 1.4;

        this.maxLevel = 100;

        // =====================================
        // Rewards
        // =====================================

        this.statPointsPerLevel = 5;

        this.skillPointsPerLevel = 1;

        // =====================================
        // Rank Tiers
        // =====================================

        this.rankTiers = [

            {
                level: 1,
                rank: "F"
            },

            {
                level: 10,
                rank: "E"
            },

            {
                level: 20,
                rank: "D"
            },

            {
                level: 30,
                rank: "C"
            },

            {
                level: 40,
                rank: "B"
            },

            {
                level: 50,
                rank: "A"
            },

            {
                level: 70,
                rank: "S"
            },

            {
                level: 90,
                rank: "SS"
            },

            {
                level: 100,
                rank: "SSS"
            }
        ];

        // =====================================
        // Prestige
        // =====================================

        this.prestigeLevel = 0;

        this.prestigeMultiplier = 1;

        // =====================================
        // Skill Points
        // =====================================

        this.skillPoints = 0;
    }

    // =========================================
    // Add Experience
    // =========================================

    addExperience(amount) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        // =====================================
        // XP Multipliers
        // =====================================

        amount *=
            this.prestigeMultiplier;

        amount *=

            1 +

            ((player.experienceBoost || 0)
            / 100);

        amount = Math.floor(amount);

        // =====================================
        // Add XP
        // =====================================

        player.experience += amount;

        // =====================================
        // Floating Text
        // =====================================

        this.game.effects
            ?.createFloatingText({

                text:
                    `+${amount} XP`,

                x: player.x,

                y:
                    player.y - 40,

                color: "#44ccff"
            });

        // =====================================
        // Level Ups
        // =====================================

        while (

            player.experience >=
            player.experienceToNext &&

            player.level <
            this.maxLevel
        ) {

            this.levelUp();
        }
    }

    // =========================================
    // Level Up
    // =========================================

    levelUp() {

        const player =
            this.game.player;

        player.level++;

        // =====================================
        // Carry Over XP
        // =====================================

        player.experience -=
            player.experienceToNext;

        // =====================================
        // New XP Requirement
        // =====================================

        player.experienceToNext =
            this.calculateXPRequired(
                player.level
            );

        // =====================================
        // Rewards
        // =====================================

        this.giveLevelRewards();

        // =====================================
        // Restore Health / Mana
        // =====================================

        player.health =
            player.maxHealth;

        player.mana =
            player.maxMana;

        // =====================================
        // Effects
        // =====================================

        this.levelUpEffects();

        // =====================================
        // Unlock Skills
        // =====================================

        this.checkSkillUnlocks();

        // =====================================
        // Rank Up
        // =====================================

        this.checkRankUp();

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `LEVEL UP! ${player.level}`,

                "success"
            );
    }

    // =========================================
    // XP Required
    // =========================================

    calculateXPRequired(level) {

        return Math.floor(

            this.baseXP *

            Math.pow(
                this.xpMultiplier,
                level - 1
            )
        );
    }

    // =========================================
    // Rewards
    // =========================================

    giveLevelRewards() {

        const player =
            this.game.player;

        // =====================================
        // Base Stats
        // =====================================

        player.maxHealth += 20;

        player.maxMana += 10;

        player.damage += 4;

        player.defense += 2;

        player.speed += 0.2;

        // =====================================
        // Stat Points
        // =====================================

        this.game.stats
            ?.addStatPoints(

                this.statPointsPerLevel
            );

        // =====================================
        // Skill Points
        // =====================================

        this.skillPoints +=
            this.skillPointsPerLevel;

        // =====================================
        // Every 5 Levels
        // =====================================

        if (
            player.level % 5 === 0
        ) {

            player.critChance += 1;

            player.healthRegen += 0.5;

            player.manaRegen += 0.5;
        }

        // =====================================
        // Every 10 Levels
        // =====================================

        if (
            player.level % 10 === 0
        ) {

            player.maxHealth += 50;

            player.damage += 10;

            player.defense += 5;
        }
    }

    // =========================================
    // Effects
    // =========================================

    levelUpEffects() {

        const player =
            this.game.player;

        // =====================================
        // Screen Shake
        // =====================================

        this.game.effects
            ?.shakeScreen(
                10,
                0.5
            );

        // =====================================
        // Particles
        // =====================================

        for (
            let i = 0;
            i < 40;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        player.x +
                        player.width / 2,

                    y:
                        player.y +
                        player.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 10,

                    velocityY:
                        (Math.random() - 0.5) * 10,

                    size:
                        Math.random() * 8 + 4,

                    color: "#ffff44",

                    life: 1.5
                });
        }

        // =====================================
        // Aura
        // =====================================

        this.game.effects
            ?.createEffect({

                type: "levelup",

                x:
                    player.x +
                    player.width / 2,

                y:
                    player.y +
                    player.height / 2,

                radius: 120,

                life: 2
            });
    }

    // =========================================
    // Rank
    // =========================================

    getCurrentRank() {

        const level =
            this.game.player.level;

        let currentRank = "F";

        for (
            const tier of
            this.rankTiers
        ) {

            if (
                level >= tier.level
            ) {

                currentRank =
                    tier.rank;
            }
        }

        return currentRank;
    }

    // =========================================
    // Rank Up
    // =========================================

    checkRankUp() {

        const player =
            this.game.player;

        for (
            const tier of
            this.rankTiers
        ) {

            if (
                player.level === tier.level
            ) {

                this.game.ui
                    ?.addNotification(

                        `RANK UP: ${tier.rank}`,

                        "legendary"
                    );

                this.game.effects
                    ?.shakeScreen(
                        20,
                        1
                    );
            }
        }
    }

    // =========================================
    // Skills
    // =========================================

    checkSkillUnlocks() {

        const level =
            this.game.player.level;

        const skills =
            this.game.skills;

        // =====================================
        // Warrior
        // =====================================

        if (
            level === 2
        ) {

            skills?.unlockSkill(
                "rageSlash"
            );
        }

        if (
            level === 5
        ) {

            skills?.unlockSkill(
                "whirlwind"
            );
        }

        if (
            level === 8
        ) {

            skills?.unlockSkill(
                "leapStrike"
            );
        }

        // =====================================
        // Mage
        // =====================================

        if (
            level === 2
        ) {

            skills?.unlockSkill(
                "fireball"
            );
        }

        if (
            level === 5
        ) {

            skills?.unlockSkill(
                "iceNova"
            );
        }

        if (
            level === 10
        ) {

            skills?.unlockSkill(
                "meteor"
            );
        }

        // =====================================
        // Rogue
        // =====================================

        if (
            level === 3
        ) {

            skills?.unlockSkill(
                "shadowStep"
            );
        }

        if (
            level === 6
        ) {

            skills?.unlockSkill(
                "poisonDaggers"
            );
        }

        // =====================================
        // Tank
        // =====================================

        if (
            level === 4
        ) {

            skills?.unlockSkill(
                "groundSlam"
            );
        }

        if (
            level === 8
        ) {

            skills?.unlockSkill(
                "ironSkin"
            );
        }

        // =====================================
        // Support
        // =====================================

        if (
            level === 2
        ) {

            skills?.unlockSkill(
                "heal"
            );
        }

        if (
            level === 6
        ) {

            skills?.unlockSkill(
                "holyAura"
            );
        }

        if (
            level === 12
        ) {

            skills?.unlockSkill(
                "summonWolf"
            );
        }
    }

    // =========================================
    // Prestige
    // =========================================

    prestige() {

        const player =
            this.game.player;

        if (
            player.level <
            this.maxLevel
        ) {

            return false;
        }

        // =====================================
        // Prestige Increase
        // =====================================

        this.prestigeLevel++;

        this.prestigeMultiplier +=
            0.25;

        // =====================================
        // Reset Player
        // =====================================

        player.level = 1;

        player.experience = 0;

        player.experienceToNext =
            this.baseXP;

        // =====================================
        // Permanent Bonuses
        // =====================================

        player.damage +=
            this.prestigeLevel * 5;

        player.maxHealth +=
            this.prestigeLevel * 25;

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `PRESTIGE ${this.prestigeLevel}!`,

                "legendary"
            );

        return true;
    }

    // =========================================
    // Hardcore Bonus
    // =========================================

    applyHardcoreRewards() {

        const player =
            this.game.player;

        player.damage += 20;

        player.maxHealth += 100;

        player.critChance += 10;

        this.game.ui
            ?.addNotification(

                "Hardcore Bonus Earned",

                "danger"
            );
    }

    // =========================================
    // Challenge Modifier XP
    // =========================================

    calculateModifiedXP(baseXP) {

        const modifiers =
            this.game.challengeModifiers;

        if (
            !modifiers
        ) {

            return baseXP;
        }

        let multiplier = 1;

        for (
            const modifier of
            modifiers
        ) {

            multiplier +=
                modifier.xpBonus || 0;
        }

        return Math.floor(
            baseXP * multiplier
        );
    }

    // =========================================
    // Endless Scaling
    // =========================================

    calculateEndlessScaling(floor) {

        return 1 +

            (floor * 0.08);
    }

    // =========================================
    // Draw XP Bar
    // =========================================

    draw(ctx) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        const width = 400;
        const height = 18;

        const x =

            (this.game.canvas.width / 2)
            - (width / 2);

        const y =
            this.game.canvas.height - 30;

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            "#111111";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // =====================================
        // XP Fill
        // =====================================

        const progress =

            player.experience /

            player.experienceToNext;

        ctx.fillStyle =
            "#44ccff";

        ctx.fillRect(

            x,
            y,

            width * progress,
            height
        );

        // =====================================
        // Border
        // =====================================

        ctx.strokeStyle =
            "#ffffff";

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );

        // =====================================
        // Text
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "14px Arial";

        ctx.fillText(

            `Lv.${player.level} (${this.getCurrentRank()}) - ${Math.floor(player.experience)} / ${player.experienceToNext} XP`,

            x + 10,

            y + 13
        );

        // =====================================
        // Prestige
        // =====================================

        if (
            this.prestigeLevel > 0
        ) {

            ctx.fillStyle =
                "#ffcc44";

            ctx.fillText(

                `Prestige ${this.prestigeLevel}`,

                x + width + 20,

                y + 13
            );
        }
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            prestigeLevel:
                this.prestigeLevel,

            prestigeMultiplier:
                this.prestigeMultiplier,

            skillPoints:
                this.skillPoints
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

        this.prestigeLevel =
            data.prestigeLevel || 0;

        this.prestigeMultiplier =
            data.prestigeMultiplier || 1;

        this.skillPoints =
            data.skillPoints || 0;
    }
}