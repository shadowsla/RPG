// =========================================
// Ultimate Tower RPG - enemySpawner.js
// =========================================

// =========================================
// Enemy Spawner System
// =========================================

export class EnemySpawner {

    constructor(game) {

        this.game = game;

        // =====================================
        // Enemy Lists
        // =====================================

        this.enemies = [];

        this.bosses = [];

        // =====================================
        // Spawn Settings
        // =====================================

        this.spawnTimer = 0;

        this.spawnInterval = 3;

        this.maxEnemies = 40;

        // =====================================
        // Difficulty Scaling
        // =====================================

        this.enemyLevel = 1;

        this.difficultyMultiplier = 1;

        this.wave = 1;

        // =====================================
        // Endless Mode
        // =====================================

        this.endlessMode = false;

        // =====================================
        // Hardcore
        // =====================================

        this.hardcoreMode = false;

        // =====================================
        // Spawn Areas
        // =====================================

        this.spawnPoints = [

            { x: 100, y: 400 },

            { x: 700, y: 400 },

            { x: 1200, y: 400 },

            { x: 1700, y: 400 }
        ];

        // =====================================
        // Enemy Types
        // =====================================

        this.enemyTypes = {

            goblin: {

                name: "Goblin",

                health: 40,

                damage: 8,

                speed: 2,

                defense: 2,

                xpReward: 20,

                lootTable: "goblin",

                color: "#44aa44",

                width: 40,

                height: 60
            },

            skeleton: {

                name: "Skeleton",

                health: 65,

                damage: 12,

                speed: 1.5,

                defense: 5,

                xpReward: 35,

                lootTable: "skeleton",

                color: "#dddddd",

                width: 42,

                height: 64
            },

            mage: {

                name: "Dark Mage",

                health: 50,

                damage: 18,

                speed: 1.2,

                defense: 3,

                xpReward: 50,

                ranged: true,

                color: "#8844ff",

                width: 40,

                height: 68
            },

            brute: {

                name: "Brute",

                health: 180,

                damage: 25,

                speed: 0.8,

                defense: 15,

                xpReward: 90,

                color: "#aa5522",

                width: 70,

                height: 90
            },

            assassin: {

                name: "Assassin",

                health: 55,

                damage: 22,

                speed: 4,

                defense: 2,

                critChance: 20,

                xpReward: 75,

                color: "#222222",

                width: 36,

                height: 62
            },

            dragon: {

                name: "Ancient Dragon",

                health: 1500,

                damage: 55,

                speed: 1.5,

                defense: 30,

                boss: true,

                xpReward: 1000,

                lootTable: "dragon",

                color: "#ff5522",

                width: 180,

                height: 140
            },

            cursedKnight: {

                name: "Cursed Knight",

                health: 500,

                damage: 35,

                speed: 1.2,

                defense: 20,

                xpReward: 300,

                color: "#662222",

                width: 80,

                height: 100
            }
        };

        // =====================================
        // Random Events
        // =====================================

        this.randomEvents = [

            "elite_wave",

            "curse_wave",

            "gold_rush",

            "boss_invasion",

            "meteor_shower"
        ];

        // =====================================
        // Event Timer
        // =====================================

        this.eventTimer = 60;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Spawning
        // =====================================

        this.spawnTimer += deltaTime;

        if (

            this.spawnTimer >=
            this.spawnInterval &&

            this.enemies.length <
            this.maxEnemies
        ) {

            this.spawnEnemy();

            this.spawnTimer = 0;
        }

        // =====================================
        // Update Enemies
        // =====================================

        this.updateEnemies(deltaTime);

        // =====================================
        // Cleanup
        // =====================================

        this.cleanupEnemies();

        // =====================================
        // Random Events
        // =====================================

        this.updateEvents(deltaTime);

        // =====================================
        // Wave Scaling
        // =====================================

        this.updateDifficulty();
    }

    // =========================================
    // Spawn Enemy
    // =========================================

