// =========================================
// Ultimate Tower RPG - enemyAI.js
// =========================================

// =========================================
// Enemy AI System
// =========================================

export class EnemyAI {

    constructor(game) {

        this.game = game;

        // =====================================
        // Detection
        // =====================================

        this.detectionRange = 450;

        this.attackRange = 80;

        this.rangedAttackRange = 300;

        // =====================================
        // Pathfinding
        // =====================================

        this.pathUpdateInterval = 0.5;

        this.pathTimer = 0;

        // =====================================
        // AI States
        // =====================================

        this.states = {

            IDLE: "idle",

            PATROL: "patrol",

            CHASE: "chase",

            ATTACK: "attack",

            FLEE: "flee",

            STUNNED: "stunned",

            DEAD: "dead"
        };

        // =====================================
        // Personalities
        // =====================================

        this.personalities = {

            aggressive: {

                chaseMultiplier: 1.5,

                fleeHealth: 0.1,

                attackDelay: 0.8
            },

            defensive: {

                chaseMultiplier: 0.8,

                fleeHealth: 0.4,

                attackDelay: 1.5
            },

            balanced: {

                chaseMultiplier: 1,

                fleeHealth: 0.25,

                attackDelay: 1
            }
        };
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        const enemies =
            this.game.enemies || [];

        for (
            const enemy of enemies
        ) {

            if (
                enemy.dead
            ) {

                enemy.aiState =
                    this.states.DEAD;

                continue;
            }

            this.updateEnemy(
                enemy,
                deltaTime
            );
        }
    }

    // =========================================
    // Update Single Enemy
    // =========================================

    updateEnemy(
        enemy,
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
        // Initialize AI
        // =====================================

        this.initializeEnemy(enemy);

        // =====================================
        // Status Effects
        // =====================================

        if (
            enemy.stunned > 0
        ) {

            enemy.aiState =
                this.states.STUNNED;

            return;
        }

        // =====================================
        // Distance
        // =====================================

        const distance =

            Math.hypot(

                player.x - enemy.x,

                player.y - enemy.y
            );

        // =====================================
        // Low Health Flee
        // =====================================

        const healthPercent =

            enemy.health /
            enemy.maxHealth;

        const personality =

            this.personalities[
                enemy.personality
            ];

        if (
            healthPercent <
            personality.fleeHealth
        ) {

            enemy.aiState =
                this.states.FLEE;
        }

        // =====================================
        // State Selection
        // =====================================

        else if (

            distance <=
            (enemy.ranged
                ? this.rangedAttackRange
                : this.attackRange)

        ) {

            enemy.aiState =
                this.states.ATTACK;
        }

        else if (

            distance <=
            this.detectionRange *
            personality.chaseMultiplier
        ) {

            enemy.aiState =
                this.states.CHASE;
        }

        else {

            enemy.aiState =
                this.states.PATROL;
        }

        // =====================================
        // Execute State
        // =====================================

        switch (
            enemy.aiState
        ) {

            case this.states.PATROL:

                this.patrol(
                    enemy,
                    deltaTime
                );

                break;

            case this.states.CHASE:

                this.chase(
                    enemy,
                    player,
                    deltaTime
                );

                break;

            case this.states.ATTACK:

                this.attack(
                    enemy,
                    player
                );

                break;

            case this.states.FLEE:

                this.flee(
                    enemy,
                    player
                );

                break;
        }

        // =====================================
        // Obstacle Avoidance
        // =====================================

        this.avoidObstacles(enemy);

        // =====================================
        // Update Cooldowns
        // =====================================

        this.updateCooldowns(
            enemy,
            deltaTime
        );
    }

    // =========================================
    // Initialize Enemy
    // =========================================

    initializeEnemy(enemy) {

        if (
            enemy.aiInitialized
        ) {

            return;
        }

        enemy.aiInitialized = true;

        enemy.aiState =
            this.states.IDLE;

        enemy.personality =
            enemy.personality ||
            "balanced";

        enemy.patrolDirection =
            Math.random() < 0.5
            ? -1
            : 1;

        enemy.patrolTimer = 0;

        enemy.attackTimer = 0;

        enemy.path = [];

        enemy.lastSeenPlayer = null;
    }

    // =========================================
    // Patrol
    // =========================================

    patrol(
        enemy,
        deltaTime
    ) {

        enemy.patrolTimer +=
            deltaTime;

        // =====================================
        // Change Direction
        // =====================================

        if (
            enemy.patrolTimer > 3
        ) {

            enemy.patrolDirection *= -1;

            enemy.patrolTimer = 0;
        }

        // =====================================
        // Movement
        // =====================================

        enemy.velocityX =

            enemy.speed *
            0.5 *
            enemy.patrolDirection;

        enemy.direction =
            enemy.patrolDirection;

        // =====================================
        // Idle Chance
        // =====================================

        if (
            Math.random() < 0.002
        ) {

            enemy.velocityX = 0;
        }
    }

