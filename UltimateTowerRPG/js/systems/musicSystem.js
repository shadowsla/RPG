// =========================================
// Ultimate Tower RPG - musicSystem.js
// =========================================

// =========================================
// Music System
// =========================================

export class MusicSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Audio Tracks
        // =====================================

        this.tracks = {};

        // =====================================
        // Current Music
        // =====================================

        this.currentTrack = null;

        this.currentTrackName = "";

        // =====================================
        // Volume
        // =====================================

        this.masterVolume = 1;

        this.musicVolume = 0.5;

        // =====================================
        // Settings
        // =====================================

        this.muted = false;

        this.fadeSpeed = 0.02;

        // =====================================
        // Combat State
        // =====================================

        this.inCombat = false;

        // =====================================
        // Initialize
        // =====================================

        this.loadMusic();
    }

    // =========================================
    // Load Music
    // =========================================

    loadMusic() {

        // =====================================
        // Main Menu
        // =====================================

        this.loadTrack(

            "menu",

            "assets/music/menu_theme.mp3"
        );

        // =====================================
        // Exploration
        // =====================================

        this.loadTrack(

            "exploration",

            "assets/music/exploration.mp3"
        );

        // =====================================
        // Combat
        // =====================================

        this.loadTrack(

            "combat",

            "assets/music/combat_theme.mp3"
        );

        // =====================================
        // Boss
        // =====================================

        this.loadTrack(

            "boss",

            "assets/music/boss_theme.mp3"
        );

        // =====================================
        // Victory
        // =====================================

        this.loadTrack(

            "victory",

            "assets/music/victory.mp3"
        );

        // =====================================
        // Game Over
        // =====================================

        this.loadTrack(

            "gameOver",

            "assets/music/game_over.mp3"
        );

        // =====================================
        // Tower
        // =====================================

        this.loadTrack(

            "tower",

            "assets/music/tower_theme.mp3"
        );

        // =====================================
        // Secret Room
        // =====================================

        this.loadTrack(

            "secret",

            "assets/music/secret_room.mp3"
        );

        // =====================================
        // Endless Mode
        // =====================================

        this.loadTrack(

            "endless",

            "assets/music/endless_mode.mp3"
        );
    }

    // =========================================
    // Load Track
    // =========================================

    loadTrack(
        name,
        path
    ) {

        const audio =
            new Audio(path);

        audio.loop = true;

        audio.volume =
            this.musicVolume;

        audio.preload = "auto";

        this.tracks[name] =
            audio;
    }

    // =========================================
    // Play Music
    // =========================================

    play(trackName) {

        // =====================================
        // Same Track
        // =====================================

        if (
            this.currentTrackName ===
            trackName
        ) {

            return;
        }

        // =====================================
        // Track Exists
        // =====================================

        const track =
            this.tracks[trackName];

        if (
            !track
        ) {

            console.warn(

                `Music track not found: ${trackName}`
            );

            return;
        }

        // =====================================
        // Fade Current
        // =====================================

        if (
            this.currentTrack
        ) {

            this.fadeOut(
                this.currentTrack
            );
        }

        // =====================================
        // Start New
        // =====================================

        this.currentTrack =
            track;

        this.currentTrackName =
            trackName;

        track.currentTime = 0;

        track.volume = 0;

        if (
            !this.muted
        ) {

            track.play()
                .catch(error => {

                    console.warn(
                        "Music autoplay blocked:",
                        error
                    );
                });

            this.fadeIn(track);
        }
    }

    // =========================================
    // Stop Music
    // =========================================

    stop() {

        if (
            this.currentTrack
        ) {

            this.currentTrack.pause();

            this.currentTrack.currentTime = 0;

            this.currentTrack = null;

            this.currentTrackName = "";
        }
    }

    // =========================================
    // Pause
    // =========================================

    pause() {

        if (
            this.currentTrack
        ) {

            this.currentTrack.pause();
        }
    }

    // =========================================
    // Resume
    // =========================================

    resume() {

        if (

            this.currentTrack &&

            !this.muted
        ) {

            this.currentTrack.play()
                .catch(() => {});
        }
    }

    // =========================================
    // Fade In
    // =========================================

    fadeIn(audio) {

        const interval =
            setInterval(() => {

                if (
                    audio.volume <
                    this.musicVolume
                ) {

                    audio.volume +=
                        this.fadeSpeed;
                }

                else {

                    audio.volume =
                        this.musicVolume;

                    clearInterval(
                        interval
                    );
                }

            }, 50);
    }

    // =========================================
    // Fade Out
    // =========================================

    fadeOut(audio) {

        const interval =
            setInterval(() => {

                if (
                    audio.volume > 0
                ) {

                    audio.volume -=
                        this.fadeSpeed;
                }

                else {

                    audio.volume = 0;

                    audio.pause();

                    clearInterval(
                        interval
                    );
                }

            }, 50);
    }

    // =========================================
    // Combat Music
    // =========================================

    enterCombat() {

        if (
            this.inCombat
        ) {

            return;
        }

        this.inCombat = true;

        this.play("combat");
    }

    // =========================================
    // Leave Combat
    // =========================================

    exitCombat() {

        if (
            !this.inCombat
        ) {

            return;
        }

        this.inCombat = false;

        // =====================================
        // Return Music
        // =====================================

        if (
            this.game.currentFloor >= 10
        ) {

            this.play("tower");
        }

        else {

            this.play("exploration");
        }
    }

    // =========================================
    // Boss Music
    // =========================================

    startBossMusic() {

        this.play("boss");
    }

    // =========================================
    // Victory
    // =========================================

    playVictoryMusic() {

        this.play("victory");
    }

    // =========================================
    // Game Over
    // =========================================

    playGameOverMusic() {

        this.play("gameOver");
    }

    // =========================================
    // Secret Room
    // =========================================

    playSecretMusic() {

        this.play("secret");
    }

    // =========================================
    // Endless
    // =========================================

    playEndlessMusic() {

        this.play("endless");
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Dynamic Music
        // =====================================

        this.checkCombatState();

        // =====================================
        // Low Health Tension
        // =====================================

        this.updateLowHealthEffect();
    }

    // =========================================
    // Combat State
    // =========================================

    checkCombatState() {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        let nearbyEnemies = 0;

        for (
            const enemy of
            this.game.enemies || []
        ) {

            const dx =
                enemy.x - player.x;

            const dy =
                enemy.y - player.y;

            const distance =
                Math.hypot(dx, dy);

            if (
                distance < 700
            ) {

                nearbyEnemies++;
            }
        }

        // =====================================
        // Enter Combat
        // =====================================

        if (
            nearbyEnemies >= 2 &&
            !this.inCombat
        ) {

            this.enterCombat();
        }

        // =====================================
        // Exit Combat
        // =====================================

        else if (
            nearbyEnemies === 0 &&
            this.inCombat
        ) {

            this.exitCombat();
        }
    }

    // =========================================
    // Low Health Audio
    // =========================================

    updateLowHealthEffect() {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        const healthPercent =

            player.health /
            player.maxHealth;

        // =====================================
        // Lower Pitch Feeling
        // =====================================

        if (
            this.currentTrack
        ) {

            if (
                healthPercent < 0.25
            ) {

                this.currentTrack.playbackRate =
                    0.92;
            }

            else {

                this.currentTrack.playbackRate =
                    1;
            }
        }
    }

    // =========================================
    // Volume
    // =========================================

    setMusicVolume(volume) {

        this.musicVolume =

            Math.max(
                0,
                Math.min(1, volume)
            );

        // =====================================
        // Apply
        // =====================================

        for (
            const track of
            Object.values(
                this.tracks
            )
        ) {

            track.volume =
                this.musicVolume;
        }
    }

    // =========================================
    // Master Volume
    // =========================================

    setMasterVolume(volume) {

        this.masterVolume =

            Math.max(
                0,
                Math.min(1, volume)
            );

        this.setMusicVolume(

            this.musicVolume *
            this.masterVolume
        );
    }

    // =========================================
    // Mute
    // =========================================

    toggleMute() {

        this.muted =
            !this.muted;

        if (
            this.muted
        ) {

            this.pause();
        }

        else {

            this.resume();
        }
    }

    // =========================================
    // Crossfade
    // =========================================

    crossfade(
        fromTrack,
        toTrack,
        duration = 2
    ) {

        const from =
            this.tracks[fromTrack];

        const to =
            this.tracks[toTrack];

        if (
            !from ||
            !to
        ) {

            return;
        }

        to.volume = 0;

        to.play();

        const steps = 60;

        const interval =
            duration * 1000 / steps;

        let currentStep = 0;

        const fade =
            setInterval(() => {

                currentStep++;

                const progress =

                    currentStep / steps;

                from.volume =

                    this.musicVolume *
                    (1 - progress);

                to.volume =

                    this.musicVolume *
                    progress;

                // Done
                if (
                    currentStep >= steps
                ) {

                    from.pause();

                    from.volume =
                        this.musicVolume;

                    clearInterval(
                        fade
                    );

                    this.currentTrack =
                        to;

                    this.currentTrackName =
                        toTrack;
                }

            }, interval);
    }

    // =========================================
    // Ambient Layer
    // =========================================

    playAmbientSound(
        path,
        volume = 0.2
    ) {

        const ambient =
            new Audio(path);

        ambient.loop = true;

        ambient.volume =
            volume;

        ambient.play()
            .catch(() => {});

        return ambient;
    }

    // =========================================
    // Save Settings
    // =========================================

    saveSettings() {

        localStorage.setItem(

            "musicSettings",

            JSON.stringify({

                musicVolume:
                    this.musicVolume,

                masterVolume:
                    this.masterVolume,

                muted:
                    this.muted
            })
        );
    }

    // =========================================
    // Load Settings
    // =========================================

    loadSettings() {

        const data =
            localStorage.getItem(
                "musicSettings"
            );

        if (
            !data
        ) {

            return;
        }

        const settings =
            JSON.parse(data);

        this.musicVolume =
            settings.musicVolume ?? 0.5;

        this.masterVolume =
            settings.masterVolume ?? 1;

        this.muted =
            settings.muted ?? false;

        this.setMusicVolume(
            this.musicVolume
        );
    }

    // =========================================
    // Current Track
    // =========================================

    getCurrentTrackName() {

        return this.currentTrackName;
    }
}
