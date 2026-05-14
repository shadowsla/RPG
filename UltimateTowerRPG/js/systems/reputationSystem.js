// =========================================
// Ultimate Tower RPG - reputationSystem.js
// =========================================

// =========================================
// Reputation System
// =========================================

export class ReputationSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Factions
        // =====================================

        this.factions = {

            knights: {
                name: "Iron Knights",
                reputation: 0,
                rank: "Outsider",
                color: "#55aaff"
            },

            mages: {
                name: "Arcane Council",
                reputation: 0,
                rank: "Outsider",
                color: "#bb66ff"
            },

            rogues: {
                name: "Shadow Syndicate",
                reputation: 0,
                rank: "Outsider",
                color: "#666666"
            },

            guardians: {
                name: "Ancient Guardians",
                reputation: 0,
                rank: "Outsider",
                color: "#33ff99"
            },

            merchants: {
                name: "Golden Traders",
                reputation: 0,
                rank: "Outsider",
                color: "#ffcc33"
            },

            voidborn: {
                name: "Voidborn Cult",
                reputation: -50,
                rank: "Enemy",
                color: "#8844ff"
            }
        };

        // =====================================
        // Rank Thresholds
        // =====================================

        this.ranks = [

            {
                name: "Enemy",
                value: -100
            },

            {
                name: "Hostile",
                value: -50
            },

            {
                name: "Suspicious",
                value: -10
            },

            {
                name: "Outsider",
                value: 0
            },

            {
                name: "Trusted",
                value: 50
            },

            {
                name: "Honored",
                value: 150
            },

            {
                name: "Champion",
                value: 300
            },

            {
                name: "Legend",
                value: 600
            }
        ];

        // =====================================
        // Rewards
        // =====================================

        this.unlockedRewards = [];
    }

    // =========================================
    // Add Reputation
    // =========================================

    addReputation(
        factionName,
        amount
    ) {

        const faction =
            this.factions[factionName];

        if (
            !faction
        ) {

            return;
        }

        // =====================================
        // Old Rank
        // =====================================

        const oldRank =
            faction.rank;

        // =====================================
        // Add Rep
        // =====================================

        faction.reputation +=
            amount;

        // Clamp
        faction.reputation =

            Math.max(
                -100,
                Math.min(
                    1000,
                    faction.reputation
                )
            );

        // =====================================
        // Update Rank
        // =====================================

        faction.rank =
            this.getRank(

                faction.reputation
            );

        // =====================================
        // Notification
        // =====================================

        this.game.ui?.addNotification(

            `${faction.name} Reputation ${amount > 0 ? "+" : ""}${amount}`,

            amount > 0
            ? "success"
            : "warning"
        );

        // =====================================
        // Rank Up
        // =====================================

        if (
            oldRank !== faction.rank
        ) {

            this.rankChanged(
                faction,
                oldRank
            );
        }

        // =====================================
        // Rewards
        // =====================================

        this.checkRewards(
            factionName
        );
    }

    // =========================================
    // Rank
    // =========================================

    getRank(reputation) {

        let currentRank =
            "Outsider";

        for (
            const rank of
            this.ranks
        ) {

            if (
                reputation >= rank.value
            ) {

                currentRank =
                    rank.name;
            }
        }

        return currentRank;
    }

    // =========================================
    // Rank Changed
    // =========================================

    rankChanged(
        faction,
        oldRank
    ) {

        this.game.ui?.addNotification(

            `${faction.name}: ${oldRank} → ${faction.rank}`,

            "success"
        );

        // =====================================
        // Special Effects
        // =====================================

        if (
            faction.rank ===
            "Champion"
        ) {

            this.game.screenEffects
                ?.flash(
                    faction.color
                );
        }

        if (
            faction.rank ===
            "Legend"
        ) {

            this.game.screenEffects
                ?.shake(
                    10,
                    0.5
                );
        }
    }

    // =========================================
    // Rewards
    // =========================================

    checkRewards(factionName) {

        const faction =
            this.factions[factionName];

        // =====================================
        // Trusted
        // =====================================

        if (
            faction.rank ===
            "Trusted"
        ) {

            this.unlockReward(

                `${factionName}_shop_discount`
            );
        }

        // =====================================
        // Honored
        // =====================================

        if (
            faction.rank ===
            "Honored"
        ) {

            this.unlockReward(

                `${factionName}_special_item`
            );
        }

        // =====================================
        // Champion
        // =====================================

        if (
            faction.rank ===
            "Champion"
        ) {

            this.unlockReward(

                `${factionName}_summon`
            );
        }

        // =====================================
        // Legend
        // =====================================

        if (
            faction.rank ===
            "Legend"
        ) {

            this.unlockReward(

                `${factionName}_ultimate`
            );
        }
    }

    // =========================================
    // Unlock Reward
    // =========================================

    unlockReward(reward) {

        if (
            this.unlockedRewards.includes(
                reward
            )
        ) {

            return;
        }

        this.unlockedRewards.push(
            reward
        );

        this.game.ui?.addNotification(

            `Unlocked: ${reward}`,

            "success"
        );
    }

    // =========================================
    // Get Reputation
    // =========================================

    getReputation(factionName) {

        return this.factions[
            factionName
        ]?.reputation || 0;
    }

    // =========================================
    // Get Rank
    // =========================================

    getFactionRank(factionName) {

        return this.factions[
            factionName
        ]?.rank || "Unknown";
    }

    // =========================================
    // Has Reward
    // =========================================

    hasReward(reward) {

        return this.unlockedRewards
            .includes(reward);
    }

    // =========================================
    // Shop Discount
    // =========================================

    getShopDiscount() {

        let discount = 0;

        // Merchants
        const merchantRank =

            this.getFactionRank(
                "merchants"
            );

        switch(merchantRank) {

            case "Trusted":
                discount = 0.05;
                break;

            case "Honored":
                discount = 0.1;
                break;

            case "Champion":
                discount = 0.2;
                break;

            case "Legend":
                discount = 0.35;
                break;
        }

        return discount;
    }

    // =========================================
    // Enemy Aggression
    // =========================================

    getEnemyAggression() {

        const voidRep =
            this.getReputation(
                "voidborn"
            );

        return (

            1 -

            (voidRep / 1000)
        );
    }

    // =========================================
    // Quest Rewards
    // =========================================

    completeFactionQuest(
        factionName,
        difficulty = 1
    ) {

        const reputationGain =

            10 * difficulty;

        const goldReward =

            100 * difficulty;

        const expReward =

            50 * difficulty;

        // =====================================
        // Rewards
        // =====================================

        this.addReputation(

            factionName,

            reputationGain
        );

        this.game.gold +=
            goldReward;

        this.game.player.exp +=
            expReward;

        this.game.ui?.addNotification(

            `${this.factions[factionName].name} Quest Complete`,

            "success"
        );
    }

    // =========================================
    // Crimes
    // =========================================

    commitCrime(
        severity = 1
    ) {

        // Lose Knight Rep
        this.addReputation(

            "knights",

            -10 * severity
        );

        // Lose Merchant Rep
        this.addReputation(

            "merchants",

            -5 * severity
        );

        // Gain Rogue Rep
        this.addReputation(

            "rogues",

            8 * severity
        );
    }

    // =========================================
    // Defeat Boss
    // =========================================

    defeatBoss(bossType) {

        switch(bossType) {

            case "void":

                this.addReputation(
                    "voidborn",
                    -25
                );

                this.addReputation(
                    "guardians",
                    20
                );

                break;

            case "dragon":

                this.addReputation(
                    "knights",
                    20
                );

                break;

            case "lich":

                this.addReputation(
                    "mages",
                    25
                );

                break;

            case "shadow":

                this.addReputation(
                    "rogues",
                    15
                );

                break;
        }
    }

    // =========================================
    // Draw UI
    // =========================================

    draw(ctx) {

        ctx.save();

        // =====================================
        // Background
        // =====================================

        ctx.fillStyle =
            "rgba(0,0,0,0.8)";

        ctx.fillRect(
            250,
            120,
            1420,
            820
        );

        // =====================================
        // Title
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 48px Arial";

        ctx.fillText(

            "FACTION REPUTATION",

            520,

            180
        );

        // =====================================
        // Factions
        // =====================================

        let y = 260;

        for (
            const faction of
            Object.values(
                this.factions
            )
        ) {

            // Name
            ctx.fillStyle =
                faction.color;

            ctx.font =
                "32px Arial";

            ctx.fillText(

                faction.name,

                340,

                y
            );

            // Rank
            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "24px Arial";

            ctx.fillText(

                faction.rank,

                760,

                y
            );

            // Reputation
            ctx.fillText(

                `${faction.reputation}`,

                980,

                y
            );

            // Bar Background
            ctx.fillStyle =
                "#333333";

            ctx.fillRect(
                1120,
                y - 25,
                400,
                30
            );

            // Bar Fill
            ctx.fillStyle =
                faction.color;

            const percent =

                (faction.reputation + 100) /
                1100;

            ctx.fillRect(

                1120,

                y - 25,

                400 * percent,

                30
            );

            // Border
            ctx.strokeStyle =
                "#ffffff";

            ctx.strokeRect(
                1120,
                y - 25,
                400,
                30
            );

            y += 90;
        }

        // =====================================
        // Rewards
        // =====================================

        ctx.fillStyle =
            "#ffcc33";

        ctx.font =
            "28px Arial";

        ctx.fillText(

            "Unlocked Rewards",

            340,

            820
        );

        ctx.font =
            "20px Arial";

        let rewardY = 860;

        for (
            const reward of
            this.unlockedRewards
        ) {

            ctx.fillText(

                `• ${reward}`,

                360,

                rewardY
            );

            rewardY += 30;
        }

        ctx.restore();
    }
}
