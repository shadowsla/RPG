// =========================================
// Ultimate Tower RPG - ultimates.js
// =========================================

// =========================================
// Ultimate Ability System
// =========================================

export class UltimateSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Ultimate Energy
        // =====================================

        this.energy = 0;

        this.maxEnergy = 100;

        // =====================================
        // Cooldowns
        // =====================================

        this.cooldowns = {};

        // =====================================
        // Active Ultimates
        // =====================================

        this.activeUltimates = [];

        // =====================================
        // Keybind
        // =====================================

        this.keybind = "R";

        // =====================================
        // Ultimate Definitions
        // =====================================

        this.ultimates = {

            // =================================
            // Warrior
            // =================================

            warrior: {

                name: "Titan Breaker",

                description:
                    "Massive shockwave attack",

                energyCost: 100,

                cooldown: 45,

                duration: 4
            },

            // =================================
            // Mage
            // =================================

            mage: {

                name: "Arcane Cataclysm",

                description:
                    "Rain magical meteors",

                energyCost: 100,

                cooldown: 50,

                duration: 6
            },

            // =================================
            // Rogue
            // =================================

            rogue: {

                name: "Shadow Frenzy",

                description:
                    "Extreme speed and clones",

                energyCost: 100,

                cooldown: 40,

                duration: 8
            },

            // =================================
            // Tank
            // =================================

            tank: {

                name: "Fortress Mode",

                description:
                    "Become unstoppable",

                energyCost: 100,

                cooldown: 55,

                duration: 10
            },

            // =================================
            // Support
            // =================================

            support: {

                name: "Celestial Blessing",

                description:
                    "Heal and buff allies",

                energyCost: 100,

                cooldown: 45,

                duration: 10
            }
        };
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Cooldowns
        // =====================================

        for (
            const key in
            this.cooldowns
        ) {

            this.cooldowns[key] -=
                deltaTime;

            if (
                this.cooldowns[key] <= 0
            ) {

                delete this.cooldowns[key];
            }
        }

        // =====================================
        // Active Ultimates
        // =====================================

        for (
            let i =
                this.activeUltimates.length - 1;
            i >= 0;
            i--
        ) {

            const ultimate =
                this.activeUltimates[i];

            ultimate.timer -=
                deltaTime;

            ultimate.update?.(
                deltaTime
            );

            // =================================
            // End
            // =================================

            if (
                ultimate.timer <= 0
            ) {

                ultimate.end?.();

                this.activeUltimates.splice(
                    i,
                    1
                );
            }
        }
    }

    // =========================================
    // Add Energy
    // =========================================

    addEnergy(amount) {

        this.energy += amount;

        if (
            this.energy >
            this.maxEnergy
        ) {

            this.energy =
                this.maxEnergy;
        }
    }

    // =========================================
    // Use Ultimate
    // =========================================

    activateUltimate() {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return false;
        }

        const classType =
            player.classType;

        const ultimate =
            this.ultimates[
                classType
            ];

        if (
            !ultimate
        ) {

            return false;
        }

        // =====================================
        // Energy
        // =====================================

        if (
            this.energy <
            ultimate.energyCost
        ) {

            this.notify(

                "Ultimate not ready",

                "warning"
            );

            return false;
        }

        // =====================================
        // Cooldown
        // =====================================

        if (
            this.cooldowns[
                classType
            ]
        ) {

            this.notify(

                "Ultimate cooling down",

                "warning"
            );

            return false;
        }

        // =====================================
        // Consume
        // =====================================

        this.energy = 0;

        this.cooldowns[
            classType
        ] = ultimate.cooldown;

        // =====================================
        // Activate
        // =====================================

        switch(classType) {

            case "warrior":

                this.activateWarriorUltimate(
                    ultimate
                );

                break;

            case "mage":

                this.activateMageUltimate(
                    ultimate
                );

                break;

            case "rogue":

                this.activateRogueUltimate(
                    ultimate
                );

                break;

            case "tank":

                this.activateTankUltimate(
                    ultimate
                );

                break;

            case "support":

                this.activateSupportUltimate(
                    ultimate
                );

                break;
        }

        // =====================================
        // Effects
        // =====================================

        this.game.effects
            ?.flashScreen(

                "#ffffff",

                0.4,

                0.25
            );

        this.game.effects
            ?.shakeScreen(
                18,
                0.4
            );

        this.notify(

            `${ultimate.name} Activated!`,

            "ultimate"
        );

        return true;
    }

    // =========================================
    // Warrior Ultimate
    // =========================================

    activateWarriorUltimate(
        ultimate
    ) {

        const player =
            this.game.player;

        // =====================================
        // Shockwave
        // =====================================

        this.game.effects
            ?.createEffect({

                type: "shockwave",

                x:
                    player.x +
                    player.width / 2,

                y:
                    player.y +
                    player.height / 2,

                size: 300,

                color: "#ff9933",

                life: 1.5
            });

        // =====================================
        // Damage Enemies
        // =====================================

        for (
            const enemy of
            this.game.enemies
        ) {

            const dx =
                enemy.x - player.x;

            const dy =
                enemy.y - player.y;

            const distance =
                Math.hypot(dx, dy);

            if (
                distance < 300
            ) {

                enemy.takeDamage?.(200);

                // Knockback
                enemy.velocityX =
                    dx * 3;

                enemy.velocityY =
                    -10;
            }
        }
    }

    // =========================================
    // Mage Ultimate
    // =========================================

    activateMageUltimate(
        ultimate
    ) {

        const player =
            this.game.player;

        const active = {

            timer:
                ultimate.duration,

            meteorTimer: 0,

            update: (deltaTime) => {

                active.meteorTimer -=
                    deltaTime;

                if (
                    active.meteorTimer <= 0
                ) {

                    active.meteorTimer =
                        0.3;

                    this.spawnMeteor();
                }
            }
        };

        this.activeUltimates.push(
            active
        );

        player.arcaneMode = true;
    }

    // =========================================
    // Spawn Meteor
    // =========================================

    spawnMeteor() {

        const x =
            Math.random() * 3000;

        const y = -200;

        this.game.effects
            ?.createEffect({

                type: "explosion",

                x,
                y: 600,

                size: 180,

                life: 1
            });

        // =====================================
        // Damage
        // =====================================

        for (
            const enemy of
            this.game.enemies
        ) {

            const distance =
                Math.hypot(

                    enemy.x - x,

                    enemy.y - 600
                );

            if (
                distance < 180
            ) {

                enemy.takeDamage?.(120);
            }
        }
    }

    // =========================================
    // Rogue Ultimate
    // =========================================

    activateRogueUltimate(
        ultimate
    ) {

        const player =
            this.game.player;

        player.speed *= 2;

        player.attackSpeed *= 2;

        player.criticalChance += 0.5;

        // =====================================
        // Clones
        // =====================================

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            this.spawnShadowClone(
                player,
                i
            );
        }

        // =====================================
        // Active
        // =====================================

        this.activeUltimates.push({

            timer:
                ultimate.duration,

            end: () => {

                player.speed /= 2;

                player.attackSpeed /= 2;

                player.criticalChance -=
                    0.5;
            }
        });
    }

    // =========================================
    // Shadow Clone
    // =========================================

    spawnShadowClone(
        player,
        index
    ) {

        const clone = {

            x:
                player.x +
                (index - 1) * 80,

            y:
                player.y,

            width:
                player.width,

            height:
                player.height,

            life: 8,

            damage: 40,

            update(deltaTime) {

                this.life -=
                    deltaTime;
            },

            draw(ctx) {

                ctx.globalAlpha = 0.5;

                ctx.fillStyle =
                    "#6622ff";

                ctx.fillRect(

                    this.x,
                    this.y,

                    this.width,
                    this.height
                );

                ctx.globalAlpha = 1;
            }
        };

        this.game.entities.push(
            clone
        );
    }

    // =========================================
    // Tank Ultimate
    // =========================================

    activateTankUltimate(
        ultimate
    ) {

        const player =
            this.game.player;

        player.invulnerable =
            true;

        player.defense += 100;

        player.damageMultiplier =
            2;

        player.sizeMultiplier =
            1.5;

        this.activeUltimates.push({

            timer:
                ultimate.duration,

            update: () => {

                // Taunt
                for (
                    const enemy of
                    this.game.enemies
                ) {

                    enemy.target =
                        player;
                }
            },

            end: () => {

                player.invulnerable =
                    false;

                player.defense -= 100;

                player.damageMultiplier =
                    1;

                player.sizeMultiplier =
                    1;
            }
        });
    }

    // =========================================
    // Support Ultimate
    // =========================================

    activateSupportUltimate(
        ultimate
    ) {

        const player =
            this.game.player;

        const active = {

            timer:
                ultimate.duration,

            healTimer: 0,

            update: (deltaTime) => {

                active.healTimer -=
                    deltaTime;

                if (
                    active.healTimer <= 0
                ) {

                    active.healTimer = 1;

                    // Heal
                    player.heal?.(25);

                    // Shield
                    player.shield =
                        50;

                    // Aura
                    this.game.effects
                        ?.createEffect({

                            type: "aura",

                            x:
                                player.x,

                            y:
                                player.y,

                            size: 120,

                            color:
                                "#66ffcc",

                            life: 1
                        });
                }
            }
        };

        this.activeUltimates.push(
            active
        );
    }

    // =========================================
    // Draw UI
    // =========================================

    draw(ctx) {

        const x = 40;

        const y =
            this.game.canvas.height - 80;

        const width = 320;

        const height = 28;

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            "#111111";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // =====================================
        // Energy
        // =====================================

        const fillWidth =

            (this.energy /
            this.maxEnergy) *
            width;

        const gradient =
            ctx.createLinearGradient(

                x,
                y,

                x + width,
                y
            );

        gradient.addColorStop(
            0,
            "#33ccff"
        );

        gradient.addColorStop(
            1,
            "#9966ff"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(

            x,
            y,

            fillWidth,

            height
        );

        // =====================================
        // Border
        // =====================================

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 2;

        ctx.strokeRect(

            x,
            y,

            width,
            height
        );

        // =====================================
        // Text
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "18px Arial";

        ctx.fillText(

            `ULTIMATE [${this.keybind}]`,

            x + 70,

            y - 10
        );

        // =====================================
        // Ready
        // =====================================

        if (
            this.energy >=
            this.maxEnergy
        ) {

            ctx.fillStyle =
                "#ffff66";

            ctx.font =
                "22px Arial";

            ctx.fillText(

                "READY!",

                x + 110,

                y + 22
            );
        }
    }

    // =========================================
    // Notification
    // =========================================

    notify(
        message,
        type = "info"
    ) {

        this.game.ui
            ?.addNotification(

                message,

                type
            );
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            energy:
                this.energy,

            cooldowns:
                this.cooldowns
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

        this.energy =
            data.energy || 0;

        this.cooldowns =
            data.cooldowns || {};
    }
}