// =========================================
// Ultimate Tower RPG - rooms.js
// =========================================

import {
    RARITY_COLORS
} from "./constants.js";

// =========================================
// Room Manager
// =========================================

export class RoomManager {

    constructor(game) {

        this.game = game;

        // =====================================
        // Rooms
        // =====================================

        this.rooms = [];

        this.currentRoom = 0;

        // =====================================
        // Room Types
        // =====================================

        this.roomTypes = [

            "combat",

            "treasure",

            "parkour",

            "shop",

            "boss",

            "secret",

            "event",

            "rest"
        ];

        // =====================================
        // Themes
        // =====================================

        this.themes = [

            "shadow",

            "fire",

            "ice",

            "storm",

            "poison",

            "holy",

            "ancient"
        ];

        // =====================================
        // Generate
        // =====================================

        this.generateRooms();
    }

    // =========================================
    // Generate Rooms
    // =========================================

    generateRooms() {

        this.rooms = [];

        let worldX = 0;

        const roomCount =
            10 +
            Math.floor(
                Math.random() * 6
            );

        for (
            let i = 0;
            i < roomCount;
            i++
        ) {

            const type =
                this.getRoomType(i);

            const theme =
                this.getTheme();

            const width =
                900 +
                Math.random() * 500;

            const height =
                600 +
                Math.random() * 300;

            const room = {

                id: i,

                type,

                theme,

                x: worldX,

                y:
                    200 +
                    Math.sin(i) * 120,

                width,

                height,

                cleared: false,

                discovered: i === 0,

                enemies: [],

                loot: [],

                platforms: [],

                hazards: [],

                portals: [],

                backgroundColor:
                    this.getThemeColor(
                        theme
                    )
            };

            // Generate Content
            this.generatePlatforms(
                room
            );

            this.generateHazards(
                room
            );

            this.generateLoot(
                room
            );

            this.generateEnemies(
                room
            );

            this.rooms.push(room);

            worldX +=
                width + 300;
        }

        // Boss Room
        this.rooms.push(

            this.createBossRoom(
                worldX
            )
        );
    }

    // =========================================
    // Room Type
    // =========================================

    getRoomType(index) {

        // First Room
        if (index === 0) {

            return "rest";
        }

        // Random
        const weights = [

            "combat",
            "combat",
            "combat",

            "parkour",

            "treasure",

            "event",

            "shop",

            "secret"
        ];

        return weights[
            Math.floor(
                Math.random() *
                weights.length
            )
        ];
    }

    // =========================================
    // Theme
    // =========================================

    getTheme() {

        return this.themes[
            Math.floor(
                Math.random() *
                this.themes.length
            )
        ];
    }

    // =========================================
    // Theme Color
    // =========================================

    getThemeColor(theme) {

        switch(theme) {

            case "shadow":
                return "#1c1b2e";

            case "fire":
                return "#3a1f1a";

            case "ice":
                return "#1b2f42";

            case "storm":
                return "#2b2d3d";

            case "poison":
                return "#23331f";

            case "holy":
                return "#3f3b28";

            case "ancient":
                return "#2d261f";

            default:
                return "#222222";
        }
    }

    // =========================================
    // Platforms
    // =========================================

    generatePlatforms(room) {

        const platformCount =
            6 +
            Math.floor(
                Math.random() * 10
            );

        for (
            let i = 0;
            i < platformCount;
            i++
        ) {

            room.platforms.push({

                x:
                    room.x +
                    Math.random() *
                    room.width,

                y:
                    room.y +
                    100 +
                    Math.random() *
                    (room.height - 200),

                width:
                    120 +
                    Math.random() * 220,

                height: 20,

                moving:
                    Math.random() > 0.8,

                vertical:
                    Math.random() > 0.5,

                speed:
                    40 +
                    Math.random() * 80,

                breakable:
                    Math.random() > 0.9
            });
        }
    }

    // =========================================
    // Hazards
    // =========================================

