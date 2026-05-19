// =========================================
// Ultimate Tower RPG - player.js
// =========================================

export class Player {

    constructor(game, x, y) {

        this.game = game;

        // =====================================
        // Position
        // =====================================

        this.x = x;
        this.y = y;

        this.width = 48;
        this.height = 72;

        // =====================================
        // Velocity
        // =====================================

        this.velocityX = 0;
        this.velocityY = 0;

        this.maxVelocityX = 12;
        this.maxVelocityY = 28;

        // =====================================
        // Physics
        // =====================================

        this.gravity = 0.9;
        this.friction = 0.82;

        this.grounded = false;
        this.jumping = false;

        // =====================================
        // Movement
        // =====================================

        this.speed = 5;
        this.sprintSpeed = 9;

        this.jumpForce = -18;

        this.direction = 1;

        this.climbing = false;
        this.wallSliding = false;
        this.ledgeGrabbing = false;

        // =====================================
        // Dodge Roll
        // =====================================

        this.rolling = false;
        this.rollTimer = 0;
        this.rollCooldown = 0;

        // =====================================
        // Combat
        // =====================================

        this.damage = 10;
        this.defense = 5;

        this.attackSpeed = 1;

        this.attackCooldown = 0;

        this.combo = 0;
        this.comboTimer = 0;

        // =====================================
        // Stats
        // =====================================

        this.level = 1;

        this.experience = 0;
        this.experienceToNext = 100;

        this.gold = 0;

        // =====================================
        // Health / Mana
        // =====================================

        this.maxHealth = 100;
        this.health = 100;

        this.maxMana = 100;
        this.mana = 100;

        this.healthRegen = 1;
        this.manaRegen = 2;

        // =====================================
        // Class
        // =====================================

        this.classType = "warrior";

        // =====================================
        // Critical
        // =====================================

        this.critChance = 5;
        this.critDamage = 150;

        // =====================================
        // Movement Abilities
        // =====================================

        this.doubleJumpUnlocked = true;
        this.doubleJumpUsed = false;

        this.airDashUnlocked = true;
        this.airDashUsed = false;

        // =====================================
        // Effects
        // =====================================

        this.invulnerable = false;
        this.invisible = false;

        this.damageMultiplier = 1;

        // =====================================
        // Shield
        // =====================================

        this.shield = 0;

        // =====================================
        // Summons
        // =====================================

        this.summons = [];

        // =====================================
        // Animation
        // =====================================

        this.animationState = "idle";

        this.animationFrame = 0;
        this.animationTimer = 0;

        // =====================================
        // Colors
        // =====================================

        this.colors = {

            warrior: "#cc4444",

            mage: "#4488ff",

            rogue: "#8844ff",

            tank: "#999999",

            support: "#44cc88"
        };
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Input
        // =====================================

        this.handleInput();

        // =====================================
        // Physics
        // =====================================

        this.applyPhysics();

        // =====================================
        // Cooldowns
        // =====================================

        this.updateCooldowns(deltaTime);

        // =====================================
        // Regeneration
        // =====================================

        this.regenerate(deltaTime);

        // =====================================
        // Combos
        // =====================================

        this.updateCombo(deltaTime);

        // =====================================
        // Animation
        // =====================================

        this.updateAnimation(deltaTime);

        // =====================================
        // Clamp
        // =====================================

        this.clampVelocity();

        // =====================================
        // Apply Movement
        // =====================================

        this.x += this.velocityX;
        this.y += this.velocityY;

        // =====================================
        // World Bounds
        // =====================================

        this.handleWorldBounds();

        // =====================================
        // Death
        // =====================================

        if (
            this.health <= 0
        ) {

            this.die();
        }
    }

    // =========================================
    // Input
    // =========================================

