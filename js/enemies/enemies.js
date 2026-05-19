// =========================================
// Ultimate Tower RPG - enemies.js
// =========================================

// =========================================
// Enemy Definitions & Factory
// =========================================

export class EnemyFactory {

    constructor(game) {

        this.game = game;

        // =====================================
        // Enemy Registry
        // =====================================

        this.enemyData = {

            // =================================
            // Goblin
            // =================================

            goblin: {

                id: "goblin",

                name: "Goblin",

                type: "ground",

                rarity: "common",

                width: 40,

                height: 60,

                color: "#44aa44",

                stats: {

                    health: 50,

                    damage: 8,

                    defense: 2,

                    speed: 2.2,

                    critChance: 2
                },

                xpReward: 20,

                goldReward: 10,

                behavior: "aggressive",

                abilities: [

                    "slash"
                ],

                lootTable: "goblin",

                sounds: {

                    hurt: "goblin_hurt",

                    death: "goblin_death",

                    attack: "goblin_attack"
                }
            },

            // =================================
            // Skeleton
            // =================================

            skeleton: {

                id: "skeleton",

                name: "Skeleton",

                type: "undead",

                rarity: "common",

                width: 42,

                height: 64,

                color: "#dddddd",

                stats: {

                    health: 70,

                    damage: 12,

                    defense: 5,

                    speed: 1.6,

                    critChance: 4
                },

                xpReward: 35,

                goldReward: 18,

                behavior: "balanced",

                abilities: [

                    "bone_throw",

                    "shield_block"
                ],

                lootTable: "skeleton"
            },

            // =================================
            // Slime
            // =================================

            slime: {

                id: "slime",

                name: "Green Slime",

                type: "slime",

                rarity: "common",

                width: 50,

                height: 35,

                color: "#33ff77",

                stats: {

                    health: 45,

                    damage: 6,

                    defense: 1,

                    speed: 1.1,

                    critChance: 0
                },

                xpReward: 15,

                goldReward: 8,

                behavior: "passive",

                abilities: [

                    "split"
                ],

                lootTable: "slime"
            },

            // =================================
            // Assassin
            // =================================

            assassin: {

                id: "assassin",

                name: "Shadow Assassin",

                type: "human",

                rarity: "rare",

                width: 36,

                height: 62,

                color: "#222222",

                stats: {

                    health: 80,

                    damage: 24,

                    defense: 3,

                    speed: 4.5,

                    critChance: 20
                },

                xpReward: 90,

                goldReward: 55,

                behavior: "aggressive",

                abilities: [

                    "dash_attack",

                    "stealth",

                    "critical_strike"
                ],

                lootTable: "assassin"
            },

            // =================================
            // Mage
            // =================================

            mage: {

                id: "mage",

                name: "Dark Mage",

                type: "caster",

                rarity: "rare",

                width: 40,

                height: 70,

                color: "#8844ff",

                ranged: true,

                stats: {

                    health: 60,

                    damage: 20,

                    defense: 2,

                    speed: 1.3,

                    critChance: 8,

                    mana: 100
                },

                xpReward: 75,

                goldReward: 45,

                behavior: "defensive",

                abilities: [

                    "fireball",

                    "teleport",

                    "magic_barrier"
                ],

                lootTable: "mage"
            },

            // =================================
            // Brute
            // =================================

            brute: {

                id: "brute",

                name: "Tower Brute",

                type: "tank",

                rarity: "elite",

                width: 72,

                height: 100,

                color: "#aa5522",

                stats: {

                    health: 250,

                    damage: 28,

                    defense: 18,

                    speed: 0.8,

                    critChance: 1
                },

                xpReward: 160,

                goldReward: 100,

                behavior: "aggressive",

                abilities: [

                    "ground_slam",

                    "rage",

                    "charge"
                ],

                lootTable: "brute"
            },

            // =================================
            // Ice Golem
            // =================================

            iceGolem: {

                id: "iceGolem",

                name: "Ice Golem",

                type: "elemental",

                rarity: "epic",

                width: 90,

                height: 120,

                color: "#88ddff",

                element: "ice",

                stats: {

                    health: 500,

                    damage: 35,

                    defense: 30,

                    speed: 0.7,

                    critChance: 0
                },

                xpReward: 400,

                goldReward: 250,

                behavior: "defensive",

                abilities: [

                    "ice_wave",

                    "freeze",

                    "ice_armor"
                ],

                lootTable: "iceGolem"
            },

            // =================================
            // Dragon
            // =================================

            dragon: {

                id: "dragon",

                name: "Ancient Dragon",

                type: "boss",

                rarity: "legendary",

                boss: true,

                width: 180,

                height: 140,

                color: "#ff5522",

                element: "fire",

                flying: true,

                stats: {

                    health: 3000,

                    damage: 65,

                    defense: 40,

                    speed: 2,

                    critChance: 15
                },

                xpReward: 3000,

                goldReward: 5000,

                behavior: "boss",

                abilities: [

                    "fire_breath",

                    "meteor",

                    "tail_whip",

                    "wing_blast",

                    "summon_fire"
                ],

                lootTable: "dragon"
            }
        };
    }

