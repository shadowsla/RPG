// =========================================
// Ultimate Tower RPG - soundSystem.js
// =========================================

// =========================================
// Sound System
// =========================================

export class SoundSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Audio
        // =====================================

        this.music = {};

        this.sounds = {};

        // =====================================
        // Settings
        // =====================================

        this.masterVolume = 1;

        this.musicVolume = 0.5;

        this.sfxVolume = 0.8;

        this.muted = false;

        // =====================================
        // Current Music
        // =====================================

        this.currentMusic = null;

        this.currentTrack = "";

        // =====================================
        // Sound Cooldowns
        // =====================================

        this.cooldowns = {};

        // =====================================
        // Load
        // =====================================

        this.loadSounds();
    }

    // =========================================
    // Load Sounds
    // =========================================

    loadSounds() {

        // =====================================
        // Music
        // =====================================

        this.loadMusic(
            "menu",
            "assets/audio/music/menu.mp3"
        );

        this.loadMusic(
            "battle",
            "assets/audio/music/battle.mp3"
        );

        this.loadMusic(
            "boss",
            "assets/audio/music/boss.mp3"
        );

        this.loadMusic(
            "void",
            "assets/audio/music/void.mp3"
        );

        this.loadMusic(
            "victory",
            "assets/audio/music/victory.mp3"
        );

        // =====================================
        // SFX
        // =====================================

        this.loadSound(
            "jump",
            "assets/audio/sfx/jump.wav"
        );

        this.loadSound(
            "dash",
            "assets/audio/sfx/dash.wav"
        );

        this.loadSound(
            "attack",
            "assets/audio/sfx/attack.wav"
        );

        this.loadSound(
            "crit",
            "assets/audio/sfx/crit.wav"
        );

        this.loadSound(
            "hit",
            "assets/audio/sfx/hit.wav"
        );

        this.loadSound(
            "enemyHit",
            "assets/audio/sfx/enemyHit.wav"
        );

        this.loadSound(
            "explosion",
            "assets/audio/sfx/explosion.wav"
        );

        this.loadSound(
            "portal",
            "assets/audio/sfx/portal.wav"
        );

        this.loadSound(
            "pickup",
            "assets/audio/sfx/pickup.wav"
        );

        this.loadSound(
            "levelUp",
            "assets/audio/sfx/levelUp.wav"
        );

        this.loadSound(
            "death",
            "assets/audio/sfx/death.wav"
        );

        this.loadSound(
            "bossRoar",
            "assets/audio/sfx/bossRoar.wav"
        );

        this.loadSound(
            "lightning",
            "assets/audio/sfx/lightning.wav"
        );

        this.loadSound(
            "uiClick",
            "assets/audio/sfx/uiClick.wav"
        );

        this.loadSound(
            "heal",
            "assets/audio/sfx/heal.wav"
        );

        this.loadSound(
            "magic",
            "assets/audio/sfx/magic.wav"
        );

        this.loadSound(
            "summon",
            "assets/audio/sfx/summon.wav"
        );
    }

    // =========================================
    // Load Music
    // =========================================

    loadMusic(name, src) {

        const audio =
            new Audio(src);

        audio.loop = true;

        audio.volume =
            this.musicVolume *
            this.masterVolume;

        this.music[name] =
            audio;
    }

    // =========================================
    // Load Sound
    // =========================================

    loadSound(name, src) {

        const audio =
            new Audio(src);

        audio.volume =
            this.sfxVolume *
            this.masterVolume;

        this.sounds[name] =
            audio;
    }

    // =========================================
    // Play Music
    // =========================================

    playMusic(name) {

        // Already Playing
        if (
            this.currentTrack === name
        ) {

            return;
        }

        // Stop Current
        this.stopMusic();

        const music =
            this.music[name];

        if (
            !music ||
            this.muted
        ) {

            return;
        }

        music.volume =
            this.musicVolume *
            this.masterVolume;

        music.currentTime = 0;

        music.play().catch(() => {});

        this.currentMusic =
            music;

        this.currentTrack =
            name;
    }

    // =========================================
    // Stop Music
    // =========================================

    stopMusic() {

        if (
            this.currentMusic
        ) {

            this.currentMusic.pause();

            this.currentMusic.currentTime = 0;
        }

        this.currentMusic = null;

        this.currentTrack = "";
    }

    // =========================================
    // Fade Music
    // =========================================

    fadeMusic(
        targetVolume,
        duration = 1
    ) {

        if (
            !this.currentMusic
        ) {

            return;
        }

        const startVolume =
            this.currentMusic.volume;

        const difference =
            targetVolume - startVolume;

        let timer = 0;

        const interval =
            setInterval(() => {

                timer += 0.05;

                const progress =
                    timer / duration;

                this.currentMusic.volume =

                    startVolume +

                    difference *

                    progress;

                if (
                    progress >= 1
                ) {

                    clearInterval(
                        interval
                    );
                }

            }, 50);
    }

    // =========================================
    // Play Sound
    // =========================================

    playSound(
        name,
        volume = 1,
        pitch = 1
    ) {

        // Muted
        if (
            this.muted
        ) {

            return;
        }

        const sound =
            this.sounds[name];

        if (
            !sound
        ) {

            return;
        }

        // =====================================
        // Cooldown
        // =====================================

        const now =
            performance.now();

        if (

            this.cooldowns[name] &&

            now -
            this.cooldowns[name] < 40
        ) {

            return;
        }

        this.cooldowns[name] = now;

        // =====================================
        // Clone Sound
        // =====================================

        const clone =
            sound.cloneNode();

        clone.volume =

            volume *

            this.sfxVolume *

            this.masterVolume;

        clone.playbackRate =
            pitch;

        clone.play().catch(() => {});
    }

    // =========================================
    // Positional Sound
    // =========================================

    playPositionalSound(
        name,
        x,
        y
    ) {

        const player =
            this.game.player;

        // Distance
        const distance =

            Math.hypot(

                player.x - x,

                player.y - y
            );

        // Volume
        const volume =

            Math.max(
                0,
                1 - distance / 2000
            );

        // Pitch
        const pitch =

            0.9 +
            Math.random() * 0.2;

        this.playSound(
            name,
            volume,
            pitch
        );
    }

    // =========================================
    // Update
    // =========================================

    update() {

        // =====================================
        // Boss Music
        // =====================================

        const bossAlive =

            this.game.enemies?.some(

                enemy => enemy.boss
            );

        if (
            bossAlive
        ) {

            this.playMusic(
                "boss"
            );
        }

        // =====================================
        // Void Music
        // =====================================

        else if (

            this.game.background?.theme ===
            "void"
        ) {

            this.playMusic(
                "void"
            );
        }

        // =====================================
        // Battle Music
        // =====================================

        else if (

            this.game.enemies?.length > 0
        ) {

            this.playMusic(
                "battle"
            );
        }

        // =====================================
        // Menu Music
        // =====================================

        else {

            this.playMusic(
                "menu"
            );
        }
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

            this.stopMusic();
        }

        else {

            this.update();
        }
    }

    // =========================================
    // Volume
    // =========================================

    setMasterVolume(volume) {

        this.masterVolume =

            Math.max(
                0,
                Math.min(1, volume)
            );

        this.updateVolumes();
    }

    setMusicVolume(volume) {

        this.musicVolume =

            Math.max(
                0,
                Math.min(1, volume)
            );

        this.updateVolumes();
    }

    setSFXVolume(volume) {

        this.sfxVolume =

            Math.max(
                0,
                Math.min(1, volume)
            );

        this.updateVolumes();
    }

    // =========================================
    // Update Volumes
    // =========================================

    updateVolumes() {

        // Music
        for (
            const music of
            Object.values(
                this.music
            )
        ) {

            music.volume =

                this.musicVolume *

                this.masterVolume;
        }

        // Sounds
        for (
            const sound of
            Object.values(
                this.sounds
            )
        ) {

            sound.volume =

                this.sfxVolume *

                this.masterVolume;
        }
    }

    // =========================================
    // Pause All
    // =========================================

    pauseAll() {

        if (
            this.currentMusic
        ) {

            this.currentMusic.pause();
        }
    }

    // =========================================
    // Resume All
    // =========================================

    resumeAll() {

        if (

            this.currentMusic &&

            !this.muted
        ) {

            this.currentMusic.play()
                .catch(() => {});
        }
    }

    // =========================================
    // Save Settings
    // =========================================

    saveSettings() {

        localStorage.setItem(

            "towerRPGSoundSettings",

            JSON.stringify({

                master:
                    this.masterVolume,

                music:
                    this.musicVolume,

                sfx:
                    this.sfxVolume,

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

                "towerRPGSoundSettings"
            );

        if (
            !data
        ) {

            return;
        }

        const settings =
            JSON.parse(data);

        this.masterVolume =
            settings.master ?? 1;

        this.musicVolume =
            settings.music ?? 0.5;

        this.sfxVolume =
            settings.sfx ?? 0.8;

        this.muted =
            settings.muted ?? false;

        this.updateVolumes();
    }
}