    // =========================================
    // Chase
    // =========================================

    chase(
        enemy,
        player,
        deltaTime
    ) {

        const dx =
            player.x - enemy.x;

        const dy =
            player.y - enemy.y;

        // =====================================
        // Direction
        // =====================================

        enemy.direction =
            dx > 0 ? 1 : -1;

        // =====================================
        // Speed
        // =====================================

        let speed =
            enemy.speed;

        // =====================================
        // Berserk Mode
        // =====================================

        if (
            enemy.berserk
        ) {

            speed *= 1.5;
        }

        // =====================================
        // Slowed
        // =====================================

        if (
            enemy.slowed > 0
        ) {

            speed *= 0.5;
        }

        // =====================================
        // Move
        // =====================================

        enemy.velocityX =

            enemy.direction *
            speed;

        // =====================================
        // Jump
        // =====================================

        if (

            dy < -100 &&

            enemy.grounded
        ) {

            enemy.velocityY = -12;

            enemy.grounded = false;
        }

        // =====================================
        // Store Position
        // =====================================

        enemy.lastSeenPlayer = {

            x: player.x,

            y: player.y
        };
    }

    // =========================================
    // Attack
    // =========================================

    attack(
        enemy,
        player
    ) {

        if (
            enemy.attackTimer > 0
        ) {

            enemy.velocityX = 0;

            return;
        }

        const personality =

            this.personalities[
                enemy.personality
            ];

        enemy.attackTimer =
            personality.attackDelay;

        // =====================================
        // Ranged Attack
        // =====================================

        if (
            enemy.ranged
        ) {

            this.rangedAttack(
                enemy,
                player
            );
        }

        // =====================================
        // Melee
        // =====================================

        else {

            this.meleeAttack(
                enemy,
                player
            );
        }
    }

    // =========================================
    // Melee Attack
    // =========================================

    meleeAttack(
        enemy,
        player
    ) {

        // =====================================
        // Dash Attack
        // =====================================

        if (
            enemy.type === "assassin"
        ) {

            enemy.velocityX =
                enemy.direction * 20;
        }

        // =====================================
        // Damage
        // =====================================

        if (
            this.isPlayerInRange(
                enemy,
                player,
                this.attackRange
            )
        ) {

            // =================================
            // Dodge Roll
            // =================================

            if (
                player.invincible
            ) {

                return;
            }

            // =================================
            // Parry
            // =================================

            if (

                this.game.combat
                    ?.parryTimer > 0
            ) {

                this.game.combat
                    ?.successfulParry(enemy);

                return;
            }

            // =================================
            // Apply Damage
            // =================================

            player.health -=
                enemy.damage;

            player.hitFlash = 0.2;

            // =================================
            // Knockback
            // =================================

            player.velocityX =
                enemy.direction * 12;

            player.velocityY = -4;

            // =================================
            // Effects
            // =================================

            this.game.effects
                ?.shakeScreen(
                    4,
                    0.12
                );

            this.game.combat
                ?.showDamageNumber(

                    enemy.damage,

                    player.x,

                    player.y,

                    false
                );

            // =================================
            // Crit
            // =================================

            if (
                Math.random() * 100 <
                (enemy.critChance || 0)
            ) {

                player.health -=
                    enemy.damage;

                this.game.combat
                    ?.showText(

                        "CRITICAL",

                        player.x,

                        player.y - 20,

                        "#ff4444"
                    );
            }
        }
    }

    // =========================================
    // Ranged Attack
    // =========================================

    rangedAttack(
        enemy,
        player
    ) {

        const dx =
            player.x - enemy.x;

        const dy =
            player.y - enemy.y;

        const distance =
            Math.hypot(dx, dy);

        // =====================================
        // Normalize
        // =====================================

        const dirX =
            dx / distance;

        const dirY =
            dy / distance;

        // =====================================
        // Projectile
        // =====================================

        const projectile = {

            x:
                enemy.x +
                enemy.width / 2,

            y:
                enemy.y -
                enemy.height / 2,

            velocityX:
                dirX * 10,

            velocityY:
                dirY * 10,

            width: 12,

            height: 12,

            damage:
                enemy.damage,

            enemy: true,

            color:
                "#ff4444",

            life: 5
        };

        if (
            !this.game.projectiles
        ) {

            this.game.projectiles = [];
        }

        this.game.projectiles
            .push(projectile);

        // =====================================
        // Casting Effect
        // =====================================

        this.game.effects
            ?.createEffect({

                type: "magic",

                x: projectile.x,

                y: projectile.y,

                radius: 20,

                life: 0.3
            });
    }

