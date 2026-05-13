// =========================================
// Ultimate Tower RPG - towerUI.js
// =========================================

export class TowerUI {

    constructor(game) {

        this.game = game;

        this.visible = true;

        this.currentTower = null;

        this.floorAnimation = 0;

        this.warningTimer = 0;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        if (this.floorAnimation > 0) {
            this.floorAnimation -= deltaTime * 2;
        }

        if (this.warningTimer > 0) {
            this.warningTimer -= deltaTime;
        }
    }

    // =========================================
    // Set Tower
    // =========================================

    setTower(tower) {

        this.currentTower = tower;

        this.floorAnimation = 1;
    }

    // =========================================
    // Boss Warning
    // =========================================

    showBossWarning() {

        this.warningTimer = 4;
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        if (!this.visible || !this.currentTower) {
            return;
        }

        this.drawTowerInfo(ctx);

        this.drawFloorInfo(ctx);

        this.drawObjective(ctx);

        if (this.warningTimer > 0) {
            this.drawBossWarning(ctx);
        }
    }

    // =========================================
    // Draw Tower Information
    // =========================================

    drawTowerInfo(ctx) {

        ctx.save();

        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";

        ctx.fillRect(20, 20, 340, 140);

        ctx.strokeStyle = "rgba(255,255,255,0.15)";

        ctx.lineWidth = 2;

        ctx.strokeRect(20, 20, 340, 140);

        // Tower Name
        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 28px Arial";

        ctx.fillText(
            this.currentTower.name,
            40,
            55
        );

        // Difficulty
        ctx.fillStyle = "#ffcc66";

        ctx.font = "20px Arial";

        ctx.fillText(
            `Difficulty: ${this.currentTower.difficulty}`,
            40,
            90
        );

        // Recommended Level
        ctx.fillStyle = "#66d9ff";

        ctx.fillText(
            `Recommended Lv: ${this.currentTower.recommendedLevel}`,
            40,
            120
        );

        // Tower Theme
        ctx.fillStyle = "#aaaaaa";

        ctx.font = "18px Arial";

        ctx.fillText(
            this.currentTower.theme,
            40,
            145
        );

        ctx.restore();
    }

    // =========================================
    // Draw Floor Information
    // =========================================

    drawFloorInfo(ctx) {

        ctx.save();

        const pulse =
            Math.sin(Date.now() * 0.005) * 4;

        ctx.fillStyle =
            "rgba(15,15,35,0.75)";

        ctx.fillRect(
            480,
            20,
            320,
            90
        );

        ctx.strokeStyle =
            "rgba(120,180,255,0.4)";

        ctx.strokeRect(
            480,
            20,
            320,
            90
        );

        // Floor Number
        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 34px Arial";

        ctx.fillText(
            `Floor ${this.currentTower.currentFloor}`,
            520,
            65 + pulse * 0.1
        );

        // Enemy Count
        ctx.fillStyle = "#ff7777";

        ctx.font = "22px Arial";

        ctx.fillText(
            `Enemies Remaining: ${this.game.enemies.length}`,
            520,
            95
        );

        ctx.restore();
    }

    // =========================================
    // Draw Objective
    // =========================================

    drawObjective(ctx) {

        ctx.save();

        ctx.fillStyle =
            "rgba(0,0,0,0.5)";

        ctx.fillRect(
            20,
            180,
            400,
            80
        );

        ctx.strokeStyle =
            "rgba(255,255,255,0.1)";

        ctx.strokeRect(
            20,
            180,
            400,
            80
        );

        ctx.fillStyle = "#ffffff";

        ctx.font = "22px Arial";

        let objective =
            "Defeat all enemies";

        if (this.currentTower.bossFloor) {

            objective =
                "Defeat the Tower Boss";
        }

        ctx.fillText(
            `Objective: ${objective}`,
            40,
            225
        );

        ctx.restore();
    }

    // =========================================
    // Draw Boss Warning
    // =========================================

    drawBossWarning(ctx) {

        ctx.save();

        const alpha =
            Math.abs(
                Math.sin(Date.now() * 0.01)
            );

        ctx.globalAlpha = alpha;

        ctx.fillStyle = "#ff2222";

        ctx.font = "bold 72px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "BOSS APPROACHING",
            this.game.width / 2,
            this.game.height / 2
        );

        ctx.restore();
    }

    // =========================================
    // Draw Tower Complete
    // =========================================

    drawTowerComplete(ctx) {

        ctx.save();

        ctx.fillStyle =
            "rgba(0,0,0,0.75)";

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        ctx.fillStyle = "#ffd700";

        ctx.font = "bold 80px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "TOWER CLEARED",
            this.game.width / 2,
            this.game.height / 2
        );

        ctx.font = "36px Arial";

        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            `Rewards Earned: ${this.currentTower.reward}`,
            this.game.width / 2,
            this.game.height / 2 + 70
        );

        ctx.restore();
    }

    // =========================================
    // Draw Floor Transition
    // =========================================

    drawFloorTransition(ctx) {

        if (this.floorAnimation <= 0) {
            return;
        }

        ctx.save();

        ctx.globalAlpha =
            this.floorAnimation;

        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 64px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            `Floor ${this.currentTower.currentFloor}`,
            this.game.width / 2,
            this.game.height / 2
        );

        ctx.restore();
    }
}
