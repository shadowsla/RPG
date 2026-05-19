// =========================================
// Ultimate Tower RPG - hazards.js
// =========================================

// =========================================
// Hazard System
// =========================================

export class HazardSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Hazards
        // =====================================

        this.hazards = [];

        // =====================================
        // Hazard Types
        // =====================================

        this.types = [

            "spikes",

            "lava",

            "saw",

            "lightning",

            "poison",

            "void",

            "crusher",

            "fireTrap",

            "iceTrap",

            "wind",

            "fallingRock",

            "laser"
        ];

        // =====================================
        // Generate
        // =====================================

        this.generateHazards();
    }

    // =========================================
    // Generate Hazards
    // =========================================

    generateHazards() {

        this.hazards = [];

        const count =
            35 +
            this.game.floor * 2;

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const type =
                this.types[
                    Math.floor(
                        Math.random() *
                        this.types.length
                    )
                ];

            this.createHazard({

                type,

                x:
                    500 +
                    Math.random() * 8500,

                y:
                    300 +
                    Math.random() * 2200
            });
        }
    }

    // =========================================
    // Create Hazard
    // =========================================

    createHazard(data) {

        const hazard = {

            type:
                data.type || "spikes",

            x:
                data.x || 0,

            y:
                data.y || 0,

            width:
                data.width ||
                this.getDefaultWidth(
                    data.type
                ),

            height:
                data.height ||
                this.getDefaultHeight(
                    data.type
                ),

            damage:
                data.damage ||
                this.getDamage(
                    data.type
                ),

            active: true,

            timer: 0,

            direction: 1,

            speed:
                50 +
                Math.random() * 150
        };

        this.hazards.push(
            hazard
        );

        return hazard;
    }

    // =========================================
    // Default Width
    // =========================================

    getDefaultWidth(type) {

        switch(type) {

            case "laser":
                return 300;

            case "lava":
                return 240;

            case "wind":
                return 180;

            default:
                return 80;
        }
    }

    // =========================================
    // Default Height
    // =========================================

    getDefaultHeight(type) {

        switch(type) {

            case "laser":
                return 20;

            case "lava":
                return 60;

            case "wind":
                return 200;

            default:
                return 80;
        }
    }

    // =========================================
    // Damage
    // =========================================

    getDamage(type) {

        switch(type) {

            case "spikes":
                return 20;

            case "lava":
                return 35;

            case "saw":
                return 30;

            case "lightning":
                return 40;

            case "poison":
                return 10;

            case "void":
                return 999;

            case "crusher":
                return 45;

            case "fireTrap":
                return 28;

            case "iceTrap":
                return 18;

            case "wind":
                return 5;

            case "fallingRock":
                return 32;

            case "laser":
                return 50;

            default:
                return 10;
        }
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        const player =
            this.game.player;

        for (
            const hazard of
            this.hazards
        ) {

            hazard.timer +=
                deltaTime;

            // =================================
            // Movement
            // =================================

            this.updateHazardMovement(
                hazard,
                deltaTime
            );

            // =================================
            // Collision
            // =================================

            if (

                hazard.active &&

                this.checkCollision(
                    player,
                    hazard
                )
            ) {

                this.applyHazardEffect(
                    player,
                    hazard
                );
            }
        }
    }

    // =========================================
    // Hazard Movement
    // =========================================

    updateHazardMovement(
        hazard,
        deltaTime
    ) {

        switch(hazard.type) {

            // =================================
            // Moving Saw
            // =================================

            case "saw":

                hazard.x +=

                    Math.sin(
                        hazard.timer * 2
                    ) *

                    hazard.speed *

                    deltaTime;

                break;

            // =================================
            // Lightning
            // =================================

            case "lightning":

                hazard.active =

                    Math.sin(
                        hazard.timer * 6
                    ) > 0;

                break;

            // =================================
            // Crusher
            // =================================

            case "crusher":

                hazard.y +=

                    Math.sin(
                        hazard.timer * 3
                    ) *

                    hazard.speed *

                    deltaTime;

                break;

            // =================================
            // Falling Rock
            // =================================

            case "fallingRock":

                hazard.y +=
                    hazard.speed *
                    deltaTime;

                // Reset
                if (
                    hazard.y > 3200
                ) {

                    hazard.y = -100;
                }

                break;

            // =================================
            // Laser
            // =================================

            case "laser":

                hazard.active =

                    Math.sin(
                        hazard.timer * 4
                    ) > -0.2;

                break;

            // =================================
            // Wind
            // =================================

            case "wind":

                hazard.force =

                    Math.sin(
                        hazard.timer * 2
                    ) * 500;

                break;
        }
    }

    // =========================================
    // Apply Effect
    // =========================================

    applyHazardEffect(
        player,
        hazard
    ) {

        // =====================================
        // Invincibility
        // =====================================

        if (
            player.invincible
        ) {

            return;
        }

        // =====================================
        // Damage
        // =====================================

        if (
            hazard.type !== "wind"
        ) {

            player.health -=
                hazard.damage;

            player.invincible = true;

            player.invincibleTimer = 0.5;
        }

        // =====================================
        // Knockback
        // =====================================

        const direction =

            player.x <
            hazard.x

            ? -1
            : 1;

        player.vx =
            direction * 450;

        player.vy = -300;

        // =====================================
        // Special Effects
        // =====================================

        switch(hazard.type) {

            // =================================
            // Lava Burn
            // =================================

            case "lava":

                player.burning = true;

                player.burnTimer = 3;

                break;

            // =================================
            // Poison
            // =================================

            case "poison":

                player.poisoned = true;

                player.poisonTimer = 5;

                break;

            // =================================
            // Ice
            // =================================

            case "iceTrap":

                player.slowed = true;

                player.slowTimer = 3;

                break;

            // =================================
            // Wind
            // =================================

            case "wind":

                player.vx +=
                    hazard.force * 0.02;

                break;

            // =================================
            // Void
            // =================================

            case "void":

                player.health = 0;

                break;

            // =================================
            // Lightning
            // =================================

            case "lightning":

                this.game.screenEffects
                    .flash("#88ddff");

                break;
        }

        // =====================================
        // Effects
        // =====================================

        this.game.camera.shake(
            6,
            0.2
        );

        this.game.createParticles(

            player.x,

            player.y,

            15
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
    // Draw
    // =========================================

    draw(ctx) {

        for (
            const hazard of
            this.hazards
        ) {

            if (
                !hazard.active
            ) {

                continue;
            }

            this.drawHazard(
                ctx,
                hazard
            );
        }
    }

    // =========================================
    // Draw Hazard
    // =========================================

    drawHazard(
        ctx,
        hazard
    ) {

        ctx.save();

        switch(hazard.type) {

            // =================================
            // Spikes
            // =================================

            case "spikes":

                ctx.fillStyle =
                    "#cccccc";

                for (
                    let i = 0;
                    i < 5;
                    i++
                ) {

                    ctx.beginPath();

                    ctx.moveTo(
                        hazard.x + i * 16,
                        hazard.y + 80
                    );

                    ctx.lineTo(
                        hazard.x + 8 + i * 16,
                        hazard.y
                    );

                    ctx.lineTo(
                        hazard.x + 16 + i * 16,
                        hazard.y + 80
                    );

                    ctx.fill();
                }

                break;

            // =================================
            // Lava
            // =================================

            case "lava":

                ctx.fillStyle =
                    "#ff5522";

                ctx.fillRect(

                    hazard.x,

                    hazard.y,

                    hazard.width,

                    hazard.height
                );

                // Glow
                ctx.shadowBlur = 20;

                ctx.shadowColor =
                    "#ff2200";

                break;

            // =================================
            // Saw
            // =================================

            case "saw":

                ctx.translate(

                    hazard.x +
                    hazard.width / 2,

                    hazard.y +
                    hazard.height / 2
                );

                ctx.rotate(
                    hazard.timer * 8
                );

                ctx.fillStyle =
                    "#aaaaaa";

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    40,
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
                        (Math.PI * 2 / 12) * i;

                    ctx.beginPath();

                    ctx.moveTo(
                        Math.cos(angle) * 40,
                        Math.sin(angle) * 40
                    );

                    ctx.lineTo(
                        Math.cos(angle) * 55,
                        Math.sin(angle) * 55
                    );

                    ctx.lineTo(
                        Math.cos(angle + 0.2) * 40,
                        Math.sin(angle + 0.2) * 40
                    );

                    ctx.fill();
                }

                break;

            // =================================
            // Lightning
            // =================================

            case "lightning":

                ctx.strokeStyle =
                    "#88ddff";

                ctx.lineWidth = 6;

                ctx.beginPath();

                ctx.moveTo(
                    hazard.x,
                    hazard.y
                );

                ctx.lineTo(
                    hazard.x + 20,
                    hazard.y + 40
                );

                ctx.lineTo(
                    hazard.x - 10,
                    hazard.y + 80
                );

                ctx.lineTo(
                    hazard.x + 30,
                    hazard.y + 120
                );

                ctx.stroke();

                break;

            // =================================
            // Poison
            // =================================

            case "poison":

                ctx.fillStyle =
                    "rgba(100,255,100,0.5)";

                ctx.beginPath();

                ctx.arc(

                    hazard.x,

                    hazard.y,

                    50,

                    0,

                    Math.PI * 2
                );

                ctx.fill();

                break;

            // =================================
            // Void
            // =================================

            case "void":

                ctx.fillStyle =
                    "#000000";

                ctx.beginPath();

                ctx.arc(

                    hazard.x,

                    hazard.y,

                    60,

                    0,

                    Math.PI * 2
                );

                ctx.fill();

                ctx.strokeStyle =
                    "#6633ff";

                ctx.lineWidth = 4;

                ctx.stroke();

                break;

            // =================================
            // Crusher
            // =================================

            case "crusher":

                ctx.fillStyle =
                    "#666666";

                ctx.fillRect(

                    hazard.x,

                    hazard.y,

                    hazard.width,

                    hazard.height
                );

                break;

            // =================================
            // Fire Trap
            // =================================

            case "fireTrap":

                ctx.fillStyle =
                    "#ff3300";

                ctx.beginPath();

                ctx.moveTo(
                    hazard.x,
                    hazard.y + 80
                );

                ctx.lineTo(
                    hazard.x + 40,
                    hazard.y
                );

                ctx.lineTo(
                    hazard.x + 80,
                    hazard.y + 80
                );

                ctx.fill();

                break;

            // =================================
            // Ice Trap
            // =================================

            case "iceTrap":

                ctx.fillStyle =
                    "#88ddff";

                ctx.fillRect(

                    hazard.x,

                    hazard.y,

                    hazard.width,

                    hazard.height
                );

                break;

            // =================================
            // Wind
            // =================================

            case "wind":

                ctx.strokeStyle =
                    "rgba(200,200,255,0.5)";

                for (
                    let i = 0;
                    i < 8;
                    i++
                ) {

                    ctx.beginPath();

                    ctx.moveTo(
                        hazard.x,
                        hazard.y + i * 20
                    );

                    ctx.lineTo(
                        hazard.x + hazard.width,
                        hazard.y + i * 20
                    );

                    ctx.stroke();
                }

                break;

            // =================================
            // Falling Rock
            // =================================

            case "fallingRock":

                ctx.fillStyle =
                    "#775544";

                ctx.beginPath();

                ctx.arc(

                    hazard.x,

                    hazard.y,

                    40,

                    0,

                    Math.PI * 2
                );

                ctx.fill();

                break;

            // =================================
            // Laser
            // =================================

            case "laser":

                ctx.fillStyle =
                    "#ff0000";

                ctx.fillRect(

                    hazard.x,

                    hazard.y,

                    hazard.width,

                    hazard.height
                );

                ctx.shadowBlur = 25;

                ctx.shadowColor =
                    "#ff0000";

                break;
        }

        ctx.restore();
    }
}
