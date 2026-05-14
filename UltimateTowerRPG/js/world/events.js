// =========================================
// Ultimate Tower RPG - events.js
// =========================================

// =========================================
// Event System
// =========================================

export class EventSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Active Events
        // =====================================

        this.activeEvents = [];

        // =====================================
        // Event Pool
        // =====================================

        this.events = [

            "meteorShower",

            "bloodMoon",

            "goldRush",

            "enemyInvasion",

            "lowGravity",

            "healingRain",

            "darkFog",

            "thunderStorm",

            "bossRage",

            "treasureRain",

            "voidCollapse",

            "timeWarp",

            "curseFloor",

            "blessingFloor",

            "summonWave"
        ];

        // =====================================
        // Timers
        // =====================================

        this.eventCooldown = 45;

        this.eventTimer = 0;

        // =====================================
        // Chances
        // =====================================

        this.eventChance = 0.4;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.eventTimer +=
            deltaTime;

        // =====================================
        // Roll Event
        // =====================================

        if (
            this.eventTimer >=
            this.eventCooldown
        ) {

            this.eventTimer = 0;

            if (
                Math.random() <
                this.eventChance
            ) {

                this.startRandomEvent();
            }
        }

        // =====================================
        // Update Events
        // =====================================

        for (
            let i =
                this.activeEvents.length - 1;
            i >= 0;
            i--
        ) {

            const event =
                this.activeEvents[i];

            event.duration -=
                deltaTime;

            this.updateEvent(
                event,
                deltaTime
            );

            // End
            if (
                event.duration <= 0
            ) {

                this.endEvent(
                    event
                );

                this.activeEvents.splice(
                    i,
                    1
                );
            }
        }
    }

    // =========================================
    // Random Event
    // =========================================

    startRandomEvent() {

        const eventType =
            this.events[
                Math.floor(
                    Math.random() *
                    this.events.length
                )
            ];

        this.startEvent(
            eventType
        );
    }

    // =========================================
    // Start Event
    // =========================================

    startEvent(type) {

        const event = {

            type,

            duration:
                this.getDuration(type),

            timer: 0,

            intensity:
                1 +
                Math.random() * 2
        };

        this.activeEvents.push(
            event
        );

        this.applyEventStart(
            event
        );

        this.game.notifications.add(

            `${this.formatName(type)} Started`,

            "warning"
        );
    }

    // =========================================
    // Event Duration
    // =========================================

    getDuration(type) {

        switch(type) {

            case "meteorShower":
                return 25;

            case "bloodMoon":
                return 45;

            case "goldRush":
                return 30;

            case "enemyInvasion":
                return 35;

            case "lowGravity":
                return 40;

            case "healingRain":
                return 25;

            case "darkFog":
                return 50;

            case "thunderStorm":
                return 35;

            case "bossRage":
                return 40;

            case "treasureRain":
                return 20;

            case "voidCollapse":
                return 30;

            case "timeWarp":
                return 25;

            case "curseFloor":
                return 60;

            case "blessingFloor":
                return 60;

            case "summonWave":
                return 20;

            default:
                return 30;
        }
    }

    // =========================================
    // Apply Event Start
    // =========================================

    applyEventStart(event) {

        switch(event.type) {

            // =================================
            // Meteor Shower
            // =================================

            case "meteorShower":

                this.game.meteorShower =
                    true;

                break;

            // =================================
            // Blood Moon
            // =================================

            case "bloodMoon":

                this.game.enemyDamageMultiplier =
                    2;

                this.game.background
                    .setTheme("blood");

                break;

            // =================================
            // Gold Rush
            // =================================

            case "goldRush":

                this.game.goldMultiplier =
                    3;

                break;

            // =================================
            // Enemy Invasion
            // =================================

            case "enemyInvasion":

                this.spawnEnemyWave(
                    25
                );

                break;

            // =================================
            // Low Gravity
            // =================================

            case "lowGravity":

                this.game.gravity =
                    500;

                break;

            // =================================
            // Healing Rain
            // =================================

            case "healingRain":

                this.game.healingRain =
                    true;

                break;

            // =================================
            // Dark Fog
            // =================================

            case "darkFog":

                this.game.darkFog =
                    true;

                break;

            // =================================
            // Thunder Storm
            // =================================

            case "thunderStorm":

                this.game.lightningStorm =
                    true;

                break;

            // =================================
            // Boss Rage
            // =================================

            case "bossRage":

                this.buffBosses();

                break;

            // =================================
            // Treasure Rain
            // =================================

            case "treasureRain":

                this.spawnTreasureRain();

                break;

            // =================================
            // Void Collapse
            // =================================

            case "voidCollapse":

                this.game.voidCollapse =
                    true;

                break;

            // =================================
            // Time Warp
            // =================================

            case "timeWarp":

                this.game.timeScale =
                    1.5;

                break;

            // =================================
            // Curse Floor
            // =================================

            case "curseFloor":

                this.game.player.cursed =
                    true;

                break;

            // =================================
            // Blessing Floor
            // =================================

            case "blessingFloor":

                this.game.player.blessed =
                    true;

                break;

            // =================================
            // Summon Wave
            // =================================

            case "summonWave":

                this.spawnSummons();

                break;
        }
    }

    // =========================================
    // Update Event
    // =========================================

    updateEvent(
        event,
        deltaTime
    ) {

        event.timer +=
            deltaTime;

        switch(event.type) {

            // =================================
            // Meteor Shower
            // =================================

            case "meteorShower":

                if (
                    Math.random() > 0.92
                ) {

                    this.spawnMeteor();
                }

                break;

            // =================================
            // Healing Rain
            // =================================

            case "healingRain":

                this.game.player.health +=

                    8 * deltaTime;

                if (
                    this.game.player.health >
                    this.game.player.maxHealth
                ) {

                    this.game.player.health =
                        this.game.player
                        .maxHealth;
                }

                break;

            // =================================
            // Thunder Storm
            // =================================

            case "thunderStorm":

                if (
                    Math.random() > 0.96
                ) {

                    this.spawnLightning();
                }

                break;

            // =================================
            // Treasure Rain
            // =================================

            case "treasureRain":

                if (
                    Math.random() > 0.95
                ) {

                    this.spawnTreasure();
                }

                break;

            // =================================
            // Void Collapse
            // =================================

            case "voidCollapse":

                this.expandVoid();

                break;

            // =================================
            // Summon Wave
            // =================================

            case "summonWave":

                if (
                    Math.random() > 0.97
                ) {

                    this.spawnSummons();
                }

                break;
        }
    }

    // =========================================
    // End Event
    // =========================================

    endEvent(event) {

        switch(event.type) {

            case "meteorShower":

                this.game.meteorShower =
                    false;

                break;

            case "bloodMoon":

                this.game.enemyDamageMultiplier =
                    1;

                this.game.background
                    .setTheme("shadow");

                break;

            case "goldRush":

                this.game.goldMultiplier =
                    1;

                break;

            case "lowGravity":

                this.game.gravity =
                    1400;

                break;

            case "healingRain":

                this.game.healingRain =
                    false;

                break;

            case "darkFog":

                this.game.darkFog =
                    false;

                break;

            case "thunderStorm":

                this.game.lightningStorm =
                    false;

                break;

            case "timeWarp":

                this.game.timeScale =
                    1;

                break;

            case "curseFloor":

                this.game.player.cursed =
                    false;

                break;

            case "blessingFloor":

                this.game.player.blessed =
                    false;

                break;
        }

        this.game.notifications.add(

            `${this.formatName(event.type)} Ended`,

            "info"
        );
    }

    // =========================================
    // Spawn Enemy Wave
    // =========================================

    spawnEnemyWave(count) {

        for (
            let i = 0;
            i < count;
            i++
        ) {

            this.game.spawnEnemy?.(

                1000 +
                Math.random() * 7000,

                400 +
                Math.random() * 1800,

                true
            );
        }
    }

    // =========================================
    // Buff Bosses
    // =========================================

    buffBosses() {

        this.game.enemies.forEach(

            enemy => {

                if (
                    enemy.boss
                ) {

                    enemy.health *= 2;

                    enemy.damage *= 1.5;
                }
            }
        );
    }

    // =========================================
    // Treasure Rain
    // =========================================

    spawnTreasureRain() {

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            this.spawnTreasure();
        }
    }

    // =========================================
    // Spawn Treasure
    // =========================================

    spawnTreasure() {

        this.game.lootDrops.push({

            x:
                Math.random() * 9000,

            y:
                Math.random() * 2500,

            rarity:
                Math.random() > 0.9
                ? "legendary"
                : "rare"
        });
    }

    // =========================================
    // Meteor
    // =========================================

    spawnMeteor() {

        this.game.projectiles.push({

            meteor: true,

            x:
                Math.random() * 10000,

            y: -200,

            vx:
                -100 +
                Math.random() * 200,

            vy: 900,

            size:
                40 +
                Math.random() * 40
        });

        this.game.camera.shake(
            4,
            0.15
        );
    }

    // =========================================
    // Lightning
    // =========================================

    spawnLightning() {

        this.game.effects.push({

            lightning: true,

            x:
                Math.random() * 10000,

            y: 0,

            duration: 0.3
        });

        this.game.screenEffects
            .flash("#aaddff");
    }

    // =========================================
    // Void
    // =========================================

    expandVoid() {

        this.game.voidSize =
            (this.game.voidSize || 0) + 0.2;
    }

    // =========================================
    // Summons
    // =========================================

    spawnSummons() {

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            this.game.summons.push({

                x:
                    this.game.player.x +
                    Math.random() * 300 - 150,

                y:
                    this.game.player.y +
                    Math.random() * 100,

                health: 100,

                damage: 20,

                duration: 20
            });
        }
    }

    // =========================================
    // Format Name
    // =========================================

    formatName(name) {

        return name

            .replace(
                /([A-Z])/g,
                " $1"
            )

            .replace(/^./, c =>
                c.toUpperCase()
            );
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        ctx.save();

        let y = 180;

        for (
            const event of
            this.activeEvents
        ) {

            // =================================
            // Background
            // =================================

            ctx.fillStyle =
                "rgba(0,0,0,0.5)";

            ctx.fillRect(
                20,
                y - 25,
                300,
                40
            );

            // =================================
            // Text
            // =================================

            ctx.fillStyle =
                "#ffaa33";

            ctx.font =
                "20px Arial";

            ctx.fillText(

                `${this.formatName(event.type)} (${Math.ceil(event.duration)}s)`,

                30,

                y
            );

            y += 50;
        }

        ctx.restore();
    }
}
