// =========================================
// Ultimate Tower RPG - bossPatterns.js
// =========================================

// =========================================
// Boss Attack Pattern System
// =========================================

export class BossPatterns {

    constructor(game) {

        this.game = game;

        // =====================================
        // Boss Registry
        // =====================================

        this.bosses = {};

        // =====================================
        // Pattern Timers
        // =====================================

        this.globalCooldown = 0;

        // =====================================
        // Register Bosses
        // =====================================

        this.registerBosses();
    }

    // =========================================
    // Register Bosses
    // =========================================

    registerBosses() {

        // =====================================
        // Dragon Boss
        // =====================================

        this.bosses.dragon = {

            name: "Ancient Dragon",

            phases: [

                // =================================
                // Phase 1
                // =================================

                {

                    healthThreshold: 1,

                    patterns: [

                        "fireBreath",

                        "tailSwipe",

                        "wingBlast"
                    ],

                    cooldown: 3
                },

                // =================================
                // Phase 2
                // =================================

                {

                    healthThreshold: 0.6,

                    patterns: [

                        "meteorRain",

                        "fireBreath",

                        "summonFlames",

                        "dashAttack"
                    ],

                    cooldown: 2
                },

                // =================================
                // Phase 3
                // =================================

                {

                    healthThreshold: 0.3,

                    patterns: [

                        "inferno",

                        "meteorRain",

                        "fireStorm",

                        "berserkCombo"
                    ],

                    cooldown: 1.2
                }
            ]
        };

        // =====================================
        // Ice Titan
        // =====================================

        this.bosses.iceTitan = {

            name: "Ice Titan",

            phases: [

                {

                    healthThreshold: 1,

                    patterns: [

                        "iceSpike",

                        "frostWave",

                        "snowball"
                    ],

                    cooldown: 3
                },

                {

                    healthThreshold: 0.5,

                    patterns: [

                        "blizzard",

                        "freezeBeam",

                        "icePrison"
                    ],

                    cooldown: 1.8
                }
            ]
        };

        // =====================================
        // Shadow King
        // =====================================

        this.bosses.shadowKing = {

            name: "Shadow King",

            phases: [

                {

                    healthThreshold: 1,

                    patterns: [

                        "shadowSlash",

                        "teleportStrike",

                        "darkOrb"
                    ],

                    cooldown: 2.5
                },

                {

                    healthThreshold: 0.4,

                    patterns: [

                        "shadowClone",

                        "voidExplosion",

                        "darkRain"
                    ],

                    cooldown: 1.5
                }
            ]
        };
    }

    // =========================================
    // Update Boss
    // =========================================

    updateBoss(
        boss,
        deltaTime
    ) {

        if (
            !boss ||
            boss.dead
        ) {

            return;
        }

        // =====================================
        // Cooldowns
        // =====================================

        if (
            boss.patternCooldown > 0
        ) {

            boss.patternCooldown -=
                deltaTime;

            return;
        }

        // =====================================
        // Get Current Phase
        // =====================================

        const phase =
            this.getBossPhase(boss);

        if (
            !phase
        ) {

            return;
        }

        // =====================================
        // Choose Pattern
        // =====================================

        const pattern =

            phase.patterns[
                Math.floor(
                    Math.random() *
                    phase.patterns.length
                )
            ];

        // =====================================
        // Execute Pattern
        // =====================================

        this.executePattern(
            boss,
            pattern
        );

        // =====================================
        // Set Cooldown
        // =====================================

        boss.patternCooldown =
            phase.cooldown;
    }

    // =========================================
    // Get Boss Phase
    // =========================================

    getBossPhase(boss) {

        const data =
            this.bosses[boss.type];

        if (
            !data
        ) {

            return null;
        }

        const hpPercent =

            boss.health /
            boss.maxHealth;

        for (
            const phase of data.phases
        ) {

            if (
                hpPercent <=
                phase.healthThreshold
            ) {

                return phase;
            }
        }

        return data.phases[0];
    }

    // =========================================
    // Execute Pattern
    // =========================================