    // =========================================
    // Create Enemy
    // =========================================

    createEnemy(
        type,
        x = 0,
        y = 0,
        level = 1
    ) {

        const data =
            this.enemyData[type];

        if (
            !data
        ) {

            console.warn(
                `Enemy type '${type}' not found`
            );

            return null;
        }

        // =====================================
        // Level Scaling
        // =====================================

        const scale =

            1 +

            ((level - 1) * 0.12);

        // =====================================
        // Enemy Object
        // =====================================

        const enemy = {

            // =================================
            // Identity
            // =================================

            id:
                `${type}_${Date.now()}_${Math.random()}`,

            type,

            name:
                data.name,

            rarity:
                data.rarity,

            boss:
                data.boss || false,

            // =================================
            // Position
            // =================================

            x,

            y,

            spawnX: x,

            spawnY: y,

            width:
                data.width,

            height:
                data.height,

            // =================================
            // Physics
            // =================================

            velocityX: 0,

            velocityY: 0,

            grounded: false,

            flying:
                data.flying || false,

            direction: -1,

            // =================================
            // Visuals
            // =================================

            color:
                data.color,

            opacity: 1,

            rotation: 0,

            scale: 1,

            hitFlash: 0,

            // =================================
            // Stats
            // =================================

            level,

            health:
                Math.floor(
                    data.stats.health * scale
                ),

            maxHealth:
                Math.floor(
                    data.stats.health * scale
                ),

            damage:
                Math.floor(
                    data.stats.damage * scale
                ),

            defense:
                Math.floor(
                    data.stats.defense * scale
                ),

            speed:
                data.stats.speed,

            critChance:
                data.stats.critChance,

            mana:
                data.stats.mana || 0,

            maxMana:
                data.stats.mana || 0,

            // =================================
            // Rewards
            // =================================

            xpReward:
                Math.floor(
                    data.xpReward * scale
                ),

            goldReward:
                Math.floor(
                    data.goldReward * scale
                ),

            // =================================
            // AI
            // =================================

            behavior:
                data.behavior,

            aiState: "idle",

            target: null,

            patrolDirection: -1,

            patrolTimer: 0,

            attackCooldown: 0,

            // =================================
            // Combat
            // =================================

            abilities:
                [...data.abilities],

            ranged:
                data.ranged || false,

            element:
                data.element || null,

            invincible: false,

            dead: false,

            // =================================
            // Status Effects
            // =================================

            burning: 0,

            poisoned: 0,

            frozen: 0,

            stunned: 0,

            slowed: 0,

            bleeding: 0,

            // =================================
            // Loot
            // =================================

            lootTable:
                data.lootTable,

            // =================================
            // Animation
            // =================================

            animationState: "idle",

            animationFrame: 0,

            animationTimer: 0,

            // =================================
            // Sounds
            // =================================

            sounds:
                data.sounds || {},

            // =================================
            // Custom Data
            // =================================

            customData: {}
        };

        // =====================================
        // Boss Initialization
        // =====================================

        if (
            enemy.boss
        ) {

            enemy.phase = 1;

            enemy.specialCooldown = 5;

            enemy.enraged = false;
        }

        return enemy;
    }

    // =========================================
    // Spawn Enemy
    // =========================================

