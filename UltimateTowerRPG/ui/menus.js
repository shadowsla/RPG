// =========================================
// Ultimate Tower RPG - menus.js
// =========================================

export class Menus {

    constructor(game) {

        this.game = game;

        // =====================================
        // States
        // =====================================

        this.currentMenu = "main";

        this.visible = true;

        // =====================================
        // Selection
        // =====================================

        this.selectedIndex = 0;

        // =====================================
        // Main Menu
        // =====================================

        this.mainMenuOptions = [

            "Start Game",
            "Continue",
            "Settings",
            "Credits",
            "Exit"
        ];

        // =====================================
        // Pause Menu
        // =====================================

        this.pauseMenuOptions = [

            "Resume",
            "Inventory",
            "Settings",
            "Save Game",
            "Main Menu"
        ];

        // =====================================
        // Credits
        // =====================================

        this.credits = [

            "Ultimate Tower RPG",
            "",
            "Created By:",
            "k b",
            "",
            "Inspired By:",
            "Action RPGs",
            "Tower Crawlers",
            "Roguelikes",
            "",
            "Thanks For Playing!"
        ];

        // =====================================
        // Animation
        // =====================================

        this.animationTimer = 0;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.animationTimer += deltaTime;
    }

    // =========================================
    // Handle Input
    // =========================================

    handleInput(key) {

        if (!this.visible) {
            return;
        }

        const options =
            this.getCurrentOptions();

        switch(key) {

            case "ArrowUp":

                this.selectedIndex--;

                if (this.selectedIndex < 0) {

                    this.selectedIndex =
                        options.length - 1;
                }

                break;

            case "ArrowDown":

                this.selectedIndex++;

                if (
                    this.selectedIndex >=
                    options.length
                ) {

                    this.selectedIndex = 0;
                }

                break;

            case "Enter":

                this.selectOption();

                break;

            case "Escape":

                if (
                    this.currentMenu ===
                    "credits"
                ) {

                    this.currentMenu =
                        "main";

                    this.selectedIndex = 0;
                }

                break;
        }
    }

    // =========================================
    // Current Options
    // =========================================

    getCurrentOptions() {

        switch(this.currentMenu) {

            case "main":
                return this.mainMenuOptions;

            case "pause":
                return this.pauseMenuOptions;

            default:
                return [];
        }
    }

    // =========================================
    // Select Option
    // =========================================

    selectOption() {

        switch(this.currentMenu) {

            // =================================
            // MAIN MENU
            // =================================

            case "main":

                this.handleMainMenu();

                break;

            // =================================
            // PAUSE MENU
            // =================================

            case "pause":

                this.handlePauseMenu();

                break;
        }
    }

    // =========================================
    // Main Menu Logic
    // =========================================

    handleMainMenu() {

        switch(this.selectedIndex) {

            // Start Game
            case 0:

                this.visible = false;

                this.game.startGame();

                break;

            // Continue
            case 1:

                this.visible = false;

                this.game.loadGame();

                break;

            // Settings
            case 2:

                this.game.settingsMenu.toggle();

                break;

            // Credits
            case 3:

                this.currentMenu = "credits";

                break;

            // Exit
            case 4:

                window.close();

                break;
        }
    }

    // =========================================
    // Pause Menu Logic
    // =========================================

    handlePauseMenu() {

        switch(this.selectedIndex) {

            // Resume
            case 0:

                this.visible = false;

                this.game.paused = false;

                break;

            // Inventory
            case 1:

                this.game.toggleInventory();

                break;

            // Settings
            case 2:

                this.game.settingsMenu.toggle();

                break;

            // Save
            case 3:

                this.game.saveGame();

                break;

            // Main Menu
            case 4:

                this.currentMenu = "main";

                this.selectedIndex = 0;

                this.game.resetGame();

                break;
        }
    }

    // =========================================
    // Open Pause Menu
    // =========================================