    generateHazards(room) {

        if (
            room.type === "rest" ||
            room.type === "shop"
        ) {

            return;
        }

        const hazardCount =
            Math.floor(
                Math.random() * 6
            );

        for (
            let i = 0;
            i < hazardCount;
            i++
        ) {

            const types = [

                "spikes",

                "lava",

                "saw",

                "void",

                "lightning"
            ];

            room.hazards.push({

                type:
                    types[
                        Math.floor(
                            Math.random() *
                            types.length
                        )
                    ],

                x:
                    room.x +
                    Math.random() *
                    room.width,

                y:
                    room.y +
                    Math.random() *
                    room.height,

                width:
                    60 +
                    Math.random() * 80,

                height:
                    60 +
                    Math.random() * 80,

                damage:
                    15 +
                    Math.random() * 25
            });
        }
    }

    // =========================================
    // Loot
    // =========================================

    generateLoot(room) {

        const lootCount =

            room.type === "treasure"
            ? 8
            : 2 + Math.floor(
                Math.random() * 4
            );

        for (
            let i = 0;
            i < lootCount;
            i++
        ) {

            const rarities = [

                "common",
                "uncommon",
                "rare",
                "epic",
                "legendary"
            ];

            room.loot.push({

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

                rarity:
                    rarities[
                        Math.floor(
                            Math.random() *
                            rarities.length
                        )
                    ],

                collected: false
            });
        }
    }

    // =========================================
    // Enemies
    // =========================================

