// =========================================
// Ultimate Tower RPG - movement.js
// =========================================

// =========================================
// Advanced Movement System
// =========================================

export class MovementSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Physics
        // =====================================

        this.gravity = 0.9;

        this.terminalVelocity = 28;

        // =====================================
        // Platforming
        // =====================================

        this.platforms = [];

        this.ladders = [];

        this.ledges = [];

        // =====================================
        // Hazards
        // =====================================

        this.fallingHazards = [];

        // =====================================
        // Destructibles
        // =====================================

        this.destructibleObjects = [];

        // =====================================
        // Air Combo
        // =====================================

        this.airComboTimer = 0;

        this.airComboHits = 0;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        // =====================================
        // Apply Gravity
        // =====================================

        this.applyGravity(player);

        // =====================================
        // Platform Collision
        // =====================================

        this.handlePlatforms(player);

        // =====================================
        // Ladder Climbing
        // =====================================

        this.handleLadders(player);

        // =====================================
        // Ledge Grab
        // =====================================

        this.handleLedgeGrab(player);

        // =====================================
        // Wall Slide
        // =====================================

        this.handleWallSlide(player);

        // =====================================
        // Air Dash
        // =====================================

        this.handleAirDash(player);

        // =====================================
        // Hazards
        // =====================================

        this.updateHazards(deltaTime);

        // =====================================
        // Destructibles
        // =====================================

        this.updateDestructibles(deltaTime);

        // =====================================
        // Air Combo
        // =====================================

        this.updateAirCombos(deltaTime);
    }

    // =========================================
    // Gravity
    // =========================================

    applyGravity(player) {

        if (

            !player.grounded &&

            !player.climbing &&

            !player.ledgeGrabbing
        ) {

            player.velocityY +=
                this.gravity;
        }

        // Clamp
        if (

            player.velocityY >
            this.terminalVelocity
        ) {

            player.velocityY =
                this.terminalVelocity;
        }
    }

    // =========================================
    // Platforms
    // =========================================

    handlePlatforms(player) {

        player.grounded = false;

        for (
            const platform of
            this.platforms
        ) {

            // =================================
            // AABB Collision
            // =================================

            const colliding =

                player.x <
                platform.x +
                platform.width &&

                player.x +
                player.width >
                platform.x &&

                player.y <
                platform.y +
                platform.height &&

                player.y +
                player.height >
                platform.y;

            if (
                !colliding
            ) {

                continue;
            }

            // =================================
            // Landing
            // =================================

            const playerBottom =

                player.y +
                player.height;

            const previousBottom =

                playerBottom -
                player.velocityY;

            if (

                previousBottom <=
                platform.y &&

                player.velocityY >= 0
            ) {

                player.y =
                    platform.y -
                    player.height;

                player.velocityY = 0;

                player.grounded = true;

                player.jumping = false;

                player.doubleJumpUsed =
                    false;

                player.airDashUsed =
                    false;
            }

            // =================================
            // Head Hit
            // =================================

            else if (

                player.y >=

                platform.y +
                platform.height -
                10 &&

                player.velocityY < 0
            ) {

                player.y =

                    platform.y +
                    platform.height;

                player.velocityY = 0;
            }

            // =================================
            // Side Collision
            // =================================

            else {

                if (
                    player.velocityX > 0
                ) {

                    player.x =
                        platform.x -
                        player.width;
                }

                else if (
                    player.velocityX < 0
                ) {

                    player.x =
                        platform.x +
                        platform.width;
                }

                player.velocityX = 0;
            }
        }
    }

    // =========================================
    // Ladders
    // =========================================

    handleLadders(player) {

        player.climbing = false;

        for (
            const ladder of
            this.ladders
        ) {

            const touching =

                player.x <
                ladder.x +
                ladder.width &&

                player.x +
                player.width >
                ladder.x &&

                player.y <
                ladder.y +
                ladder.height &&

                player.y +
                player.height >
                ladder.y;

            if (
                touching
            ) {

                const keys =
                    this.game.input.keys;

                // Up
                if (

                    keys["w"] ||

                    keys["ArrowUp"]
                ) {

                    player.climbing = true;

                    player.velocityY = -6;
                }

                // Down
                else if (

                    keys["s"] ||

                    keys["ArrowDown"]
                ) {

                    player.climbing = true;

                    player.velocityY = 6;
                }

                // Idle
                else {

                    player.velocityY = 0;
                }

                if (
                    player.climbing
                ) {

                    player.grounded = false;
                }
            }
        }
    }

    // =========================================
    // Ledge Grab
    // =========================================

    handleLedgeGrab(player) {

        player.ledgeGrabbing = false;

        for (
            const ledge of
            this.ledges
        ) {

            const nearLedge =

                Math.abs(
                    player.x - ledge.x
                ) < 40 &&

                Math.abs(
                    player.y - ledge.y
                ) < 60;

            if (

                nearLedge &&

                !player.grounded &&

                player.velocityY > 0
            ) {

                const keys =
                    this.game.input.keys;

                if (

                    keys["a"] ||

                    keys["d"] ||

                    keys["ArrowLeft"] ||

                    keys["ArrowRight"]
                ) {

                    player.ledgeGrabbing =
                        true;

                    player.velocityY = 0;

                    player.y =
                        ledge.y - 40;

                    // Climb Up
                    if (

                        keys["w"] ||

                        keys["ArrowUp"]
                    ) {

                        player.y -= 70;

                        player.x +=
                            player.direction * 30;

                        player.ledgeGrabbing =
                            false;
                    }
                }
            }
        }
    }

    // =========================================
    // Wall Slide
    // =========================================

    handleWallSlide(player) {

        player.wallSliding = false;

        if (
            player.grounded
        ) {

            return;
        }

        for (
            const platform of
            this.platforms
        ) {

            const touchingWall =

                player.y <
                platform.y +
                platform.height &&

                player.y +
                player.height >
                platform.y &&

                (

                    Math.abs(

                        player.x +
                        player.width -

                        platform.x

                    ) < 10 ||

                    Math.abs(

                        player.x -

                        (platform.x +
                        platform.width)

                    ) < 10
                );

            if (
                touchingWall
            ) {

                const keys =
                    this.game.input.keys;

                if (

                    keys["a"] ||

                    keys["d"]
                ) {

                    player.wallSliding =
                        true;

                    player.velocityY =
                        Math.min(
                            player.velocityY,
                            3
                        );
                }
            }
        }
    }

    // =========================================
    // Air Dash
    // =========================================

    handleAirDash(player) {

        const keys =
            this.game.input.keys;

        if (

            player.airDashUnlocked &&

            !player.airDashUsed &&

            !player.grounded
        ) {

            if (
                keys["q"]
            ) {

                player.airDashUsed =
                    true;

                player.velocityX =
                    player.direction * 20;

                player.velocityY = 0;

                this.game.effects
                    ?.createEffect({

                        type: "dash",

                        x: player.x,

                        y: player.y,

                        direction:
                            player.direction,

                        life: 0.4
                    });
            }
        }
    }

    // =========================================
    // Air Combo
    // =========================================

    updateAirCombos(deltaTime) {

        if (
            this.airComboTimer > 0
        ) {

            this.airComboTimer -=
                deltaTime;
        }

        else {

            this.airComboHits = 0;
        }
    }

    // =========================================
    // Register Air Hit
    // =========================================

    registerAirHit(enemy) {

        const player =
            this.game.player;

        if (
            player.grounded
        ) {

            return;
        }

        this.airComboHits++;

        this.airComboTimer = 2;

        // =====================================
        // Launch Enemy
        // =====================================

        enemy.velocityY =

            -8 -

            this.airComboHits;

        // =====================================
        // Bonus Damage
        // =====================================

        enemy.takeDamage?.(

            this.airComboHits * 3
        );

        // =====================================
        // Floating Text
        // =====================================

        this.game.effects
            ?.createFloatingText({

                text:
                    `${this.airComboHits} HIT!`,

                x: enemy.x,

                y: enemy.y,

                color: "#ffff44"
            });
    }

    // =========================================
    // Hazards
    // =========================================

    updateHazards(deltaTime) {

        for (
            const hazard of
            this.fallingHazards
        ) {

            hazard.velocityY +=
                this.gravity;

            hazard.y +=
                hazard.velocityY;

            // =================================
            // Collision
            // =================================

            const player =
                this.game.player;

            const hitPlayer =

                player.x <
                hazard.x +
                hazard.width &&

                player.x +
                player.width >
                hazard.x &&

                player.y <
                hazard.y +
                hazard.height &&

                player.y +
                player.height >
                hazard.y;

            if (
                hitPlayer
            ) {

                player.takeDamage?.(
                    hazard.damage
                );

                hazard.destroyed = true;
            }

            // =================================
            // Ground Impact
            // =================================

            if (
                hazard.y >
                this.game.worldHeight
            ) {

                hazard.destroyed = true;

                this.game.effects
                    ?.createEffect({

                        type: "explosion",

                        x: hazard.x,

                        y: hazard.y,

                        life: 1
                    });
            }
        }

        // Cleanup
        this.fallingHazards =

            this.fallingHazards.filter(

                h => !h.destroyed
            );
    }

    // =========================================
    // Destructibles
    // =========================================

    updateDestructibles(deltaTime) {

        for (
            const object of
            this.destructibleObjects
        ) {

            if (
                object.health <= 0
            ) {

                object.destroyed = true;

                // Loot
                this.spawnLoot(object);

                // Effect
                this.game.effects
                    ?.createEffect({

                        type: "debris",

                        x: object.x,

                        y: object.y,

                        life: 1
                    });
            }
        }

        // Cleanup
        this.destructibleObjects =

            this.destructibleObjects.filter(

                obj => !obj.destroyed
            );
    }

    // =========================================
    // Damage Destructible
    // =========================================

    damageDestructible(
        x,
        y,
        damage
    ) {

        for (
            const object of
            this.destructibleObjects
        ) {

            const hit =

                x <
                object.x +
                object.width &&

                x >
                object.x &&

                y <
                object.y +
                object.height &&

                y >
                object.y;

            if (
                hit
            ) {

                object.health -=
                    damage;

                return true;
            }
        }

        return false;
    }

    // =========================================
    // Loot
    // =========================================

    spawnLoot(object) {

        const gold =
            Math.floor(

                Math.random() * 25
            ) + 10;

        this.game.player.gold +=
            gold;

        this.game.effects
            ?.createFloatingText({

                text:
                    `+${gold} Gold`,

                x: object.x,

                y: object.y,

                color: "#ffdd44"
            });
    }

    // =========================================
    // Add Platform
    // =========================================

    addPlatform(
        x,
        y,
        width,
        height
    ) {

        this.platforms.push({

            x,
            y,

            width,
            height
        });
    }

    // =========================================
    // Add Ladder
    // =========================================

    addLadder(
        x,
        y,
        width,
        height
    ) {

        this.ladders.push({

            x,
            y,

            width,
            height
        });
    }

    // =========================================
    // Add Ledge
    // =========================================

    addLedge(
        x,
        y
    ) {

        this.ledges.push({

            x,
            y
        });
    }

    // =========================================
    // Add Hazard
    // =========================================

    addFallingHazard(
        x,
        y,
        damage = 25
    ) {

        this.fallingHazards.push({

            x,
            y,

            width: 40,
            height: 40,

            velocityY: 0,

            damage,

            destroyed: false
        });
    }

    // =========================================
    // Add Destructible
    // =========================================

    addDestructible(
        x,
        y,
        width,
        height,
        health = 50
    ) {

        this.destructibleObjects.push({

            x,
            y,

            width,
            height,

            health,

            destroyed: false
        });
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        // =====================================
        // Platforms
        // =====================================

        for (
            const platform of
            this.platforms
        ) {

            ctx.fillStyle =
                "#555555";

            ctx.fillRect(

                platform.x,
                platform.y,

                platform.width,
                platform.height
            );
        }

        // =====================================
        // Ladders
        // =====================================

        for (
            const ladder of
            this.ladders
        ) {

            ctx.fillStyle =
                "#aa7744";

            ctx.fillRect(

                ladder.x,
                ladder.y,

                ladder.width,
                ladder.height
            );
        }

        // =====================================
        // Destructibles
        // =====================================

        for (
            const object of
            this.destructibleObjects
        ) {

            ctx.fillStyle =
                "#886644";

            ctx.fillRect(

                object.x,
                object.y,

                object.width,
                object.height
            );
        }

        // =====================================
        // Hazards
        // =====================================

        for (
            const hazard of
            this.fallingHazards
        ) {

            ctx.fillStyle =
                "#ff3333";

            ctx.fillRect(

                hazard.x,
                hazard.y,

                hazard.width,
                hazard.height
            );
        }
    }
}