// =========================================
// Ultimate Tower RPG - bosses.js
// =========================================

// =========================================
// Boss System
// =========================================

import { BossPatterns } from "./bossPatterns.js";

export class BossManager {

    constructor(game) {

        this.game = game;

        // =====================================
        // Boss List
        // =====================================

        this.activeBosses = [];

        // =====================================
        // Boss Patterns
        // =====================================

        this.patterns =
            new BossPatterns(game);

        // =====================================
        // Boss Definitions
        // =====================================

        this.bosses = {

            // =================================
            // Ancient Dragon
            // =================================

            dragon: {

                id: "dragon",

                name: "Ancient Dragon",

                title: "The Inferno King",

                level: 25,

                width: 220,

                height: 160,

                color: "#ff5522",

                element: "fire",

                music: "dragon_theme",

                stats: {

                    health: 5000,

                    damage: 65,

                    defense: 40,

                    speed: 2.5,

                    critChance: 15
                },

                abilities: [

                    "fireBreath",

                    "meteorRain",

                    "inferno",

                    "tailSwipe",

                    "berserkCombo"
                ],

                rewards: {

                    xp: 5000,

                    gold: 10000,

                    items: [

                        "dragonBlade",

                        "infernoArmor",

                        "fireCrystal"
                    ]
                }
            },

            // =================================
            // Ice Titan
            // =================================

            iceTitan: {

                id: "iceTitan",

                name: "Ice Titan",

                title: "Frozen Guardian",

                level: 20,

                width: 180,

                height: 220,

                color: "#88ddff",

                element: "ice",

                music: "ice_theme",

                stats: {

                    health: 4200,

                    damage: 50,

                    defense: 55,

                    speed: 1.4,

                    critChance: 5
                },

                abilities: [

                    "iceSpike",

                    "freezeBeam",

                    "blizzard",

                    "icePrison"
                ],

                rewards: {

                    xp: 4200,

                    gold: 8500,

                    items: [

                        "frostHammer",

                        "iceCrown",

                        "glacierShield"
                    ]
                }
            },

            // =================================
            // Shadow King
            // =================================

            shadowKing: {

                id: "shadowKing",

                name: "Shadow King",

                title: "Ruler of Darkness",

                level: 30,

                width: 120,

                height: 190,

                color: "#551188",

                element: "shadow",

                music: "shadow_theme",

                stats: {

                    health: 6000,

                    damage: 75,

                    defense: 28,

                    speed: 4,

                    critChance: 25
                },

                abilities: [

                    "shadowSlash",

                    "teleportStrike",

                    "darkRain",

                    "shadowClone",

                    "voidExplosion"
                ],

                rewards: {

                    xp: 8000,

                    gold: 15000,

                    items: [

                        "shadowKatana",

                        "voidCape",

                        "darkCore"
                    ]
                }
            },

            // =================================
            // Mechanical Core
            // =================================

            mechCore: {

                id: "mechCore",

                name: "Mechanical Core",

                title: "The Steel Nightmare",

                level: 35,

                width: 240,

                height: 240,

                color: "#999999",

                element: "electric",

                music: "machine_theme",

                stats: {

                    health: 9000,

                    damage: 80,

                    defense: 70,

                    speed: 1.8,

                    critChance: 10
                },

                abilities: [

                    "laserBeam",

                    "missileBarrage",

                    "shockwave",

                    "droneSummon"
                ],

                rewards: {

                    xp: 12000,

                    gold: 25000,

                    items: [

                        "plasmaRifle",

                        "mechArmor",

                        "energyCore"
                    ]
                }
            }
        };
    }

    // =========================================
    // Spawn Boss
    // =========================================

