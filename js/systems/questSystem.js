// =========================================
// Ultimate Tower RPG - questSystem.js
// =========================================

// =========================================
// Quest System
// =========================================

export class QuestSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Quest Lists
        // =====================================

        this.activeQuests = [];

        this.completedQuests = [];

        this.failedQuests = [];

        this.availableQuests = [];

        // =====================================
        // Quest ID
        // =====================================

        this.nextQuestId = 1;

        // =====================================
        // Generate Starting Quests
        // =====================================

        this.generateStarterQuests();
    }

    // =========================================
    // Starter Quests
    // =========================================

    generateStarterQuests() {

        // =====================================
        // First Blood
        // =====================================

        this.addAvailableQuest({

            title: "First Blood",

            description:
                "Defeat 10 enemies.",

            type: "kill",

            target: "enemy",

            required: 10,

            progress: 0,

            rewards: {

                gold: 250,

                exp: 150,

                item: "Iron Sword"
            }
        });

        // =====================================
        // Treasure Hunter
        // =====================================

        this.addAvailableQuest({

            title: "Treasure Hunter",

            description:
                "Collect 500 gold.",

            type: "gold",

            required: 500,

            progress: 0,

            rewards: {

                gold: 500,

                exp: 250
            }
        });

        // =====================================
        // Tower Climber
        // =====================================

        this.addAvailableQuest({

            title: "Tower Climber",

            description:
                "Reach Floor 5.",

            type: "floor",

            required: 5,

            progress: 0,

            rewards: {

                gold: 1000,

                exp: 600,

                unlock: "Double Jump"
            }
        });

        // =====================================
        // Combo Master
        // =====================================

        this.addAvailableQuest({

            title: "Combo Master",

            description:
                "Reach a 25 combo.",

            type: "combo",

            required: 25,

            progress: 0,

            rewards: {

                gold: 800,

                exp: 500
            }
        });

        // =====================================
        // Explorer
        // =====================================

        this.addAvailableQuest({

            title: "Explorer",

            description:
                "Discover 3 secret rooms.",

            type: "secret",

            required: 3,

            progress: 0,

            rewards: {

                gold: 1200,

                exp: 700,

                item: "Explorer Boots"
            }
        });
    }

    // =========================================
    // Add Available Quest
    // =========================================

    addAvailableQuest(data) {

        const quest = {

            id: this.nextQuestId++,

            title:
                data.title,

            description:
                data.description,

            type:
                data.type,

            target:
                data.target || null,

            required:
                data.required || 1,

            progress:
                data.progress || 0,

            rewards:
                data.rewards || {},

            rarity:
                data.rarity || "Common",

            timeLimit:
                data.timeLimit || null,

            completed:
                false,

            failed:
                false
        };

        this.availableQuests.push(
            quest
        );
    }

    // =========================================
    // Accept Quest
    // =========================================

    acceptQuest(questId) {

        const index =
            this.availableQuests.findIndex(

                q => q.id === questId
            );

        if (
            index === -1
        ) {

            return;
        }

        const quest =
            this.availableQuests[index];

        this.activeQuests.push(
            quest
        );

        this.availableQuests.splice(
            index,
            1
        );

        // =====================================
        // Notification
        // =====================================

        this.game.ui?.addNotification(

            `Quest Accepted: ${quest.title}`,

            "success"
        );

        // =====================================
        // Sound
        // =====================================

        this.game.sound?.playSound(
            "uiClick"
        );
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        for (
            const quest of
            this.activeQuests
        ) {

            // =================================
            // Time Limit
            // =================================

            if (
                quest.timeLimit
            ) {

                quest.timeLimit -=
                    deltaTime;

                if (
                    quest.timeLimit <= 0
                ) {

                    this.failQuest(
                        quest.id
                    );
                }
            }
        }

        // =====================================
        // Auto Accept Starter Quests
        // =====================================

        if (
            this.activeQuests.length === 0
        ) {

            const starter =
                this.availableQuests[0];

            if (
                starter
            ) {

                this.acceptQuest(
                    starter.id
                );
            }
        }
    }

    // =========================================
    // Add Progress
    // =========================================

    addProgress(
        type,
        amount = 1,
        target = null
    ) {

        for (
            const quest of
            this.activeQuests
        ) {

            // Wrong Type
            if (
                quest.type !== type
            ) {

                continue;
            }

            // Wrong Target
            if (

                quest.target &&

                target &&

                quest.target !== target
            ) {

                continue;
            }

            // =================================
            // Progress
            // =================================

            quest.progress +=
                amount;

            // Clamp
            if (
                quest.progress >
                quest.required
            ) {

                quest.progress =
                    quest.required;
            }

            // =================================
            // Notification
            // =================================

            this.game.ui?.addNotification(

                `${quest.title}: ${quest.progress}/${quest.required}`,

                "info"
            );

            // =================================
            // Complete
            // =================================

            if (
                quest.progress >=
                quest.required
            ) {

                this.completeQuest(
                    quest.id
                );
            }
        }
    }

    // =========================================
    // Complete Quest
    // =========================================

    completeQuest(questId) {

        const index =
            this.activeQuests.findIndex(

                q => q.id === questId
            );

        if (
            index === -1
        ) {

            return;
        }

        const quest =
            this.activeQuests[index];

        quest.completed = true;

        // =====================================
        // Rewards
        // =====================================

        this.giveRewards(
            quest.rewards
        );

        // =====================================
        // Move
        // =====================================

        this.completedQuests.push(
            quest
        );

        this.activeQuests.splice(
            index,
            1
        );

        // =====================================
        // Notification
        // =====================================

        this.game.ui?.addNotification(

            `Quest Complete: ${quest.title}`,

            "success"
        );

        // =====================================
        // Effects
        // =====================================

        this.game.screenEffects
            ?.flash("#33ff66");

        // =====================================
        // Sound
        // =====================================

        this.game.sound?.playSound(
            "levelUp"
        );

        // =====================================
        // Reputation
        // =====================================

        this.game.reputation?.addReputation(
            "knights",
            10
        );

        // =====================================
        // Generate New Quest
        // =====================================

        this.generateRandomQuest();
    }

    // =========================================
    // Fail Quest
    // =========================================

    failQuest(questId) {

        const index =
            this.activeQuests.findIndex(

                q => q.id === questId
            );

        if (
            index === -1
        ) {

            return;
        }

        const quest =
            this.activeQuests[index];

        quest.failed = true;

        this.failedQuests.push(
            quest
        );

        this.activeQuests.splice(
            index,
            1
        );

        this.game.ui?.addNotification(

            `Quest Failed: ${quest.title}`,

            "danger"
        );
    }

    // =========================================
    // Rewards
    // =========================================

    giveRewards(rewards) {

        // Gold
        if (
            rewards.gold
        ) {

            this.game.gold +=
                rewards.gold;
        }

        // Experience
        if (
            rewards.exp
        ) {

            this.game.player.exp +=
                rewards.exp;
        }

        // Item
        if (
            rewards.item
        ) {

            this.game.player.inventory
                ?.push({

                    name:
                        rewards.item,

                    rarity:
                        "Rare"
                });

            this.game.ui?.addNotification(

                `Received: ${rewards.item}`,

                "success"
            );
        }

        // Unlock
        if (
            rewards.unlock
        ) {

            if (
                rewards.unlock ===
                "Double Jump"
            ) {

                this.game.player
                    .doubleJump = true;
            }

            this.game.ui?.addNotification(

                `Unlocked: ${rewards.unlock}`,

                "success"
            );
        }
    }

    // =========================================
    // Random Quest
    // =========================================

    generateRandomQuest() {

        const types = [

            "kill",

            "gold",

            "floor",

            "combo",

            "secret"
        ];

        const type =

            types[
                Math.floor(
                    Math.random() *
                    types.length
                )
            ];

        switch(type) {

            // =================================
            // Kill Quest
            // =================================

            case "kill":

                this.addAvailableQuest({

                    title:
                        "Monster Hunter",

                    description:
                        "Defeat 25 enemies.",

                    type:
                        "kill",

                    required:
                        25,

                    rewards: {

                        gold: 1200,

                        exp: 800
                    }
                });

                break;

            // =================================
            // Gold Quest
            // =================================

            case "gold":

                this.addAvailableQuest({

                    title:
                        "Wealth Collector",

                    description:
                        "Collect 2000 gold.",

                    type:
                        "gold",

                    required:
                        2000,

                    rewards: {

                        gold: 1500,

                        exp: 600
                    }
                });

                break;

            // =================================
            // Floor Quest
            // =================================

            case "floor":

                this.addAvailableQuest({

                    title:
                        "Ascension",

                    description:
                        "Reach Floor 10.",

                    type:
                        "floor",

                    required:
                        10,

                    rewards: {

                        gold: 2500,

                        exp: 1500
                    }
                });

                break;

            // =================================
            // Combo Quest
            // =================================

            case "combo":

                this.addAvailableQuest({

                    title:
                        "Stylish Fighter",

                    description:
                        "Reach a 50 combo.",

                    type:
                        "combo",

                    required:
                        50,

                    rewards: {

                        gold: 2200,

                        exp: 1300
                    }
                });

                break;

            // =================================
            // Secret Quest
            // =================================

            case "secret":

                this.addAvailableQuest({

                    title:
                        "Hidden Truths",

                    description:
                        "Find 5 secrets.",

                    type:
                        "secret",

                    required:
                        5,

                    rewards: {

                        gold: 3000,

                        exp: 1800
                    }
                });

                break;
        }
    }

    // =========================================
    // Get Quest
    // =========================================

    getQuest(questId) {

        return [

            ...this.activeQuests,

            ...this.availableQuests,

            ...this.completedQuests

        ].find(
            q => q.id === questId
        );
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        ctx.save();

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            "rgba(0,0,0,0.85)";

        ctx.fillRect(
            200,
            100,
            1520,
            880
        );

        // =====================================
        // Title
        // =====================================

        ctx.fillStyle =
            "#ffcc33";

        ctx.font =
            "bold 52px Arial";

        ctx.fillText(

            "QUEST LOG",

            760,

            170
        );

        // =====================================
        // Active Quests
        // =====================================

        ctx.fillStyle =
            "#33ff66";

        ctx.font =
            "bold 34px Arial";

        ctx.fillText(

            "Active Quests",

            280,

            240
        );

        let y = 300;

        for (
            const quest of
            this.activeQuests
        ) {

            // Box
            ctx.fillStyle =
                "#222222";

            ctx.fillRect(
                250,
                y - 40,
                1400,
                110
            );

            ctx.strokeStyle =
                "#ffffff";

            ctx.strokeRect(
                250,
                y - 40,
                1400,
                110
            );

            // Title
            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "28px Arial";

            ctx.fillText(

                quest.title,

                280,

                y
            );

            // Description
            ctx.fillStyle =
                "#cccccc";

            ctx.font =
                "22px Arial";

            ctx.fillText(

                quest.description,

                280,

                y + 35
            );

            // Progress
            ctx.fillStyle =
                "#33ff66";

            ctx.fillText(

                `${quest.progress}/${quest.required}`,

                1400,

                y
            );

            // Progress Bar
            ctx.fillStyle =
                "#444444";

            ctx.fillRect(
                1200,
                y + 15,
                300,
                20
            );

            ctx.fillStyle =
                "#33ff66";

            ctx.fillRect(

                1200,

                y + 15,

                300 *

                (quest.progress /
                quest.required),

                20
            );

            // Rewards
            ctx.fillStyle =
                "#ffcc33";

            ctx.font =
                "18px Arial";

            ctx.fillText(

                `Reward: ${quest.rewards.gold || 0} Gold, ${quest.rewards.exp || 0} EXP`,

                900,

                y + 60
            );

            y += 140;
        }

        // =====================================
        // Completed
        // =====================================

        ctx.fillStyle =
            "#66ccff";

        ctx.font =
            "bold 28px Arial";

        ctx.fillText(

            `Completed: ${this.completedQuests.length}`,

            280,

            900
        );

        // =====================================
        // Failed
        // =====================================

        ctx.fillStyle =
            "#ff4444";

        ctx.fillText(

            `Failed: ${this.failedQuests.length}`,

            700,

            900
        );

        ctx.restore();
    }
}