    spawnEnemy(
        type,
        x,
        y,
        level = 1
    ) {

        const enemy =
            this.createEnemy(
                type,
                x,
                y,
                level
            );

        if (
            !enemy
        ) {

            return null;
        }

        // =====================================
        // Add To Game
        // =====================================

        if (
            !this.game.enemies
        ) {

            this.game.enemies = [];
        }

        this.game.enemies.push(enemy);

        // =====================================
        // Spawn Effect
        // =====================================

        this.createSpawnEffect(enemy);

        return enemy;
    }

    // =========================================
    // Spawn Wave
    // =========================================

    spawnWave(
        enemyTypes,
        count,
        level
    ) {

        const spawned = [];

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const type =

                enemyTypes[
                    Math.floor(
                        Math.random() *
                        enemyTypes.length
                    )
                ];

            const x =
                200 +
                Math.random() * 1400;

            const y =
                this.game.groundLevel;

            const enemy =
                this.spawnEnemy(
                    type,
                    x,
                    y,
                    level
                );

            if (
                enemy
            ) {

                spawned.push(enemy);
            }
        }

        return spawned;
    }

    // =========================================
    // Boss Spawn
    // =========================================

    spawnBoss(
        type,
        level = 10
    ) {

        const boss =
            this.spawnEnemy(

                type,

                this.game.worldWidth / 2,

                this.game.groundLevel,

                level
            );

        if (
            !boss
        ) {

            return null;
        }

        // =====================================
        // Boss Intro
        // =====================================

        this.game.ui
            ?.addNotification(

                `BOSS: ${boss.name}`,

                "legendary"
            );

        this.game.effects
            ?.shakeScreen(
                20,
                1
            );

        // =====================================
        // Music
        // =====================================

        this.game.music
            ?.playTrack(
                "boss_theme"
            );

        return boss;
    }

    // =========================================
    // Elite Modifier
    // =========================================

    makeElite(enemy) {

        enemy.rarity = "elite";

        enemy.color = "#ffcc44";

        enemy.maxHealth *= 2;

        enemy.health =
            enemy.maxHealth;

        enemy.damage *= 1.5;

        enemy.defense *= 1.5;

        enemy.speed *= 1.2;

        enemy.xpReward *= 3;

        enemy.goldReward *= 4;

        enemy.elite = true;

        enemy.abilities.push(
            "elite_burst"
        );

        return enemy;
    }

    // =========================================
    // Apply Status Effect
    // =========================================

    applyStatusEffect(
        enemy,
        effect,
        duration
    ) {

        switch (
            effect
        ) {

            case "burn":

                enemy.burning =
                    duration;

                break;

            case "poison":

                enemy.poisoned =
                    duration;

                break;

            case "freeze":

                enemy.frozen =
                    duration;

                break;

            case "stun":

                enemy.stunned =
                    duration;

                break;

            case "slow":

                enemy.slowed =
                    duration;

                break;

            case "bleed":

                enemy.bleeding =
                    duration;

                break;
        }

        // =====================================
        // Effect Text
        // =====================================

        this.game.combat
            ?.showText(

                effect.toUpperCase(),

                enemy.x,

                enemy.y - 40,

                "#ff8844"
            );
    }

    // =========================================
    // Update Status Effects
    // =========================================

    updateStatusEffects(
        enemy,
        deltaTime
    ) {

        // =====================================
        // Burn
        // =====================================

        if (
            enemy.burning > 0
        ) {

            enemy.burning -=
                deltaTime;

            enemy.health -=
                6 * deltaTime;

            this.createBurnParticles(
                enemy
            );
        }

        // =====================================
        // Poison
        // =====================================

        if (
            enemy.poisoned > 0
        ) {

            enemy.poisoned -=
                deltaTime;

            enemy.health -=
                4 * deltaTime;
        }

        // =====================================
        // Frozen
        // =====================================

        if (
            enemy.frozen > 0
        ) {

            enemy.frozen -=
                deltaTime;

            enemy.velocityX *= 0.8;
        }

        // =====================================
        // Bleeding
        // =====================================

        if (
            enemy.bleeding > 0
        ) {

            enemy.bleeding -=
                deltaTime;

            enemy.health -=
                8 * deltaTime;
        }

        // =====================================
        // Death
        // =====================================

        if (
            enemy.health <= 0
        ) {

            this.killEnemy(enemy);
        }
    }

    // =========================================
    // Kill Enemy
    // =========================================

    killEnemy(enemy) {

        if (
            enemy.dead
        ) {

            return;
        }

        enemy.dead = true;

        // =====================================
        // Rewards
        // =====================================

        this.game.leveling
            ?.addExperience(

                enemy.xpReward
            );

        this.game.inventory
            ?.addGold(

                enemy.goldReward
            );

        // =====================================
        // Loot
        // =====================================

        this.game.loot
            ?.dropLoot(enemy);

        // =====================================
        // Effects
        // =====================================

        this.createDeathEffect(
            enemy
        );

        // =====================================
        // Sound
        // =====================================

        if (
            enemy.sounds.death
        ) {

            this.game.sound
                ?.play(
                    enemy.sounds.death
                );
        }

        // =====================================
        // Boss Death
        // =====================================

        if (
            enemy.boss
        ) {

            this.game.music
                ?.playTrack(
                    "victory_theme"
                );

            this.game.ui
                ?.addNotification(

                    `${enemy.name} Defeated!`,

                    "legendary"
                );
        }
    }

    // =========================================
    // Spawn Effect
    // =========================================

    createSpawnEffect(enemy) {

        for (
            let i = 0;
            i < 15;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        enemy.x +
                        enemy.width / 2,

                    y:
                        enemy.y -
                        enemy.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 10,

                    velocityY:
                        (Math.random() - 0.5) * 10,

                    size:
                        Math.random() * 6 + 2,

                    color:
                        enemy.color,

                    life: 0.8
                });
        }
    }

    // =========================================
    // Burn Particles
    // =========================================

    createBurnParticles(enemy) {

        if (
            Math.random() < 0.2
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        enemy.x +
                        Math.random() *
                        enemy.width,

                    y:
                        enemy.y -
                        Math.random() *
                        enemy.height,

                    velocityX:
                        (Math.random() - 0.5) * 2,

                    velocityY:
                        -2,

                    size:
                        Math.random() * 5 + 2,

                    color: "#ff6622",

                    life: 0.5
                });
        }
    }

    // =========================================
    // Death Effect
    // =========================================

    createDeathEffect(enemy) {

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        enemy.x +
                        enemy.width / 2,

                    y:
                        enemy.y -
                        enemy.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 15,

                    velocityY:
                        (Math.random() - 0.5) * 15,

                    size:
                        Math.random() * 8 + 2,

                    color:
                        enemy.color,

                    life: 1.2
                });
        }
    }

    // =========================================
    // Get Enemy Data
    // =========================================

    getEnemyData(type) {

        return this.enemyData[type];
    }

    // =========================================
    // Get All Enemy Types
    // =========================================

    getAllEnemyTypes() {

        return Object.keys(
            this.enemyData
        );
    }

    // =========================================
    // Draw Enemy
    // =========================================

    drawEnemy(ctx, enemy) {

        // =====================================
        // Flash
        // =====================================

        ctx.fillStyle =

            enemy.hitFlash > 0
            ? "#ffffff"
            : enemy.color;

        // =====================================
        // Body
        // =====================================

        ctx.fillRect(

            enemy.x,

            enemy.y -
            enemy.height,

            enemy.width,

            enemy.height
        );

        // =====================================
        // Boss Outline
        // =====================================

        if (
            enemy.boss
        ) {

            ctx.strokeStyle =
                "#ffcc44";

            ctx.lineWidth = 4;

            ctx.strokeRect(

                enemy.x,

                enemy.y -
                enemy.height,

                enemy.width,

                enemy.height
            );
        }

        // =====================================
        // Health Bar
        // =====================================

        const hpPercent =

            enemy.health /
            enemy.maxHealth;

        ctx.fillStyle =
            "#222222";

        ctx.fillRect(

            enemy.x,

            enemy.y -
            enemy.height - 14,

            enemy.width,

            8
        );

        ctx.fillStyle =
            "#44ff44";

        ctx.fillRect(

            enemy.x,

            enemy.y -
            enemy.height - 14,

            enemy.width *
            hpPercent,

            8
        );

        // =====================================
        // Name
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "12px Arial";

        ctx.fillText(

            `Lv.${enemy.level} ${enemy.name}`,

            enemy.x,

            enemy.y -
            enemy.height - 22
        );
    }
}