    openPauseMenu() {

        this.currentMenu = "pause";

        this.selectedIndex = 0;

        this.visible = true;
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        if (!this.visible) {
            return;
        }

        ctx.save();

        // Background Overlay
        ctx.fillStyle =
            "rgba(0,0,0,0.72)";

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        switch(this.currentMenu) {

            case "main":

                this.drawMainMenu(ctx);

                break;

            case "pause":

                this.drawPauseMenu(ctx);

                break;

            case "credits":

                this.drawCredits(ctx);

                break;
        }

        ctx.restore();
    }

    // =========================================
    // Main Menu
    // =========================================

    drawMainMenu(ctx) {

        // Title Glow
        const glow =
            Math.sin(
                this.animationTimer * 2
            ) * 10;

        ctx.shadowBlur = 20 + glow;

        ctx.shadowColor = "#66aaff";

        // Title
        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 74px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "ULTIMATE",
            this.game.width / 2,
            160
        );

        ctx.fillText(
            "TOWER RPG",
            this.game.width / 2,
            240
        );

        ctx.shadowBlur = 0;

        // Subtitle
        ctx.fillStyle = "#aaaaaa";

        ctx.font = "24px Arial";

        ctx.fillText(
            "Rise Through The Towers",
            this.game.width / 2,
            290
        );

        // Options
        for (
            let i = 0;
            i < this.mainMenuOptions.length;
            i++
        ) {

            const x =
                this.game.width / 2;

            const y =
                380 + i * 65;

            // Highlight
            if (i === this.selectedIndex) {

                ctx.fillStyle =
                    "rgba(100,140,255,0.25)";

                ctx.fillRect(
                    x - 180,
                    y - 38,
                    360,
                    50
                );
            }

            ctx.fillStyle =
                i === this.selectedIndex
                    ? "#7cb8ff"
                    : "#ffffff";

            ctx.font = "36px Arial";

            ctx.fillText(
                this.mainMenuOptions[i],
                x,
                y
            );
        }

        // Footer
        ctx.fillStyle =
            "#777777";

        ctx.font = "18px Arial";

        ctx.fillText(
            "Arrow Keys To Navigate",
            this.game.width / 2,
            this.game.height - 40
        );
    }

    // =========================================
    // Pause Menu
    // =========================================

    drawPauseMenu(ctx) {

        // Panel
        ctx.fillStyle =
            "rgba(15,18,35,0.95)";

        ctx.fillRect(
            390,
            130,
            500,
            460
        );

        // Border
        ctx.strokeStyle =
            "rgba(255,255,255,0.15)";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            390,
            130,
            500,
            460
        );

        // Title
        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 58px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "PAUSED",
            this.game.width / 2,
            210
        );

        // Options
        for (
            let i = 0;
            i < this.pauseMenuOptions.length;
            i++
        ) {

            const y =
                310 + i * 55;

            if (i === this.selectedIndex) {

                ctx.fillStyle =
                    "rgba(100,140,255,0.25)";

                ctx.fillRect(
                    450,
                    y - 32,
                    380,
                    42
                );
            }

            ctx.fillStyle =
                i === this.selectedIndex
                    ? "#7cb8ff"
                    : "#ffffff";

            ctx.font = "32px Arial";

            ctx.fillText(
                this.pauseMenuOptions[i],
                this.game.width / 2,
                y
            );
        }
    }

    // =========================================
    // Credits
    // =========================================

    drawCredits(ctx) {

        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 58px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "CREDITS",
            this.game.width / 2,
            120
        );

        for (
            let i = 0;
            i < this.credits.length;
            i++
        ) {

            const y =
                200 + i * 45;

            ctx.fillStyle =
                i === 0
                    ? "#7cb8ff"
                    : "#ffffff";

            ctx.font =
                i === 0
                    ? "36px Arial"
                    : "28px Arial";

            ctx.fillText(
                this.credits[i],
                this.game.width / 2,
                y
            );
        }

        // Footer
        ctx.fillStyle =
            "#888888";

        ctx.font = "20px Arial";

        ctx.fillText(
            "Press ESC To Return",
            this.game.width / 2,
            this.game.height - 50
        );
    }
}
