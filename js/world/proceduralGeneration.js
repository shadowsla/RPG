// =========================================
// Ultimate Tower RPG - proceduralGeneration.js
// =========================================

import {
    RANDOM_EVENTS
} from "./constants.js";

// =========================================
// Procedural Generation System
// =========================================

export class ProceduralGeneration {

    constructor(game) {

        this.game = game;

        // =====================================
        // Generation Settings
        // =====================================

        this.worldWidth = 12000;

        this.worldHeight = 4000;

        this.seed =
            Math.floor(
                Math.random() * 9999999
            );

        // =====================================
        // Biomes
        // =====================================

        this.biomes = [

            "shadow",

            "fire",

            "ice",

            "storm",

            "poison",

            "holy",

            "ancient",

            "void"
        ];

        // =====================================
        // Structures
        // =====================================

        this.structureTypes = [

            "tower",

            "bridge",

            "ruins",

            "arena",

            "cave",

            "fortress"
        ];

        // =====================================
        // Generated Data
        // =====================================

        this.generatedRooms = [];

        this.generatedPlatforms = [];

        this.generatedHazards = [];

        this.generatedStructures = [];

        this.generatedDecorations = [];
    }

    // =========================================
    // Generate Entire Floor
    // =========================================

    generateFloor(floor = 1) {

        // Reset
        this.generatedRooms = [];

        this.generatedPlatforms = [];

        this.generatedHazards = [];

        this.generatedStructures = [];

        this.generatedDecorations = [];

        // =====================================
        // Biome
        // =====================================

        const biome =
            this.getBiome(floor);

        // =====================================
        // Main Generation
        // =====================================

        this.generateRooms(
            floor,
            biome
        );

        this.generatePlatforms(
            floor
        );

        this.generateHazards(
            floor,
            biome
        );

        this.generateStructures(
            floor,
            biome
        );

        this.generateDecorations(
            biome
        );

        this.generateRandomEvent();

        // =====================================
        // Apply To Game
        // =====================================

        this.applyGeneration();
    }

    // =========================================
    // Biome
    // =========================================

    getBiome(floor) {

        return this.biomes[
            floor %
            this.biomes.length
        ];
    }

    // =========================================
    // Rooms
    // =========================================

    generateRooms(
        floor,
        biome
    ) {

        let currentX = 0;

        const roomCount =
            8 +
            Math.floor(
                floor / 2
            );

        for (
            let i = 0;
            i < roomCount;
            i++
        ) {

            const width =
                800 +
                Math.random() * 600;

            const height =
                500 +
                Math.random() * 400;

            const room = {

                id: i,

                biome,

                x: currentX,

                y:
                    300 +
                    Math.sin(i) * 150,

                width,

                height,

                difficulty:
                    floor * 1.2,

                enemies: [],

                loot: [],

                connectedRooms: []
            };

            // Connect Rooms
            if (i > 0) {

                room.connectedRooms.push(
                    i - 1
                );
            }

            // Enemy Count
            const enemyCount =
                4 +
                Math.floor(
                    Math.random() * 8
                );

            for (
                let e = 0;
                e < enemyCount;
                e++
            ) {

                room.enemies.push({

                    x:
                        room.x +
                        100 +
                        Math.random() *
                        (room.width - 200),

                    y:
                        room.y +
                        100 +
                        Math.random() *
                        (room.height - 200),

                    level:
                        floor,

                    elite:
                        Math.random() > 0.9
                });
            }

            // Loot
            const lootCount =
                1 +
                Math.floor(
                    Math.random() * 5
                );

            for (
                let l = 0;
                l < lootCount;
                l++
            ) {

                room.loot.push({

                    x:
                        room.x +
                        Math.random() *
                        room.width,

                    y:
                        room.y +
                        Math.random() *
                        room.height,

                    rarity:
                        this.rollRarity(
                            floor
                        )
                });
            }

            this.generatedRooms.push(
                room
            );

            currentX +=
                width + 400;
        }
    }

    // =========================================
    // Platforms
    // =========================================

    generatePlatforms(floor) {

        const platformCount =
            50 + floor * 3;

        for (
            let i = 0;
            i < platformCount;
            i++
        ) {

            this.generatedPlatforms.push({

                x:
                    Math.random() *
                    this.worldWidth,

                y:
                    200 +
                    Math.random() *
                    this.worldHeight,

                width:
                    120 +
                    Math.random() * 260,

                height: 20,

                moving:
                    Math.random() > 0.8,

                falling:
                    Math.random() > 0.93,

                breakable:
                    Math.random() > 0.9,

                speed:
                    40 +
                    Math.random() * 120,

                direction:
                    Math.random() > 0.5
                    ? 1
                    : -1
            });
        }
    }

    // =========================================
    // Hazards
    // =========================================

    generateHazards(
        floor,
        biome
    ) {

        const hazardCount =
            20 + floor;

        const biomeHazards = {

            shadow: [
                "void",
                "shadowFlame"
            ],

            fire: [
                "lava",
                "fireTrap"
            ],

            ice: [
                "iceSpike",
                "freezeZone"
            ],

            storm: [
                "lightning",
                "wind"
            ],

            poison: [
                "poisonGas",
                "acid"
            ],

            holy: [
                "holyBeam",
                "lightBurst"
            ],

            ancient: [
                "crusher",
                "spikes"
            ],

            void: [
                "blackHole",
                "voidRift"
            ]
        };

        const possibleHazards =
            biomeHazards[biome];

        for (
            let i = 0;
            i < hazardCount;
            i++
        ) {

            const type =
                possibleHazards[
                    Math.floor(
                        Math.random() *
                        possibleHazards.length
                    )
                ];

            this.generatedHazards.push({

                type,

                x:
                    Math.random() *
                    this.worldWidth,

                y:
                    300 +
                    Math.random() *
                    this.worldHeight,

                width:
                    60 +
                    Math.random() * 100,

                height:
                    60 +
                    Math.random() * 100,

                damage:
                    15 + floor * 2,

                active: true
            });
        }
    }