    // =========================================
    // Flee
    // =========================================

    flee(
        enemy,
        player
    ) {

        const dx =
            enemy.x - player.x;

        enemy.direction =
            dx > 0 ? 1 : -1;

        enemy.velocityX =

            enemy.direction *
            enemy.speed *
            1.5;

        // =====================================
        // Healing
        // =====================================

        enemy.health += 0.05;

        if (
            enemy.health >
            enemy.maxHealth
        ) {

            enemy.health =
                enemy.maxHealth;
        }
    }

    // =========================================
    // Obstacle Avoidance
    // =========================================

    avoidObstacles(enemy) {

        const platforms =
            this.game.platforms || [];

        for (
            const platform of platforms
        ) {

            // =================================
            // Wall Detection
            // =================================

            const nearWall =

                enemy.x + enemy.width >
                platform.x &&

                enemy.x <
                platform.x + platform.width &&

                enemy.y >
                platform.y - 50;

            if (
                nearWall &&
                enemy.grounded
            ) {

                enemy.velocityY = -10;

                enemy.grounded = false;
            }
        }

        // =====================================
        // Edge Detection
        // =====================================

        if (
            enemy.x < 0
        ) {

            enemy.x = 0;

            enemy.patrolDirection = 1;
        }

        if (
            enemy.x >
            this.game.worldWidth -
            enemy.width
        ) {

            enemy.x =
                this.game.worldWidth -
                enemy.width;

            enemy.patrolDirection = -1;
        }
    }

    // =========================================
    // Cooldowns
    // =========================================

    updateCooldowns(
        enemy,
        deltaTime
    ) {

        if (
            enemy.attackTimer > 0
        ) {

            enemy.attackTimer -=
                deltaTime;
        }

        if (
            enemy.specialCooldown > 0
        ) {

            enemy.specialCooldown -=
                deltaTime;
        }
    }

    // =========================================
    // Range Check
    // =========================================

    isPlayerInRange(
        enemy,
        player,
        range
    ) {

        return (

            Math.hypot(

                player.x - enemy.x,

                player.y - enemy.y
            ) <= range
        );
    }

    // =========================================
    // Group AI
    // =========================================

    alertNearbyEnemies(
        sourceEnemy,
        radius = 250
    ) {

        const enemies =
            this.game.enemies || [];

        for (
            const enemy of enemies
        ) {

            if (
                enemy === sourceEnemy
            ) {

                continue;
            }

            const distance =

                Math.hypot(

                    enemy.x -
                    sourceEnemy.x,

                    enemy.y -
                    sourceEnemy.y
                );

            if (
                distance <= radius
            ) {

                enemy.aiState =
                    this.states.CHASE;

                enemy.alerted = true;
            }
        }
    }

    // =========================================
    // Boss AI
    // =========================================

    updateBossAI(
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

        // =====================================
        // Teleport
        // =====================================

        if (
            boss.canTeleport &&
            Math.random() < 0.002
        ) {

            boss.x =
                player.x +

                (Math.random() - 0.5) *
                300;

            this.game.effects
                ?.createEffect({

                    type: "teleport",

                    x: boss.x,

                    y: boss.y,

                    radius: 40,

                    life: 0.5
                });
        }

        // =====================================
        // Summon
        // =====================================

        if (
            boss.canSummon &&
            Math.random() < 0.001
        ) {

            this.game.enemySpawner
                ?.spawnEnemy("goblin");

            this.game.enemySpawner
                ?.spawnEnemy("skeleton");
        }
    }

    // =========================================
    // Draw Debug
    // =========================================

    drawDebug(ctx) {

        if (
            !this.game.debugMode
        ) {

            return;
        }

        const enemies =
            this.game.enemies || [];

        for (
            const enemy of enemies
        ) {

            // =================================
            // Detection Range
            // =================================

            ctx.strokeStyle =
                "rgba(255,0,0,0.3)";

            ctx.beginPath();

            ctx.arc(

                enemy.x,

                enemy.y,

                this.detectionRange,

                0,

                Math.PI * 2
            );

            ctx.stroke();

            // =================================
            // State Text
            // =================================

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "12px Arial";

            ctx.fillText(

                enemy.aiState,

                enemy.x,

                enemy.y - 80
            );

            // =================================
            // Path Lines
            // =================================

            if (
                enemy.lastSeenPlayer
            ) {

                ctx.strokeStyle =
                    "#ffff00";

                ctx.beginPath();

                ctx.moveTo(
                    enemy.x,
                    enemy.y
                );

                ctx.lineTo(

                    enemy.lastSeenPlayer.x,

                    enemy.lastSeenPlayer.y
                );

                ctx.stroke();
            }
        }
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            detectionRange:
                this.detectionRange
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

        this.detectionRange =
            data.detectionRange || 450;
    }
}