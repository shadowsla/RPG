// =========================================
// Ultimate Tower RPG - rankingSystem.js
// =========================================

// =========================================
// Ranking System
// =========================================

export class RankingSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Player Rank
        // =====================================

        this.currentRank = "E";

        this.rankPoints = 0;

        this.highestRank = "E";

        // =====================================
        // Match Ranking
        // =====================================

        this.currentRunRank = "E";

        this.comboMultiplier = 1;

        this.maxCombo = 0;

        this.currentCombo = 0;

        // =====================================
        // Score
        // =====================================

        this.totalScore = 0;

        this.killScore = 0;

        this.timeScore = 0;

        this.styleScore = 0;

        this.explorationScore = 0;

        // =====================================
        // Statistics
        // =====================================

        this.kills = 0;

        this.deaths = 0;

        this.damageTaken = 0;

        this.damageDealt = 0;

        this.perfectDodges = 0;

        this.parries = 0;

        this.criticalHits = 0;

        this.airCombos = 0;

        this.secretsFound = 0;

        // =====================================
        // Rank Thresholds
        // =====================================

        this.rankThresholds = {

            E: 0,

            D: 1000,

            C: 3000,

            B: 7000,

            A: 12000,

            S: 20000,

            "SS": 35000,

            "SSS": 60000,

            "X": 100000
        };

        // =====================================
        // Style Bonuses
        // =====================================

        this.styleBonuses = {

            parry: 250,

            perfectDodge: 180,

            airCombo: 350,

            criticalHit: 120,

            noDamage: 1000,

            fastClear: 1500,

            bossExecution: 2500,

            combo10: 500,

            combo25: 1500,

            combo50: 4000
        };
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Combo Decay
        // =====================================

        if (
            this.currentCombo > 0
        ) {

            this.comboMultiplier -=

                deltaTime * 0.2;

            if (
                this.comboMultiplier <= 1
            ) {

                this.resetCombo();
            }
        }

        // =====================================
        // Update Rank
        // =====================================

        this.updateRank();
    }

    // =========================================
    // Add Kill
    // =========================================

    addKill(
        enemy,
        style = false
    ) {

        this.kills++;

        // =====================================
        // Base Score
        // =====================================

        let score =

            enemy.boss
            ? 5000
            : enemy.elite
            ? 1000
            : 250;

        // =====================================
        // Combo
        // =====================================

        this.currentCombo++;

        this.comboMultiplier += 0.15;

        // Clamp
        if (
            this.comboMultiplier > 8
        ) {

            this.comboMultiplier = 8;
        }

        // =====================================
        // Max Combo
        // =====================================

        if (
            this.currentCombo >
            this.maxCombo
        ) {

            this.maxCombo =
                this.currentCombo;
        }

        // =====================================
        // Combo Bonus
        // =====================================

        score *=
            this.comboMultiplier;

        // =====================================
        // Style Kill
        // =====================================

        if (
            style
        ) {

            score *= 1.5;
        }

        // =====================================
        // Add
        // =====================================

        this.killScore +=
            Math.floor(score);

        this.totalScore +=
            Math.floor(score);

        // =====================================
        // Notifications
        // =====================================

        this.showRankPopup(

            `+${Math.floor(score)}`,

            this.getComboRank()
        );

        // =====================================
        // Combo Rewards
        // =====================================

        this.checkComboRewards();
    }

    // =========================================
    // Combo Rewards
    // =========================================

    checkComboRewards() {

        switch(this.currentCombo) {

            case 10:

                this.addStyleBonus(
                    "combo10"
                );

                break;

            case 25:

                this.addStyleBonus(
                    "combo25"
                );

                break;

            case 50:

                this.addStyleBonus(
                    "combo50"
                );

                break;
        }
    }

    // =========================================
    // Style Bonus
    // =========================================

    addStyleBonus(type) {

        const bonus =
            this.styleBonuses[type];

        if (
            !bonus
        ) {

            return;
        }

        this.styleScore +=
            bonus;

        this.totalScore +=
            bonus;

        this.showRankPopup(

            type
                .replace(
                    /([A-Z])/g,
                    " $1"
                ),

            "STYLE"
        );
    }

    // =========================================
    // Perfect Dodge
    // =========================================

    perfectDodge() {

        this.perfectDodges++;

        this.addStyleBonus(
            "perfectDodge"
        );
    }

    // =========================================
    // Parry
    // =========================================

    parry() {

        this.parries++;

        this.addStyleBonus(
            "parry"
        );
    }

    // =========================================
    // Critical Hit
    // =========================================

    criticalHit() {

        this.criticalHits++;

        this.addStyleBonus(
            "criticalHit"
        );
    }

    // =========================================
    // Air Combo
    // =========================================

    airCombo() {

        this.airCombos++;

        this.addStyleBonus(
            "airCombo"
        );
    }

    // =========================================
    // Secret Found
    // =========================================

    secretFound() {

        this.secretsFound++;

        this.explorationScore +=
            500;

        this.totalScore +=
            500;
    }

    // =========================================
    // Damage
    // =========================================

    addDamageDealt(amount) {

        this.damageDealt +=
            amount;

        this.totalScore +=

            Math.floor(
                amount * 0.5
            );
    }

    takeDamage(amount) {

        this.damageTaken +=
            amount;

        this.resetCombo();
    }

    // =========================================
    // Death
    // =========================================

    death() {

        this.deaths++;

        // Heavy Penalty
        this.totalScore -=
            2000;

        if (
            this.totalScore < 0
        ) {

            this.totalScore = 0;
        }

        this.resetCombo();
    }

    // =========================================
    // Combo Reset
    // =========================================

    resetCombo() {

        this.currentCombo = 0;

        this.comboMultiplier = 1;
    }

    // =========================================
    // Rank
    // =========================================

    updateRank() {

        let rank = "E";

        for (
            const [name, value]
            of Object.entries(
                this.rankThresholds
            )
        ) {

            if (
                this.totalScore >= value
            ) {

                rank = name;
            }
        }

        // =====================================
        // Rank Up
        // =====================================

        if (
            rank !==
            this.currentRunRank
        ) {

            this.rankUp(
                this.currentRunRank,
                rank
            );
        }

        this.currentRunRank =
            rank;

        // =====================================
        // Highest
        // =====================================

        if (

            this.getRankValue(rank) >

            this.getRankValue(
                this.highestRank
            )
        ) {

            this.highestRank =
                rank;
        }
    }

    // =========================================
    // Rank Value
    // =========================================

    getRankValue(rank) {

        const values = {

            E: 1,

            D: 2,

            C: 3,

            B: 4,

            A: 5,

            S: 6,

            SS: 7,

            SSS: 8,

            X: 9
        };

        return values[rank] || 0;
    }

    // =========================================
    // Rank Up
    // =========================================

    rankUp(
        oldRank,
        newRank
    ) {

        this.game.ui?.addNotification(

            `RANK UP ${oldRank} → ${newRank}`,

            "success"
        );

        // =====================================
        // Effects
        // =====================================

        this.game.screenEffects
            ?.flash("#ffcc33");

        this.game.camera
            ?.shake(10, 0.3);

        // =====================================
        // Sound
        // =====================================

        this.game.sound?.playSound(
            "levelUp"
        );
    }

    // =========================================
    // Combo Rank
    // =========================================

    getComboRank() {

        const combo =
            this.currentCombo;

        if (combo >= 100)
            return "GODLIKE";

        if (combo >= 75)
            return "LEGENDARY";

        if (combo >= 50)
            return "INSANE";

        if (combo >= 25)
            return "UNSTOPPABLE";

        if (combo >= 10)
            return "RAMPAGE";

        if (combo >= 5)
            return "COMBO";

        return "HIT";
    }

    // =========================================
    // Time Bonus
    // =========================================

    calculateTimeBonus(clearTime) {

        let bonus = 0;

        if (
            clearTime < 300
        ) {

            bonus = 5000;

            this.addStyleBonus(
                "fastClear"
            );
        }

        else if (
            clearTime < 600
        ) {

            bonus = 2500;
        }

        else if (
            clearTime < 900
        ) {

            bonus = 1000;
        }

        this.timeScore +=
            bonus;

        this.totalScore +=
            bonus;
    }

    // =========================================
    // Floor Complete
    // =========================================

    completeFloor() {

        // =====================================
        // No Damage Bonus
        // =====================================

        if (
            this.damageTaken <= 0
        ) {

            this.addStyleBonus(
                "noDamage"
            );
        }

        // =====================================
        // Rank Points
        // =====================================

        this.rankPoints +=

            Math.floor(
                this.totalScore / 100
            );

        // =====================================
        // Permanent Rank
        // =====================================

        this.updatePermanentRank();
    }

    // =========================================
    // Permanent Rank
    // =========================================

    updatePermanentRank() {

        if (
            this.rankPoints >= 100000
        ) {

            this.currentRank = "X";
        }

        else if (
            this.rankPoints >= 50000
        ) {

            this.currentRank = "SSS";
        }

        else if (
            this.rankPoints >= 25000
        ) {

            this.currentRank = "SS";
        }

        else if (
            this.rankPoints >= 10000
        ) {

            this.currentRank = "S";
        }

        else if (
            this.rankPoints >= 5000
        ) {

            this.currentRank = "A";
        }

        else if (
            this.rankPoints >= 2500
        ) {

            this.currentRank = "B";
        }

        else if (
            this.rankPoints >= 1000
        ) {

            this.currentRank = "C";
        }

        else if (
            this.rankPoints >= 250
        ) {

            this.currentRank = "D";
        }

        else {

            this.currentRank = "E";
        }
    }

    // =========================================
    // Popup
    // =========================================

    showRankPopup(
        text,
        rank
    ) {

        this.game.effects?.push({

            type: "rankPopup",

            text,

            rank,

            x:
                this.game.player.x,

            y:
                this.game.player.y - 120,

            life: 1.5
        });
    }

    // =========================================
    // Reset Run
    // =========================================

    resetRun() {

        this.currentRunRank = "E";

        this.comboMultiplier = 1;

        this.currentCombo = 0;

        this.maxCombo = 0;

        this.totalScore = 0;

        this.killScore = 0;

        this.timeScore = 0;

        this.styleScore = 0;

        this.explorationScore = 0;

        this.kills = 0;

        this.damageTaken = 0;

        this.damageDealt = 0;

        this.perfectDodges = 0;

        this.parries = 0;

        this.criticalHits = 0;

        this.airCombos = 0;
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        ctx.save();

        // =====================================
        // Rank Display
        // =====================================

        ctx.fillStyle =
            this.getRankColor(
                this.currentRunRank
            );

        ctx.font =
            "bold 72px Arial";

        ctx.fillText(

            this.currentRunRank,

            1650,

            120
        );

        // =====================================
        // Combo
        // =====================================

        if (
            this.currentCombo > 1
        ) {

            ctx.fillStyle =
                "#ffcc33";

            ctx.font =
                "bold 38px Arial";

            ctx.fillText(

                `${this.currentCombo}x COMBO`,

                1480,

                180
            );
        }

        // =====================================
        // Multiplier
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "28px Arial";

        ctx.fillText(

            `${this.comboMultiplier.toFixed(1)}x`,

            1620,

            220
        );

        // =====================================
        // Score
        // =====================================

        ctx.fillStyle =
            "#66ffcc";

        ctx.font =
            "32px Arial";

        ctx.fillText(

            `Score: ${this.totalScore}`,

            1350,

            280
        );

        // =====================================
        // Stats
        // =====================================

        ctx.fillStyle =
            "#cccccc";

        ctx.font =
            "20px Arial";

        const stats = [

            `Kills: ${this.kills}`,

            `Max Combo: ${this.maxCombo}`,

            `Parries: ${this.parries}`,

            `Perfect Dodges: ${this.perfectDodges}`,

            `Air Combos: ${this.airCombos}`,

            `Secrets: ${this.secretsFound}`
        ];

        let y = 340;

        for (
            const stat of stats
        ) {

            ctx.fillText(
                stat,
                1400,
                y
            );

            y += 35;
        }

        ctx.restore();
    }

    // =========================================
    // Rank Color
    // =========================================

    getRankColor(rank) {

        switch(rank) {

            case "X":
                return "#ff0000";

            case "SSS":
                return "#ff33ff";

            case "SS":
                return "#ff66cc";

            case "S":
                return "#ffcc00";

            case "A":
                return "#66ff66";

            case "B":
                return "#3399ff";

            case "C":
                return "#bbbbbb";

            case "D":
                return "#888888";

            default:
                return "#666666";
        }
    }
}