    // =========================================
    // Structures
    // =========================================

    generateStructures(
        floor,
        biome
    ) {

        const structureCount =
            6 +
            Math.floor(
                floor / 4
            );

        for (
            let i = 0;
            i < structureCount;
            i++
        ) {

            const type =
                this.structureTypes[
                    Math.floor(
                        Math.random() *
                        this.structureTypes.length
                    )
                ];

            this.generatedStructures.push({

                type,

                biome,

                x:
                    600 +
                    Math.random() *
                    (this.worldWidth - 1200),

                y:
                    200 +
                    Math.random() *
                    (this.worldHeight - 500),

                width:
                    300 +
                    Math.random() * 600,

                height:
                    200 +
                    Math.random() * 500
            });
        }
    }

    // =========================================
    // Decorations
    // =========================================

    generateDecorations(biome) {

        const decorationCount = 120;

        const biomeDecor = {

            shadow: "crystal",

            fire: "embers",

            ice: "snow",

            storm: "cloud",

            poison: "mushroom",

            holy: "pillar",

            ancient: "statue",

            void: "orb"
        };

        for (
            let i = 0;
            i < decorationCount;
            i++
        ) {

            this.generatedDecorations.push({

                type:
                    biomeDecor[biome],

                x:
                    Math.random() *
                    this.worldWidth,

                y:
                    Math.random() *
                    this.worldHeight,

                size:
                    10 +
                    Math.random() * 40
            });
        }
    }

    // =========================================
    // Random Event
    // =========================================

    generateRandomEvent() {

        // 40% Chance
        if (
            Math.random() > 0.4
        ) {

            return;
        }

        const event =
            RANDOM_EVENTS[
                Math.floor(
                    Math.random() *
                    RANDOM_EVENTS.length
                )
            ];

        switch(event) {

            case "Treasure Room":

                this.spawnTreasureRoom();

                break;

            case "Elite Ambush":

                this.spawnEliteEnemies();

                break;

            case "Meteor Shower":

                this.enableMeteorShower =
                    true;

                break;

            case "Healing Fountain":

                this.spawnHealingFountain();

                break;

            case "Dark Fog":

                this.enableFog = true;

                break;
        }

        this.game.notifications.add(

            `World Event: ${event}`,

            "warning"
        );
    }

    // =========================================
    // Treasure Room
    // =========================================

    spawnTreasureRoom() {

        this.generatedRooms.push({

            secret: true,

            treasure: true,

            x:
                9000 +
                Math.random() * 1000,

            y: 500,

            width: 800,

            height: 500,

            loot: Array.from(
                { length: 10 },
                () => ({

                    rarity:
                        "legendary"
                })
            )
        });
    }

    // =========================================
    // Elite Enemies
    // =========================================

    spawnEliteEnemies() {

        for (
            const room of
            this.generatedRooms
        ) {

            if (
                room.enemies
            ) {

                room.enemies.forEach(

                    enemy => {

                        enemy.elite = true;

                        enemy.level += 5;
                    }
                );
            }
        }
    }

    // =========================================
    // Healing Fountain
    // =========================================

    spawnHealingFountain() {

        this.generatedStructures.push({

            type: "fountain",

            x:
                2000 +
                Math.random() * 6000,

            y: 600,

            width: 180,

            height: 180,

            healing: true
        });
    }

    // =========================================
    // Rarity
    // =========================================

    rollRarity(floor) {

        const roll =
            Math.random();

        if (
            roll <
            Math.max(
                0.4 - floor * 0.002,
                0.1
            )
        ) {

            return "common";
        }

        if (roll < 0.7) {

            return "rare";
        }

        if (roll < 0.9) {

            return "epic";
        }

        if (roll < 0.98) {

            return "legendary";
        }

        return "mythic";
    }

    // =========================================
    // Apply To Game
    // =========================================

    applyGeneration() {

        this.game.rooms =
            this.generatedRooms;

        this.game.platforms =
            this.generatedPlatforms;

        this.game.hazards =
            this.generatedHazards;

        this.game.structures =
            this.generatedStructures;

        this.game.decorations =
            this.generatedDecorations;

        // World Size
        this.game.camera.worldWidth =
            this.worldWidth;

        this.game.camera.worldHeight =
            this.worldHeight;
    }

    // =========================================
    // Regenerate
    // =========================================

    regenerate(seed = null) {

        if (seed) {

            this.seed = seed;
        }

        this.generateFloor(
            this.game.floor
        );
    }

    // =========================================
    // Draw Debug
    // =========================================

    drawDebug(ctx) {

        ctx.save();

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "18px monospace";

        ctx.fillText(

            `Seed: ${this.seed}`,

            20,

            200
        );

        ctx.fillText(

            `Rooms: ${this.generatedRooms.length}`,

            20,

            225
        );

        ctx.fillText(

            `Platforms: ${this.generatedPlatforms.length}`,

            20,

            250
        );

        ctx.fillText(

            `Hazards: ${this.generatedHazards.length}`,

            20,

            275
        );

        ctx.fillText(

            `Structures: ${this.generatedStructures.length}`,

            20,

            300
        );

        ctx.restore();
    }
}