    spawnEnemy(type = null) {

        // =====================================
        // Random Type
        // =====================================

        if (
            !type
        ) {

            type =
                this.chooseEnemyType();
        }

        const template =
            this.enemyTypes[type];

        if (
            !template
        ) {

            return;
        }

        // =====================================
        // Spawn Point
        // =====================================

        const point =

            this.spawnPoints[
                Math.floor(
                    Math.random() *
                    this.spawnPoints.length
                )
            ];

        // =====================================
        // Level Scaling
        // =====================================

        const level =
            this.enemyLevel;

        const multiplier =

            this.difficultyMultiplier;

        // =====================================
        // Enemy Object
        // =====================================

        const enemy = {

            id:
                `${type}_${Date.now()}_${Math.random()}`,

            type,

            name:
                template.name,

            x:
                point.x,

            y:
                point.y,

            width:
                template.width,

            height:
                template.height,

            color:
                template.color,

            level,

            health:
                Math.floor(
                    template.health *
                    multiplier
                ),

            maxHealth:
                Math.floor(
                    template.health *
                    multiplier
                ),

            damage:
                Math.floor(
                    template.damage *
                    multiplier
                ),

            defense:
                Math.floor(
                    template.defense *
                    multiplier
                ),

            speed:
                template.speed,

            velocityX: 0,

            velocityY: 0,

            grounded: true,

            direction: -1,

            ranged:
                template.ranged || false,

            boss:
                template.boss || false,

            xpReward:
                Math.floor(
                    template.xpReward *
                    multiplier
                ),

            critChance:
                template.critChance || 0,

            lootTable:
                template.lootTable || "goblin",

            attackCooldown: 0,

            dead: false,

            hitFlash: 0,

            stunned: 0,

            burning: 0,

            poisoned: 0,

            slowed: 0
        };

        // =====================================
        // Boss Effects
        // =====================================

        if (
            enemy.boss
        ) {

            enemy.phase = 1;

            enemy.specialAttackTimer = 5;

            this.bosses.push(enemy);

            this.game.ui
                ?.addNotification(

                    `${enemy.name} Appeared!`,

                    "legendary"
                );

            this.game.effects
                ?.shakeScreen(
                    15,
                    0.5
                );
        }

        // =====================================
        // Add Enemy
        // =====================================

        this.enemies.push(enemy);

        this.game.enemies =
            this.enemies;
    }

    // =========================================
    // Enemy Type Selection
    // =========================================

    chooseEnemyType() {

        const floor =
            this.game.currentFloor || 1;

        // =====================================
        // Early Floors
        // =====================================

        if (
            floor < 3
        ) {

            return Math.random() < 0.7
                ? "goblin"
                : "skeleton";
        }

        // =====================================
        // Mid Floors
        // =====================================

        if (
            floor < 8
        ) {

            const pool = [

                "goblin",

                "skeleton",

                "mage",

                "assassin"
            ];

            return pool[
                Math.floor(
                    Math.random() *
                    pool.length
                )
            ];
        }

        // =====================================
        // Higher Floors
        // =====================================

        const highPool = [

            "skeleton",

            "mage",

            "assassin",

            "brute",

            "cursedKnight"
        ];

        return highPool[
            Math.floor(
                Math.random() *
                highPool.length
            )
        ];
    }

    // =========================================
    // Update Enemies
    // =========================================

    updateEnemies(deltaTime) {

        const player =
            this.game.player;

        for (
            const enemy of
            this.enemies
        ) {

            if (
                enemy.dead
            ) {

                continue;
            }

            // =================================
            // Hit Flash
            // =================================

            if (
                enemy.hitFlash > 0
            ) {

                enemy.hitFlash -=
                    deltaTime;
            }

            // =================================
            // Status Effects
            // =================================

            this.updateStatusEffects(
                enemy,
                deltaTime
            );

            // =================================
            // Stunned
            // =================================

            if (
                enemy.stunned > 0
            ) {

                enemy.stunned -=
                    deltaTime;

                continue;
            }

            // =================================
            // AI
            // =================================

            this.enemyAI(
                enemy,
                player,
                deltaTime
            );

            // =================================
            // Gravity
            // =================================

            enemy.velocityY +=
                0.5;

            enemy.x +=
                enemy.velocityX;

            enemy.y +=
                enemy.velocityY;

            // =================================
            // Ground
            // =================================

            if (
                enemy.y >
                this.game.groundLevel
            ) {

                enemy.y =
                    this.game.groundLevel;

                enemy.velocityY = 0;

                enemy.grounded = true;
            }

            // =================================
            // Attack Cooldown
            // =================================

            if (
                enemy.attackCooldown > 0
            ) {

                enemy.attackCooldown -=
                    deltaTime;
            }

            // =================================
            // Boss AI
            // =================================

            if (
                enemy.boss
            ) {

                this.updateBoss(
                    enemy,
                    deltaTime
                );
            }
        }
    }

    // =========================================
    // Enemy AI
    // =========================================

    enemyAI(
        enemy,
        player,
        deltaTime
    ) {

        if (
            !player
        ) {

            return;
        }

        const dx =
            player.x - enemy.x;

        const distance =
            Math.abs(dx);

        // =====================================
        // Direction
        // =====================================

        enemy.direction =
            dx > 0 ? 1 : -1;

        // =====================================
        // Movement
        // =====================================

        if (
            distance > 80
        ) {

            let moveSpeed =
                enemy.speed;

            // Slow
            if (
                enemy.slowed > 0
            ) {

                moveSpeed *= 0.5;
            }

            enemy.velocityX =

                enemy.direction *
                moveSpeed;
        }

        else {

            enemy.velocityX = 0;

            // =================================
            // Attack
            // =================================

            this.enemyAttack(
                enemy,
                player
            );
        }

        // =====================================
        // Jump Obstacles
        // =====================================

        if (
            Math.random() < 0.002 &&
            enemy.grounded
        ) {

            enemy.velocityY = -10;

            enemy.grounded = false;
        }
    }

