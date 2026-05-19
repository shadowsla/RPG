// =========================================
// Ultimate Tower RPG - jumping.js
// =========================================

// =========================================
// Advanced Jumping System
// =========================================

export class JumpingSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Jump Settings
        // =====================================

        this.jumpForce = -18;

        this.doubleJumpForce = -16;

        this.wallJumpForceX = 12;

        this.wallJumpForceY = -16;

        // =====================================
        // Coyote Time
        // Allows jumping slightly after
        // leaving a platform
        // =====================================

        this.coyoteTime = 0.12;

        this.coyoteTimer = 0;

        // =====================================
        // Jump Buffer
        // Allows jump input slightly before
        // landing
        // =====================================

        this.jumpBufferTime = 0.15;

        this.jumpBufferTimer = 0;

        // =====================================
        // Variable Jump
        // =====================================

        this.jumpCutMultiplier = 0.5;

        // =====================================
        // Air Jumps
        // =====================================

        this.maxAirJumps = 1;

        this.airJumpsRemaining = 1;

        // =====================================
        // Wall Jump
        // =====================================

        this.wallJumpLockTime = 0.2;

        this.wallJumpTimer = 0;

        // =====================================
        // Ground Pound
        // =====================================

        this.groundPoundForce = 30;

        this.groundPounding = false;

        // =====================================
        // Bounce
        // =====================================

        this.bounceForce = -20;
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
        // Timers
        // =====================================

        this.updateTimers(deltaTime);

        // =====================================
        // Input
        // =====================================

        this.handleInput(player);

        // =====================================
        // Variable Jump Height
        // =====================================

        this.handleVariableJump(player);

        // =====================================
        // Ground Pound
        // =====================================

        this.handleGroundPound(player);

        // =====================================
        // Landing
        // =====================================

        this.handleLanding(player);
    }

    // =========================================
    // Timers
    // =========================================

    updateTimers(deltaTime) {

        if (
            this.coyoteTimer > 0
        ) {

            this.coyoteTimer -=
                deltaTime;
        }

        if (
            this.jumpBufferTimer > 0
        ) {

            this.jumpBufferTimer -=
                deltaTime;
        }

        if (
            this.wallJumpTimer > 0
        ) {

            this.wallJumpTimer -=
                deltaTime;
        }
    }

    // =========================================
    // Input
    // =========================================

    handleInput(player) {

        const keys =
            this.game.input.keys;

        // =====================================
        // Jump Press
        // =====================================

        if (

            keys[" "] ||

            keys["w"] ||

            keys["ArrowUp"]
        ) {

            this.jumpBufferTimer =
                this.jumpBufferTime;

            // =================================
            // Ground Jump
            // =================================

            if (

                player.grounded ||

                this.coyoteTimer > 0
            ) {

                this.performJump(player);

                return;
            }

            // =================================
            // Wall Jump
            // =================================

            if (
                player.wallSliding
            ) {

                this.performWallJump(player);

                return;
            }

            // =================================
            // Double Jump
            // =================================

            if (
                this.airJumpsRemaining > 0
            ) {

                this.performDoubleJump(player);
            }
        }
    }

    // =========================================
    // Jump
    // =========================================

    performJump(player) {

        player.velocityY =
            this.jumpForce;

        player.grounded = false;

        player.jumping = true;

        this.coyoteTimer = 0;

        this.createJumpEffect(player);

        this.playJumpSound();

        // Reset Air Jumps
        this.airJumpsRemaining =
            this.maxAirJumps;
    }

    // =========================================
    // Double Jump
    // =========================================

    performDoubleJump(player) {

        player.velocityY =
            this.doubleJumpForce;

        this.airJumpsRemaining--;

        player.doubleJumpUsed =
            true;

        this.createDoubleJumpEffect(
            player
        );

        this.playDoubleJumpSound();
    }

    // =========================================
    // Wall Jump
    // =========================================

    performWallJump(player) {

        player.velocityY =
            this.wallJumpForceY;

        // =====================================
        // Push Direction
        // =====================================

        if (
            player.direction === 1
        ) {

            player.velocityX =
                -this.wallJumpForceX;
        }

        else {

            player.velocityX =
                this.wallJumpForceX;
        }

        player.wallSliding = false;

        this.wallJumpTimer =
            this.wallJumpLockTime;

        this.createWallJumpEffect(
            player
        );

        this.game.effects
            ?.shakeScreen(
                4,
                0.15
            );
    }

    // =========================================
    // Variable Jump Height
    // =========================================

    handleVariableJump(player) {

        const keys =
            this.game.input.keys;

        const holdingJump =

            keys[" "] ||

            keys["w"] ||

            keys["ArrowUp"];

        // =====================================
        // Short Hop
        // =====================================

        if (

            !holdingJump &&

            player.velocityY < 0
        ) {

            player.velocityY *=
                this.jumpCutMultiplier;
        }
    }

    // =========================================
    // Ground Pound
    // =========================================

    handleGroundPound(player) {

        const keys =
            this.game.input.keys;

        // =====================================
        // Activate
        // =====================================

        if (

            !player.grounded &&

            keys["s"] &&

            keys["Shift"]
        ) {

            this.groundPounding =
                true;

            player.velocityY =
                this.groundPoundForce;
        }

        // =====================================
        // Landing Impact
        // =====================================

        if (

            this.groundPounding &&

            player.grounded
        ) {

            this.groundPounding =
                false;

            this.createGroundPoundShockwave(
                player
            );

            // Damage Nearby Enemies
            this.damageNearbyEnemies(
                player
            );

            this.game.effects
                ?.shakeScreen(
                    15,
                    0.4
                );
        }
    }

    // =========================================
    // Landing
    // =========================================

    handleLanding(player) {

        // =====================================
        // Reset Air Jumps
        // =====================================

        if (
            player.grounded
        ) {

            this.airJumpsRemaining =
                this.maxAirJumps;

            player.doubleJumpUsed =
                false;

            player.airDashUsed =
                false;
        }

        // =====================================
        // Coyote Time
        // =====================================

        else {

            this.coyoteTimer =
                this.coyoteTime;
        }

        // =====================================
        // Buffered Jump
        // =====================================

        if (

            player.grounded &&

            this.jumpBufferTimer > 0
        ) {

            this.performJump(player);

            this.jumpBufferTimer = 0;
        }
    }

    // =========================================
    // Bounce
    // =========================================

    bouncePlayer(player, force) {

        player.velocityY =
            -(force || 20);

        player.grounded = false;

        this.createBounceEffect(player);
    }

    // =========================================
    // Enemy Bounce
    // =========================================

    bounceOnEnemy(enemy) {

        const player =
            this.game.player;

        // =====================================
        // Bounce Up
        // =====================================

        player.velocityY =
            this.bounceForce;

        // =====================================
        // Damage Enemy
        // =====================================

        enemy.takeDamage?.(
            player.damage * 1.5
        );

        // =====================================
        // Effects
        // =====================================

        this.createBounceEffect(player);

        this.game.effects
            ?.createFloatingText({

                text: "BOUNCE!",

                x: enemy.x,

                y: enemy.y,

                color: "#ffff44"
            });
    }

    // =========================================
    // Stomp Check
    // =========================================

    checkEnemyStomp(enemy) {

        const player =
            this.game.player;

        // =====================================
        // Falling Onto Enemy
        // =====================================

        const stomping =

            player.velocityY > 0 &&

            player.y +
            player.height <
            enemy.y + 20;

        if (
            stomping
        ) {

            this.bounceOnEnemy(enemy);

            return true;
        }

        return false;
    }

    // =========================================
    // Ground Pound Damage
    // =========================================

    damageNearbyEnemies(player) {

        for (
            const enemy of
            this.game.enemies
        ) {

            const distance =
                Math.hypot(

                    enemy.x - player.x,

                    enemy.y - player.y
                );

            if (
                distance < 180
            ) {

                enemy.takeDamage?.(
                    player.damage * 2
                );

                // Knockback
                enemy.velocityX =

                    (enemy.x - player.x)
                    * 0.15;

                enemy.velocityY = -12;
            }
        }
    }

    // =========================================
    // Jump Effect
    // =========================================

    createJumpEffect(player) {

        this.game.effects
            ?.createEffect({

                type: "jump",

                x:
                    player.x +
                    player.width / 2,

                y:
                    player.y +
                    player.height,

                radius: 25,

                life: 0.5
            });
    }

    // =========================================
    // Double Jump Effect
    // =========================================

    createDoubleJumpEffect(player) {

        this.game.effects
            ?.createEffect({

                type: "doubleJump",

                x:
                    player.x +
                    player.width / 2,

                y:
                    player.y +
                    player.height / 2,

                radius: 40,

                color: "#44ccff",

                life: 0.7
            });

        // Particles
        for (
            let i = 0;
            i < 12;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        player.x +
                        player.width / 2,

                    y:
                        player.y +
                        player.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 8,

                    velocityY:
                        (Math.random() - 0.5) * 8,

                    size:
                        Math.random() * 4 + 2,

                    color: "#88ddff",

                    life: 0.8
                });
        }
    }

    // =========================================
    // Wall Jump Effect
    // =========================================

    createWallJumpEffect(player) {

        this.game.effects
            ?.createEffect({

                type: "wallJump",

                x:
                    player.x +
                    (player.direction * 10),

                y:
                    player.y +
                    player.height / 2,

                radius: 35,

                color: "#ffffff",

                life: 0.4
            });
    }

    // =========================================
    // Bounce Effect
    // =========================================

    createBounceEffect(player) {

        this.game.effects
            ?.createEffect({

                type: "bounce",

                x:
                    player.x +
                    player.width / 2,

                y:
                    player.y +
                    player.height,

                radius: 30,

                color: "#ffff44",

                life: 0.5
            });
    }

    // =========================================
    // Ground Pound Shockwave
    // =========================================

    createGroundPoundShockwave(
        player
    ) {

        this.game.effects
            ?.createEffect({

                type: "shockwave",

                x:
                    player.x +
                    player.width / 2,

                y:
                    player.y +
                    player.height,

                radius: 200,

                color: "#ff8844",

                life: 1
            });

        // Debris
        for (
            let i = 0;
            i < 20;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        player.x +
                        player.width / 2,

                    y:
                        player.y +
                        player.height,

                    velocityX:
                        (Math.random() - 0.5) * 16,

                    velocityY:
                        Math.random() * -10,

                    size:
                        Math.random() * 6 + 2,

                    color: "#886644",

                    life: 1.2
                });
        }
    }

    // =========================================
    // Sounds
    // =========================================

    playJumpSound() {

        this.game.sound
            ?.play("jump");
    }

    playDoubleJumpSound() {

        this.game.sound
            ?.play("doubleJump");
    }

    // =========================================
    // Draw Debug
    // =========================================

    draw(ctx) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        // =====================================
        // Ground Pound Aura
        // =====================================

        if (
            this.groundPounding
        ) {

            ctx.save();

            ctx.globalAlpha = 0.4;

            ctx.fillStyle =
                "#ff4444";

            ctx.beginPath();

            ctx.arc(

                player.x +
                player.width / 2,

                player.y +
                player.height / 2,

                50,

                0,

                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }

        // =====================================
        // Air Jump UI
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "16px Arial";

        ctx.fillText(

            `Air Jumps: ${this.airJumpsRemaining}`,

            20,
            120
        );
    }
}