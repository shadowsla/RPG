// =========================================
// Ultimate Tower RPG - combat.js
// =========================================

// =========================================
// Combat System
// =========================================

export class CombatSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Combo System
        // =====================================

        this.combo = 0;

        this.comboTimer = 0;

        this.comboResetTime = 2;

        this.maxCombo = 999;

        // =====================================
        // Combat Multipliers
        // =====================================

        this.comboDamageMultiplier = 0.05;

        this.criticalMultiplier = 2;

        this.backstabMultiplier = 1.5;

        this.airComboMultiplier = 1.25;

        // =====================================
        // Parry
        // =====================================

        this.parryWindow = 0.2;

        this.parryTimer = 0;

        this.parryCooldown = 0;

        // =====================================
        // Dodge Roll
        // =====================================

        this.rollCooldown = 0;

        this.rollInvincibilityTime = 0.4;

        // =====================================
        // Combat State
        // =====================================

        this.inCombat = false;

        this.combatTimer = 0;

        this.combatDuration = 5;

        // =====================================
        // Damage Numbers
        // =====================================

        this.damageNumbers = [];
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Combo Timer
        // =====================================

        this.updateCombo(deltaTime);

        // =====================================
        // Parry
        // =====================================

        this.updateParry(deltaTime);

        // =====================================
        // Cooldowns
        // =====================================

        this.updateCooldowns(deltaTime);

        // =====================================
        // Combat State
        // =====================================

        this.updateCombatState(deltaTime);
    }

    // =========================================
    // Combo
    // =========================================

    updateCombo(deltaTime) {

        if (
            this.combo > 0
        ) {

            this.comboTimer -=
                deltaTime;

            // Reset
            if (
                this.comboTimer <= 0
            ) {

                this.resetCombo();
            }
        }
    }

    // =========================================
    // Parry
    // =========================================

    updateParry(deltaTime) {

        if (
            this.parryTimer > 0
        ) {

            this.parryTimer -=
                deltaTime;
        }

        if (
            this.parryCooldown > 0
        ) {

            this.parryCooldown -=
                deltaTime;
        }
    }

    // =========================================
    // Cooldowns
    // =========================================

    updateCooldowns(deltaTime) {

        if (
            this.rollCooldown > 0
        ) {

            this.rollCooldown -=
                deltaTime;
        }
    }

    // =========================================
    // Combat State
    // =========================================

    updateCombatState(deltaTime) {

        if (
            this.inCombat
        ) {

            this.combatTimer -=
                deltaTime;

            if (
                this.combatTimer <= 0
            ) {

                this.inCombat = false;
            }
        }
    }

    // =========================================
    // Basic Attack
    // =========================================

    attack(attacker, target) {

        if (
            !attacker ||
            !target
        ) {

            return;
        }

        // =====================================
        // Base Damage
        // =====================================

        let damage =
            attacker.damage || 10;

        // =====================================
        // Combo Damage
        // =====================================

        damage *=

            1 +

            (this.combo *
            this.comboDamageMultiplier);

        // =====================================
        // Critical Hit
        // =====================================

        const critical =

            this.rollCritical(
                attacker
            );

        if (
            critical
        ) {

            damage *=
                this.criticalMultiplier;
        }

        // =====================================
        // Backstab
        // =====================================

        if (
            this.isBackstab(
                attacker,
                target
            )
        ) {

            damage *=
                this.backstabMultiplier;

            this.showText(

                "BACKSTAB",

                target.x,

                target.y,

                "#ff8844"
            );
        }

        // =====================================
        // Air Combo
        // =====================================

        if (
            !attacker.grounded
        ) {

            damage *=
                this.airComboMultiplier;
        }

        // =====================================
        // Elemental
        // =====================================

        damage =
            this.applyElementalDamage(

                attacker,

                target,

                damage
            );

        // =====================================
        // Defense
        // =====================================

        damage =
            this.applyDefense(

                target,

                damage
            );

        // =====================================
        // Minimum Damage
        // =====================================

        damage =
            Math.max(
                1,
                Math.floor(damage)
            );

        // =====================================
        // Apply Damage
        // =====================================

        this.dealDamage(

            target,

            damage,

            critical
        );

        // =====================================
        // Combo
        // =====================================

        this.addCombo();

        // =====================================
        // Combat State
        // =====================================

        this.enterCombat();

        // =====================================
        // Lifesteal
        // =====================================

        this.applyLifeSteal(

            attacker,

            damage
        );

        // =====================================
        // Knockback
        // =====================================

        this.applyKnockback(

            attacker,

            target,

            damage
        );

        // =====================================
        // Effects
        // =====================================

        this.createHitEffect(
            target
        );
    }

    // =========================================
    // Deal Damage
    // =========================================

    dealDamage(
        target,
        damage,
        critical = false
    ) {

        target.health -= damage;

        // =====================================
        // Damage Text
        // =====================================

        this.showDamageNumber(

            damage,

            target.x,

            target.y,

            critical
        );

        // =====================================
        // Flash
        // =====================================

        target.hitFlash = 0.15;

        // =====================================
        // Death
        // =====================================

        if (
            target.health <= 0
        ) {

            this.kill(target);
        }
    }

    // =========================================
    // Kill
    // =========================================

    kill(target) {

        target.dead = true;

        // =====================================
        // Explosion
        // =====================================

        this.createDeathEffect(
            target
        );

        // =====================================
        // XP
        // =====================================

        if (
            target.xpReward
        ) {

            this.game.leveling
                ?.addExperience(

                    target.xpReward
                );
        }

        // =====================================
        // Loot
        // =====================================

        this.game.inventory
            ?.dropLoot(target);

        // =====================================
        // Combo Bonus
        // =====================================

        this.combo += 2;

        // =====================================
        // Notification
        // =====================================

        this.game.ui
            ?.addNotification(

                `${target.name || "Enemy"} Defeated`,

                "success"
            );
    }

    // =========================================
    // Combo Add
    // =========================================

    addCombo() {

        this.combo++;

        if (
            this.combo >
            this.maxCombo
        ) {

            this.combo =
                this.maxCombo;
        }

        this.comboTimer =
            this.comboResetTime;

        // =====================================
        // Combo Milestones
        // =====================================

        if (
            this.combo % 10 === 0
        ) {

            this.game.ui
                ?.addNotification(

                    `${this.combo} HIT COMBO!`,

                    "legendary"
                );

            this.game.effects
                ?.shakeScreen(
                    6,
                    0.2
                );
        }
    }

    // =========================================
    // Reset Combo
    // =========================================

    resetCombo() {

        if (
            this.combo >= 10
        ) {

            this.showText(

                "COMBO LOST",

                this.game.player.x,

                this.game.player.y - 40,

                "#ff4444"
            );
        }

        this.combo = 0;
    }

    // =========================================
    // Critical Hit
    // =========================================

    rollCritical(attacker) {

        const chance =

            attacker.critChance || 0;

        return (

            Math.random() * 100
            < chance
        );
    }

    // =========================================
    // Backstab
    // =========================================

    isBackstab(
        attacker,
        target
    ) {

        return (

            attacker.direction !==
            target.direction
        );
    }

    // =========================================
    // Defense
    // =========================================

    applyDefense(
        target,
        damage
    ) {

        const defense =
            target.defense || 0;

        return (

            damage *

            (100 / (100 + defense))
        );
    }

    // =========================================
    // Elemental Damage
    // =========================================

    applyElementalDamage(
        attacker,
        target,
        damage
    ) {

        const element =
            attacker.element;

        if (
            !element
        ) {

            return damage;
        }

        // =====================================
        // Weaknesses
        // =====================================

        const weaknesses = {

            fire: "ice",

            ice: "lightning",

            lightning: "water",

            poison: "nature",

            holy: "shadow",

            shadow: "holy"
        };

        // =====================================
        // Bonus Damage
        // =====================================

        if (
            target.element ===
            weaknesses[element]
        ) {

            damage *= 1.5;

            this.showText(

                "WEAKNESS",

                target.x,

                target.y - 20,

                "#ffaa44"
            );
        }

        // =====================================
        // Status Effects
        // =====================================

        this.applyStatusEffect(
            target,
            element
        );

        return damage;
    }

    // =========================================
    // Status Effects
    // =========================================

    applyStatusEffect(
        target,
        element
    ) {

        switch (
            element
        ) {

            // =================================
            // Burn
            // =================================

            case "fire":

                target.burning = 3;

                break;

            // =================================
            // Freeze
            // =================================

            case "ice":

                target.slowed = 2;

                break;

            // =================================
            // Shock
            // =================================

            case "lightning":

                target.stunned = 1;

                break;

            // =================================
            // Poison
            // =================================

            case "poison":

                target.poisoned = 5;

                break;
        }
    }

    // =========================================
    // Lifesteal
    // =========================================

    applyLifeSteal(
        attacker,
        damage
    ) {

        const steal =
            attacker.lifeSteal || 0;

        if (
            steal <= 0
        ) {

            return;
        }

        const heal =

            damage *

            (steal / 100);

        attacker.health += heal;

        if (
            attacker.health >
            attacker.maxHealth
        ) {

            attacker.health =
                attacker.maxHealth;
        }

        this.showText(

            `+${Math.floor(heal)}`,

            attacker.x,

            attacker.y - 20,

            "#44ff44"
        );
    }

    // =========================================
    // Knockback
    // =========================================

    applyKnockback(
        attacker,
        target,
        damage
    ) {

        const force =

            Math.min(
                20,
                damage * 0.08
            );

        if (
            attacker.x < target.x
        ) {

            target.velocityX =
                force;
        }

        else {

            target.velocityX =
                -force;
        }

        target.velocityY =
            -4;
    }

    // =========================================
    // Parry
    // =========================================

    parry() {

        if (
            this.parryCooldown > 0
        ) {

            return false;
        }

        this.parryTimer =
            this.parryWindow;

        this.parryCooldown =
            1;

        this.showText(

            "PARRY",

            this.game.player.x,

            this.game.player.y - 30,

            "#44ccff"
        );

        return true;
    }

    // =========================================
    // Successful Parry
    // =========================================

    successfulParry(enemy) {

        enemy.stunned = 2;

        enemy.velocityX *= -2;

        this.game.effects
            ?.shakeScreen(
                10,
                0.3
            );

        this.showText(

            "PERFECT PARRY",

            enemy.x,

            enemy.y,

            "#ffff44"
        );
    }

    // =========================================
    // Dodge Roll
    // =========================================

    dodgeRoll(player) {

        if (
            this.rollCooldown > 0
        ) {

            return false;
        }

        player.rolling = true;

        player.invincible = true;

        player.velocityX =

            player.direction * 15;

        this.rollCooldown = 1;

        // =====================================
        // End Roll
        // =====================================

        setTimeout(() => {

            player.rolling = false;

            player.invincible = false;

        }, this.rollInvincibilityTime * 1000);

        return true;
    }

    // =========================================
    // Area Damage
    // =========================================

    areaAttack(
        x,
        y,
        radius,
        damage
    ) {

        for (
            const enemy of
            this.game.enemies
        ) {

            const distance =
                Math.hypot(

                    enemy.x - x,

                    enemy.y - y
                );

            if (
                distance <= radius
            ) {

                this.dealDamage(

                    enemy,

                    damage
                );

                this.applyKnockback(

                    { x },

                    enemy,

                    damage
                );
            }
        }
    }

    // =========================================
    // Combat State
    // =========================================

    enterCombat() {

        this.inCombat = true;

        this.combatTimer =
            this.combatDuration;
    }

    // =========================================
    // Hit Effect
    // =========================================

    createHitEffect(target) {

        this.game.effects
            ?.createEffect({

                type: "hit",

                x:
                    target.x +
                    target.width / 2,

                y:
                    target.y +
                    target.height / 2,

                radius: 25,

                life: 0.2
            });

        // Particles
        for (
            let i = 0;
            i < 8;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        target.x +
                        target.width / 2,

                    y:
                        target.y +
                        target.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 10,

                    velocityY:
                        (Math.random() - 0.5) * 10,

                    size:
                        Math.random() * 4 + 2,

                    color: "#ff4444",

                    life: 0.5
                });
        }
    }

    // =========================================
    // Death Effect
    // =========================================

    createDeathEffect(target) {

        for (
            let i = 0;
            i < 25;
            i++
        ) {

            this.game.effects
                ?.createParticle({

                    x:
                        target.x +
                        target.width / 2,

                    y:
                        target.y +
                        target.height / 2,

                    velocityX:
                        (Math.random() - 0.5) * 20,

                    velocityY:
                        (Math.random() - 0.5) * 20,

                    size:
                        Math.random() * 8 + 2,

                    color: "#ff8844",

                    life: 1
                });
        }
    }

    // =========================================
    // Damage Numbers
    // =========================================

    showDamageNumber(
        damage,
        x,
        y,
        critical = false
    ) {

        this.showText(

            damage.toString(),

            x,

            y,

            critical
            ? "#ffff44"
            : "#ffffff"
        );
    }

    // =========================================
    // Floating Text
    // =========================================

    showText(
        text,
        x,
        y,
        color = "#ffffff"
    ) {

        this.game.effects
            ?.createFloatingText({

                text,

                x,

                y,

                color
            });
    }

    // =========================================
    // Draw UI
    // =========================================

    draw(ctx) {

        // =====================================
        // Combo Counter
        // =====================================

        if (
            this.combo > 1
        ) {

            ctx.fillStyle =
                "#ffaa44";

            ctx.font =
                "bold 36px Arial";

            ctx.fillText(

                `${this.combo} COMBO`,

                this.game.canvas.width / 2 - 100,

                120
            );
        }

        // =====================================
        // Combat State
        // =====================================

        if (
            this.inCombat
        ) {

            ctx.fillStyle =
                "#ff4444";

            ctx.font =
                "18px Arial";

            ctx.fillText(

                "IN COMBAT",

                this.game.canvas.width - 180,

                40
            );
        }

        // =====================================
        // Parry Cooldown
        // =====================================

        if (
            this.parryCooldown > 0
        ) {

            ctx.fillStyle =
                "#44ccff";

            ctx.font =
                "16px Arial";

            ctx.fillText(

                `Parry CD: ${this.parryCooldown.toFixed(1)}`,

                20,

                160
            );
        }
    }
}