    spawnBoss(
        bossId,
        x = null,
        y = null
    ) {

        const data =
            this.bosses[bossId];

        if (
            !data
        ) {

            console.warn(
                `Boss '${bossId}' not found`
            );

            return null;
        }

        // =====================================
        // Default Position
        // =====================================

        x ??=
            this.game.worldWidth / 2;

        y ??=
            this.game.groundLevel;

        // =====================================
        // Create Boss
        // =====================================

        const boss = {

            // =================================
            // Identity
            // =================================

            id:
                `${bossId}_${Date.now()}`,

            type:
                bossId,

            name:
                data.name,

            title:
                data.title,

            boss: true,

            // =================================
            // Position
            // =================================

            x,

            y,

            width:
                data.width,

            height:
                data.height,

            velocityX: 0,

            velocityY: 0,

            grounded: true,

            direction: -1,

            // =================================
            // Visuals
            // =================================

            color:
                data.color,

            element:
                data.element,

            opacity: 1,

            rotation: 0,

            scale: 1,

            // =================================
            // Stats
            // =================================

            level:
                data.level,

            health:
                data.stats.health,

            maxHealth:
                data.stats.health,

            damage:
                data.stats.damage,

            defense:
                data.stats.defense,

            speed:
                data.stats.speed,

            critChance:
                data.stats.critChance,

            // =================================
            // Combat
            // =================================

            abilities:
                [...data.abilities],

            attackCooldown: 0,

            patternCooldown: 3,

            invincible: false,

            dead: false,

            enraged: false,

            // =================================
            // Boss Mechanics
            // =================================

            phase: 1,

            phaseTimer: 0,

            summonCooldown: 10,

            berserk: false,

            // =================================
            // Status Effects
            // =================================

            burning: 0,

            poisoned: 0,

            frozen: 0,

            stunned: 0,

            slowed: 0,

            // =================================
            // Rewards
            // =================================

            rewards:
                data.rewards,

            // =================================
            // AI
            // =================================

            aiState: "idle",

            target:
                this.game.player,

            // =================================
            // Animation
            // =================================

            animationState: "idle",

            animationFrame: 0,

            animationTimer: 0
        };

        // =====================================
        // Add Boss
        // =====================================

        this.activeBosses.push(boss);

        // =====================================
        // Add To Enemy List
        // =====================================

        if (
            !this.game.enemies
        ) {

            this.game.enemies = [];
        }

        this.game.enemies.push(boss);

        // =====================================
        // Intro
        // =====================================

        this.startBossIntro(boss);

        return boss;
    }

    // =========================================
    // Boss Intro
    // =========================================

    startBossIntro(boss) {

        // =====================================
        // Pause
        // =====================================

        this.game.cutscene = true;

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `${boss.name} - ${boss.title}`,

                "legendary"
            );

        // =====================================
        // Camera Shake
        // =====================================

        this.game.effects
            ?.shakeScreen(
                25,
                1
            );

        // =====================================
        // Music
        // =====================================

        this.game.music
            ?.playTrack(
                this.bosses[boss.type].music
            );

        // =====================================
        // Intro Effect
        // =====================================

