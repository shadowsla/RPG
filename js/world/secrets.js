// =========================================
// Ultimate Tower RPG - secrets.js
// =========================================

// =========================================
// Secret System
// =========================================

export class SecretSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Secrets
        // =====================================

        this.hiddenRooms = [];

        this.secretWalls = [];

        this.secretChests = [];

        this.hiddenNPCs = [];

        this.runes = [];

        // =====================================
        // Discovery
        // =====================================

        this.discoveredSecrets = 0;

        this.totalSecrets = 0;

        // =====================================
        // Rare Events
        // =====================================

        this.secretPortalChance = 0.01;

        this.mimicChance = 0.08;

        // =====================================
        // Generate
        // =====================================

        this.generateSecrets();
    }

    // =========================================
    // Generate Secrets
    // =========================================

    generateSecrets() {

        this.hiddenRooms = [];

        this.secretWalls = [];

        this.secretChests = [];

        this.hiddenNPCs = [];

        this.runes = [];

        // =====================================
        // Hidden Rooms
        // =====================================

        for (
            let i = 0;
            i < 6;
            i++
        ) {

            this.hiddenRooms.push({

                x:
                    800 +
                    Math.random() * 7000,

                y:
                    300 +
                    Math.random() * 1800,

                width: 500,

                height: 300,

                discovered: false,

                reward:
                    this.getRandomReward()
            });
        }

        // =====================================
        // Secret Walls
        // =====================================

        for (
            let i = 0;
            i < 20;
            i++
        ) {

            this.secretWalls.push({

                x:
                    500 +
                    Math.random() * 8000,

                y:
                    300 +
                    Math.random() * 2200,

                width: 64,

                height: 128,

                broken: false,

                hp: 50
            });
        }

        // =====================================
        // Secret Chests
        // =====================================

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            this.secretChests.push({

                x:
                    600 +
                    Math.random() * 7600,

                y:
                    300 +
                    Math.random() * 2000,

                width: 50,

                height: 40,

                opened: false,

                mimic:
                    Math.random() <
                    this.mimicChance,

                rarity:
                    this.getChestRarity()
            });
        }

        // =====================================
        // Hidden NPCs
        // =====================================

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            this.hiddenNPCs.push({

                x:
                    1000 +
                    Math.random() * 6500,

                y:
                    400 +
                    Math.random() * 1600,

                width: 48,

                height: 72,

                found: false,

                dialogue:
                    this.getNPCDialogue()
            });
        }

        // =====================================
        // Ancient Runes
        // =====================================

        for (
            let i = 0;
            i < 15;
            i++
        ) {

            this.runes.push({

                x:
                    500 +
                    Math.random() * 8200,

                y:
                    300 +
                    Math.random() * 2100,

                activated: false,

                symbol:
                    this.getRuneSymbol()
            });
        }

        this.totalSecrets =

            this.hiddenRooms.length +

            this.secretWalls.length +

            this.secretChests.length +

            this.hiddenNPCs.length +

            this.runes.length;
    }

    // =========================================
    // Random Reward
    // =========================================

    getRandomReward() {

        const rewards = [

            "legendary_weapon",

            "mythic_armor",

            "gold_cache",

            "skill_scroll",

            "pet_egg",

            "mount_token",

            "rare_material",

            "boss_key"
        ];

        return rewards[
            Math.floor(
                Math.random() *
                rewards.length
            )
        ];
    }

    // =========================================
    // Chest Rarity
    // =========================================

    getChestRarity() {

        const roll =
            Math.random();

        if (roll < 0.5) {
            return "common";
        }

        if (roll < 0.75) {
            return "rare";
        }

        if (roll < 0.93) {
            return "epic";
        }

        return "legendary";
    }

    // =========================================
    // Rune Symbol
    // =========================================

    getRuneSymbol() {

        const symbols = [

            "☼",
            "✦",
            "☾",
            "✧",
            "⚡",
            "❖",
            "☠",
            "∞"
        ];

        return symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];
    }

    // =========================================
    // NPC Dialogue
    // =========================================

    getNPCDialogue() {

        const dialogue = [

            "The tower watches...",

            "Beyond floor 100 lies chaos.",

            "Hidden power sleeps below.",

            "A cursed king rules the abyss.",

            "Beware the endless floors.",

            "Only legends survive here."
        ];

        return dialogue[
            Math.floor(
                Math.random() *
                dialogue.length
            )
        ];
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        const player =
            this.game.player;

        // =====================================
        // Hidden Rooms
        // =====================================

        for (
            const room of
            this.hiddenRooms
        ) {

            if (
                !room.discovered &&
                this.distance(
                    player.x,
                    player.y,
                    room.x,
                    room.y
                ) < 200
            ) {

                room.discovered = true;

                this.discoveredSecrets++;

                this.game.notifications.add(

                    "Hidden Room Found!",

                    "success"
                );

                this.game.camera.shake(
                    5,
                    0.2
                );
            }
        }

        // =====================================
        // Secret Walls
        // =====================================

        for (
            const wall of
            this.secretWalls
        ) {

            if (
                wall.broken
            ) {

                continue;
            }

            // Attack Detection
            if (
                player.attacking &&
                this.checkCollision(
                    player,
                    wall
                )
            ) {

                wall.hp -=
                    player.damage;

                this.game.createParticles(

                    wall.x,

                    wall.y,

                    8
                );

                if (
                    wall.hp <= 0
                ) {

                    wall.broken = true;

                    this.discoveredSecrets++;

                    this.game.notifications.add(

                        "Secret Passage Opened!",

                        "warning"
                    );
                }
            }
        }

        // =====================================
        // Secret Chests
        // =====================================

        for (
            const chest of
            this.secretChests
        ) {

            if (
                chest.opened
            ) {

                continue;
            }

            if (
                this.checkCollision(
                    player,
                    chest
                ) &&
                this.game.keys["KeyX"]
            ) {

                chest.opened = true;

                this.discoveredSecrets++;

                // Mimic
                if (
                    chest.mimic
                ) {

                    this.spawnMimic(
                        chest.x,
                        chest.y
                    );

                    this.game.notifications.add(

                        "MIMIC!",

                        "danger"
                    );

                } else {

                    this.giveChestReward(
                        chest
                    );

                    this.game.notifications.add(

                        `${chest.rarity.toUpperCase()} Chest Opened`,

                        "success"
                    );
                }
            }
        }

        // =====================================
        // Hidden NPCs
        // =====================================

        for (
            const npc of
            this.hiddenNPCs
        ) {

            if (
                npc.found
            ) {

                continue;
            }

            if (
                this.distance(
                    player.x,
                    player.y,
                    npc.x,
                    npc.y
                ) < 120
            ) {

                npc.found = true;

                this.discoveredSecrets++;

                this.game.notifications.add(

                    npc.dialogue,

                    "info"
                );
            }
        }

        // =====================================
        // Runes
        // =====================================

        for (
            const rune of
            this.runes
        ) {

            if (
                rune.activated
            ) {

                continue;
            }

            if (
                this.distance(
                    player.x,
                    player.y,
                    rune.x,
                    rune.y
                ) < 80
            ) {

                rune.activated = true;

                this.discoveredSecrets++;

                this.activateRune(
                    rune
                );
            }
        }

        // =====================================
        // Secret Portal
        // =====================================

        if (
            Math.random() <
            this.secretPortalChance *
            deltaTime
        ) {

            this.spawnSecretPortal();
        }
    }

    // =========================================
    // Mimic
    // =========================================

    spawnMimic(x, y) {

        this.game.enemies.push({

            x,
            y,

            width: 60,

            height: 60,

            health: 200,

            damage: 35,

            speed: 260,

            mimic: true,

            update(deltaTime) {

                this.x +=
                    Math.sin(
                        Date.now() * 0.002
                    ) * 2;
            },

            draw(ctx) {

                ctx.save();

                ctx.fillStyle =
                    "#992222";

                ctx.fillRect(
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );

                ctx.fillStyle =
                    "#ffffff";

                ctx.fillText(
                    "👁",
                    this.x + 15,
                    this.y + 35
                );

                ctx.restore();
            }
        });
    }

    // =========================================
    // Rewards
    // =========================================

    giveChestReward(chest) {

        switch(chest.rarity) {

            case "common":

                this.game.gold += 50;

                break;

            case "rare":

                this.game.gold += 150;

                break;

            case "epic":

                this.game.gold += 400;

                break;

            case "legendary":

                this.game.gold += 1000;

                break;
        }
    }

    // =========================================
    // Rune
    // =========================================

    activateRune(rune) {

        this.game.animations.play(

            "levelup",

            rune.x,

            rune.y
        );

        // Random Buff
        const buffs = [

            "damage",

            "speed",

            "health",

            "mana"
        ];

        const buff =
            buffs[
                Math.floor(
                    Math.random() *
                    buffs.length
                )
            ];

        switch(buff) {

            case "damage":

                this.game.player.damage +=
                    5;

                break;

            case "speed":

                this.game.player.speed +=
                    25;

                break;

            case "health":

                this.game.player.maxHealth +=
                    20;

                break;

            case "mana":

                this.game.player.maxMana +=
                    20;

                break;
        }

        this.game.notifications.add(

            `Rune Activated: +${buff}`,

            "success"
        );
    }

    // =========================================
    // Secret Portal
    // =========================================

    spawnSecretPortal() {

        const portal = {

            x:
                1000 +
                Math.random() * 7000,

            y:
                400 +
                Math.random() * 1800,

            width: 100,

            height: 140,

            timer: 20
        };

        this.game.effects.push(
            portal
        );

        this.game.notifications.add(

            "A Secret Portal Appeared!",

            "warning"
        );
    }

    // =========================================
    // Collision
    // =========================================

    checkCollision(a, b) {

        return (

            a.x <
            b.x + b.width &&

            a.x + a.width >
            b.x &&

            a.y <
            b.y + b.height &&

            a.y + a.height >
            b.y
        );
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

        // =====================================
        // Secret Walls
        // =====================================

        for (
            const wall of
            this.secretWalls
        ) {

            if (
                wall.broken
            ) {

                continue;
            }

            ctx.save();

            ctx.globalAlpha = 0.15;

            ctx.fillStyle =
                "#ffffff";

            ctx.fillRect(

                wall.x,

                wall.y,

                wall.width,

                wall.height
            );

            ctx.restore();
        }

        // =====================================
        // Chests
        // =====================================

        for (
            const chest of
            this.secretChests
        ) {

            if (
                chest.opened
            ) {

                continue;
            }

            ctx.save();

            switch(chest.rarity) {

                case "common":

                    ctx.fillStyle =
                        "#aaaaaa";

                    break;

                case "rare":

                    ctx.fillStyle =
                        "#5599ff";

                    break;

                case "epic":

                    ctx.fillStyle =
                        "#bb55ff";

                    break;

                case "legendary":

                    ctx.fillStyle =
                        "#ffaa33";

                    break;
            }

            ctx.fillRect(

                chest.x,

                chest.y,

                chest.width,

                chest.height
            );

            ctx.restore();
        }

        // =====================================
        // Runes
        // =====================================

        for (
            const rune of
            this.runes
        ) {

            if (
                rune.activated
            ) {

                continue;
            }

            ctx.save();

            ctx.fillStyle =
                "#88ddff";

            ctx.font =
                "28px Arial";

            ctx.fillText(

                rune.symbol,

                rune.x,

                rune.y
            );

            ctx.restore();
        }

        // =====================================
        // Secret Counter
        // =====================================

        ctx.save();

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "18px Arial";

        ctx.fillText(

            `Secrets: ${this.discoveredSecrets}/${this.totalSecrets}`,

            20,

            140
        );

        ctx.restore();
    }
}
