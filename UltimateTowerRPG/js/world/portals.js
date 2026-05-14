// =========================================
// Ultimate Tower RPG - portals.js
// =========================================

import {
    RARITY_COLORS
} from "./constants.js";

// =========================================
// Portal System
// =========================================

export class PortalSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Portals
        // =====================================

        this.portals = [];

        // =====================================
        // Portal Types
        // =====================================

        this.portalTypes = [

            "floor",

            "boss",

            "secret",

            "challenge",

            "shop",

            "void",

            "event"
        ];

        // =====================================
        // Generate
        // =====================================

        this.generateInitialPortals();
    }

    // =========================================
    // Generate Starting Portals
    // =========================================

    generateInitialPortals() {

        this.portals = [];

        // Floor Exit Portal
        this.createPortal({

            type: "floor",

            x: 8500,

            y: 900,

            width: 100,

            height: 160,

            destination:
                this.game.floor + 1
        });

        // Secret Portal Chance
        if (
            Math.random() > 0.8
        ) {

            this.createPortal({

                type: "secret",

                x:
                    2000 +
                    Math.random() * 5000,

                y:
                    500 +
                    Math.random() * 1200,

                width: 90,

                height: 140,

                destination:
                    "secretRealm"
            });
        }

        // Challenge Portal
        if (
            Math.random() > 0.7
        ) {

            this.createPortal({

                type: "challenge",

                x:
                    3000 +
                    Math.random() * 4000,

                y:
                    500 +
                    Math.random() * 1400,

                width: 100,

                height: 160,

                destination:
                    "challengeArena"
            });
        }
    }

    // =========================================
    // Create Portal
    // =========================================

    createPortal(data) {

        const portal = {

            type:
                data.type || "floor",

            x:
                data.x || 0,

            y:
                data.y || 0,

            width:
                data.width || 100,

            height:
                data.height || 160,

            destination:
                data.destination || 1,

            active: true,

            unlocked:
                data.unlocked ?? true,

            timer: 0,

            rotation: 0,

            particles: [],

            color:
                this.getPortalColor(
                    data.type
                )
        };

        this.portals.push(
            portal
        );

        return portal;
    }

    // =========================================
    // Portal Color
    // =========================================

    getPortalColor(type) {

        switch(type) {

            case "floor":
                return "#8844ff";

            case "boss":
                return "#ff3333";

            case "secret":
                return "#33ffee";

            case "challenge":
                return "#ffaa22";

            case "shop":
                return "#44ff88";

            case "void":
                return "#000000";

            case "event":
                return "#ff66ff";

            default:
                return "#ffffff";
        }
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        const player =
            this.game.player;

        for (
            const portal of
            this.portals
        ) {

            portal.timer +=
                deltaTime;

            portal.rotation +=
                deltaTime;

            // =================================
            // Floating Animation
            // =================================

            portal.floatOffset =

                Math.sin(
                    portal.timer * 2
                ) * 8;

            // =================================
            // Portal Particles
            // =================================

            if (
                Math.random() > 0.7
            ) {

                this.spawnPortalParticle(
                    portal
                );
            }

            // =================================
            // Particle Update
            // =================================

            for (
                let i =
                    portal.particles.length - 1;
                i >= 0;
                i--
            ) {

                const particle =
                    portal.particles[i];

                particle.life -=
                    deltaTime;

                particle.x +=
                    particle.vx *
                    deltaTime;

                particle.y +=
                    particle.vy *
                    deltaTime;

                if (
                    particle.life <= 0
                ) {

                    portal.particles.splice(
                        i,
                        1
                    );
                }
            }

            // =================================
            // Player Collision
            // =================================

            if (

                portal.active &&

                portal.unlocked &&

                this.checkCollision(
                    player,
                    portal
                )
            ) {

                // Interact
                if (
                    this.game.keys["KeyX"]
                ) {

                    this.activatePortal(
                        portal
                    );
                }
            }
        }
    }

    // =========================================
    // Activate Portal
    // =========================================

    activatePortal(portal) {

        this.game.screenEffects.fadeOut(
            0.4
        );

        this.game.camera.shake(
            10,
            0.4
        );

        this.game.notifications.add(

            `Entering ${portal.type.toUpperCase()} Portal`,

            "warning"
        );

        switch(portal.type) {

            // =================================
            // Next Floor
            // =================================

            case "floor":

                setTimeout(() => {

                    this.game.floor =
                        portal.destination;

                    this.game.generateFloor();

                    this.game.spawnEnemies();

                    this.game.player.x =
                        400;

                    this.game.player.y =
                        500;

                }, 400);

                break;

            // =================================
            // Boss Arena
            // =================================

            case "boss":

                setTimeout(() => {

                    this.spawnBossArena();

                }, 400);

                break;

            // =================================
            // Secret Realm
            // =================================

            case "secret":

                setTimeout(() => {

                    this.enterSecretRealm();

                }, 400);

                break;

            // =================================
            // Challenge Arena
            // =================================

            case "challenge":

                setTimeout(() => {

                    this.enterChallengeArena();

                }, 400);

                break;

            // =================================
            // Shop
            // =================================

            case "shop":

                this.game.menus.open(
                    "shop"
                );

                break;

            // =================================
            // Void
            // =================================

            case "void":

                setTimeout(() => {

                    this.enterVoidDimension();

                }, 400);

                break;

            // =================================
            // Event
            // =================================

            case "event":

                this.triggerEvent();

                break;
        }
    }

    // =========================================
    // Secret Realm
    // =========================================

    enterSecretRealm() {

        this.game.notifications.add(

            "Secret Realm Discovered!",

            "success"
        );

        this.game.gold += 1000;

        this.game.player.health =
            this.game.player.maxHealth;

        // Spawn Legendary Loot
        for (
            let i = 0;
            i < 5;
            i++
        ) {

            this.game.lootDrops.push({

                x:
                    1200 + i * 120,

                y: 700,

                rarity: "legendary"
            });
        }
    }

    // =========================================
    // Challenge Arena
    // =========================================

    enterChallengeArena() {

        this.game.notifications.add(

            "Challenge Arena Started",

            "danger"
        );

        // Spawn Waves
        for (
            let i = 0;
            i < 20;
            i++
        ) {

            this.game.spawnEnemy?.(

                1000 +
                Math.random() * 2000,

                500 +
                Math.random() * 800,

                true
            );
        }
    }

    // =========================================
    // Void
    // =========================================

    enterVoidDimension() {

        this.game.background
            .setTheme("void");

        this.game.notifications.add(

            "Entered The Void",

            "danger"
        );

        // Strong Enemies
        this.game.enemyMultiplier =
            4;

        // Rare Loot
        this.game.lootMultiplier =
            5;
    }

    // =========================================
    // Boss Arena
    // =========================================

    spawnBossArena() {

        this.game.notifications.add(

            "Boss Arena Opened",

            "danger"
        );

        this.game.spawnBoss?.(
            "towerGuardian"
        );
    }

    // =========================================
    // Random Event
    // =========================================

    triggerEvent() {

        const events = [

            "Gold Rain",

            "Double Damage",

            "Low Gravity",

            "Meteor Storm",

            "Enemy Frenzy"
        ];

        const event =
            events[
                Math.floor(
                    Math.random() *
                    events.length
                )
            ];

        this.game.notifications.add(

            event,

            "warning"
        );
    }

    // =========================================
    // Particles
    // =========================================

    spawnPortalParticle(portal) {

        portal.particles.push({

            x:
                portal.x +
                portal.width / 2,

            y:
                portal.y +
                portal.height / 2,

            vx:
                (Math.random() - 0.5) *
                120,

            vy:
                (Math.random() - 0.5) *
                120,

            size:
                2 +
                Math.random() * 6,

            life: 1,

            color:
                portal.color
        });
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
    // Draw
    // =========================================

    draw(ctx) {

        for (
            const portal of
            this.portals
        ) {

            this.drawPortal(
                ctx,
                portal
            );
        }
    }

    // =========================================
    // Draw Portal
    // =========================================

    drawPortal(
        ctx,
        portal
    ) {

        ctx.save();

        const drawY =
            portal.y +
            (portal.floatOffset || 0);

        // =====================================
        // Glow
        // =====================================

        ctx.shadowBlur = 30;

        ctx.shadowColor =
            portal.color;

        // =====================================
        // Portal Ring
        // =====================================

        ctx.translate(

            portal.x +
            portal.width / 2,

            drawY +
            portal.height / 2
        );

        ctx.rotate(
            portal.rotation
        );

        ctx.strokeStyle =
            portal.color;

        ctx.lineWidth = 8;

        ctx.beginPath();

        ctx.arc(

            0,

            0,

            portal.width / 2,

            0,

            Math.PI * 2
        );

        ctx.stroke();

        // =====================================
        // Inner Portal
        // =====================================

        const gradient =
            ctx.createRadialGradient(

                0,
                0,
                10,

                0,
                0,
                portal.width / 2
            );

        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            1,
            portal.color
        );

        ctx.fillStyle =
            gradient;

        ctx.globalAlpha = 0.7;

        ctx.beginPath();

        ctx.arc(

            0,

            0,

            portal.width / 2 - 10,

            0,

            Math.PI * 2
        );

        ctx.fill();

        // =====================================
        // Symbol
        // =====================================

        ctx.globalAlpha = 1;

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "28px Arial";

        let symbol = "◉";

        switch(portal.type) {

            case "floor":
                symbol = "⇧";
                break;

            case "boss":
                symbol = "☠";
                break;

            case "secret":
                symbol = "✦";
                break;

            case "challenge":
                symbol = "⚔";
                break;

            case "shop":
                symbol = "$";
                break;

            case "void":
                symbol = "∞";
                break;

            case "event":
                symbol = "☼";
                break;
        }

        ctx.fillText(
            symbol,
            -10,
            10
        );

        // =====================================
        // Particles
        // =====================================

        for (
            const particle of
            portal.particles
        ) {

            ctx.globalAlpha =
                particle.life;

            ctx.fillStyle =
                particle.color;

            ctx.beginPath();

            ctx.arc(

                particle.x -
                portal.x -
                portal.width / 2,

                particle.y -
                drawY -
                portal.height / 2,

                particle.size,

                0,

                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();

        // =====================================
        // Interact Text
        // =====================================

        const player =
            this.game.player;

        if (
            this.checkCollision(
                player,
                portal
            )
        ) {

            ctx.save();

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "20px Arial";

            ctx.fillText(

                "Press X",

                portal.x - 10,

                drawY - 20
            );

            ctx.restore();
        }
    }
}