    handleInput() {

        const input =
            this.game.input;

        // =====================================
        // Movement
        // =====================================

        let moveSpeed =
            this.speed;

        // Sprint
        if (
            input.keys["Shift"]
        ) {

            moveSpeed =
                this.sprintSpeed;
        }

        // Left
        if (

            input.keys["a"] ||

            input.keys["ArrowLeft"]
        ) {

            this.velocityX -=
                moveSpeed * 0.5;

            this.direction = -1;
        }

        // Right
        if (

            input.keys["d"] ||

            input.keys["ArrowRight"]
        ) {

            this.velocityX +=
                moveSpeed * 0.5;

            this.direction = 1;
        }

        // =====================================
        // Jump
        // =====================================

        if (

            input.keys[" "] ||

            input.keys["w"] ||

            input.keys["ArrowUp"]
        ) {

            this.jump();
        }

        // =====================================
        // Dodge Roll
        // =====================================

        if (
            input.keys["Control"] &&
            !this.rolling &&
            this.rollCooldown <= 0
        ) {

            this.dodgeRoll();
        }

        // =====================================
        // Attack
        // =====================================

        if (
            input.mouse.down
        ) {

            this.attack();
        }

        // =====================================
        // Skills
        // =====================================

        for (
            let i = 1;
            i <= 6;
            i++
        ) {

            if (
                input.keys[i]
            ) {

                this.game.skills
                    ?.useSkill(i);
            }
        }

        // =====================================
        // Ultimate
        // =====================================

        if (
            input.keys["r"]
        ) {

            this.game.ultimateSystem
                ?.activateUltimate();
        }
    }

    // =========================================
    // Jump
    // =========================================

    jump() {

        // Ground Jump
        if (
            this.grounded
        ) {

            this.velocityY =
                this.jumpForce;

            this.grounded = false;

            this.jumping = true;

            this.doubleJumpUsed = false;

            this.airDashUsed = false;

            this.createJumpEffect();

            return;
        }

        // Double Jump
        if (

            this.doubleJumpUnlocked &&

            !this.doubleJumpUsed
        ) {

            this.velocityY =
                this.jumpForce * 0.9;

            this.doubleJumpUsed = true;

            this.createJumpEffect();
        }
    }

    // =========================================
    // Dodge Roll
    // =========================================

    dodgeRoll() {

        this.rolling = true;

        this.rollTimer = 0.45;

        this.rollCooldown = 1.5;

        this.invulnerable = true;

        this.velocityX =
            this.direction * 18;

        this.game.effects
            ?.createEffect({

                type: "dust",

                x: this.x,

                y: this.y + this.height,

                life: 0.5
            });
    }

    // =========================================
    // Attack
    // =========================================

    attack() {

        if (
            this.attackCooldown > 0
        ) {

            return;
        }

        this.attackCooldown =
            0.45 / this.attackSpeed;

        // =====================================
        // Combo
        // =====================================

        this.combo++;

        this.comboTimer = 1.2;

        if (
            this.combo > 3
        ) {

            this.combo = 1;
        }

        // =====================================
        // Hit Enemies
        // =====================================

        const range = 100;

        for (
            const enemy of
            this.game.enemies
        ) {

            const distance =
                Math.hypot(

                    enemy.x - this.x,

                    enemy.y - this.y
                );

            if (
                distance < range
            ) {

                const damage =
                    this.calculateDamage();

                enemy.takeDamage?.(
                    damage
                );

                // Knockback
                enemy.velocityX =
                    this.direction * 8;

                enemy.velocityY =
                    -4;
            }
        }

        // =====================================
        // Effect
        // =====================================

        this.game.effects
            ?.createEffect({

                type: "slash",

                x:
                    this.x +
                    (this.direction * 40),

                y:
                    this.y + 20,

                direction:
                    this.direction,

                life: 0.25
            });
    }

    // =========================================
    // Physics
    // =========================================

    applyPhysics() {

        // Gravity
        if (
            !this.grounded
        ) {

            this.velocityY +=
                this.gravity;
        }

        // Friction
        this.velocityX *=
            this.friction;

        // Climbing
        if (
            this.climbing
        ) {

            this.velocityY *= 0.6;
        }
    }

    // =========================================
    // Cooldowns
    // =========================================

    updateCooldowns(deltaTime) {

        if (
            this.attackCooldown > 0
        ) {

            this.attackCooldown -=
                deltaTime;
        }

        if (
            this.rollCooldown > 0
        ) {

            this.rollCooldown -=
                deltaTime;
        }

        if (
            this.rollTimer > 0
        ) {

            this.rollTimer -=
                deltaTime;

            if (
                this.rollTimer <= 0
            ) {

                this.rolling = false;

                this.invulnerable = false;
            }
        }
    }

