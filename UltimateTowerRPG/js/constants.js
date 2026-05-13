// =========================================
// Ultimate Tower RPG - constants.js
// =========================================

// =========================================
// Game
// =========================================

export const GAME_TITLE =
    "Ultimate Tower RPG";

export const GAME_VERSION =
    "1.0.0";

export const TARGET_FPS = 60;

export const TILE_SIZE = 64;

export const GRAVITY = 1800;

// =========================================
// Screen
// =========================================

export const DEFAULT_WIDTH =
    1280;

export const DEFAULT_HEIGHT =
    720;

// =========================================
// Player
// =========================================

export const PLAYER = {

    WIDTH: 48,

    HEIGHT: 64,

    MAX_HEALTH: 100,

    MAX_MANA: 100,

    MOVE_SPEED: 320,

    SPRINT_SPEED: 520,

    JUMP_FORCE: -780,

    DOUBLE_JUMP_FORCE: -700,

    DODGE_SPEED: 900,

    DODGE_TIME: 0.25,

    CLIMB_SPEED: 220,

    ATTACK_COOLDOWN: 0.35,

    HEAVY_ATTACK_COOLDOWN: 1.1,

    MAX_LEVEL: 999,

    CRIT_CHANCE: 0.1,

    CRIT_MULTIPLIER: 1.8
};

// =========================================
// Enemy
// =========================================

export const ENEMY = {

    WIDTH: 44,

    HEIGHT: 58,

    BASE_HEALTH: 60,

    BASE_DAMAGE: 12,

    MOVE_SPEED: 140,

    ATTACK_RANGE: 70,

    DETECTION_RANGE: 600,

    KNOCKBACK_FORCE: 450
};

// =========================================
// Boss
// =========================================

export const BOSS = {

    WIDTH: 120,

    HEIGHT: 160,

    HEALTH_MULTIPLIER: 12,

    DAMAGE_MULTIPLIER: 3,

    MOVE_SPEED: 180,

    SPECIAL_ATTACK_COOLDOWN: 4,

    SUMMON_COOLDOWN: 8
};

// =========================================
// Projectiles
// =========================================

export const PROJECTILE = {

    SPEED: 900,

    SIZE: 12,

    LIFETIME: 3,

    EXPLOSION_RADIUS: 100
};

// =========================================
// Physics
// =========================================

export const PHYSICS = {

    FRICTION: 0.85,

    AIR_RESISTANCE: 0.98,

    TERMINAL_VELOCITY: 1600,

    WALL_SLIDE_SPEED: 180,

    LEDGE_GRAB_DISTANCE: 40
};

// =========================================
// Camera
// =========================================

export const CAMERA = {

    SMOOTHNESS: 0.08,

    SHAKE_POWER: 10,

    SHAKE_DURATION: 0.25,

    MIN_ZOOM: 0.7,

    MAX_ZOOM: 2
};

// =========================================
// Combat
// =========================================

export const COMBAT = {

    COMBO_RESET_TIME: 1.2,

    PARRY_WINDOW: 0.18,

    INVINCIBILITY_TIME: 0.6,

    AIR_COMBO_BONUS: 1.5,

    BACKSTAB_MULTIPLIER: 2
};

// =========================================
// Elements
// =========================================

export const ELEMENTS = {

    FIRE: "fire",

    ICE: "ice",

    LIGHTNING: "lightning",

    POISON: "poison",

    SHADOW: "shadow",

    HOLY: "holy"
};

// =========================================
// Rarity
// =========================================

export const RARITY = {

    COMMON: "common",

    UNCOMMON: "uncommon",

    RARE: "rare",

    EPIC: "epic",

    LEGENDARY: "legendary",

    MYTHIC: "mythic"
};

// =========================================
// Rarity Colors
// =========================================

export const RARITY_COLORS = {

    common: "#cccccc",

    uncommon: "#44ff88",

    rare: "#5599ff",

    epic: "#bb66ff",

    legendary: "#ffaa33",

    mythic: "#ff4444"
};

// =========================================
// Classes
// =========================================

export const CLASSES = {

    WARRIOR: {

        name: "Warrior",

        healthMultiplier: 1.5,

        manaMultiplier: 0.7,

        damageMultiplier: 1.2
    },

    MAGE: {

        name: "Mage",

        healthMultiplier: 0.8,

        manaMultiplier: 1.8,

        damageMultiplier: 1.5
    },

    ROGUE: {

        name: "Rogue",

        healthMultiplier: 1,

        manaMultiplier: 1,

        damageMultiplier: 1.3
    },

    TANK: {

        name: "Tank",

        healthMultiplier: 2.2,

        manaMultiplier: 0.5,

        damageMultiplier: 0.9
    },

    SUPPORT: {

        name: "Support",

        healthMultiplier: 1.1,

        manaMultiplier: 1.4,

        damageMultiplier: 1
    }
};

// =========================================
// Skills
// =========================================

export const SKILLS = {

    DASH: {

        cooldown: 3,

        staminaCost: 20
    },

    FIREBALL: {

        cooldown: 2,

        manaCost: 15
    },

    HEAL: {

        cooldown: 8,

        manaCost: 25
    },

    SUMMON: {

        cooldown: 20,

        manaCost: 50
    },

    ULTIMATE: {

        cooldown: 60,

        manaCost: 100
    }
};

// =========================================
// Weather
// =========================================

export const WEATHER = {

    CLEAR: "clear",

    RAIN: "rain",

    SNOW: "snow",

    FOG: "fog",

    STORM: "storm"
};

// =========================================
// Tower Events
// =========================================

export const RANDOM_EVENTS = [

    "Treasure Room",

    "Cursed Shrine",

    "Elite Ambush",

    "Merchant Floor",

    "Boss Rush",

    "Meteor Shower",

    "Dark Fog",

    "Healing Fountain",

    "Challenge Arena"
];

// =========================================
// Challenge Modifiers
// =========================================

export const CHALLENGE_MODIFIERS = [

    "Double Enemy Speed",

    "Low Gravity",

    "No Healing",

    "Exploding Enemies",

    "Darkness",

    "Permanent Storm",

    "Half Mana",

    "One Hit Mode",

    "Enemy Regeneration"
];

// =========================================
// Keybind Defaults
// =========================================

export const DEFAULT_KEYBINDS = {

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

    parry: "KeyZ",

    inventory: "KeyI",

    crafting: "KeyC",

    map: "KeyM",

    interact: "KeyX",

    pause: "Escape"
};

// =========================================
// UI
// =========================================

export const UI = {

    HEALTH_BAR_WIDTH: 300,

    HEALTH_BAR_HEIGHT: 24,

    MANA_BAR_WIDTH: 240,

    MANA_BAR_HEIGHT: 18,

    HOTBAR_SLOTS: 10,

    INVENTORY_COLUMNS: 8,

    INVENTORY_ROWS: 5
};

// =========================================
// Audio
// =========================================

export const AUDIO = {

    MASTER_VOLUME: 1,

    MUSIC_VOLUME: 0.8,

    SFX_VOLUME: 0.9
};

// =========================================
// Save
// =========================================

export const SAVE_KEYS = {

    SETTINGS:
        "ultimate_tower_settings",

    PLAYER:
        "ultimate_tower_player",

    WORLD:
        "ultimate_tower_world"
};