    executePattern(
        boss,
        pattern
    ) {

        switch (
            pattern
        ) {

            // =================================
            // Dragon
            // =================================

            case "fireBreath":

                this.fireBreath(boss);

                break;

            case "tailSwipe":

                this.tailSwipe(boss);

                break;

            case "wingBlast":

                this.wingBlast(boss);

                break;

            case "meteorRain":

                this.meteorRain(boss);

                break;

            case "summonFlames":

                this.summonFlames(boss);

                break;

            case "dashAttack":

                this.dashAttack(boss);

                break;

            case "inferno":

                this.inferno(boss);

                break;

            case "fireStorm":

                this.fireStorm(boss);

                break;

            case "berserkCombo":

                this.berserkCombo(boss);

                break;

            // =================================
            // Ice Titan
            // =================================

            case "iceSpike":

                this.iceSpike(boss);

                break;

            case "frostWave":

                this.frostWave(boss);

                break;

            case "snowball":

                this.snowball(boss);

                break;

            case "blizzard":

                this.blizzard(boss);

                break;

            case "freezeBeam":

                this.freezeBeam(boss);

                break;

            case "icePrison":

                this.icePrison(boss);

                break;

            // =================================
            // Shadow King
            // =================================

            case "shadowSlash":

                this.shadowSlash(boss);

                break;

            case "teleportStrike":

                this.teleportStrike(boss);

                break;

            case "darkOrb":

                this.darkOrb(boss);

                break;

            case "shadowClone":

                this.shadowClone(boss);

                break;

            case "voidExplosion":

                this.voidExplosion(boss);

                break;

            case "darkRain":

                this.darkRain(boss);

                break;
        }
    }

    // =========================================
    // FIRE BREATH
    // =========================================

    fireBreath(boss) {

        const player =
            this.game.player;

        const direction =

            player.x > boss.x
            ? 1
            : -1;

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            this.game.projectiles.push({

                x:
                    boss.x +
                    boss.width / 2,

                y:
                    boss.y - 80,

                velocityX:
                    direction * (8 + i),

                velocityY:
                    (Math.random() - 0.5) * 2,

                width: 20,

                height: 20,

                damage:
                    boss.damage * 0.7,

                element: "fire",

                enemy: true,

                life: 4,

                color: "#ff6622"
            });
        }