    // =========================================
    // Regeneration
    // =========================================

    regenerate(deltaTime) {

        this.health +=

            this.healthRegen *
            deltaTime;

        this.mana +=

            this.manaRegen *
            deltaTime;

        this.health = Math.min(

            this.health,
            this.maxHealth
        );

        this.mana = Math.min(

            this.mana,
            this.maxMana
        );
    }

    // =========================================
    // Combo
    // =========================================

    updateCombo(deltaTime) {

        if (
            this.comboTimer > 0
        ) {

            this.comboTimer -=
                deltaTime;
        }

        else {

            this.combo = 0;
        }
    }

    // =========================================
    // Animation
    // =========================================

    updateAnimation(deltaTime) {

        if (
            !this.grounded
        ) {

            this.animationState =
                "jump";
        }

        else if (
            Math.abs(this.velocityX) > 1
        ) {

            this.animationState =
                "run";
        }

        else {

            this.animationState =
                "idle";
        }

        this.animationTimer +=
            deltaTime * 10;

        if (
            this.animationTimer >= 1
        ) {

            this.animationTimer = 0;

            this.animationFrame++;
        }
    }

    // =========================================
    // Clamp
    // =========================================

    clampVelocity() {

        this.velocityX = Math.max(

            -this.maxVelocityX,

            Math.min(
                this.velocityX,
                this.maxVelocityX
            )
        );

        this.velocityY = Math.max(

            -this.maxVelocityY,

            Math.min(
                this.velocityY,
                this.maxVelocityY
            )
        );
    }

    // =========================================
    // World Bounds
    // =========================================

    handleWorldBounds() {

        const worldWidth =
            this.game.worldWidth || 5000;

        const worldHeight =
            this.game.worldHeight || 3000;

        // Left
        if (
            this.x < 0
        ) {

            this.x = 0;
        }

        // Right
        if (
            this.x + this.width >
            worldWidth
        ) {

            this.x =
                worldWidth -
                this.width;
        }

        // Bottom
        if (
            this.y >
            worldHeight + 1000
        ) {

            this.takeDamage(9999);
        }
    }

    // =========================================
    // Damage
    // =========================================

    takeDamage(amount) {

        if (
            this.invulnerable
        ) {

            return;
        }

        // Dodge
        const dodgeRoll =
            Math.random() * 100;

        if (
            dodgeRoll <
            this.dodgeChance
        ) {

            this.showFloatingText(
                "DODGE",
                "#66ffff"
            );

            return;
        }

        // Shield
        if (
            this.shield > 0
        ) {

            const absorbed =
                Math.min(

                    this.shield,
                    amount
                );

            this.shield -=
                absorbed;

            amount -=
                absorbed;
        }

        // Defense
        amount -=
            this.defense;

        amount = Math.max(
            1,
            amount
        );

        this.health -=
            amount;

        // Knockback
        this.velocityY = -6;

        // Screen Shake
        this.game.effects
            ?.shakeScreen(
                6,
                0.2
            );

        // Floating Text
        this.showFloatingText(
            `-${Math.floor(amount)}`,
            "#ff4444"
        );
    }

    // =========================================
    // Heal
    // =========================================

    heal(amount) {

        this.health += amount;

        if (
            this.health >
            this.maxHealth
        ) {

            this.health =
                this.maxHealth;
        }

        this.showFloatingText(
            `+${Math.floor(amount)}`,
            "#44ff88"
        );
    }

    // =========================================
    // Damage Calc
    // =========================================

    calculateDamage() {

        let damage =
            this.damage;

        // Combo Bonus
        damage +=
            this.combo * 5;

        // Critical
        const critRoll =
            Math.random() * 100;

        if (
            critRoll <
            this.critChance
        ) {

            damage *=
                this.critDamage / 100;

            this.showFloatingText(
                "CRIT!",
                "#ffff44"
            );
        }

        // Multiplier
        damage *=
            this.damageMultiplier;

        return Math.floor(damage);
    }

    // =========================================
    // Experience
    // =========================================

    gainExperience(amount) {

        this.experience +=
            amount;

        while (

            this.experience >=
            this.experienceToNext
        ) {

            this.levelUp();
        }
    }