    // =========================================
    // Enemy Attack
    // =========================================

    enemyAttack(
        enemy,
        player
    ) {

        if (
            enemy.attackCooldown > 0
        ) {

            return;
        }

        enemy.attackCooldown = 1.2;

        // =====================================
        // Parry Check
        // =====================================

        if (

            this.game.combat
                ?.parryTimer > 0
        ) {

            this.game.combat
                ?.successfulParry(enemy);

            return;
        }

        // =====================================
        // Damage
        // =====================================

        const damage =
            enemy.damage;

        // =====================================
        // Invincible
        // =====================================

        if (
            player.invincible
        ) {

            return;
        }

        player.health -=
            damage;

        // =====================================
        // Knockback
        // =====================================

        player.velocityX =
            enemy.direction * 10;

        player.velocityY = -5;

        // =====================================
        // Hit Effect
        // =====================================

        this.game.combat
            ?.showDamageNumber(

                damage,

                player.x,

                player.y,

                false
            );

        this.game.effects
            ?.shakeScreen(
                5,
                0.15
            );

        // =====================================
        // Death
        // =====================================

        if (
            player.health <= 0
        ) {

            this.playerDeath();
        }
    }

    // =========================================
    // Boss Logic
    // =========================================

    updateBoss(
        boss,
        deltaTime
    ) {

        // =====================================
        // Phases
        // =====================================

        const healthPercent =

            boss.health /
            boss.maxHealth;

        if (
            healthPercent < 0.5 &&
            boss.phase === 1
        ) {

            boss.phase = 2;

            boss.damage *= 1.5;

            boss.speed *= 1.3;

            this.game.ui
                ?.addNotification(

                    `${boss.name} ENRAGED!`,

                    "danger"
                );
        }

        // =====================================
        // Special Attack
        // =====================================

        boss.specialAttackTimer -=
            deltaTime;

        if (
            boss.specialAttackTimer <= 0
        ) {

            this.bossSpecialAttack(
                boss
            );

            boss.specialAttackTimer =

                boss.phase === 1
                ? 6
                : 3;
        }
    }

    // =========================================
    // Boss Special
    // =========================================

    bossSpecialAttack(boss) {

        // =====================================
        // Fireballs
        // =====================================

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            this.game.projectiles
                ?.push({

                    x:
                        boss.x +
                        boss.width / 2,

                    y:
                        boss.y +
                        boss.height / 2,

                    velocityX:
                        Math.cos(
                            (Math.PI * 2 / 8) * i
                        ) * 8,

                    velocityY:
                        Math.sin(
                            (Math.PI * 2 / 8) * i
                        ) * 8,

                    damage:
                        boss.damage,

                    element: "fire",

                    enemy: true
                });
        }

