// =========================================
// Ultimate Tower RPG - subclasses.js
// =========================================

// =========================================
// Subclass System
// =========================================

export class SubclassSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Current Subclass
        // =====================================

        this.currentSubclass = null;

        // =====================================
        // Unlocked
        // =====================================

        this.unlockedSubclasses = [];

        // =====================================
        // Skill Trees
        // =====================================

        this.skillTrees = {};

        // =====================================
        // Definitions
        // =====================================

        this.subclasses = {

            // =================================
            // WARRIOR
            // =================================

            berserker: {

                mainClass: "warrior",

                name: "Berserker",

                description:
                    "Extreme melee damage and rage",

                passive:
                    "Gain damage as health lowers",

                bonuses: {

                    damage: 25,

                    attackSpeed: 15,

                    defense: -10,

                    critChance: 10
                },

                abilities: [

                    "Rage Slam",

                    "Blood Rush",

                    "Whirlwind",

                    "Execution Strike"
                ]
            },

            knight: {

                mainClass: "warrior",

                name: "Knight",

                description:
                    "Balanced offense and defense",

                passive:
                    "Reduce incoming damage",

                bonuses: {

                    defense: 25,

                    health: 100,

                    damage: 10
                },

                abilities: [

                    "Shield Bash",

                    "Holy Strike",

                    "Guardian Aura",

                    "Charge"
                ]
            },

            samurai: {

                mainClass: "warrior",

                name: "Samurai",

                description:
                    "Fast precision attacks",

                passive:
                    "Critical hits chain combos",

                bonuses: {

                    critChance: 20,

                    speed: 15,

                    attackSpeed: 20
                },

                abilities: [

                    "Quick Draw",

                    "Blade Dance",

                    "Counter Slash",

                    "Dragon Strike"
                ]
            },

            // =================================
            // MAGE
            // =================================

            pyromancer: {

                mainClass: "mage",

                name: "Pyromancer",

                description:
                    "Fire based destruction",

                passive:
                    "Burn enemies over time",

                bonuses: {

                    magicDamage: 30,

                    mana: 50
                },

                abilities: [

                    "Fireball",

                    "Flame Wave",

                    "Meteor Storm",

                    "Inferno"
                ]
            },

            cryomancer: {

                mainClass: "mage",

                name: "Cryomancer",

                description:
                    "Ice and freezing magic",

                passive:
                    "Slow enemies with attacks",

                bonuses: {

                    magicDamage: 15,

                    defense: 10,

                    manaRegen: 20
                },

                abilities: [

                    "Ice Spear",

                    "Frost Nova",

                    "Frozen Prison",

                    "Blizzard"
                ]
            },

            stormcaller: {

                mainClass: "mage",

                name: "Stormcaller",

                description:
                    "Lightning speed magic",

                passive:
                    "Lightning chains between enemies",

                bonuses: {

                    speed: 20,

                    critChance: 15,

                    magicDamage: 20
                },

                abilities: [

                    "Lightning Bolt",

                    "Thunder Crash",

                    "Static Field",

                    "Tempest"
                ]
            },

            // =================================
            // ROGUE
            // =================================

            assassin: {

                mainClass: "rogue",

                name: "Assassin",

                description:
                    "Critical burst damage",

                passive:
                    "Bonus damage from behind",

                bonuses: {

                    critChance: 30,

                    speed: 15,

                    stealth: 100
                },

                abilities: [

                    "Backstab",

                    "Shadow Step",

                    "Poison Blade",

                    "Death Mark"
                ]
            },

            ninja: {

                mainClass: "rogue",

                name: "Ninja",

                description:
                    "Mobility and stealth master",

                passive:
                    "Dodging increases damage",

                bonuses: {

                    speed: 30,

                    dodgeChance: 20,

                    attackSpeed: 15
                },

                abilities: [

                    "Smoke Bomb",

                    "Kunai Throw",

                    "Wall Run",

                    "Shadow Clone"
                ]
            },

            gunslinger: {

                mainClass: "rogue",

                name: "Gunslinger",

                description:
                    "Ranged combo specialist",

                passive:
                    "Rapid attacks build combo",

                bonuses: {

                    rangedDamage: 25,

                    attackSpeed: 25
                },

                abilities: [

                    "Rapid Fire",

                    "Ricochet Shot",

                    "Explosive Round",

                    "Bullet Storm"
                ]
            },

            // =================================
            // TANK
            // =================================

            juggernaut: {

                mainClass: "tank",

                name: "Juggernaut",

                description:
                    "Massive unstoppable defense",

                passive:
                    "Cannot be knocked back",

                bonuses: {

                    health: 300,

                    defense: 40,

                    speed: -10
                },

                abilities: [

                    "Earthquake",

                    "Fortify",

                    "Taunt",

                    "Titan Crash"
                ]
            },

            paladin: {

                mainClass: "tank",

                name: "Paladin",

                description:
                    "Holy defensive warrior",

                passive:
                    "Heal nearby allies",

                bonuses: {

                    defense: 25,

                    healing: 20,

                    health: 150
                },

                abilities: [

                    "Holy Shield",

                    "Divine Light",

                    "Judgement",

                    "Sanctuary"
                ]
            },

            guardian: {

                mainClass: "tank",

                name: "Guardian",

                description:
                    "Protective shield specialist",

                passive:
                    "Generate energy shields",

                bonuses: {

                    shieldPower: 40,

                    defense: 30
                },

                abilities: [

                    "Barrier Field",

                    "Reflect",

                    "Protect",

                    "Iron Wall"
                ]
            },

            // =================================
            // SUPPORT
            // =================================

            priest: {

                mainClass: "support",

                name: "Priest",

                description:
                    "Powerful healing support",

                passive:
                    "Healing restores mana",

                bonuses: {

                    healing: 40,

                    mana: 100
                },

                abilities: [

                    "Heal",

                    "Revive",

                    "Blessing",

                    "Purify"
                ]
            },

            bard: {

                mainClass: "support",

                name: "Bard",

                description:
                    "Music based buffs",

                passive:
                    "Songs buff nearby allies",

                bonuses: {

                    cooldownReduction: 20,

                    speed: 15
                },

                abilities: [

                    "Battle Song",

                    "Healing Melody",

                    "Speed Anthem",

                    "Silence"
                ]
            },

            druid: {

                mainClass: "support",

                name: "Druid",

                description:
                    "Nature magic and summons",

                passive:
                    "Summons gain bonus stats",

                bonuses: {

                    summonDamage: 25,

                    healing: 20,

                    manaRegen: 15
                },

                abilities: [

                    "Summon Wolf",

                    "Nature Heal",

                    "Vine Trap",

                    "Spirit Tree"
                ]
            }
        };

        // =====================================
        // Skill Trees
        // =====================================

        this.initializeSkillTrees();
    }

    // =========================================
    // Skill Trees
    // =========================================

    initializeSkillTrees() {

        for (
            const subclassName in
            this.subclasses
        ) {

            this.skillTrees[
                subclassName
            ] = {

                points: 0,

                skills: [

                    {
                        id: "power1",

                        name:
                            "Power Boost",

                        level: 0,

                        maxLevel: 5,

                        description:
                            "+5% Damage"
                    },

                    {
                        id: "survival1",

                        name:
                            "Survival",

                        level: 0,

                        maxLevel: 5,

                        description:
                            "+10 Max Health"
                    },

                    {
                        id: "speed1",

                        name:
                            "Quickness",

                        level: 0,

                        maxLevel: 5,

                        description:
                            "+3% Speed"
                    }
                ]
            };
        }
    }

    // =========================================
    // Unlock
    // =========================================

    unlockSubclass(subclassName) {

        if (
            this.unlockedSubclasses.includes(
                subclassName
            )
        ) {

            return;
        }

        this.unlockedSubclasses.push(
            subclassName
        );

        this.notify(

            `${subclassName} unlocked!`,

            "success"
        );
    }

    // =========================================
    // Select
    // =========================================

    selectSubclass(subclassName) {

        const subclass =
            this.subclasses[
                subclassName
            ];

        if (
            !subclass
        ) {

            return false;
        }

        // =====================================
        // Unlock Check
        // =====================================

        if (

            !this.unlockedSubclasses
            .includes(subclassName)
        ) {

            this.notify(

                "Subclass locked",

                "danger"
            );

            return false;
        }

        // =====================================
        // Main Class Check
        // =====================================

        const player =
            this.game.player;

        if (

            player.classType !==
            subclass.mainClass
        ) {

            this.notify(

                `Requires ${subclass.mainClass}`,

                "danger"
            );

            return false;
        }

        // =====================================
        // Remove Old Bonuses
        // =====================================

        if (
            this.currentSubclass
        ) {

            this.removeBonuses(
                this.currentSubclass
            );
        }

        // =====================================
        // Apply
        // =====================================

        this.currentSubclass =
            subclassName;

        this.applyBonuses(
            subclassName
        );

        this.notify(

            `${subclass.name} selected!`,

            "success"
        );

        return true;
    }

    // =========================================
    // Bonuses
    // =========================================

    applyBonuses(subclassName) {

        const subclass =
            this.subclasses[
                subclassName
            ];

        const player =
            this.game.player;

        for (
            const stat in
            subclass.bonuses
        ) {

            if (
                player[stat] ===
                undefined
            ) {

                player[stat] = 0;
            }

            player[stat] +=
                subclass.bonuses[stat];
        }
    }

    // =========================================
    // Remove Bonuses
    // =========================================

    removeBonuses(subclassName) {

        const subclass =
            this.subclasses[
                subclassName
            ];

        const player =
            this.game.player;

        for (
            const stat in
            subclass.bonuses
        ) {

            player[stat] -=
                subclass.bonuses[stat];
        }
    }

    // =========================================
    // Skill Points
    // =========================================

    addSkillPoint(
        subclassName,
        amount = 1
    ) {

        this.skillTrees[
            subclassName
        ].points += amount;
    }

    // =========================================
    // Upgrade Skill
    // =========================================

    upgradeSkill(
        subclassName,
        skillId
    ) {

        const tree =
            this.skillTrees[
                subclassName
            ];

        if (
            tree.points <= 0
        ) {

            return false;
        }

        const skill =
            tree.skills.find(

                s =>
                    s.id === skillId
            );

        if (
            !skill
        ) {

            return false;
        }

        if (
            skill.level >=
            skill.maxLevel
        ) {

            return false;
        }

        // =====================================
        // Upgrade
        // =====================================

        skill.level++;

        tree.points--;

        this.applySkillEffect(
            skill
        );

        this.notify(

            `${skill.name} upgraded!`,

            "success"
        );

        return true;
    }

    // =========================================
    // Skill Effects
    // =========================================

    applySkillEffect(skill) {

        const player =
            this.game.player;

        switch(skill.id) {

            case "power1":

                player.damage += 5;

                break;

            case "survival1":

                player.maxHealth += 10;

                break;

            case "speed1":

                player.speed += 3;

                break;
        }
    }

    // =========================================
    // Passive Update
    // =========================================

    update(deltaTime) {

        if (
            !this.currentSubclass
        ) {

            return;
        }

        const player =
            this.game.player;

        switch(this.currentSubclass) {

            // =================================
            // Berserker
            // =================================

            case "berserker":

                this.updateBerserker(
                    player
                );

                break;

            // =================================
            // Paladin
            // =================================

            case "paladin":

                this.updatePaladin(
                    player,
                    deltaTime
                );

                break;

            // =================================
            // Druid
            // =================================

            case "druid":

                this.updateDruid(
                    player
                );

                break;
        }
    }

    // =========================================
    // Berserker Passive
    // =========================================

    updateBerserker(player) {

        const healthPercent =

            player.health /
            player.maxHealth;

        player.damageMultiplier =

            1 +

            ((1 - healthPercent) *
            1.5);
    }

    // =========================================
    // Paladin Passive
    // =========================================

    updatePaladin(
        player,
        deltaTime
    ) {

        if (
            !player.healTimer
        ) {

            player.healTimer = 0;
        }

        player.healTimer -=
            deltaTime;

        if (
            player.healTimer <= 0
        ) {

            player.healTimer = 2;

            player.heal?.(5);
        }
    }

    // =========================================
    // Druid Passive
    // =========================================

    updateDruid(player) {

        if (
            player.summons
        ) {

            for (
                const summon of
                player.summons
            ) {

                summon.damage *= 1.001;
            }
        }
    }

    // =========================================
    // Get Current
    // =========================================

    getCurrentSubclass() {

        if (
            !this.currentSubclass
        ) {

            return null;
        }

        return this.subclasses[
            this.currentSubclass
        ];
    }

    // =========================================
    // Draw UI
    // =========================================

    draw(ctx) {

        if (
            !this.currentSubclass
        ) {

            return;
        }

        const subclass =
            this.getCurrentSubclass();

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            "rgba(0,0,0,0.6)";

        ctx.fillRect(
            20,
            20,
            300,
            90
        );

        // =====================================
        // Name
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "24px Arial";

        ctx.fillText(

            subclass.name,

            35,

            50
        );

        // =====================================
        // Passive
        // =====================================

        ctx.font =
            "16px Arial";

        ctx.fillStyle =
            "#cccccc";

        ctx.fillText(

            `Passive: ${subclass.passive}`,

            35,

            80
        );
    }

    // =========================================
    // Save
    // =========================================

    save() {

        return {

            currentSubclass:
                this.currentSubclass,

            unlockedSubclasses:
                this.unlockedSubclasses,

            skillTrees:
                this.skillTrees
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

        this.currentSubclass =
            data.currentSubclass;

        this.unlockedSubclasses =
            data.unlockedSubclasses || [];

        this.skillTrees =
            data.skillTrees ||
            this.skillTrees;
    }

    // =========================================
    // Notify
    // =========================================

    notify(
        message,
        type = "info"
    ) {

        this.game.ui?.addNotification(

            message,

            type
        );
    }
}