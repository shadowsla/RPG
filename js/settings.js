// =========================================
// Ultimate Tower RPG - settings.js
// =========================================

export class Settings {

    constructor(game) {

        this.game = game;

        // =====================================
        // Default Settings
        // =====================================

        this.data = {

            // ================================
            // Audio
            // ================================

            masterVolume: 100,

            musicVolume: 80,

            sfxVolume: 90,

            mute: false,

            // ================================
            // Graphics
            // ================================

            fullscreen: false,

            screenShake: true,

            particles: true,

            shadows: true,

            lighting: true,

            postProcessing: true,

            weatherEffects: true,

            showDamageNumbers: true,

            showFPS: false,

            highQuality: true,

            // ================================
            // Gameplay
            // ================================

            autoSave: true,

            hardcoreMode: false,

            endlessMode: false,

            tutorial: true,

            vibration: true,

            difficulty: "normal",

            // ================================
            // Controls
            // ================================

            keybinds: {

                moveUp: "KeyW",

                moveDown: "KeyS",

                moveLeft: "KeyA",

                moveRight: "KeyD",

                jump: "Space",

                sprint: "ShiftLeft",

                dodge: "ControlLeft",

                attack: "Mouse0",

                heavyAttack: "Mouse2",

                skill1: "KeyQ",

                skill2: "KeyE",

                skill3: "KeyR",

                ultimate: "KeyF",

                inventory: "KeyI",

                crafting: "KeyC",

                map: "KeyM",

                pause: "Escape",

                interact: "KeyX",

                parry: "KeyZ"
            }
        };

        // =====================================
        // Save Slot
        // =====================================

        this.saveKey =
            "ultimate_tower_rpg_settings";

        // =====================================
        // Load Saved Settings
        // =====================================

        this.load();
    }

    // =========================================
    // Get Setting
    // =========================================

    get(setting) {

        return this.data[setting];
    }

    // =========================================
    // Set Setting
    // =========================================

    set(setting, value) {

        this.data[setting] = value;

        this.apply(setting);

        this.save();
    }

    // =========================================
    // Toggle Boolean Setting
    // =========================================

    toggle(setting) {

        this.data[setting] =
            !this.data[setting];

        this.apply(setting);

        this.save();
    }

    // =========================================
    // Change Keybind
    // =========================================

    setKeybind(
        action,
        key
    ) {

        this.data.keybinds[action] =
            key;

        this.save();
    }

    // =========================================
    // Get Keybind
    // =========================================

    getKeybind(action) {

        return this.data.keybinds[action];
    }

    // =========================================
    // Apply Settings
    // =========================================

    apply(setting) {

        switch(setting) {

            // =================================
            // Fullscreen
            // =================================

            case "fullscreen":

                if (
                    this.data.fullscreen
                ) {

                    this.enableFullscreen();

                } else {

                    this.disableFullscreen();
                }

                break;

            // =================================
            // Audio
            // =================================

            case "masterVolume":

            case "musicVolume":

            case "sfxVolume":

            case "mute":

                this.applyAudio();

                break;

            // =================================
            // Graphics
            // =================================

            case "screenShake":

            case "particles":

            case "shadows":

            case "lighting":

            case "postProcessing":

            case "weatherEffects":

            case "highQuality":

                this.applyGraphics();

                break;

            // =================================
            // Difficulty
            // =================================

            case "difficulty":

                this.applyDifficulty();

                break;
        }
    }

    // =========================================
    // Apply Audio
    // =========================================

    applyAudio() {

        const muted =
            this.data.mute;

        const volume =
            this.data.masterVolume / 100;

        if (
            this.game.audioManager
        ) {

            this.game.audioManager
                .setMasterVolume(

                    muted ? 0 : volume
                );
        }
    }

    // =========================================
    // Apply Graphics
    // =========================================

    applyGraphics() {

        // Particle Limit
        if (
            this.game.particleSystem
        ) {

            this.game.particleSystem
                .maxParticles =

                this.data.highQuality
                    ? 1500
                    : 500;
        }

        // Shadows
        if (
            this.game.renderer
        ) {

            this.game.renderer
                .enableShadows =

                this.data.shadows;
        }
    }

    // =========================================
    // Apply Difficulty
    // =========================================

    applyDifficulty() {

        switch(
            this.data.difficulty
        ) {

            case "easy":

                this.game.enemyMultiplier =
                    0.75;

                break;

            case "normal":

                this.game.enemyMultiplier =
                    1;

                break;

            case "hard":

                this.game.enemyMultiplier =
                    1.5;

                break;

            case "nightmare":

                this.game.enemyMultiplier =
                    2.5;

                break;
        }
    }

    // =========================================
    // Fullscreen
    // =========================================

    enableFullscreen() {

        const element =
            document.documentElement;

        if (
            element.requestFullscreen
        ) {

            element.requestFullscreen();
        }
    }

    disableFullscreen() {

        if (
            document.exitFullscreen
        ) {

            document.exitFullscreen();
        }
    }

    // =========================================
    // Save Settings
    // =========================================

    save() {

        localStorage.setItem(

            this.saveKey,

            JSON.stringify(this.data)
        );
    }

    // =========================================
    // Load Settings
    // =========================================

    load() {

        const saved =
            localStorage.getItem(
                this.saveKey
            );

        if (!saved) {
            return;
        }

        try {

            const parsed =
                JSON.parse(saved);

            this.data = {

                ...this.data,

                ...parsed
            };

        } catch(error) {

            console.error(
                "Failed To Load Settings",
                error
            );
        }
    }

    // =========================================
    // Reset Settings
    // =========================================

    reset() {

        localStorage.removeItem(
            this.saveKey
        );

        location.reload();
    }

    // =========================================
    // Export Settings
    // =========================================

    exportSettings() {

        return JSON.stringify(
            this.data,
            null,
            2
        );
    }

    // =========================================
    // Import Settings
    // =========================================

    importSettings(json) {

        try {

            const parsed =
                JSON.parse(json);

            this.data = parsed;

            this.save();

            return true;

        } catch(error) {

            console.error(
                "Invalid Settings File"
            );

            return false;
        }
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // Placeholder
    }
}
