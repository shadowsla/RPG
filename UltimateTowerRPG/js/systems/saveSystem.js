// =========================================
// Ultimate Tower RPG - saveSystem.js
// =========================================

// =========================================
// Save System
// =========================================

export class SaveSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Save Slots
        // =====================================

        this.maxSlots = 3;

        // =====================================
        // Auto Save
        // =====================================

        this.autoSaveEnabled = true;

        this.autoSaveTimer = 0;

        this.autoSaveInterval = 60;

        // =====================================
        // Version
        // =====================================

        this.saveVersion = "1.0.0";
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        if (
            !this.autoSaveEnabled
        ) {

            return;
        }

        this.autoSaveTimer +=
            deltaTime;

        // =====================================
        // Auto Save
        // =====================================

        if (
            this.autoSaveTimer >=
            this.autoSaveInterval
        ) {

            this.autoSaveTimer = 0;

            this.autoSave(1);
        }
    }

    // =========================================
    // Create Save Data
    // =========================================

    createSaveData() {

        const player =
            this.game.player;

        return {

            // =================================
            // Meta
            // =================================

            version:
                this.saveVersion,

            timestamp:
                Date.now(),

            playTime:
                this.game.playTime,

            // =================================
            // World
            // =================================

            floor:
                this.game.floor,

            score:
                this.game.score,

            gold:
                this.game.gold,

            deaths:
                this.game.deaths,

            // =================================
            // Player
            // =================================

            player: {

                className:
                    player.className,

                level:
                    player.level,

                exp:
                    player.exp,

                nextLevelExp:
                    player.nextLevelExp,

                health:
                    player.health,

                maxHealth:
                    player.maxHealth,

                mana:
                    player.mana,

                maxMana:
                    player.maxMana,

                stamina:
                    player.stamina,

                maxStamina:
                    player.maxStamina,

                x:
                    player.x,

                y:
                    player.y,

                strength:
                    player.strength,

                defense:
                    player.defense,

                speed:
                    player.speed,

                critChance:
                    player.critChance,

                critDamage:
                    player.critDamage,

                jumpsUnlocked:
                    player.jumpsUnlocked,

                doubleJump:
                    player.doubleJump,

                wallClimb:
                    player.wallClimb,

                dodgeUnlocked:
                    player.dodgeUnlocked,

                inventory:
                    player.inventory,

                equipment:
                    player.equipment,

                skills:
                    player.skills,

                unlockedAbilities:
                    player.unlockedAbilities
            },

            // =================================
            // Settings
            // =================================

            settings: {

                musicVolume:
                    this.game.sound?.musicVolume,

                sfxVolume:
                    this.game.sound?.sfxVolume,

                fullscreen:
                    this.game.settings?.fullscreen,

                particles:
                    this.game.settings?.particles,

                screenShake:
                    this.game.settings?.screenShake
            },

            // =================================
            // Statistics
            // =================================

            statistics: {

                enemiesKilled:
                    this.game.statistics
                        ?.enemiesKilled || 0,

                bossesKilled:
                    this.game.statistics
                        ?.bossesKilled || 0,

                damageDealt:
                    this.game.statistics
                        ?.damageDealt || 0,

                damageTaken:
                    this.game.statistics
                        ?.damageTaken || 0,

                goldCollected:
                    this.game.statistics
                        ?.goldCollected || 0,

                itemsCollected:
                    this.game.statistics
                        ?.itemsCollected || 0
            },

            // =================================
            // Achievements
            // =================================

            achievements:
                this.game.achievements
                || [],

            // =================================
            // Towers
            // =================================

            unlockedTowers:
                this.game.unlockedTowers
                || [],

            // =================================
            // Hardcore
            // =================================

            hardcore:
                this.game.hardcoreMode
                || false,

            endless:
                this.game.endlessMode
                || false
        };
    }

    // =========================================
    // Save Game
    // =========================================

    saveGame(slot = 1) {

        try {

            const saveData =
                this.createSaveData();

            localStorage.setItem(

                `towerRPG_save_${slot}`,

                JSON.stringify(
                    saveData
                )
            );

            // =================================
            // Save Preview
            // =================================

            localStorage.setItem(

                `towerRPG_preview_${slot}`,

                JSON.stringify({

                    level:
                        saveData.player.level,

                    floor:
                        saveData.floor,

                    className:
                        saveData.player.className,

                    playTime:
                        saveData.playTime,

                    timestamp:
                        saveData.timestamp
                })
            );

            // =================================
            // Notification
            // =================================

            this.game.ui?.addNotification(

                `Game Saved (Slot ${slot})`,

                "success"
            );

            console.log(
                `Saved Slot ${slot}`
            );

            return true;
        }

        catch(error) {

            console.error(
                "Save Failed:",
                error
            );

            this.game.ui?.addNotification(

                "Save Failed",

                "danger"
            );

            return false;
        }
    }

    // =========================================
    // Load Game
    // =========================================

    loadGame(slot = 1) {

        try {

            const data =
                localStorage.getItem(

                    `towerRPG_save_${slot}`
                );

            if (
                !data
            ) {

                this.game.ui?.addNotification(

                    "No Save File Found",

                    "warning"
                );

                return false;
            }

            const saveData =
                JSON.parse(data);

            this.applySaveData(
                saveData
            );

            this.game.ui?.addNotification(

                `Loaded Slot ${slot}`,

                "success"
            );

            console.log(
                `Loaded Slot ${slot}`
            );

            return true;
        }

        catch(error) {

            console.error(
                "Load Failed:",
                error
            );

            this.game.ui?.addNotification(

                "Load Failed",

                "danger"
            );

            return false;
        }
    }

    // =========================================
    // Apply Save Data
    // =========================================

    applySaveData(saveData) {

        const player =
            this.game.player;

        // =====================================
        // World
        // =====================================

        this.game.floor =
            saveData.floor;

        this.game.score =
            saveData.score;

        this.game.gold =
            saveData.gold;

        this.game.deaths =
            saveData.deaths;

        this.game.playTime =
            saveData.playTime;

        // =====================================
        // Player
        // =====================================

        Object.assign(
            player,
            saveData.player
        );

        // =====================================
        // Settings
        // =====================================

        if (
            saveData.settings
        ) {

            this.game.sound
                .setMusicVolume(

                    saveData.settings
                        .musicVolume ?? 0.5
                );

            this.game.sound
                .setSFXVolume(

                    saveData.settings
                        .sfxVolume ?? 0.8
                );

            this.game.settings.fullscreen =

                saveData.settings
                    .fullscreen ?? false;

            this.game.settings.particles =

                saveData.settings
                    .particles ?? true;

            this.game.settings.screenShake =

                saveData.settings
                    .screenShake ?? true;
        }

        // =====================================
        // Statistics
        // =====================================

        this.game.statistics =
            saveData.statistics || {};

        // =====================================
        // Achievements
        // =====================================

        this.game.achievements =
            saveData.achievements || [];

        // =====================================
        // Towers
        // =====================================

        this.game.unlockedTowers =

            saveData.unlockedTowers || [];

        // =====================================
        // Modes
        // =====================================

        this.game.hardcoreMode =
            saveData.hardcore || false;

        this.game.endlessMode =
            saveData.endless || false;
    }

    // =========================================
    // Auto Save
    // =========================================

    autoSave(slot = 1) {

        if (
            !this.autoSaveEnabled
        ) {

            return;
        }

        this.saveGame(slot);

        console.log(
            "Auto Saved"
        );
    }

    // =========================================
    // Delete Save
    // =========================================

    deleteSave(slot = 1) {

        localStorage.removeItem(

            `towerRPG_save_${slot}`
        );

        localStorage.removeItem(

            `towerRPG_preview_${slot}`
        );

        this.game.ui?.addNotification(

            `Deleted Save ${slot}`,

            "warning"
        );
    }

    // =========================================
    // Save Exists
    // =========================================

    saveExists(slot = 1) {

        return !!localStorage.getItem(

            `towerRPG_save_${slot}`
        );
    }

    // =========================================
    // Get Save Preview
    // =========================================

    getSavePreview(slot = 1) {

        const data =
            localStorage.getItem(

                `towerRPG_preview_${slot}`
            );

        if (
            !data
        ) {

            return null;
        }

        return JSON.parse(data);
    }

    // =========================================
    // Export Save
    // =========================================

    exportSave(slot = 1) {

        const data =
            localStorage.getItem(

                `towerRPG_save_${slot}`
            );

        if (
            !data
        ) {

            return null;
        }

        // Base64 Encode
        return btoa(data);
    }

    // =========================================
    // Import Save
    // =========================================

    importSave(
        encodedData,
        slot = 1
    ) {

        try {

            const decoded =
                atob(encodedData);

            JSON.parse(decoded);

            localStorage.setItem(

                `towerRPG_save_${slot}`,

                decoded
            );

            this.game.ui?.addNotification(

                "Save Imported",

                "success"
            );

            return true;
        }

        catch(error) {

            console.error(
                "Import Failed:",
                error
            );

            this.game.ui?.addNotification(

                "Invalid Save File",

                "danger"
            );

            return false;
        }
    }

    // =========================================
    // Reset All Saves
    // =========================================

    resetAllSaves() {

        for (
            let i = 1;
            i <= this.maxSlots;
            i++
        ) {

            this.deleteSave(i);
        }

        this.game.ui?.addNotification(

            "All Saves Deleted",

            "danger"
        );
    }

    // =========================================
    // Format Time
    // =========================================

    formatPlayTime(seconds) {

        const hours =

            Math.floor(
                seconds / 3600
            );

        const minutes =

            Math.floor(
                (seconds % 3600) / 60
            );

        const secs =

            Math.floor(
                seconds % 60
            );

        return (

            `${hours}h ` +

            `${minutes}m ` +

            `${secs}s`
        );
    }

    // =========================================
    // Draw Save Slots
    // =========================================

    drawSaveSlots(ctx) {

        ctx.save();

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 48px Arial";

        ctx.fillText(

            "SAVE SLOTS",

            650,

            120
        );

        for (
            let i = 1;
            i <= this.maxSlots;
            i++
        ) {

            const preview =
                this.getSavePreview(i);

            const x = 450;

            const y =
                180 + i * 180;

            // =================================
            // Slot Box
            // =================================

            ctx.fillStyle =
                "#222222";

            ctx.fillRect(
                x,
                y,
                900,
                140
            );

            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth = 3;

            ctx.strokeRect(
                x,
                y,
                900,
                140
            );

            // =================================
            // Slot Text
            // =================================

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "32px Arial";

            ctx.fillText(

                `Slot ${i}`,

                x + 30,

                y + 50
            );

            // =================================
            // Preview
            // =================================

            if (
                preview
            ) {

                ctx.font =
                    "24px Arial";

                ctx.fillText(

                    `Level ${preview.level} ${preview.className}`,

                    x + 30,

                    y + 90
                );

                ctx.fillText(

                    `Floor ${preview.floor}`,

                    x + 350,

                    y + 90
                );

                ctx.fillText(

                    this.formatPlayTime(
                        preview.playTime
                    ),

                    x + 550,

                    y + 90
                );
            }

            else {

                ctx.font =
                    "24px Arial";

                ctx.fillStyle =
                    "#888888";

                ctx.fillText(

                    "Empty Slot",

                    x + 30,

                    y + 90
                );
            }
        }

        ctx.restore();
    }
}