        for (
            let i = 0;
            i < 80;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        boss.x +
                        boss.width / 2,

                    y:
                        boss.y -
                        boss.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 20,

                    velocityY:
                        (Math.random() - 0.5) * 20,

                    size:
                        Math.random() * 10 + 2,

                    color:
                        boss.color,

                    life: 2
                });
        }

        // =====================================
        // Resume
        // =====================================

        setTimeout(() => {

            this.game.cutscene = false;

        }, 3000);
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        for (
            const boss of this.activeBosses
        ) {

            if (
                boss.dead
            ) {

                continue;
            }

            this.updateBoss(
                boss,
                deltaTime
            );
        }

        // =====================================
        // Cleanup
        // =====================================

        this.cleanupBosses();
    }

    // =========================================
    // Update Single Boss
    // =========================================

    updateBoss(
        boss,
        deltaTime
    ) {

        // =====================================
        // Status Effects
        // =====================================

        this.updateStatusEffects(
            boss,
            deltaTime
        );

        // =====================================
        // Gravity
        // =====================================

        if (
            !boss.flying
        ) {

            boss.velocityY += 0.5;
        }

        boss.x +=
            boss.velocityX;

        boss.y +=
            boss.velocityY;

        // =====================================
        // Ground Collision
        // =====================================

        if (
            boss.y >
            this.game.groundLevel
        ) {

            boss.y =
                this.game.groundLevel;

            boss.velocityY = 0;

            boss.grounded = true;
        }

        // =====================================
        // Boss AI
        // =====================================

        this.bossAI(
            boss,
            deltaTime
        );

        // =====================================
        // Attack Patterns
        // =====================================

        this.patterns.updateBoss(
            boss,
            deltaTime
        );

        // =====================================
        // Phase Changes
        // =====================================

        this.checkPhaseChange(boss);

        // =====================================
        // Death
        // =====================================

        if (
            boss.health <= 0
        ) {

            this.killBoss(boss);
        }
    }

    // =========================================
    // Boss AI
    // =========================================

    bossAI(
        boss,
        deltaTime
    ) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        const dx =
            player.x - boss.x;

        const distance =
            Math.abs(dx);

        // =====================================
        // Direction
        // =====================================

        boss.direction =
            dx > 0 ? 1 : -1;

        // =====================================
        // Movement
        // =====================================

        if (
            distance > 200
        ) {

            boss.velocityX =

                boss.direction *
                boss.speed;
        }

        else {

            boss.velocityX *= 0.9;
        }

        // =====================================
        // Berserk Speed
        // =====================================

        if (
            boss.berserk
        ) {

            boss.velocityX *= 1.5;
        }
    }

    // =========================================
    // Phase Changes
    // =========================================

    checkPhaseChange(boss) {

        const hpPercent =

            boss.health /
            boss.maxHealth;

        // =====================================
        // Phase 2
        // =====================================

        if (

            hpPercent <= 0.66 &&

            boss.phase === 1
        ) {

            boss.phase = 2;

            this.phaseTransition(
                boss
            );
        }

        // =====================================
        // Phase 3
        // =====================================

        if (

            hpPercent <= 0.33 &&

            boss.phase === 2
        ) {

            boss.phase = 3;

            boss.berserk = true;

            this.phaseTransition(
                boss
            );
        }
    }

    // =========================================
    // Phase Transition
    // =========================================

    phaseTransition(boss) {

        // =====================================
        // Heal Slightly
        // =====================================

        boss.health +=
            boss.maxHealth * 0.1;

        if (
            boss.health >
            boss.maxHealth
        ) {

            boss.health =
                boss.maxHealth;
        }

        // =====================================
        // Buff Stats
        // =====================================

        boss.damage *= 1.25;

        boss.speed *= 1.15;

        // =====================================
        // Effects
        // =====================================

        this.game.effects
            ?.shakeScreen(
                20,
                0.8
            );

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `${boss.name} Entered Phase ${boss.phase}!`,

                "danger"
            );

        // =====================================
        // Explosion Particles
        // =====================================

        for (
            let i = 0;
            i < 60;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        boss.x +
                        boss.width / 2,

                    y:
                        boss.y -
                        boss.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 25,

                    velocityY:
                        (Math.random() - 0.5) * 25,

                    size:
                        Math.random() * 12 + 3,

                    color:
                        boss.color,

                    life: 1.5
                });
        }
    }

    // =========================================
    // Status Effects
    // =========================================

    updateStatusEffects(
        boss,
        deltaTime
    ) {

        // =====================================
        // Burn
        // =====================================

        if (
            boss.burning > 0
        ) {

            boss.burning -=
                deltaTime;

            boss.health -=
                5 * deltaTime;
        }

        // =====================================
        // Poison
        // =====================================

        if (
            boss.poisoned > 0
        ) {

            boss.poisoned -=
                deltaTime;

            boss.health -=
                3 * deltaTime;
        }

        // =====================================
        // Slow
        // =====================================

        if (
            boss.slowed > 0
        ) {

            boss.slowed -=
                deltaTime;
        }

        // =====================================
        // Stun Resistance
        // =====================================

        if (
            boss.stunned > 0
        ) {

            boss.stunned -=
                deltaTime * 2;
        }
    }

    // =========================================
    // Kill Boss
    // =========================================

    killBoss(boss) {

        if (
            boss.dead
        ) {

            return;
        }

        boss.dead = true;

        // =====================================
        // Rewards
        // =====================================

        this.giveBossRewards(
            boss
        );

        // =====================================
        // Effects
        // =====================================

        this.bossDeathEffects(
            boss
        );

        // =====================================
        // Victory Music
        // =====================================

        this.game.music
            ?.playTrack(
                "victory_theme"
            );

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `${boss.name} Defeated!`,

                "legendary"
            );

        // =====================================
        // Unlock Floor
        // =====================================

        this.game.currentFloor++;

        // =====================================
        // Save Progress
        // =====================================

        this.game.save
            ?.autoSave?.();
    }

    // =========================================
    // Rewards
    // =========================================

    giveBossRewards(boss) {

        const rewards =
            boss.rewards;

        // =====================================
        // XP
        // =====================================

        this.game.leveling
            ?.addExperience(

                rewards.xp
            );

        // =====================================
        // Gold
        // =====================================

        this.game.inventory
            ?.addGold(

                rewards.gold
            );

        // =====================================
        // Items
        // =====================================

        for (
            const item of rewards.items
        ) {

            this.game.inventory
                ?.addItem(item);
        }
    }

    // =========================================
    // Death Effects
    // =========================================

    bossDeathEffects(boss) {

        this.game.effects
            ?.shakeScreen(
                40,
                2
            );

        for (
            let i = 0;
            i < 200;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        boss.x +
                        boss.width / 2,

                    y:
                        boss.y -
                        boss.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 40,

                    velocityY:
                        (Math.random() - 0.5) * 40,

                    size:
                        Math.random() * 16 + 4,

                    color:
                        boss.color,

                    life: 3
                });
        }
    }

    // =========================================
    // Cleanup
    // =========================================

    cleanupBosses() {

        this.activeBosses =
            this.activeBosses.filter(

                boss => !boss.dead
            );
    }

    // =========================================
    // Draw Bosses
    // =========================================

    draw(ctx) {

        for (
            const boss of this.activeBosses
        ) {

            this.drawBoss(
                ctx,
                boss
            );

            this.patterns.drawBossUI(
                ctx,
                boss
            );
        }
    }

    // =========================================
    // Draw Boss
    // =========================================

    drawBoss(
        ctx,
        boss
    ) {

        // =====================================
        // Glow
        // =====================================

        ctx.shadowBlur = 25;

        ctx.shadowColor =
            boss.color;

        // =====================================
        // Boss Body
        // =====================================

        ctx.fillStyle =
            boss.color;

        ctx.fillRect(

            boss.x,

            boss.y -
            boss.height,

            boss.width,

            boss.height
        );

        // =====================================
        // Reset Glow
        // =====================================

        ctx.shadowBlur = 0;

        // =====================================
        // Boss Border
        // =====================================

        ctx.strokeStyle =
            "#ffcc44";

        ctx.lineWidth = 5;

        ctx.strokeRect(

            boss.x,

            boss.y -
            boss.height,

            boss.width,

            boss.height
        );

        // =====================================
        // Name
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "24px Arial";

        ctx.fillText(

            boss.name,

            boss.x,

            boss.y -
            boss.height - 25
        );

        // =====================================
        // Crown Icon
        // =====================================

        ctx.font =
            "28px Arial";

        ctx.fillText(

            "👑",

            boss.x +
            boss.width - 30,

            boss.y -
            boss.height - 25
        );
    }

    // =========================================
    // Get Active Boss
    // =========================================

    getCurrentBoss() {

        return this.activeBosses[0] || null;
    }

    // =========================================
    // Is Boss Active
    // =========================================

    isBossFightActive() {

        return this.activeBosses.length > 0;
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            activeBosses:
                this.activeBosses
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

        this.activeBosses =
            data.activeBosses || [];
    }
}