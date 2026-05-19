// =========================================
// Ultimate Tower RPG - collision.js
// =========================================

// =========================================
// Collision System
// =========================================

export class CollisionSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Collision Layers
        // =====================================

        this.layers = {

            player: 1,

            enemy: 2,

            projectile: 4,

            environment: 8,

            item: 16,

            trigger: 32
        };

        // =====================================
        // Debug
        // =====================================

        this.debug = false;

        // =====================================
        // Spatial Grid
        // =====================================

        this.gridSize = 128;

        this.spatialGrid = {};
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Rebuild Grid
        // =====================================

        this.buildSpatialGrid();

        // =====================================
        // Player Collision
        // =====================================

        this.handlePlayerCollisions();

        // =====================================
        // Enemy Collision
        // =====================================

        this.handleEnemyCollisions();

        // =====================================
        // Projectile Collision
        // =====================================

        this.handleProjectileCollisions();

        // =====================================
        // Item Pickup
        // =====================================

        this.handleItemCollisions();

        // =====================================
        // Triggers
        // =====================================

        this.handleTriggerCollisions();
    }

    // =========================================
    // Spatial Grid
    // =========================================

    buildSpatialGrid() {

        this.spatialGrid = {};

        const objects = [

            this.game.player,

            ...(this.game.enemies || []),

            ...(this.game.projectiles || []),

            ...(this.game.platforms || []),

            ...(this.game.items || []),

            ...(this.game.triggers || [])
        ];

        for (
            const object of objects
        ) {

            if (
                !object
            ) {

                continue;
            }

            const cellX = Math.floor(
                object.x / this.gridSize
            );

            const cellY = Math.floor(
                object.y / this.gridSize
            );

            const key =
                `${cellX},${cellY}`;

            if (
                !this.spatialGrid[key]
            ) {

                this.spatialGrid[key] = [];
            }

            this.spatialGrid[key]
                .push(object);
        }
    }

    // =========================================
    // Nearby Objects
    // =========================================

    getNearbyObjects(object) {

        const nearby = [];

        const cellX = Math.floor(
            object.x / this.gridSize
        );

        const cellY = Math.floor(
            object.y / this.gridSize
        );

        for (
            let x = -1;
            x <= 1;
            x++
        ) {

            for (
                let y = -1;
                y <= 1;
                y++
            ) {

                const key =
                    `${cellX + x},${cellY + y}`;

                if (
                    this.spatialGrid[key]
                ) {

                    nearby.push(

                        ...this.spatialGrid[key]
                    );
                }
            }
        }

        return nearby;
    }

    // =========================================
    // Player Collision
    // =========================================

    handlePlayerCollisions() {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        player.grounded = false;

        // =====================================
        // Platforms
        // =====================================

        for (
            const platform of
            this.game.platforms || []
        ) {

            this.resolvePlatformCollision(

                player,
                platform
            );
        }

        // =====================================
        // Hazards
        // =====================================

        for (
            const hazard of
            this.game.hazards || []
        ) {

            if (

                this.checkAABB(
                    player,
                    hazard
                )
            ) {

                hazard.onTouch?.(
                    player
                );
            }
        }

        // =====================================
        // Walls
        // =====================================

        for (
            const wall of
            this.game.walls || []
        ) {

            this.resolveSolidCollision(

                player,
                wall
            );
        }
    }

    // =========================================
    // Enemy Collision
    // =========================================

    handleEnemyCollisions() {

        for (
            const enemy of
            this.game.enemies || []
        ) {

            // =================================
            // Platforms
            // =================================

            for (
                const platform of
                this.game.platforms || []
            ) {

                this.resolvePlatformCollision(

                    enemy,
                    platform
                );
            }

            // =================================
            // Enemy Push
            // =================================

            for (
                const otherEnemy of
                this.game.enemies || []
            ) {

                if (
                    enemy === otherEnemy
                ) {

                    continue;
                }

                if (

                    this.checkCircleCollision(

                        enemy,
                        otherEnemy
                    )
                ) {

                    this.pushApart(

                        enemy,
                        otherEnemy
                    );
                }
            }

            // =================================
            // Player
            // =================================

            if (

                this.checkAABB(
                    enemy,
                    this.game.player
                )
            ) {

                enemy.onPlayerTouch?.(
                    this.game.player
                );
            }
        }
    }

    // =========================================
    // Projectiles
    // =========================================

    handleProjectileCollisions() {

        for (
            let i =
                this.game.projectiles
                    .length - 1;
            i >= 0;
            i--
        ) {

            const projectile =
                this.game.projectiles[i];

            // =================================
            // Environment
            // =================================

            for (
                const wall of
                this.game.walls || []
            ) {

                if (

                    this.checkAABB(
                        projectile,
                        wall
                    )
                ) {

                    projectile.onCollision?.(
                        wall
                    );

                    this.destroyProjectile(
                        i
                    );

                    break;
                }
            }

            // =================================
            // Enemy Hit
            // =================================

            if (
                projectile.owner ===
                "player"
            ) {

                for (
                    const enemy of
                    this.game.enemies || []
                ) {

                    if (

                        this.checkAABB(
                            projectile,
                            enemy
                        )
                    ) {

                        enemy.takeDamage?.(

                            projectile.damage
                        );

                        projectile.onHit?.(
                            enemy
                        );

                        this.destroyProjectile(
                            i
                        );

                        break;
                    }
                }
            }

            // =================================
            // Player Hit
            // =================================

            else {

                const player =
                    this.game.player;

                if (

                    this.checkAABB(
                        projectile,
                        player
                    )
                ) {

                    player.takeDamage?.(

                        projectile.damage
                    );

                    projectile.onHit?.(
                        player
                    );

                    this.destroyProjectile(
                        i
                    );
                }
            }
        }
    }

    // =========================================
    // Items
    // =========================================

    handleItemCollisions() {

        const player =
            this.game.player;

        for (
            let i =
                this.game.items.length - 1;
            i >= 0;
            i--
        ) {

            const item =
                this.game.items[i];

            if (

                this.checkCircleCollision(
                    player,
                    item,
                    70
                )
            ) {

                item.onPickup?.(
                    player
                );

                this.game.items.splice(
                    i,
                    1
                );
            }
        }
    }

    // =========================================
    // Triggers
    // =========================================

    handleTriggerCollisions() {

        const player =
            this.game.player;

        for (
            const trigger of
            this.game.triggers || []
        ) {

            if (

                this.checkAABB(
                    player,
                    trigger
                )
            ) {

                if (
                    !trigger.active
                ) {

                    trigger.active = true;

                    trigger.onEnter?.(
                        player
                    );
                }
            }

            else {

                if (
                    trigger.active
                ) {

                    trigger.active = false;

                    trigger.onExit?.(
                        player
                    );
                }
            }
        }
    }

    // =========================================
    // Platform Collision
    // =========================================

    resolvePlatformCollision(
        entity,
        platform
    ) {

        if (

            !this.checkAABB(
                entity,
                platform
            )
        ) {

            return;
        }

        // =====================================
        // Falling Down
        // =====================================

        const entityBottom =

            entity.y +
            entity.height;

        const previousBottom =

            entityBottom -
            entity.velocityY;

        // Land On Platform
        if (

            previousBottom <=
            platform.y &&

            entity.velocityY >= 0
        ) {

            entity.y =

                platform.y -
                entity.height;

            entity.velocityY = 0;

            entity.grounded = true;

            entity.jumping = false;
        }
    }

    // =========================================
    // Solid Collision
    // =========================================

    resolveSolidCollision(
        entity,
        solid
    ) {

        if (

            !this.checkAABB(
                entity,
                solid
            )
        ) {

            return;
        }

        // =====================================
        // Distances
        // =====================================

        const overlapX =

            Math.min(

                entity.x +
                entity.width -
                solid.x,

                solid.x +
                solid.width -
                entity.x
            );

        const overlapY =

            Math.min(

                entity.y +
                entity.height -
                solid.y,

                solid.y +
                solid.height -
                entity.y
            );

        // =====================================
        // Resolve
        // =====================================

        if (
            overlapX < overlapY
        ) {

            // Horizontal
            if (
                entity.x < solid.x
            ) {

                entity.x -= overlapX;
            }

            else {

                entity.x += overlapX;
            }

            entity.velocityX = 0;
        }

        else {

            // Vertical
            if (
                entity.y < solid.y
            ) {

                entity.y -= overlapY;

                entity.grounded = true;
            }

            else {

                entity.y += overlapY;
            }

            entity.velocityY = 0;
        }
    }

    // =========================================
    // Push Apart
    // =========================================

    pushApart(
        entityA,
        entityB
    ) {

        const dx =
            entityB.x - entityA.x;

        const dy =
            entityB.y - entityA.y;

        const distance =
            Math.hypot(dx, dy);

        if (
            distance === 0
        ) {

            return;
        }

        const minDistance = 40;

        if (
            distance < minDistance
        ) {

            const push =

                (minDistance -
                distance) * 0.5;

            const nx =
                dx / distance;

            const ny =
                dy / distance;

            entityA.x -= nx * push;

            entityA.y -= ny * push;

            entityB.x += nx * push;

            entityB.y += ny * push;
        }
    }

    // =========================================
    // AABB
    // =========================================

    checkAABB(a, b) {

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
    // Circle
    // =========================================

    checkCircleCollision(
        a,
        b,
        radius = null
    ) {

        const ax =
            a.x + a.width / 2;

        const ay =
            a.y + a.height / 2;

        const bx =
            b.x + b.width / 2;

        const by =
            b.y + b.height / 2;

        const distance =
            Math.hypot(

                bx - ax,
                by - ay
            );

        const combinedRadius =

            radius ||

            ((a.width + b.width) * 0.5);

        return distance <
            combinedRadius;
    }

    // =========================================
    // Point
    // =========================================

    pointInRect(
        pointX,
        pointY,
        rect
    ) {

        return (

            pointX >= rect.x &&

            pointX <=
            rect.x + rect.width &&

            pointY >= rect.y &&

            pointY <=
            rect.y + rect.height
        );
    }

    // =========================================
    // Line Intersection
    // =========================================

    lineIntersectsRect(
        x1,
        y1,
        x2,
        y2,
        rect
    ) {

        return (

            this.lineIntersectsLine(

                x1, y1,
                x2, y2,

                rect.x,
                rect.y,

                rect.x +
                rect.width,

                rect.y
            ) ||

            this.lineIntersectsLine(

                x1, y1,
                x2, y2,

                rect.x,
                rect.y,

                rect.x,

                rect.y +
                rect.height
            ) ||

            this.lineIntersectsLine(

                x1, y1,
                x2, y2,

                rect.x +
                rect.width,

                rect.y,

                rect.x +
                rect.width,

                rect.y +
                rect.height
            ) ||

            this.lineIntersectsLine(

                x1, y1,
                x2, y2,

                rect.x,

                rect.y +
                rect.height,

                rect.x +
                rect.width,

                rect.y +
                rect.height
            )
        );
    }

    // =========================================
    // Line vs Line
    // =========================================

    lineIntersectsLine(
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        x4,
        y4
    ) {

        const denominator =

            (x1 - x2) *
            (y3 - y4) -

            (y1 - y2) *
            (x3 - x4);

        if (
            denominator === 0
        ) {

            return false;
        }

        const t =

            ((x1 - x3) *
            (y3 - y4) -

            (y1 - y3) *
            (x3 - x4)) /

            denominator;

        const u =

            -(
                (x1 - x2) *
                (y1 - y3) -

                (y1 - y2) *
                (x1 - x3)
            ) /

            denominator;

        return (

            t >= 0 &&
            t <= 1 &&

            u >= 0 &&
            u <= 1
        );
    }

    // =========================================
    // Destroy Projectile
    // =========================================

    destroyProjectile(index) {

        this.game.projectiles.splice(
            index,
            1
        );
    }

    // =========================================
    // Debug Draw
    // =========================================

    drawDebug(ctx) {

        if (
            !this.debug
        ) {

            return;
        }

        ctx.save();

        ctx.strokeStyle =
            "#00ff00";

        ctx.lineWidth = 2;

        const objects = [

            this.game.player,

            ...(this.game.enemies || []),

            ...(this.game.platforms || []),

            ...(this.game.items || [])
        ];

        for (
            const object of
            objects
        ) {

            if (
                !object
            ) {

                continue;
            }

            ctx.strokeRect(

                object.x,
                object.y,

                object.width,
                object.height
            );
        }

        ctx.restore();
    }

    // =========================================
    // Toggle Debug
    // =========================================

    toggleDebug() {

        this.debug =
            !this.debug;
    }
}