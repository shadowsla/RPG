// =========================================
// Ultimate Tower RPG - settingsMenu.js
// =========================================

export class SettingsMenu {

    constructor(game) {

        this.game = game;

        this.visible = false;

        this.selectedOption = 0;

        // =====================================
        // Settings
        // =====================================

        this.settings = {

            masterVolume: 100,

            musicVolume: 80,

            sfxVolume: 90,

            fullscreen: false,

            screenShake: true,

            particles: true,

            shadows: true,

            damageNumbers: true,

            showFPS: false,

            difficulty: "Normal",

            mobileControls: true,

            autoSave: true
        };

        // =====================================
        // Menu Options
        // =====================================

        this.options = [

            "Master Volume",
            "Music Volume",
            "SFX Volume",
            "Fullscreen",
            "Screen Shake",
            "Particles",
            "Shadows",
            "Damage Numbers",
            "Show FPS",
            "Difficulty",
            "Mobile Controls",
            "Auto Save",
            "Close Settings"
        ];
    }

    // =========================================
    // Toggle Menu
    // =========================================

    toggle() {

        this.visible = !this.visible;
    }

    // =========================================
    // Update
    // =========================================

    update() {

        if (!this.visible) {
            return;
        }
    }

    // =========================================
    // Handle Input
    // =========================================

    handleInput(key) {

        if (!this.visible) {
            return;
        }

        switch(key) {

            case "ArrowUp":

                this.selectedOption--;

                if (this.selectedOption < 0) {

                    this.selectedOption =
                        this.options.length - 1;
                }

                break;

            case "ArrowDown":

                this.selectedOption++;

                if (
                    this.selectedOption >=
                    this.options.length
                ) {

                    this.selectedOption = 0;
                }

                break;

            case "ArrowLeft":

                this.adjustOption(-1);

                break;

            case "ArrowRight":

                this.adjustOption(1);

                break;

            case "Enter":

                this.selectOption();

                break;

            case "Escape":

                this.visible = false;

                break;
        }
    }

    // =========================================
    // Adjust Option
    // =========================================

    adjustOption(direction) {

        switch(this.selectedOption) {

            // Master Volume
            case 0:

                this.settings.masterVolume +=
                    direction * 5;

                this.settings.masterVolume =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            this.settings.masterVolume
                        )
                    );

                break;

            // Music Volume
            case 1:

                this.settings.musicVolume +=
                    direction * 5;

