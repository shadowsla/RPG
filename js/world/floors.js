// =========================================
// Ultimate Tower RPG - floors.js
// =========================================

import {
    FLOOR_THEMES,
    FLOOR_EVENTS,
    FLOOR_MODIFIERS
} from "./constants.js";

// =========================================
// Floor System
// =========================================

export class FloorSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Floor Data
        // =====================================

        this.currentFloor = 1;

        this.highestFloor = 1;

        this.floorSeed =
            Math.floor(
                Math.random() * 999999
            );

        // =====================================
        // Current Floor State
        // =====================================

        this.currentTheme =
            "shadow";

        this.currentEvent =
            null;

        this.currentModifiers =
            [];

        // =====================================
        // Modes
        // =====================================

        this.hardcoreMode = false;

        this.endlessMode = false;

        this.challengeMode = false;

        // =====================================
        // Difficulty
        // =====================================

        this.enemyMultiplier = 1;

        this.lootMultiplier = 1;

        this.hazardMultiplier = 1;

        // =====================================
        // Floor History
        // =====================================

        this.completedFloors = [];

        this.floorStats = {};

        // =====================================
        // Boss Floors
        // =====================================

        this.bossFloors = [

            5,
            10,
            15,
            20,
            25,
            30,
            40,
            50,
            75,
            100,
            150,
            200
        ];
    }

    // =========================================
    // Start Floor
    // =========================================

    startFloor(floor) {

        this.currentFloor = floor;

        // =====================================
        // Save Highest
        // =====================================

        if (
            floor > this.highestFloor
        ) {

            this.highestFloor = floor;
        }

        // =====================================
        // Generate Seed
        // =====================================

        this.floorSeed =
            Math.floor(
                Math.random() * 99999999
            );

        // =====================================
        // Theme
        // =====================================

        this.currentTheme =
            this.getTheme(floor);

        // =====================================
        // Event
        // =====================================

        this.currentEvent =
            this.rollEvent();

        // =====================================
        // Modifiers
        // =====================================

        this.currentModifiers =
            this.rollModifiers();

        // =====================================
        // Scaling
        // =====================================

        this.calculateDifficulty();

        // =====================================
        // Apply Theme
        // =====================================

        this.game.background
            .setTheme(
                this.currentTheme
            );

        // =====================================
        // Generate Floor
        // =====================================

        this.generateFloor();

        // =====================================
        // Notifications
        // =====================================

        this.game.notifications.add(

            `Floor ${floor} Started`,

            "info"
        );

        if (
            this.currentEvent
        ) {

            this.game.notifications.add(

                `Event: ${this.currentEvent}`,

                "warning"
            );
        }

        // =====================================
        // Boss Warning
        // =====================================

        if (
            this.isBossFloor()
        ) {

            this.game.screenEffects
                .triggerBossWarning(

                    `BOSS FLOOR ${floor}`
                );
        }
    }

    // =========================================
    // Theme
    // =========================================

    getTheme(floor) {

        return FLOOR_THEMES[
            floor %
            FLOOR_THEMES.length
        ];
    }

    // =========================================
    // Event
    // =========================================

    rollEvent() {

        // 35% Chance
        if (
            Math.random() > 0.35
        ) {

            return null;
        }

        return FLOOR_EVENTS[
            Math.floor(
                Math.random() *
                FLOOR_EVENTS.length
            )
        ];
    }

    // =========================================
    // Modifiers
    // =========================================

    rollModifiers() {

        const modifiers = [];

        const modifierCount =

            Math.floor(
                this.currentFloor / 20
            );

        for (
            let i = 0;
            i < modifierCount;
            i++
        ) {

            modifiers.push(

                FLOOR_MODIFIERS[
                    Math.floor(
                        Math.random() *
                        FLOOR_MODIFIERS.length
                    )
                ]
            );
        }

        return modifiers;
    }

    // =========================================
    // Difficulty
    // =========================================

    calculateDifficulty() {

        const floor =
            this.currentFloor;

        // Enemy
        this.enemyMultiplier =
            1 + floor * 0.15;

        // Loot
        this.lootMultiplier =
            1 + floor * 0.08;

        // Hazards
        this.hazardMultiplier =
            1 + floor * 0.1;

        // Hardcore
        if (
            this.hardcoreMode
        ) {

            this.enemyMultiplier *=
                2;

            this.hazardMultiplier *=
                1.8;
        }

        // Endless
        if (
            this.endlessMode
        ) {

            this.enemyMultiplier *=
                1.5;
        }

        // Challenge
        if (
            this.challengeMode
        ) {

            this.enemyMultiplier *=
                1.8;

            this.lootMultiplier *=
                2;
        }
    }

    // =========================================
    // Generate Floor
    // =========================================

    generateFloor() {

        // =====================================
        // Generate Systems
        // =====================================

        this.game.rooms?.generateRooms();

        this.game.hazards?.generateHazards();

        this.game.portals?.generateInitialPortals();

        this.game.secrets?.generateSecrets();

        // =====================================
        // Spawn Enemies
        // =====================================

        this.spawnEnemies();

        // =====================================
        // Apply Event
        // =====================================

        this.applyEvent();

        // =====================================
        // Apply Modifiers
        // =====================================

        this.applyModifiers();
    }

    // =========================================
    // Spawn Enemies
    // =========================================

    spawnEnemies() {

        this.game.enemies = [];

        const enemyCount =
            15 +
            this.currentFloor * 2;

        for (
            let i = 0;
            i < enemyCount;
            i++
        ) {

            this.game.enemies.push({

                x:
                    500 +
                    Math.random() * 9000,

                y:
                    300 +
                    Math.random() * 2200,

                width: 48,

                height: 64,

                level:
                    this.currentFloor,

                health:
                    100 *
                    this.enemyMultiplier,

                maxHealth:
                    100 *
                    this.enemyMultiplier,

                damage:
                    15 *
                    this.enemyMultiplier,

                speed:
                    120 +
                    this.currentFloor * 2,

                elite:
                    Math.random() > 0.9,

                boss: false
            });
        }

        // Boss Floor
        if (
            this.isBossFloor()
        ) {

            this.spawnBoss();
        }
    }

    // =========================================
    // Boss
    // =========================================

    spawnBoss() {

        this.game.enemies.push({

            x: 5000,

            y: 1200,

            width: 220,

            height: 260,

            level:
                this.currentFloor + 5,

            health:
                5000 *
                this.enemyMultiplier,

            maxHealth:
                5000 *
                this.enemyMultiplier,

            damage:
                80 *
                this.enemyMultiplier,

            speed: 160,

            elite: true,

            boss: true,

            phase: 1
        });
    }

    // =========================================
    // Event Effects
    // =========================================

    applyEvent() {

        switch(this.currentEvent) {

            case "Treasure Storm":

                this.lootMultiplier *=
                    3;

                break;

            case "Elite Invasion":

                this.game.enemies.forEach(

                    enemy => {

                        enemy.elite = true;

                        enemy.health *= 2;
                    }
                );

                break;

            case "Meteor Shower":

                this.game.meteorShower =
                    true;

                break;

            case "Low Gravity":

                this.game.gravity =
                    700;

                break;

            case "Healing Aura":

                this.game.player.health =
                    this.game.player
                    .maxHealth;

                break;

            case "Dark Fog":

                this.game.darkFog =
                    true;

                break;

            case "Gold Rush":

                this.lootMultiplier *=
                    2;

                break;

            case "Boss Frenzy":

                this.forceBoss =
                    true;

                break;
        }
    }

    // =========================================
    // Modifiers
    // =========================================

    applyModifiers() {

        for (
            const modifier of
            this.currentModifiers
        ) {

            switch(modifier) {

                case "Double Enemy Speed":

                    this.game.enemySpeedMultiplier =
                        2;

                    break;

                case "Exploding Enemies":

                    this.game.explodingEnemies =
                        true;

                    break;

                case "No Healing":

                    this.game.disableHealing =
                        true;

                    break;

                case "Permanent Storm":

                    this.game.background
                        .setTheme("storm");

                    break;

                case "Half Mana":

                    this.game.player.mana *=
                        0.5;

                    break;

                case "One Hit Mode":

                    this.game.oneHitMode =
                        true;

                    break;

                case "Enemy Regeneration":

                    this.game.enemyRegen =
                        true;

                    break;
            }
        }
    }

    // =========================================
    // Boss Floor
    // =========================================

    isBossFloor() {

        return (

            this.bossFloors.includes(
                this.currentFloor
            ) ||

            this.forceBoss
        );
    }

    // =========================================
    // Complete Floor
    // =========================================

    completeFloor() {

        // =====================================
        // Save Stats
        // =====================================

        this.completedFloors.push(
            this.currentFloor
        );

        this.floorStats[
            this.currentFloor
        ] = {

            time:
                this.game.playTime,

            deaths:
                this.game.deaths,

            score:
                this.game.score
        };

        // =====================================
        // Rewards
        // =====================================

        const reward =

            Math.floor(

                500 *
                this.lootMultiplier
            );

        this.game.gold +=
            reward;

        this.game.score +=

            this.currentFloor * 2000;

        // =====================================
        // Notification
        // =====================================

        this.game.notifications.add(

            `Floor ${this.currentFloor} Cleared!`,

            "success"
        );

        // =====================================
        // Next Floor
        // =====================================

        this.startFloor(
            this.currentFloor + 1
        );
    }

    // =========================================
    // Modes
    // =========================================

    enableHardcore() {

        this.hardcoreMode = true;

        this.game.notifications.add(

            "Hardcore Mode Enabled",

            "danger"
        );
    }

    enableEndless() {

        this.endlessMode = true;

        this.game.notifications.add(

            "Endless Mode Enabled",

            "warning"
        );
    }

    enableChallenge() {

        this.challengeMode = true;

        this.game.notifications.add(

            "Challenge Mode Enabled",

            "warning"
        );
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Meteor Shower
        // =====================================

        if (
            this.game.meteorShower
        ) {

            if (
                Math.random() > 0.97
            ) {

                this.spawnMeteor();
            }
        }

        // =====================================
        // Floor Complete Check
        // =====================================

        const enemiesAlive =
            this.game.enemies.filter(

                enemy =>
                    enemy.health > 0
            );

        if (
            enemiesAlive.length === 0
        ) {

            this.completeFloor();
        }
    }

    // =========================================
    // Meteor
    // =========================================

    spawnMeteor() {

        this.game.projectiles.push({

            x:
                Math.random() * 10000,

            y: -200,

            vx: -200,

            vy: 900,

            size: 50,

            meteor: true
        });

        this.game.camera.shake(
            5,
            0.2
        );
    }

    // =========================================
    // Draw UI
    // =========================================

    draw(ctx) {

        ctx.save();

        // =====================================
        // Floor
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "28px Arial";

        ctx.fillText(

            `Floor ${this.currentFloor}`,

            20,

            40
        );

        // =====================================
        // Theme
        // =====================================

        ctx.font =
            "18px Arial";

        ctx.fillText(

            `Theme: ${this.currentTheme}`,

            20,

            70
        );

        // =====================================
        // Event
        // =====================================

        if (
            this.currentEvent
        ) {

            ctx.fillStyle =
                "#ffaa33";

            ctx.fillText(

                `Event: ${this.currentEvent}`,

                20,

                100
            );
        }

        // =====================================
        // Modifiers
        // =====================================

        ctx.fillStyle =
            "#ff6666";

        for (
            let i = 0;
            i <
            this.currentModifiers.length;
            i++
        ) {

            ctx.fillText(

                this.currentModifiers[i],

                20,

                130 + i * 25
            );
        }

        ctx.restore();
    }
}