    // =========================================
    // Level Up
    // =========================================

    levelUp() {

        this.level++;

        this.experience -=
            this.experienceToNext;

        this.experienceToNext =
            Math.floor(

                this.experienceToNext * 1.4
            );

        // Stats
        this.maxHealth += 20;
        this.maxMana += 10;

        this.damage += 4;
        this.defense += 2;

        this.health =
            this.maxHealth;

        this.mana =
            this.maxMana;

        // Skill Points
        this.game.stats
            ?.addStatPoints(5);

        // Notification
        this.game.ui
            ?.addNotification(

                `Level Up! Lv.${this.level}`,

                "success"
            );

        // Effects
        this.game.effects
            ?.createEffect({

                type: "levelup",

                x: this.x,

                y: this.y,

                life: 2
            });
    }

    // =========================================
    // Floating Text
    // =========================================

    showFloatingText(
        text,
        color
    ) {

        this.game.effects
            ?.createFloatingText({

                text,

                x:
                    this.x +
                    this.width / 2,

                y:
                    this.y,

                color
            });
    }

    // =========================================
    // Jump Effect
    // =========================================

    createJumpEffect() {

        this.game.effects
            ?.createEffect({

                type: "jump",

                x:
                    this.x +
                    this.width / 2,

                y:
                    this.y +
                    this.height,

                life: 0.5
            });
    }

    // =========================================
    // Death
    // =========================================

    die() {

        this.game.ui
            ?.addNotification(

                "You Died",

                "danger"
            );

        // Respawn
        this.health =
            this.maxHealth;

        this.mana =
            this.maxMana;

        this.x = 200;
        this.y = 200;
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        ctx.save();

        // =====================================
        // Invisibility
        // =====================================

        if (
            this.invisible
        ) {

            ctx.globalAlpha = 0.4;
        }

        // =====================================
        // Roll Rotation
        // =====================================

        if (
            this.rolling
        ) {

            ctx.translate(

                this.x +
                this.width / 2,

                this.y +
                this.height / 2
            );

            ctx.rotate(
                Date.now() * 0.02
            );

            ctx.translate(

                -this.width / 2,

                -this.height / 2
            );
        }

        else {

            ctx.translate(
                this.x,
                this.y
            );
        }

        // =====================================
        // Body
        // =====================================

        ctx.fillStyle =

            this.colors[
                this.classType
            ];

        ctx.fillRect(

            0,
            0,

            this.width,
            this.height
        );

        // =====================================
        // Eyes
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        const eyeX =

            this.direction === 1
            ? 30
            : 10;

        ctx.fillRect(
            eyeX,
            18,
            8,
            8
        );

        // =====================================
        // Shield Effect
        // =====================================

        if (
            this.shield > 0
        ) {

            ctx.strokeStyle =
                "#44ccff";

            ctx.lineWidth = 4;

            ctx.beginPath();

            ctx.arc(

                this.width / 2,

                this.height / 2,

                42,

                0,

                Math.PI * 2
            );

            ctx.stroke();
        }

        ctx.restore();

        // =====================================
        // Health Bar
        // =====================================

        this.drawHealthBar(ctx);
    }

    // =========================================
    // Health Bar
    // =========================================

    drawHealthBar(ctx) {

        const width = 70;
        const height = 8;

        const x =
            this.x -
            10;

        const y =
            this.y - 20;

        // Background
        ctx.fillStyle =
            "#111111";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // Health
        const healthWidth =

            (this.health /
            this.maxHealth) *
            width;

        ctx.fillStyle =
            "#44ff44";

        ctx.fillRect(

            x,
            y,

            healthWidth,
            height
        );

        // Border
        ctx.strokeStyle =
            "#ffffff";

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            x: this.x,
            y: this.y,

            level: this.level,

            experience:
                this.experience,

            experienceToNext:
                this.experienceToNext,

            health:
                this.health,

            mana:
                this.mana,

            maxHealth:
                this.maxHealth,

            maxMana:
                this.maxMana,

            classType:
                this.classType,

            gold:
                this.gold
        };
    }

    // =========================================
    // Load
    // =========================================

    load(data) {

        if (
            !data
        ) {

            return;
        }

        Object.assign(
            this,
            data
        );
    }
}