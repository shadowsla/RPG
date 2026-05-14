// =========================================
// Ultimate Tower RPG - towers.js
// =========================================

import {
    RANDOM_EVENTS,
    CHALLENGE_MODIFIERS
} from "./constants.js";

// =========================================
// Tower System
// =========================================

export class TowerSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Tower State
        // =====================================

        this.currentFloor = 1;

        this.maxFloor = 999;

        this.highestFloor = 1;

        this.towerName =
            "Eternal Abyss Tower";

        // =====================================
        // Difficulty Scaling
        // =====================================

        this.enemyHealthMultiplier = 1;

        this.enemyDamageMultiplier = 1;

        this.lootMultiplier = 1;

        // =====================================
        // Events
        // =====================================

        this.activeEvent = null;

        this.eventTimer = 0;

        // =====================================
        // Challenge Modifiers
        // =====================================

        this.activeModifiers = [];

        // =====================================
        // Modes
        // =====================================

        this.hardcoreMode = false;

        this.endlessMode = false;

        this.cursedFloor = false;

        // =====================================
        // Procedural
        // =====================================

        this.floorSeed =
            Math.random() * 999999;

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
            100
        ];
    }

    // =========================================
    // Start Floor
    // =========================================

    startFloor(floor) {

        this.currentFloor = floor;

        // =====================================
        // Scaling
        // =====================================

        this.calculateScaling();

        // =====================================
        // Generate Floor
        // =====================================

        this.generateFloor();

        // =====================================
        // Random Event
        // =====================================

        this.rollRandomEvent();

        // =====================================
        // Challenge Modifiers
        // =====================================

        this.rollChallengeModifiers();

        // =====================================
        // Notifications
        // =====================================

        this.game.notifications.add(

            `Entering Floor ${floor}`,

            "info"
        );

        // =====================================
        // Boss Warning
        // =====================================

        if (
            this.isBossFloor()
        ) {

            this.game.screenEffects
                .triggerBossWarning(

                    `FLOOR ${floor} BOSS`
                );
        }
    }

    // =========================================
    // Scaling
    // =========================================

    calculateScaling() {

        const floor =
            this.currentFloor;

        // Enemy Scaling
        this.enemyHealthMultiplier =
            1 + floor * 0.15;

        this.enemyDamageMultiplier =
            1 + floor * 0.1;

        // Loot Scaling
        this.lootMultiplier =
            1 + floor * 0.05;

        // Hardcore
        if (
            this.hardcoreMode
        ) {

            this.enemyHealthMultiplier *=
                1.8;

            this.enemyDamageMultiplier *=
                2;
        }

        // Endless
        if (
            this.endlessMode
        ) {

            this.enemyHealthMultiplier *=
                1.4;
        }
    }

    // =========================================
    // Generate Floor
    // =========================================

    generateFloor() {

        // Reset
        this.game.rooms = [];

        this.game.platforms = [];

        this.game.destructibles = [];

        // =====================================
        // Seeded Random
        // =====================================

        const roomCount =
            8 +
            Math.floor(
                Math.random() * 6
            );

        // =====================================
        // Rooms
        // =====================================

        for (
            let i = 0;
            i < roomCount;
            i++
        ) {

            const room = {

                x:
                    i * 900,

                y:
                    200 +
                    Math.sin(
                        i + this.floorSeed
                    ) * 160,

                width:
                    650 +
                    Math.random() * 300,

                height:
                    450 +
                    Math.random() * 200,

                theme:
                    this.getFloorTheme(),

                cursed:
                    this.cursedFloor
            };

            this.game.rooms.push(
                room
            );
        }

        // =====================================
        // Platform Sections
        // =====================================

        for (
            let i = 0;
            i < 80;
            i++
        ) {

            this.game.platforms.push({

                x:
                    Math.random() * 9000,

                y:
                    250 +
                    Math.random() * 2200,

                width:
                    120 +
                    Math.random() * 260,

                height: 20,

                moving:
                    Math.random() > 0.8,

                breakable:
                    Math.random() > 0.9,

                falling:
                    Math.random() > 0.95
            });
        }

        // =====================================
        // Destructible Objects
        // =====================================

        for (
            let i = 0;
            i < 40;
            i++
        ) {

            this.game.destructibles.push({

                x:
                    Math.random() * 8500,

                y:
                    500 +
                    Math.random() * 1800,

                width: 64,

                height: 64,

                health: 80,

                maxHealth: 80,

                lootChance: 0.5
            });
        }
    }

    // =========================================
    // Floor Theme
    // =========================================

    getFloorTheme() {

        const themes = [

            "shadow",

            "fire",

            "ice",

            "storm",

            "poison",

            "holy"
        ];

        return themes[
            this.currentFloor %
            themes.length
        ];
    }

    // =========================================
    // Random Events
    // =========================================

    rollRandomEvent() {

        // 35% Chance
        if (
            Math.random() > 0.35
        ) {

            this.activeEvent = null;

            return;
        }

        this.activeEvent =

            RANDOM_EVENTS[
                Math.floor(
                    Math.random() *
                    RANDOM_EVENTS.length
                )
            ];

        this.applyEvent(
            this.activeEvent
        );

        this.game.notifications.add(

            `Event: ${this.activeEvent}`,

            "warning"
        );
    }

    // =========================================
    // Apply Event
    // =========================================

    applyEvent(event) {

        switch(event) {

            // =================================
            // Treasure Room
            // =================================

            case "Treasure Room":

                this.lootMultiplier *=
                    3;

                break;

            // =================================
            // Cursed Shrine
            // =================================

            case "Cursed Shrine":

                this.cursedFloor = true;

                this.enemyDamageMultiplier *=
                    1.5;

                break;

            // =================================
            // Elite Ambush
            // =================================

            case "Elite Ambush":

                this.enemyHealthMultiplier *=
                    2;

                break;

            // =================================
            // Merchant Floor
            // =================================

            case "Merchant Floor":

                this.game.gold += 100;

                break;

            // =================================
            // Boss Rush
            // =================================

            case "Boss Rush":

                this.forceBossFloor =
                    true;

                break;

            // =================================
            // Meteor Shower
            // =================================

            case "Meteor Shower":

                this.enableMeteorShower =
                    true;

                break;

            // =================================
            // Dark Fog
            // =================================

            case "Dark Fog":

                this.game.background
                    .setTheme("shadow");

                break;

            // =================================
            // Healing Fountain
            // =================================

            case "Healing Fountain":

                this.game.player.health =
                    this.game.player
                    .maxHealth;

                break;

            // =================================
            // Challenge Arena
            // =================================

            case "Challenge Arena":

                this.enemyHealthMultiplier *=
                    1.4;

                this.lootMultiplier *=
                    2;

                break;
        }
    }

    // =========================================
    // Challenge Modifiers
    // =========================================

    rollChallengeModifiers() {

        this.activeModifiers = [];

        // Higher Floors
        const modifierCount =

            Math.floor(
                this.currentFloor / 20
            );

        for (
            let i = 0;
            i < modifierCount;
            i++
        ) {

            const modifier =

                CHALLENGE_MODIFIERS[
                    Math.floor(
                        Math.random() *
                        CHALLENGE_MODIFIERS.length
                    )
                ];

            if (
                !this.activeModifiers.includes(
                    modifier
                )
            ) {

                this.activeModifiers.push(
                    modifier
                );

                this.applyModifier(
                    modifier
                );
            }
        }
    }

    // =========================================
    // Apply Modifier
    // =========================================

    applyModifier(modifier) {

        switch(modifier) {

            case "Double Enemy Speed":

                this.enemySpeedMultiplier =
                    2;

                break;

            case "Low Gravity":

                this.game.gravity =
                    900;

                break;

            case "No Healing":

                this.disableHealing =
                    true;

                break;

            case "Exploding Enemies":

                this.explodingEnemies =
                    true;

                break;

            case "Darkness":

                this.darkness =
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

                this.oneHitMode =
                    true;

                break;

            case "Enemy Regeneration":

                this.enemyRegeneration =
                    true;

                break;
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

            this.forceBossFloor
        );
    }

    // =========================================
    // Complete Floor
    // =========================================

    completeFloor() {

        // Rewards
        const rewardGold =

            Math.floor(

                100 *
                this.lootMultiplier
            );

        this.game.gold +=
            rewardGold;

        this.game.score +=

            this.currentFloor * 1000;

        // Highest Floor
        if (
            this.currentFloor >
            this.highestFloor
        ) {

            this.highestFloor =
                this.currentFloor;
        }

        // Notification
        this.game.notifications.add(

            `Floor ${this.currentFloor} Cleared!`,

            "success"
        );

        // Next Floor
        this.startFloor(
            this.currentFloor + 1
        );
    }

    // =========================================
    // Hardcore Mode
    // =========================================

    enableHardcoreMode() {

        this.hardcoreMode = true;

        this.game.notifications.add(

            "Hardcore Mode Enabled",

            "danger"
        );
    }

    // =========================================
    // Endless Mode
    // =========================================

    enableEndlessMode() {

        this.endlessMode = true;

        this.game.notifications.add(

            "Endless Mode Enabled",

            "warning"
        );
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.eventTimer +=
            deltaTime;

        // =====================================
        // Meteor Shower
        // =====================================

        if (
            this.enableMeteorShower
        ) {

            if (
                Math.random() > 0.97
            ) {

                this.spawnMeteor();
            }
        }
    }

    // =========================================
    // Spawn Meteor
    // =========================================

    spawnMeteor() {

        const meteor = {

            x:
                Math.random() * 9000,

            y: -200,

            vx: -300,

            vy: 800,

            size: 50
        };

        this.game.projectiles.push(
            meteor
        );

        this.game.camera.shake(
            4,
            0.2
        );
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        // =====================================
        // Active Event
        // =====================================

        if (
            this.activeEvent
        ) {

            ctx.save();

            ctx.fillStyle =
                "rgba(0,0,0,0.5)";

            ctx.fillRect(
                20,
                20,
                320,
                80
            );

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "24px Arial";

            ctx.fillText(

                `Event: ${this.activeEvent}`,

                40,
                60
            );

            ctx.restore();
        }

        // =====================================
        // Modifiers
        // =====================================

        if (
            this.activeModifiers.length > 0
        ) {

            ctx.save();

            ctx.fillStyle =
                "#ff5555";

            ctx.font =
                "18px Arial";

            for (
                let i = 0;
                i <
                this.activeModifiers.length;
                i++
            ) {

                ctx.fillText(

                    this.activeModifiers[i],

                    40,

                    120 + i * 24
                );
            }

            ctx.restore();
        }
    }
}
