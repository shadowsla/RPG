// =========================================
// Ultimate Tower RPG - traps.js
// =========================================

import {
    ELEMENTS
} from "./constants.js";

// =========================================
// Trap Manager
// =========================================

export class TrapManager {

    constructor(game) {

        this.game = game;

        this.traps = [];

        this.spawnInitialTraps();
    }

    // =========================================
    // Spawn Starting Traps
    // =========================================

    spawnInitialTraps() {

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            const type =
                this.getRandomTrapType();

            this.createTrap(

                500 +
                Math.random() * 7000,

                400 +
                Math.random() * 1800,

                type
            );
        }
    }

    // =========================================
    // Random Trap
    // =========================================

    getRandomTrapType() {

        const trapTypes = [

            "spikes",

            "fire",

            "ice",

            "poison",

            "lightning",

            "sawblade",

            "fallingRock"
        ];

        return trapTypes[
            Math.floor(
                Math.random() *
                trapTypes.length
            )
        ];
    }

    // =========================================
    // Create Trap
    // =========================================

    createTrap(
        x,
        y,
        type = "spikes"
    ) {

        const trap = {

            x,
            y,

            width: 64,

            height: 64,

            type,

            active: true,

            cooldown: 0,

            timer: 0,

            damage: 20,

            element: null,

            rotation: 0,

            animationTime: 0
        };

        // =====================================
        // Type Settings
        // =====================================

        switch(type) {

            case "spikes":

                trap.damage = 25;

                trap.cooldownMax = 1.5;

                break;

            case "fire":

                trap.damage = 18;

                trap.element =
                    ELEMENTS.FIRE;

                trap.cooldownMax = 0.4;

                break;

            case "ice":

                trap.damage = 12;

                trap.element =
                    ELEMENTS.ICE;

                trap.cooldownMax = 0.7;

                break;

            case "poison":

                trap.damage = 10;

                trap.element =
                    ELEMENTS.POISON;

                trap.cooldownMax = 0.5;

                break;

            case "lightning":

                trap.damage = 35;

                trap.element =
                    ELEMENTS.LIGHTNING;

                trap.cooldownMax = 2;

                break;

            case "sawblade":

                trap.damage = 22;

                trap.cooldownMax = 0.15;

                break;

            case "fallingRock":

                trap.damage = 45;

                trap.cooldownMax = 3;

                break;
        }

        this.traps.push(trap);

        return trap;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        const player =
            this.game.player;

        for (
            const trap of
            this.traps
        ) {

            trap.timer += deltaTime;

            trap.animationTime +=
                deltaTime;

            // Cooldown
            if (
                trap.cooldown > 0
            ) {

                trap.cooldown -=
                    deltaTime;
            }

            // Rotating Saw
            if (
                trap.type ===
                "sawblade"
            ) {

                trap.rotation +=
                    deltaTime * 8;
            }

            // Falling Rock Motion
            if (
                trap.type ===
                "fallingRock"
            ) {

                trap.y +=
                    Math.sin(
                        trap.animationTime
                    ) * 0.4;
            }

            // =================================
            // Collision
            // =================================

            if (
                this.checkCollision(
                    player,
                    trap
                )
            ) {

                this.activateTrap(
                    trap,
                    player
                );
            }
        }
    }

    // =========================================
    // Activate Trap
    // =========================================

    activateTrap(
        trap,
        target
    ) {

        if (
            trap.cooldown > 0
        ) {

            return;
        }

        trap.cooldown =
            trap.cooldownMax;

        // =====================================
        // Damage
        // =====================================

        if (
            target.takeDamage
        ) {

            target.takeDamage(
                trap.damage,
                trap.element
            );
        }

        // =====================================
        // Effects
        // =====================================

        switch(trap.type) {

            case "spikes":

                this.game.animations.play(

                    "slash",

                    trap.x +
                    trap.width / 2,

                    trap.y
                );

                break;

            case "fire":

                this.spawnFireParticles(
                    trap
                );

                break;

            case "ice":

                target.slowed = true;

                target.slowTimer = 2;

                break;

            case "poison":

                target.poisoned = true;

                target.poisonTimer = 5;

                break;

            case "lightning":

                this.game.animations.play(

                    "lightning",

                    trap.x +
                    trap.width / 2,

                    trap.y
                );

                this.game.camera.shake(
                    8,
                    0.25
                );

                break;

            case "sawblade":

                target.knockbackX =
                    (
                        target.x - trap.x
                    ) * 3;

                break;

            case "fallingRock":

                this.game.camera.shake(
                    15,
                    0.4
                );

                break;
        }

        // Notification
        this.game.notifications.add(

            `Hit By ${trap.type}!`,

            "danger"
        );
    }

    // =========================================
    // Fire Particles
    // =========================================

    spawnFireParticles(trap) {

        for (
            let i = 0;
            i < 10;
            i++
        ) {

            this.game.particles.push({

                x:
                    trap.x +
                    Math.random() *
                    trap.width,

                y:
                    trap.y +
                    Math.random() *
                    trap.height,

                vx:
                    (Math.random() - 0.5) *
                    120,

                vy:
                    -50 -
                    Math.random() * 120,

                size:
                    4 +
                    Math.random() * 8,

                life: 1,

                color: "#ff6622",

                update(deltaTime) {

                    this.x +=
                        this.vx *
                        deltaTime;

                    this.y +=
                        this.vy *
                        deltaTime;

                    this.life -=
                        deltaTime;
                },

                draw(ctx) {

                    ctx.save();

                    ctx.globalAlpha =
                        this.life;

                    ctx.fillStyle =
                        this.color;

                    ctx.beginPath();

                    ctx.arc(

                        this.x,

                        this.y,

                        this.size,

                        0,

                        Math.PI * 2
                    );

                    ctx.fill();

                    ctx.restore();
                },

                get dead() {

                    return this.life <= 0;
                }
            });
        }
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
            const trap of
            this.traps
        ) {

            this.drawTrap(
                ctx,
                trap
            );
        }
    }

    // =========================================
    // Draw Trap
    // =========================================

    drawTrap(
        ctx,
        trap
    ) {

        ctx.save();

        ctx.translate(

            trap.x +
            trap.width / 2,

            trap.y +
            trap.height / 2
        );

        ctx.rotate(
            trap.rotation
        );

        switch(trap.type) {

            // =================================
            // Spikes
            // =================================

            case "spikes":

                ctx.fillStyle =
                    "#cccccc";

                for (
                    let i = -24;
                    i <= 24;
                    i += 16
                ) {

                    ctx.beginPath();

                    ctx.moveTo(i, 20);

                    ctx.lineTo(i + 8, -20);

                    ctx.lineTo(i + 16, 20);

                    ctx.fill();
                }

                break;

            // =================================
            // Fire
            // =================================

            case "fire":

                ctx.fillStyle =
                    "#ff5522";

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    24,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                break;

            // =================================
            // Ice
            // =================================

            case "ice":

                ctx.fillStyle =
                    "#88ddff";

                ctx.fillRect(
                    -24,
                    -24,
                    48,
                    48
                );

                break;

            // =================================
            // Poison
            // =================================

            case "poison":

                ctx.fillStyle =
                    "#66cc44";

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    26,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                break;

            // =================================
            // Lightning
            // =================================

            case "lightning":

                ctx.strokeStyle =
                    "#aaddff";

                ctx.lineWidth = 6;

                ctx.beginPath();

                ctx.moveTo(0, -25);

                ctx.lineTo(-10, -5);

                ctx.lineTo(5, -5);

                ctx.lineTo(-5, 25);

                ctx.stroke();

                break;

            // =================================
            // Sawblade
            // =================================

            case "sawblade":

                ctx.fillStyle =
                    "#bbbbbb";

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    28,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                // Teeth
                for (
                    let i = 0;
                    i < 12;
                    i++
                ) {

                    const angle =
                        (
                            Math.PI * 2 / 12
                        ) * i;

                    const x =
                        Math.cos(angle) *
                        34;

                    const y =
                        Math.sin(angle) *
                        34;

                    ctx.beginPath();

                    ctx.arc(
                        x,
                        y,
                        5,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();
                }

                break;

            // =================================
            // Falling Rock
            // =================================

            case "fallingRock":

                ctx.fillStyle =
                    "#7a6a5f";

                ctx.fillRect(
                    -30,
                    -30,
                    60,
                    60
                );

                break;
        }

        ctx.restore();
    }
}