        this.shakeBossAttack(10);
    }

    // =========================================
    // TAIL SWIPE
    // =========================================

    tailSwipe(boss) {

        const player =
            this.game.player;

        const distance =

            Math.abs(
                player.x - boss.x
            );

        if (
            distance < 220
        ) {

            player.health -=
                boss.damage * 1.2;

            player.velocityX =
                (player.x > boss.x
                    ? 1
                    : -1) * 25;

            player.velocityY = -10;

            this.game.effects
                ?.showImpact?.(

                    player.x,

                    player.y
                );
        }

        this.shakeBossAttack(15);
    }

    // =========================================
    // WING BLAST
    // =========================================

    wingBlast(boss) {

        const player =
            this.game.player;

        const direction =

            player.x > boss.x
            ? 1
            : -1;

        player.velocityX =
            direction * 35;

        player.velocityY = -8;

        this.game.effects
            ?.createWindBurst?.(

                boss.x,

                boss.y
            );

        this.shakeBossAttack(8);
    }

    // =========================================
    // METEOR RAIN
    // =========================================

    meteorRain(boss) {

        for (
            let i = 0;
            i < 15;
            i++
        ) {

            setTimeout(() => {

                this.game.projectiles.push({

                    x:
                        Math.random() *
                        this.game.worldWidth,

                    y: -100,

                    velocityX:
                        (Math.random() - 0.5) * 3,

                    velocityY: 10,

                    width: 32,

                    height: 32,

                    damage:
                        boss.damage,

                    element: "fire",

                    enemy: true,

                    life: 10,

                    color: "#ff3300"
                });

            }, i * 200);

        }

        this.shakeBossAttack(20);
    }

    // =========================================
    // SUMMON FLAMES
    // =========================================

    summonFlames(boss) {

        for (
            let i = 0;
            i < 6;
            i++
        ) {

            this.game.enemySpawner
                ?.spawnEnemy(

                    "slime",

                    boss.x +
                    (Math.random() - 0.5) * 300,

                    boss.y
                );
        }

        this.game.ui
            ?.addNotification(

                "Flame Minions Summoned!",

                "warning"
            );
    }

    // =========================================
    // DASH ATTACK
    // =========================================

    dashAttack(boss) {

        const player =
            this.game.player;

        const direction =

            player.x > boss.x
            ? 1
            : -1;

        boss.velocityX =
            direction * 25;

        boss.velocityY = -4;

        this.game.effects
            ?.createDashTrail?.(
                boss
            );

        this.shakeBossAttack(12);
    }

    // =========================================
    // INFERNO
    // =========================================

    inferno(boss) {

        for (
            let i = 0;
            i < 50;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        Math.random() *
                        this.game.worldWidth,

                    y:
                        Math.random() *
                        this.game.canvas.height,

                    velocityX:
                        (Math.random() - 0.5) * 8,

                    velocityY:
                        Math.random() * 6,

                    size:
                        Math.random() * 12 + 4,

                    color: "#ff4400",

                    life: 2
                });
        }

        const player =
            this.game.player;

        player.health -=
            boss.damage * 2;

        this.shakeBossAttack(30);
    }

    // =========================================
    // FIRE STORM
    // =========================================

    fireStorm(boss) {

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            this.game.projectiles.push({

                x:
                    Math.random() *
                    this.game.worldWidth,

                y:
                    Math.random() *
                    300,

                velocityX:
                    (Math.random() - 0.5) * 12,

                velocityY:
                    (Math.random() - 0.5) * 12,

                width: 18,

                height: 18,

                damage:
                    boss.damage * 0.5,

                enemy: true,

                color: "#ff8800",

                life: 6
            });
        }

        this.shakeBossAttack(25);
    }

    // =========================================
    // BERSERK COMBO
    // =========================================

    berserkCombo(boss) {

        boss.enraged = true;

        boss.damage *= 1.5;

        boss.speed *= 1.5;

        this.game.ui
            ?.addNotification(

                "BOSS ENRAGED!",

                "danger"
            );

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            setTimeout(() => {

                this.dashAttack(boss);

            }, i * 400);
        }
    }

    // =========================================
    // ICE SPIKE
    // =========================================

    iceSpike(boss) {

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            this.game.projectiles.push({

                x:
                    boss.x +
                    i * 40,

                y:
                    boss.y,

                velocityX: 0,

                velocityY: -8,

                width: 24,

                height: 60,

                damage:
                    boss.damage,

                element: "ice",

                enemy: true,

                color: "#88ddff",

                life: 3
            });
        }
    }

    // =========================================
    // FROST WAVE
    // =========================================

    frostWave(boss) {

        const player =
            this.game.player;

        player.slowed = 5;

        this.game.effects
            ?.createFreezeWave?.(

                boss.x,

                boss.y
            );
    }

    // =========================================
    // SNOWBALL
    // =========================================

    snowball(boss) {

        const player =
            this.game.player;

        const dx =
            player.x - boss.x;

        const dy =
            player.y - boss.y;

        const distance =
            Math.hypot(dx, dy);

        this.game.projectiles.push({

            x:
                boss.x,

            y:
                boss.y,

            velocityX:
                (dx / distance) * 9,

            velocityY:
                (dy / distance) * 9,

            width: 26,

            height: 26,

            damage:
                boss.damage,

            enemy: true,

            color: "#ccffff",

            life: 5
        });
    }

    // =========================================
    // BLIZZARD
    // =========================================

    blizzard(boss) {

        for (
            let i = 0;
            i < 100;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        Math.random() *
                        this.game.worldWidth,

                    y:
                        Math.random() *
                        this.game.canvas.height,

                    velocityX: -6,

                    velocityY: 4,

                    size:
                        Math.random() * 5 + 1,

                    color: "#ffffff",

                    life: 3
                });
        }

        this.game.player.slowed = 8;
    }

    // =========================================
    // FREEZE BEAM
    // =========================================

    freezeBeam(boss) {

        const player =
            this.game.player;

        player.frozen = 2;

        this.game.effects
            ?.createLaser?.({

                startX: boss.x,

                startY: boss.y,

                endX: player.x,

                endY: player.y,

                color: "#88ffff"
            });
    }

    // =========================================
    // ICE PRISON
    // =========================================

    icePrison(boss) {

        const player =
            this.game.player;

        player.stunned = 3;

        this.game.effects
            ?.createPrison?.(

                player.x,

                player.y
            );
    }

    // =========================================
    // SHADOW SLASH
    // =========================================

    shadowSlash(boss) {

        const player =
            this.game.player;

        player.health -=
            boss.damage * 1.4;

        this.game.effects
            ?.createShadowSlash?.(

                player.x,

                player.y
            );
    }

    // =========================================
    // TELEPORT STRIKE
    // =========================================

    teleportStrike(boss) {

        const player =
            this.game.player;

        boss.x =
            player.x -
            100;

        boss.y =
            player.y;

        setTimeout(() => {

            this.shadowSlash(boss);

        }, 300);
    }

    // =========================================
    // DARK ORB
    // =========================================

    darkOrb(boss) {

        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const angle =
                (Math.PI * 2 / 6) * i;

            this.game.projectiles.push({

                x:
                    boss.x,

                y:
                    boss.y,

                velocityX:
                    Math.cos(angle) * 6,

                velocityY:
                    Math.sin(angle) * 6,

                width: 18,

                height: 18,

                damage:
                    boss.damage,

                enemy: true,

                color: "#551188",

                life: 6
            });
        }
    }

    // =========================================
    // SHADOW CLONE
    // =========================================

    shadowClone(boss) {

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            this.game.enemySpawner
                ?.spawnEnemy(

                    "assassin",

                    boss.x +
                    (Math.random() - 0.5) * 400,

                    boss.y
                );
        }
    }

    // =========================================
    // VOID EXPLOSION
    // =========================================

    voidExplosion(boss) {

        const player =
            this.game.player;

        const distance =

            Math.hypot(

                player.x - boss.x,

                player.y - boss.y
            );

        if (
            distance < 300
        ) {

            player.health -=
                boss.damage * 2.2;
        }

        this.game.effects
            ?.createExplosion?.({

                x: boss.x,

                y: boss.y,

                radius: 300,

                color: "#5500aa"
            });

        this.shakeBossAttack(35);
    }

    // =========================================
    // DARK RAIN
    // =========================================

    darkRain(boss) {

        for (
            let i = 0;
            i < 40;
            i++
        ) {

            setTimeout(() => {

                this.game.projectiles.push({

                    x:
                        Math.random() *
                        this.game.worldWidth,

                    y: -50,

                    velocityX: 0,

                    velocityY: 14,

                    width: 14,

                    height: 28,

                    damage:
                        boss.damage * 0.6,

                    enemy: true,

                    color: "#7700ff",

                    life: 5
                });

            }, i * 80);
        }
    }

    // =========================================
    // Screen Shake
    // =========================================

    shakeBossAttack(
        intensity = 10
    ) {

        this.game.effects
            ?.shakeScreen(

                intensity,

                0.4
            );
    }

    // =========================================
    // Draw Boss UI
    // =========================================

    drawBossUI(ctx, boss) {

        if (
            !boss ||
            boss.dead
        ) {

            return;
        }

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            "#111111";

        ctx.fillRect(

            200,

            20,

            800,

            40
        );

        // =====================================
        // HP Bar
        // =====================================

        const hpPercent =

            boss.health /
            boss.maxHealth;

        ctx.fillStyle =
            "#ff2222";

        ctx.fillRect(

            200,

            20,

            800 * hpPercent,

            40
        );

        // =====================================
        // Name
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "28px Arial";

        ctx.fillText(

            boss.name,

            220,

            48
        );

        // =====================================
        // Phase
        // =====================================

        ctx.font =
            "18px Arial";

        ctx.fillText(

            `Phase ${boss.phase || 1}`,

            850,

            48
        );
    }
}