    generateEnemies(room) {

        if (

            room.type === "rest" ||

            room.type === "shop" ||

            room.type === "treasure"
        ) {

            return;
        }

        const enemyCount =

            room.type === "combat"
            ? 6 + Math.floor(
                Math.random() * 6
            )
            : 3 + Math.floor(
                Math.random() * 4
            );

        for (
            let i = 0;
            i < enemyCount;
            i++
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

                width: 48,

                height: 64,

                health:
                    60 +
                    this.game.floor * 12,

                damage:
                    10 +
                    this.game.floor * 2,

                elite:
                    Math.random() > 0.9
            });
        }
    }

    // =========================================
    // Boss Room
    // =========================================

    createBossRoom(x) {

        return {

            id: 999,

            type: "boss",

            theme: "shadow",

            x,

            y: 150,

            width: 1800,

            height: 1000,

            cleared: false,

            discovered: false,

            enemies: [

                {

                    boss: true,

                    x: x + 900,

                    y: 500,

                    width: 180,

                    height: 220,

                    health:
                        5000 +
                        this.game.floor * 500,

                    damage:
                        50 +
                        this.game.floor * 10
                }
            ],

            loot: [

                {

                    rarity: "legendary",

                    x: x + 900,

                    y: 600,

                    collected: false
                }
            ],

            platforms: [],

            hazards: [],

            portals: []
        };
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        const player =
            this.game.player;

        // =====================================
        // Current Room
        // =====================================

        this.currentRoom =
            this.getCurrentRoom();

        const room =
            this.rooms[
                this.currentRoom
            ];

        if (!room) {

            return;
        }

        // =====================================
        // Discover
        // =====================================

        if (!room.discovered) {

            room.discovered = true;

            this.game.notifications.add(

                `${room.type.toUpperCase()} ROOM`,

                "info"
            );
        }

        // =====================================
        // Moving Platforms
        // =====================================

        for (
            const platform of
            room.platforms
        ) {

            if (
                platform.moving
            ) {

                if (
                    platform.vertical
                ) {

                    platform.y +=

                        Math.sin(
                            Date.now() * 0.001
                        ) *

                        platform.speed *

                        deltaTime;

                } else {

                    platform.x +=

                        Math.sin(
                            Date.now() * 0.001
                        ) *

                        platform.speed *

                        deltaTime;
                }
            }
        }

        // =====================================
        // Loot Pickup
        // =====================================

        for (
            const loot of
            room.loot
        ) {

            if (
                loot.collected
            ) {

                continue;
            }

            if (
                this.distance(
                    player.x,
                    player.y,
                    loot.x,
                    loot.y
                ) < 60
            ) {

                loot.collected = true;

                this.collectLoot(
                    loot
                );
            }
        }

        // =====================================
        // Room Clear
        // =====================================

        const aliveEnemies =
            room.enemies.filter(
                e => e.health > 0
            );

        if (
            aliveEnemies.length === 0 &&
            !room.cleared
        ) {

            room.cleared = true;

            this.roomCleared(
                room
            );
        }
    }

    // =========================================
    // Loot
    // =========================================

    collectLoot(loot) {

        const goldRewards = {

            common: 20,

            uncommon: 40,

            rare: 100,

            epic: 300,

            legendary: 1000
        };

        this.game.gold +=
            goldRewards[
                loot.rarity
            ] || 10;

        this.game.notifications.add(

            `${loot.rarity.toUpperCase()} Loot Collected`,

            "success"
        );

        this.game.createParticles(

            loot.x,

            loot.y,

            15
        );
    }

    // =========================================
    // Room Cleared
    // =========================================

    roomCleared(room) {

        this.game.score +=
            500;

        this.game.notifications.add(

            `${room.type.toUpperCase()} CLEARED`,

            "success"
        );

        // Reward
        this.game.gold +=
            100;

        // Portal
        room.portals.push({

            x:
                room.x +
                room.width - 120,

            y:
                room.y +
                room.height / 2,

            width: 80,

            height: 120,

            active: true
        });
    }

    // =========================================
    // Current Room
    // =========================================

    getCurrentRoom() {

        const player =
            this.game.player;

        for (
            let i = 0;
            i < this.rooms.length;
            i++
        ) {

            const room =
                this.rooms[i];

            if (

                player.x >= room.x &&

                player.x <=
                room.x + room.width
            ) {

                return i;
            }
        }

        return 0;
    }

    // =========================================
    // Distance
    // =========================================

    distance(
        x1,
        y1,
        x2,
        y2
    ) {

        const dx = x2 - x1;

        const dy = y2 - y1;

        return Math.sqrt(
            dx * dx +
            dy * dy
        );
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        for (
            const room of
            this.rooms
        ) {

            this.drawRoom(
                ctx,
                room
            );
        }
    }

    // =========================================
    // Draw Room
    // =========================================

    drawRoom(
        ctx,
        room
    ) {

        ctx.save();

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            room.backgroundColor;

        ctx.fillRect(

            room.x,

            room.y,

            room.width,

            room.height
        );

        // =====================================
        // Border
        // =====================================

        ctx.strokeStyle =
            room.cleared
            ? "#44ff88"
            : "#ffffff";

        ctx.lineWidth = 4;

        ctx.strokeRect(

            room.x,

            room.y,

            room.width,

            room.height
        );

        // =====================================
        // Platforms
        // =====================================

        for (
            const platform of
            room.platforms
        ) {

            ctx.fillStyle =
                platform.breakable
                ? "#996644"
                : "#666666";

            ctx.fillRect(

                platform.x,

                platform.y,

                platform.width,

                platform.height
            );
        }

        // =====================================
        // Hazards
        // =====================================

        for (
            const hazard of
            room.hazards
        ) {

            switch(hazard.type) {

                case "spikes":

                    ctx.fillStyle =
                        "#cccccc";

                    break;

                case "lava":

                    ctx.fillStyle =
                        "#ff5522";

                    break;

                case "saw":

                    ctx.fillStyle =
                        "#bbbbbb";

                    break;

                case "void":

                    ctx.fillStyle =
                        "#000000";

                    break;

                case "lightning":

                    ctx.fillStyle =
                        "#88ddff";

                    break;
            }

            ctx.fillRect(

                hazard.x,

                hazard.y,

                hazard.width,

                hazard.height
            );
        }

        // =====================================
        // Loot
        // =====================================

        for (
            const loot of
            room.loot
        ) {

            if (
                loot.collected
            ) {

                continue;
            }

            ctx.fillStyle =

                RARITY_COLORS[
                    loot.rarity
                ];

            ctx.beginPath();

            ctx.arc(

                loot.x,

                loot.y,

                16,

                0,

                Math.PI * 2
            );

            ctx.fill();
        }

        // =====================================
        // Portals
        // =====================================

        for (
            const portal of
            room.portals
        ) {

            ctx.fillStyle =
                "rgba(120,0,255,0.7)";

            ctx.fillRect(

                portal.x,

                portal.y,

                portal.width,

                portal.height
            );
        }

        // =====================================
        // Room Label
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "20px Ar