                this.settings.musicVolume =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            this.settings.musicVolume
                        )
                    );

                break;

            // SFX Volume
            case 2:

                this.settings.sfxVolume +=
                    direction * 5;

                this.settings.sfxVolume =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            this.settings.sfxVolume
                        )
                    );

                break;

            // Difficulty
            case 9:

                this.cycleDifficulty(direction);

                break;
        }
    }

    // =========================================
    // Select Option
    // =========================================

    selectOption() {

        switch(this.selectedOption) {

            case 3:
                this.settings.fullscreen =
                    !this.settings.fullscreen;

                this.toggleFullscreen();

                break;

            case 4:
                this.settings.screenShake =
                    !this.settings.screenShake;

                break;

            case 5:
                this.settings.particles =
                    !this.settings.particles;

                break;

            case 6:
                this.settings.shadows =
                    !this.settings.shadows;

                break;

            case 7:
                this.settings.damageNumbers =
                    !this.settings.damageNumbers;

                break;

            case 8:
                this.settings.showFPS =
                    !this.settings.showFPS;

                break;

            case 10:
                this.settings.mobileControls =
                    !this.settings.mobileControls;

                break;

            case 11:
                this.settings.autoSave =
                    !this.settings.autoSave;

                break;

            case 12:
                this.visible = false;
                break;
        }

        this.saveSettings();
    }

    // =========================================
    // Difficulty Cycle
    // =========================================

    cycleDifficulty(direction) {

        const difficulties = [
            "Easy",
            "Normal",
            "Hard",
            "Nightmare",
            "Impossible"
        ];

        let index =
            difficulties.indexOf(
                this.settings.difficulty
            );

        index += direction;

        if (index < 0) {
            index = difficulties.length - 1;
        }

        if (index >= difficulties.length) {
            index = 0;
        }

        this.settings.difficulty =
            difficulties[index];
    }

    // =========================================
    // Fullscreen
    // =========================================

    toggleFullscreen() {

        if (!document.fullscreenElement) {

            document.documentElement
                .requestFullscreen();

        } else {

            document.exitFullscreen();
        }
    }

    // =========================================
    // Draw Menu
    // =========================================

    draw(ctx) {

        if (!this.visible) {
            return;
        }

        ctx.save();

        // Background Overlay
        ctx.fillStyle =
            "rgba(0,0,0,0.7)";

        ctx.fillRect(
            0,
            0,
            this.game.width,
            this.game.height
        );

        // Menu Background
        ctx.fillStyle =
            "rgba(15,18,35,0.95)";

        ctx.fillRect(
            340,
            90,
            600,
            540
        );

        // Border
        ctx.strokeStyle =
            "rgba(255,255,255,0.15)";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            340,
            90,
            600,
            540
        );

        // Title
        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 42px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "SETTINGS",
            this.game.width / 2,
            145
        );

        // Options
        ctx.textAlign = "left";

        for (
            let i = 0;
            i < this.options.length;
            i++
        ) {

            const y = 210 + i * 30;

            // Highlight Selected
            if (i === this.selectedOption) {

                ctx.fillStyle =
                    "rgba(100,140,255,0.25)";

                ctx.fillRect(
                    370,
                    y - 22,
                    540,
                    28
                );
            }

            ctx.fillStyle =
                i === this.selectedOption
                    ? "#7cb8ff"
                    : "#ffffff";

            ctx.font = "22px Arial";

            ctx.fillText(
                this.options[i],
                390,
                y
            );

            // Value
            ctx.fillStyle = "#cccccc";

            ctx.textAlign = "right";

            ctx.fillText(
                this.getOptionValue(i),
                880,
                y
            );

            ctx.textAlign = "left";
        }

        // Footer
        ctx.fillStyle =
            "#888888";

        ctx.font = "18px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "Arrow Keys = Navigate | Enter = Select",
            this.game.width / 2,
            590
        );

        ctx.restore();
    }

    // =========================================
    // Get Option Value
    // =========================================

    getOptionValue(index) {

        switch(index) {

            case 0:
                return `${this.settings.masterVolume}%`;

            case 1:
                return `${this.settings.musicVolume}%`;

            case 2:
                return `${this.settings.sfxVolume}%`;

            case 3:
                return this.settings.fullscreen
                    ? "ON"
                    : "OFF";

            case 4:
                return this.settings.screenShake
                    ? "ON"
                    : "OFF";

            case 5:
                return this.settings.particles
                    ? "ON"
                    : "OFF";

            case 6:
                return this.settings.shadows
                    ? "ON"
                    : "OFF";

            case 7:
                return this.settings.damageNumbers
                    ? "ON"
                    : "OFF";

            case 8:
                return this.settings.showFPS
                    ? "ON"
                    : "OFF";

            case 9:
                return this.settings.difficulty;

            case 10:
                return this.settings.mobileControls
                    ? "ON"
                    : "OFF";

            case 11:
                return this.settings.autoSave
                    ? "ON"
                    : "OFF";

            default:
                return "";
        }
    }

    // =========================================
    // Save Settings
    // =========================================

    saveSettings() {

        localStorage.setItem(
            "ultimateTowerSettings",
            JSON.stringify(this.settings)
        );
    }

    // =========================================
    // Load Settings
    // =========================================

    loadSettings() {

        const saved =
            localStorage.getItem(
                "ultimateTowerSettings"
            );

        if (!saved) {
            return;
        }

        const data = JSON.parse(saved);

        Object.assign(
            this.settings,
            data
        );
    }
}
