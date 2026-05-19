// =========================================
// Ultimate Tower RPG - physics.js
// =========================================

// =========================================
// Physics System
// =========================================

export class PhysicsSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Gravity
        // =====================================

        this.gravity = 1800;

        this.maxFallSpeed = 2200;

        // =====================================
        // Friction
        // =====================================

        this.groundFriction = 0.82;

        this.airFriction = 0.97;

        // =====================================
        // Collision
        // =====================================

        this.collisionIterations = 3;

        // =====================================
        // Physics Objects
        // =====================================

        this.objects = [];

        // =====================================
        // Platforms
        // =====================================

        this.platforms = [];

        // =====================================
        // Hazards
        // =====================================

        this.hazards = [];

        // =====================================
        // Destructibles
        // =====================================

        this.destructibles = [];
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Physics Objects
        // =====================================

        for (
            const object of
            this.objects
        ) {

            this.updateObject(
                object,
                deltaTime
            );
        }

        // =====================================
        // Destructibles
        // =====================================

        this.updateDestructibles(
            deltaTime
        );
    }

    // =========================================
    // Update Object
    // =========================================

    updateObject(
        object,
        deltaTime
    ) {

        // =====================================
        // Apply Gravity
        // =====================================

        if (
            !object.noGravity
        ) {

            object.velocityY +=

                this.gravity *
                deltaTime;
        }

        // =====================================
        // Clamp Fall Speed
        // =====================================

        if (
            object.velocityY >
            this.maxFallSpeed
        ) {

            object.velocityY =
                this.maxFallSpeed;
        }

        // =====================================
        // Friction
        // =====================================

        if (
            object.grounded
        ) {

            object.velocityX *=
                this.groundFriction;
        }

        else {

            object.velocityX *=
                this.airFriction;
        }

        // =====================================
        // Movement
        // =====================================

        object.x +=
            object.velocityX *
            deltaTime;

        this.resolveHorizontalCollisions(
            object
        );

        object.y +=
            object.velocityY *
            deltaTime;

        object.grounded = false;

        this.resolveVerticalCollisions(
            object
        );

        // =====================================
        // Platforms
        // =====================================

        this.handlePlatforms(
            object
        );

        // =====================================
        // Hazards
        // =====================================

        this.handleHazards(
            object
        );

        // =====================================
        // World Bounds
        // =====================================

        this.handleWorldBounds(
            object
        );
    }

    // =========================================
    // Horizontal Collisions
    // =========================================

    resolveHorizontalCollisions(
        object
    ) {

        for (
            const wall of
            this.game.walls || []
        ) {

            if (
                this.checkCollision(
                    object,
                    wall
                )
            ) {

                // =================================
                // Moving Right
                // =================================

                if (
                    object.velocityX > 0
                ) {

                    object.x =
                        wall.x -
                        object.width;

                    object.touchingRight =
                        true;
                }

                // =================================
                // Moving Left
                // =================================

                else if (
                    object.velocityX < 0
                ) {

                    object.x =
                        wall.x +
                        wall.width;

                    object.touchingLeft =
                        true;
                }

                // Stop
                object.velocityX = 0;
            }
        }
    }

    // =========================================
    // Vertical Collisions
    // =========================================

    resolveVerticalCollisions(
        object
    ) {

        for (
            const wall of
            this.game.walls || []
        ) {

            if (
                this.checkCollision(
                    object,
                    wall
                )
            ) {

                // =================================
                // Falling
                // =================================

                if (
                    object.velocityY > 0
                ) {

                    object.y =
                        wall.y -
                        object.height;

                    object.velocityY = 0;

                    object.grounded = true;

                    object.jumpsLeft =
                        object.maxJumps || 1;
                }

                // =================================
                // Jumping
                // =================================

                else if (
                    object.velocityY < 0
                ) {

                    object.y =
                        wall.y +
                        wall.height;

                    object.velocityY = 0;
                }
            }
        }
    }

    // =========================================
    // Platforms
    // =========================================

    handlePlatforms(object) {

        for (
            const platform of
            this.platforms
        ) {

            // =================================
            // One Way Platform
            // =================================

            if (

                object.velocityY >= 0 &&

                object.y +
                object.height <=
                platform.y + 20 &&

                this.checkCollision(
                    object,
                    platform
                )
            ) {

                object.y =
                    platform.y -
                    object.height;

                object.velocityY = 0;

                object.grounded = true;
            }
        }
    }

    // =========================================
    // Hazards
    // =========================================

    handleHazards(object) {

        for (
            const hazard of
            this.hazards
        ) {

            if (
                this.checkCollision(
                    object,
                    hazard
                )
            ) {

                // =================================
                // Damage
                // =================================

                if (
                    object.takeDamage
                ) {

                    object.takeDamage(
                        hazard.damage || 10
                    );
                }

                // =================================
                // Knockback
                // =================================

                const direction =

                    object.x <
                    hazard.x
                    ? -1
                    : 1;

                object.velocityX =
                    direction * 600;

                object.velocityY =
                    -400;
            }
        }
    }

    // =========================================
    // World Bounds
    // =========================================

    handleWorldBounds(object) {

        const worldWidth =
            this.game.worldWidth ||
            10000;

        const worldHeight =
            this.game.worldHeight ||
            10000;

        // Left
        if (
            object.x < 0
        ) {

            object.x = 0;

            object.velocityX = 0;
        }

        // Right
        if (
            object.x +
            object.width >
            worldWidth
        ) {

            object.x =
                worldWidth -
                object.width;

            object.velocityX = 0;
        }

        // Ceiling
        if (
            object.y < 0
        ) {

            object.y = 0;

            object.velocityY = 0;
        }

        // Falling Death
        if (
            object.y >
            worldHeight + 1000
        ) {

            // Respawn
            if (
                object.respawn
            ) {

                object.respawn();
            }

            else {

                object.y = 0;

                object.velocityY = 0;
            }
        }
    }

    // =========================================
    // Collision Check
    // =========================================

    checkCollision(a, b) {

        return (

            a.x < b.x + b.width &&

            a.x + a.width > b.x &&

            a.y < b.y + b.height &&

            a.y + a.height > b.y
        );
    }

    // =========================================
    // Circle Collision
    // =========================================

    checkCircleCollision(
        a,
        b
    ) {

        const dx =
            a.x - b.x;

        const dy =
            a.y - b.y;

        const distance =
            Math.hypot(dx, dy);

        return (

            distance <
            a.radius + b.radius
        );
    }

    // =========================================
    // Raycast
    // =========================================

    raycast(
        x1,
        y1,
        x2,
        y2
    ) {

        const steps = 100;

        for (
            let i = 0;
            i <= steps;
            i++
        ) {

            const t =
                i / steps;

            const x =

                x1 +
                (x2 - x1) * t;

            const y =

                y1 +
                (y2 - y1) * t;

            // =================================
            // Walls
            // =================================

            for (
                const wall of
                this.game.walls || []
            ) {

                if (

                    x >= wall.x &&

                    x <= wall.x + wall.width &&

                    y >= wall.y &&

                    y <= wall.y + wall.height
                ) {

                    return {

                        hit: true,

                        x,

                        y,

                        wall
                    };
                }
            }
        }

        return {

            hit: false,

            x: x2,

            y: y2
        };
    }

    // =========================================
    // Knockback
    // =========================================

    applyKnockback(
        object,
        forceX,
        forceY
    ) {

        object.velocityX +=
            forceX;

        object.velocityY +=
            forceY;
    }

    // =========================================
    // Explosion Force
    // =========================================

    explosion(
        x,
        y,
        radius,
        force,
        damage = 0
    ) {

        for (
            const object of
            this.objects
        ) {

            const dx =
                object.x - x;

            const dy =
                object.y - y;

            const distance =
                Math.hypot(dx, dy);

            // =================================
            // Inside Radius
            // =================================

            if (
                distance < radius
            ) {

                const strength =

                    1 -
                    distance / radius;

                const angle =

                    Math.atan2(
                        dy,
                        dx
                    );

                // =================================
                // Knockback
                // =================================

                object.velocityX +=

                    Math.cos(angle) *

                    force *

                    strength;

                object.velocityY +=

                    Math.sin(angle) *

                    force *

                    strength;

                // =================================
                // Damage
                // =================================

                if (

                    damage > 0 &&

                    object.takeDamage
                ) {

                    object.takeDamage(

                        Math.floor(
                            damage *
                            strength
                        )
                    );
                }
            }
        }

        // =====================================
        // Effect
        // =====================================

        this.game.effects?.push({

            type: "explosion",

            x,

            y,

            radius,

            life: 0.5
        });

        // =====================================
        // Sound
        // =====================================

        this.game.sound?.playSound(
            "explosion"
        );
    }

    // =========================================
    // Destructibles
    // =========================================

    updateDestructibles(
        deltaTime
    ) {

        for (
            let i =
                this.destructibles.length - 1;
            i >= 0;
            i--
        ) {

            const obj =
                this.destructibles[i];

            // =================================
            // Destroyed
            // =================================

            if (
                obj.health <= 0
            ) {

                this.destroyObject(
                    obj
                );

                this.destructibles.splice(
                    i,
                    1
                );
            }
        }
    }

    // =========================================
    // Destroy Object
    // =========================================

    destroyObject(object) {

        // =====================================
        // Particles
        // =====================================

        for (
            let i = 0;
            i < 20;
            i++
        ) {

            this.game.effects?.push({

                type: "debris",

                x:
                    object.x +
                    object.width / 2,

                y:
                    object.y +
                    object.height / 2,

                velocityX:
                    (Math.random() - 0.5) * 800,

                velocityY:
                    (Math.random() - 0.5) * 800,

                life: 1,

                size:
                    4 +
                    Math.random() * 8
            });
        }

        // =====================================
        // Drop Loot
        // =====================================

        if (
            Math.random() < 0.4
        ) {

            this.game.spawnLoot?.(

                object.x +
                object.width / 2,

                object.y +
                object.height / 2
            );
        }

        // =====================================
        // Sound
        // =====================================

        this.game.sound?.playSound(
            "explosion"
        );
    }

    // =========================================
    // Platform
    // =========================================

    addPlatform(platform) {

        this.platforms.push(
            platform
        );
    }

    // =========================================
    // Hazard
    // =========================================

    addHazard(hazard) {

        this.hazards.push(
            hazard
        );
    }

    // =========================================
    // Physics Object
    // =========================================

    addObject(object) {

        // Defaults
        object.velocityX ??= 0;

        object.velocityY ??= 0;

        object.width ??= 32;

        object.height ??= 32;

        object.grounded ??= false;

        this.objects.push(
            object
        );
    }

    // =========================================
    // Remove Object
    // =========================================

    removeObject(object) {

        const index =
            this.objects.indexOf(
                object
            );

        if (
            index !== -1
        ) {

            this.objects.splice(
                index,
                1
            );
        }
    }

    // =========================================
    // Moving Platform
    // =========================================

    createMovingPlatform(
        x,
        y,
        width,
        height,
        moveX,
        moveY,
        speed
    ) {

        const platform = {

            x,
            y,

            width,
            height,

            startX: x,
            startY: y,

            moveX,
            moveY,

            speed,

            timer: 0
        };

        this.platforms.push(
            platform
        );

        return platform;
    }

    // =========================================
    // Update Platforms
    // =========================================

    updatePlatforms(
        deltaTime
    ) {

        for (
            const platform of
            this.platforms
        ) {

            if (
                platform.moveX ||
                platform.moveY
            ) {

                platform.timer +=
                    deltaTime;

                platform.x =

                    platform.startX +

                    Math.sin(
                        platform.timer *
                        platform.speed
                    ) *

                    platform.moveX;

                platform.y =

                    platform.startY +

                    Math.sin(
                        platform.timer *
                        platform.speed
                    ) *

                    platform.moveY;
            }
        }
    }
}
