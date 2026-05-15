// =========================================
// Ultimate Tower RPG - skills.js
// =========================================

// =========================================
// Skill System
// =========================================

export class SkillSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Equipped Skills
        // =====================================

        this.equippedSkills = [];

        // =====================================
        // Unlocked Skills
        // =====================================

        this.unlockedSkills = [];

        // =====================================
        // Cooldowns
        // =====================================

        this.cooldowns = {};

        // =====================================
        // Skill Slots
        // =====================================

        this.maxSkillSlots = 6;

        // =====================================
        // Keybinds
        // =====================================

        this.keybinds = {

            1: null,

            2: null,

            3: null,

            4: null,

            5: null,

            6: null
        };

        // =====================================
        // Skill Definitions
        // =====================================

        this.skills = {

            // =================================
            // WARRIOR
            // =================================

            rageSlash: {

                name: "Rage Slash",

                classType: "warrior",

                damage: 45,

                manaCost: 10,

                cooldown: 3,

                range: 120,

                type: "melee",

                description:
                    "Heavy sword slash"
            },

            whirlwind: {

                name: "Whirlwind",

                classType: "warrior",

                damage: 20,

                manaCost: 25,

                cooldown: 8,

                range: 180,

                type: "aoe",

                duration: 3,

                description:
                    "Spin attack hitting all enemies"
            },

            leapStrike: {

                name: "Leap Strike",

                classType: "warrior",

                damage: 60,

                manaCost: 20,

                cooldown: 7,

                type: "movement",

                description:
                    "Jump slam attack"
            },

            shieldBreak: {

                name: "Shield Break",

                classType: "warrior",

                damage: 35,

                manaCost: 15,

                cooldown: 5,

                type: "debuff",

                description:
                    "Lower enemy defense"
            },

            // =================================
            // MAGE
            // =================================

            fireball: {

                name: "Fireball",

                classType: "mage",

                damage: 50,

                manaCost: 15,

                cooldown: 2,

                range: 500,

                element: "fire",

                type: "projectile",

                description:
                    "Explosive fire projectile"
            },

            iceNova: {

                name: "Ice Nova",

                classType: "mage",

                damage: 25,

                manaCost: 30,

                cooldown: 10,

                range: 220,

                element: "ice",

                type: "aoe",

                description:
                    "Freeze nearby enemies"
            },

            lightningChain: {

                name: "Lightning Chain",

                classType: "mage",

                damage: 40,

                manaCost: 20,

                cooldown: 6,

                range: 400,

                element: "lightning",

                type: "chain",

                description:
                    "Lightning jumps between enemies"
            },

            meteor: {

                name: "Meteor",

                classType: "mage",

                damage: 120,

                manaCost: 50,

                cooldown: 15,

                range: 700,

                element: "fire",

                type: "ultimateSkill",

                description:
                    "Massive meteor strike"
            },

            // =================================
            // ROGUE
            // =================================

            shadowStep: {

                name: "Shadow Step",

                classType: "rogue",

                damage: 35,

                manaCost: 15,

                cooldown: 4,

                type: "movement",

                description:
                    "Teleport behind enemies"
            },

            poisonDaggers: {

                name: "Poison Daggers",

                classType: "rogue",

                damage: 18,

                manaCost: 12,

                cooldown: 3,

                range: 400,

                type: "projectile",

                effect: "poison",

                description:
                    "Throw poisoned daggers"
            },

            smokeBomb: {

                name: "Smoke Bomb",

                classType: "rogue",

                manaCost: 20,

                cooldown: 12,

                type: "utility",

                description:
                    "Become invisible briefly"
            },

            bladeDance: {

                name: "Blade Dance",

                classType: "rogue",

                damage: 15,

                manaCost: 30,

                cooldown: 10,

                duration: 4,

                type: "combo",

                description:
                    "Rapid combo attack"
            },

            // =================================
            // TANK
            // =================================

            taunt: {

                name: "Taunt",

                classType: "tank",

                manaCost: 15,

                cooldown: 8,

                range: 300,

                type: "utility",

                description:
                    "Force enemies to target you"
            },

            groundSlam: {

                name: "Ground Slam",

                classType: "tank",

                damage: 55,

                manaCost: 25,

                cooldown: 7,

                range: 200,

                type: "aoe",

                description:
                    "Massive shockwave"
            },

            ironSkin: {

                name: "Iron Skin",

                classType: "tank",

                manaCost: 20,

                cooldown: 15,

                duration: 8,

                type: "buff",

                description:
                    "Increase defense greatly"
            },

            barrierField: {

                name: "Barrier Field",

                classType: "tank",

                manaCost: 35,

                cooldown: 18,

                duration: 6,

                type: "shield",

                description:
                    "Create protective barrier"
            },

            // =================================
            // SUPPORT
            // =================================

            heal: {

                name: "Heal",

                classType: "support",

                healing: 50,

                manaCost: 20,

                cooldown: 4,

                range: 250,

                type: "heal",

                description:
                    "Restore health"
            },

            holyAura: {

                name: "Holy Aura",

                classType: "support",

                manaCost: 30,

                cooldown: 12,

                duration: 10,

                type: "buff",

                description:
                    "Boost nearby allies"
            },

            revive: {

                name: "Revive",

                classType: "support",

                manaCost: 60,

                cooldown: 45,

                type: "revive",

                description:
                    "Revive defeated ally"
            },

            summonWolf: {

                name: "Summon Wolf",

                classType: "support",

                manaCost: 35,

                cooldown: 20,

                duration: 25,

                type: "summon",

                description:
                    "Summon companion wolf"
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
            const skill in
            this.cooldowns
        ) {

            this.cooldowns[skill] -=
                deltaTime;

            if (
                this.cooldowns[skill] <= 0
            ) {

                delete this.cooldowns[skill];
            }
        }
    }

    // =========================================
    // Unlock Skill
    // =========================================

    unlockSkill(skillId) {

        if (

            this.unlockedSkills.includes(
                skillId
            )
        ) {

            return;
        }

        this.unlockedSkills.push(
            skillId
        );

        const skill =
            this.skills[skillId];

        this.notify(

            `${skill.name} unlocked!`,

            "success"
        );
    }

    // =========================================
    // Equip Skill
    // =========================================

    equipSkill(
        skillId,
        slot
    ) {

        const skill =
            this.skills[skillId];

        if (
            !skill
        ) {

            return false;
        }

        // =====================================
        // Unlocked
        // =====================================

        if (

            !this.unlockedSkills.includes(
                skillId
            )
        ) {

            return false;
        }

        // =====================================
        // Class Check
        // =====================================

        if (

            skill.classType !==
            this.game.player.classType
        ) {

            return false;
        }

        // =====================================
        // Equip
        // =====================================

        this.keybinds[slot] =
            skillId;

        if (

            !this.equippedSkills.includes(
                skillId
            )
        ) {

            this.equippedSkills.push(
                skillId
            );
        }

        return true;
    }

    // =========================================
    // Use Skill
    // =========================================

    useSkill(slot) {

        const skillId =
            this.keybinds[slot];

        if (
            !skillId
        ) {

            return false;
        }

        const skill =
            this.skills[skillId];

        const player =
            this.game.player;

        // =====================================
        // Cooldown
        // =====================================

        if (
            this.cooldowns[skillId]
        ) {

            return false;
        }

        // =====================================
        // Mana
        // =====================================

        if (
            player.mana <
            skill.manaCost
        ) {

            this.notify(

                "Not enough mana",

                "warning"
            );

            return false;
        }

        // =====================================
        // Consume Mana
        // =====================================

        player.mana -=
            skill.manaCost;

        // =====================================
        // Set Cooldown
        // =====================================

        const cooldownReduction =

            player.cooldownReduction || 0;

        this.cooldowns[skillId] =

            skill.cooldown *

            (1 -
            cooldownReduction / 100);

        // =====================================
        // Activate
        // =====================================

        switch(skillId) {

            // Warrior
            case "rageSlash":
                this.rageSlash(skill);
                break;

            case "whirlwind":
                this.whirlwind(skill);
                break;

            case "leapStrike":
                this.leapStrike(skill);
                break;

            // Mage
            case "fireball":
                this.fireball(skill);
                break;

            case "iceNova":
                this.iceNova(skill);
                break;

            case "lightningChain":
                this.lightningChain(skill);
                break;

            // Rogue
            case "shadowStep":
                this.shadowStep(skill);
                break;

            case "poisonDaggers":
                this.poisonDaggers(skill);
                break;

            case "smokeBomb":
                this.smokeBomb(skill);
                break;

            // Tank
            case "taunt":
                this.taunt(skill);
                break;

            case "groundSlam":
                this.groundSlam(skill);
                break;

            case "ironSkin":
                this.ironSkin(skill);
                break;

            // Support
            case "heal":
                this.heal(skill);
                break;

            case "holyAura":
                this.holyAura(skill);
                break;

            case "summonWolf":
                this.summonWolf(skill);
                break;
        }

        // =====================================
        // Ultimate Energy
        // =====================================

        this.game.ultimateSystem
            ?.addEnergy(10);

        return true;
    }

    // =========================================
    // Rage Slash
    // =========================================

    rageSlash(skill) {

        const player =
            this.game.player;

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
                distance <
                skill.range
            ) {

                enemy.takeDamage?.(
                    skill.damage +
                    player.damage
                );
            }
        }

        this.createEffect(
            "slash",
            player.x,
            player.y
        );
    }

    // =========================================
    // Whirlwind
    // =========================================

    whirlwind(skill) {

        const player =
            this.game.player;

        player.whirlwindActive =
            skill.duration;

        this.notify(
            "WHIRLWIND!",
            "skill"
        );
    }

    // =========================================
    // Leap Strike
    // =========================================

    leapStrike(skill) {

        const player =
            this.game.player;

        player.velocityY = -20;

        player.velocityX =
            player.direction * 12;

        setTimeout(() => {

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
                        skill.damage
                    );

                    enemy.velocityY =
                        -12;
                }
            }

        }, 400);
    }

    // =========================================
    // Fireball
    // =========================================

    fireball(skill) {

        const player =
            this.game.player;

        this.game.projectiles.push({

            type: "fireball",

            x: player.x,

            y: player.y,

            width: 24,

            height: 24,

            velocityX:
                player.direction * 12,

            velocityY: 0,

            damage:
                skill.damage +
                player.damage,

            element: "fire",

            owner: "player"
        });
    }

    // =========================================
    // Ice Nova
    // =========================================

    iceNova(skill) {

        const player =
            this.game.player;

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
                distance <
                skill.range
            ) {

                enemy.takeDamage?.(
                    skill.damage
                );

                enemy.frozen = 3;
            }
        }

        this.createEffect(
            "iceNova",
            player.x,
            player.y
        );
    }

    // =========================================
    // Lightning Chain
    // =========================================

    lightningChain(skill) {

        const player =
            this.game.player;

        let hits = 0;

        for (
            const enemy of
            this.game.enemies
        ) {

            if (
                hits >= 5
            ) {

                break;
            }

            const distance =
                Math.hypot(

                    enemy.x - player.x,

                    enemy.y - player.y
                );

            if (
                distance <
                skill.range
            ) {

                enemy.takeDamage?.(
                    skill.damage
                );

                hits++;
            }
        }
    }

    // =========================================
    // Shadow Step
    // =========================================

    shadowStep(skill) {

        const player =
            this.game.player;

        player.x +=
            player.direction * 250;

        this.createEffect(
            "shadow",
            player.x,
            player.y
        );
    }

    // =========================================
    // Poison Daggers
    // =========================================

    poisonDaggers(skill) {

        const player =
            this.game.player;

        for (
            let i = -1;
            i <= 1;
            i++
        ) {

            this.game.projectiles.push({

                type: "dagger",

                x: player.x,

                y: player.y,

                width: 12,

                height: 12,

                velocityX:
                    player.direction * 15,

                velocityY:
                    i * 2,

                damage: skill.damage,

                poison: true,

                owner: "player"
            });
        }
    }

    // =========================================
    // Smoke Bomb
    // =========================================

    smokeBomb(skill) {

        const player =
            this.game.player;

        player.invisible = true;

        setTimeout(() => {

            player.invisible = false;

        }, 4000);

        this.createEffect(
            "smoke",
            player.x,
            player.y
        );
    }

    // =========================================
    // Taunt
    // =========================================

    taunt(skill) {

        const player =
            this.game.player;

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
                distance <
                skill.range
            ) {

                enemy.target =
                    player;
            }
        }
    }

    // =========================================
    // Ground Slam
    // =========================================

    groundSlam(skill) {

        const player =
            this.game.player;

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
                distance <
                skill.range
            ) {

                enemy.takeDamage?.(
                    skill.damage
                );

                enemy.velocityY =
                    -15;
            }
        }

        this.game.effects
            ?.shakeScreen(
                12,
                0.5
            );
    }

    // =========================================
    // Iron Skin
    // =========================================

    ironSkin(skill) {

        const player =
            this.game.player;

        player.defense += 50;

        setTimeout(() => {

            player.defense -= 50;

        }, skill.duration * 1000);
    }

    // =========================================
    // Heal
    // =========================================

    heal(skill) {

        const player =
            this.game.player;

        player.heal?.(
            skill.healing
        );

        this.createEffect(
            "heal",
            player.x,
            player.y
        );
    }

    // =========================================
    // Holy Aura
    // =========================================

    holyAura(skill) {

        const player =
            this.game.player;

        player.damageMultiplier =
            1.3;

        player.speed *= 1.2;

        setTimeout(() => {

            player.damageMultiplier =
                1;

            player.speed /= 1.2;

        }, skill.duration * 1000);
    }

    // =========================================
    // Summon Wolf
    // =========================================

    summonWolf(skill) {

        const player =
            this.game.player;

        if (
            !player.summons
        ) {

            player.summons = [];
        }

        const wolf = {

            type: "wolf",

            x:
                player.x + 60,

            y:
                player.y,

            width: 40,

            height: 40,

            damage: 20,

            speed: 5,

            life:
                skill.duration
        };

        player.summons.push(
            wolf
        );

        this.game.entities.push(
            wolf
        );
    }

    // =========================================
    // Effect
    // =========================================

    createEffect(
        type,
        x,
        y
    ) {

        this.game.effects
            ?.createEffect({

                type,

                x,

                y,

                life: 1
            });
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
    // Draw
    // =========================================

    draw(ctx) {

        const startX = 20;

        const y =
            this.game.canvas.height - 140;

        const size = 60;

        // =====================================
        // Skill Slots
        // =====================================

        for (
            let i = 1;
            i <= this.maxSkillSlots;
            i++
        ) {

            const x =
                startX +
                ((i - 1) * 70);

            // Background
            ctx.fillStyle =
                "rgba(0,0,0,0.7)";

            ctx.fillRect(
                x,
                y,
                size,
                size
            );

            // Border
            ctx.strokeStyle =
                "#ffffff";

            ctx.strokeRect(
                x,
                y,
                size,
                size
            );

            // Skill
            const skillId =
                this.keybinds[i];

            if (
                skillId
            ) {

                const skill =
                    this.skills[skillId];

                ctx.fillStyle =
                    "#ffffff";

                ctx.font =
                    "12px Arial";

                ctx.fillText(

                    skill.name,

                    x + 5,

                    y + 20
                );

                // Cooldown Overlay
                if (
                    this.cooldowns[skillId]
                ) {

                    const cooldown =
                        this.cooldowns[
                            skillId
                        ];

                    ctx.fillStyle =
                        "rgba(0,0,0,0.7)";

                    ctx.fillRect(
                        x,
                        y,
                        size,
                        size
                    );

                    ctx.fillStyle =
                        "#ff4444";

                    ctx.font =
                        "20px Arial";

                    ctx.fillText(

                        cooldown
                            .toFixed(1),

                        x + 18,

                        y + 38
                    );
                }
            }

            // Keybind
            ctx.fillStyle =
                "#ffff66";

            ctx.font =
                "16px Arial";

            ctx.fillText(
                i,
                x + 24,
                y + 55
            );
        }
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            equippedSkills:
                this.equippedSkills,

            unlockedSkills:
                this.unlockedSkills,

            keybinds:
                this.keybinds
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

        this.equippedSkills =
            data.equippedSkills || [];

        this.unlockedSkills =
            data.unlockedSkills || [];

        this.keybinds =
            data.keybinds ||
            this.keybinds;
    }
}