        this.game.effects
            ?.shakeScreen(
                12,
                0.3
            );
    }

    // =========================================
    // Status Effects
    // =========================================

    updateStatusEffects(
        enemy,
        deltaTime
    ) {

        // =====================================
        // Burning
        // =====================================

        if (
            enemy.burning > 0
        ) {

            enemy.burning -=
                deltaTime;

            enemy.health -=
                5 * deltaTime;
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
                3 * deltaTime;
        }

        // =====================================
        // Slow
        // =====================================

        if (
            enemy.slowed > 0
        ) {

            enemy.slowed -=
                deltaTime;
        }

        // =====================================
        // Death
        // =====================================

        if (
            enemy.health <= 0
        ) {

            enemy.dead = true;

            this.game.combat
                ?.kill(enemy);
        }
    }

    // =========================================
    // Cleanup
    // =========================================

    cleanupEnemies() {

        this.enemies =
            this.enemies.filter(

                enemy => !enemy.dead
            );

        this.bosses =
            this.bosses.filter(

                boss => !boss.dead
            );

        this.game.enemies =
            this.enemies;
    }

    // =========================================
    // Difficulty Scaling
    // =========================================

    updateDifficulty() {

        const floor =
            this.game.currentFloor || 1;

        this.enemyLevel =
            floor;

        this.difficultyMultiplier =

            1 +

            (floor * 0.15);

        // =====================================
        // Endless
        // =====================================

        if (
            this.endlessMode
        ) {

            this.difficultyMultiplier +=

                this.wave * 0.05;
        }
    }

    // =========================================
    // Waves
    // =========================================

    nextWave() {

        this.wave++;

        this.maxEnemies += 2;

        if (
            this.spawnInterval > 0.5
        ) {

            this.spawnInterval -=
                0.1;
        }

        this.game.ui
            ?.addNotification(

                `Wave ${this.wave}`,

                "warning"
            );
    }

    // =========================================
    // Random Events
    // =========================================

    updateEvents(deltaTime) {

        this.eventTimer -=
            deltaTime;

        if (
            this.eventTimer <= 0
        ) {

            this.triggerRandomEvent();

            this.eventTimer =

                60 + Math.random() * 60;
        }
    }

    // =========================================
    // Trigger Event
    // =========================================

    triggerRandomEvent() {

        const event =

            this.randomEvents[
                Math.floor(
                    Math.random() *
                    this.randomEvents.length
                )
            ];

        switch (
            event
        ) {

            // =================================
            // Elite Wave
            // =================================

            case "elite_wave":

                for (
                    let i = 0;
                    i < 5;
                    i++
                ) {

                    this.spawnEnemy(
                        "brute"
                    );
                }

                break;

            // =================================
            // Boss
            // =================================

            case "boss_invasion":

                this.spawnEnemy(
                    "dragon"
                );

                break;

            // =================================
            // Gold Rush
            // =================================

            case "gold_rush":

                this.game.player.goldMultiplier = 2;

                setTimeout(() => {

                    this.game.player.goldMultiplier = 1;

                }, 30000);

                break;
        }

        this.game.ui
            ?.addNotification(

                `EVENT: ${event.replace("_", " ").toUpperCase()}`,

                "epic"
            );
    }

    // =========================================
    // Player Death
    // =========================================

    playerDeath() {

        const player =
            this.game.player;

        player.dead = true;

        // =====================================
        // Hardcore
        // =====================================

        if (
            this.hardcoreMode
        ) {

            this.game.save
                ?.deleteSave?.();

            this.game.ui
                ?.addNotification(

                    "HARDCORE SAVE DELETED",

                    "danger"
                );
        }

        // =====================================
        // Respawn
        // =====================================

        setTimeout(() => {

            player.dead = false;

            player.health =
                player.maxHealth;

            player.x = 200;

            player.y = 300;

        }, 3000);
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        for (
            const enemy of
            this.enemies
        ) {

            // =================================
            // Flash
            // =================================

            if (
                enemy.hitFlash > 0
            ) {

                ctx.fillStyle =
                    "#ffffff";
            }

            else {

                ctx.fillStyle =
                    enemy.color;
            }

            // =================================
            // Enemy Body
            // =================================

            ctx.fillRect(

                enemy.x,

                enemy.y -

                enemy.height,

                enemy.width,

                enemy.height
            );

            // =================================
            // Health Bar
            // =================================

            const barWidth =
                enemy.width;

            const healthPercent =

                enemy.health /
                enemy.maxHealth;

            ctx.fillStyle =
                "#222222";

            ctx.fillRect(

                enemy.x,

                enemy.y -
                enemy.height - 15,

                barWidth,

                6
            );

            ctx.fillStyle =
                enemy.boss
                ? "#ff2222"
                : "#44ff44";

            ctx.fillRect(

                enemy.x,

                enemy.y -
                enemy.height - 15,

                barWidth *
                healthPercent,

                6
            );

            // =================================
            // Name
            // =================================

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

            // =================================
            // Status Effects
            // =================================

            if (
                enemy.burning > 0
            ) {

                ctx.fillText(
                    "🔥",
                    enemy.x + enemy.width + 5,
                    enemy.y - 40
                );
            }

            if (
                enemy.poisoned > 0
            ) {

                ctx.fillText(
                    "☠️",
                    enemy.x + enemy.width + 5,
                    enemy.y - 20
                );
            }

            if (
                enemy.stunned > 0
            ) {

                ctx.fillText(
                    "💫",
                    enemy.x + enemy.width + 5,
                    enemy.y
                );
            }
        }

        // =====================================
        // Wave Info
        // =====================================

        ctx.fillStyle =
            "#ffaa44";

        ctx.font =
            "22px Arial";

        ctx.fillText(

            `Wave: ${this.wave}`,

            20,

            90
        );

        ctx.fillText(

            `Enemies: ${this.enemies.length}/${this.maxEnemies}`,

            20,

            120
        );
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            wave:
                this.wave,

            enemyLevel:
                this.enemyLevel,

            endlessMode:
                this.endlessMode,

            hardcoreMode:
                this.hardcoreMode
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

        this.wave =
            data.wave || 1;

        this.enemyLevel =
            data.enemyLevel || 1;

        this.endlessMode =
            data.endlessMode || false;

        this.hardcoreMode =
            data.hardcoreMode || false;
    }
}