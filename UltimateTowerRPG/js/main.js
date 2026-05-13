// =========================================
// Ultimate Tower RPG - main.js
// =========================================

// =========================================
// Imports
// =========================================

import { Renderer } from "./renderer.js";

import { Camera } from "./camera.js";

import { Background } from "./background.js";

import { Animations } from "./animations.js";

import { Shaders } from "./shaders.js";

import { ScreenEffects } from "./screenEffects.js";

import { Settings } from "./settings.js";

import { HUD } from "./hud.js";

import { Menus } from "./menus.js";

import { InventoryUI } from "./inventoryUI.js";

import { CraftingUI } from "./craftingUI.js";

import { TowerUI } from "./TowerUI.js";

import { SettingsMenu } from "./settingsMenu.js";

import { Notifications } from "./notifications.js";

import { MobileControls } from "./mobileControls.js";

import { Player } from "./player.js";

import { Enemy } from "./enemy.js";

import { BossEnemy } from "./bossEnemy.js";

import { Projectile } from "./projectile.js";

import { Particle } from "./particle.js";

// =========================================
// Game Class
// =========================================

class Game {

    constructor() {

        // =====================================
        // Canvas
        // =====================================

        this.canvas =
            document.getElementById(
                "gameCanvas"
            );

        this.ctx =
            this.canvas.getContext("2d");

        this.resize();

        // =====================================
        // Core Systems
        // =====================================

        this.settings =
            new Settings(this);

        this.camera =
            new Camera(this);

        this.renderer =
            new Renderer(this);

        this.background =
            new Background(this);

        this.animations =
            new Animations(this);

        this.shaders =
            new Shaders(this);

        this.screenEffects =
            new ScreenEffects(this);

        // =====================================
        // UI
        // =====================================

        this.hud =
            new HUD(this);

        this.menus =
            new Menus(this);

        this.inventoryUI =
            new InventoryUI(this);

        this.craftingUI =
            new CraftingUI(this);

        this.towerUI =
            new TowerUI(this);

        this.settingsMenu =
            new SettingsMenu(this);

        this.notifications =
            new Notifications(this);

        this.mobileControls =
            new MobileControls(this);

        // =====================================
        // Game State
        // =====================================

        this.running = true;

        this.paused = false;

        this.gameOver = false;

        this.deltaTime = 0;

        this.lastTime = 0;

        this.enemyMultiplier = 1;

        // =====================================
        // World
        // =====================================

        this.rooms = [];

        this.platforms = [];

        this.destructibles = [];

        this.lootDrops = [];

        // =====================================
        // Entities
        // =====================================

        this.player =
            new Player(
                this,
                400,
                400
            );

        this.enemies = [];

        this.projectiles = [];

        this.particles = [];

        this.effects = [];

        // =====================================
        // Input
        // =====================================

        this.keys = {};

        this.mouse = {

            x: 0,
            y: 0,

            down: false
        };

        // =====================================
        // Setup
        // =====================================

        this.setupEvents();

        this.generateWorld();

        this.spawnEnemies();

        // =====================================
        // Start
        // =====================================

        requestAnimationFrame(
            this.loop.bind(this)
        );
    }

    // =========================================
    // Resize
    // =========================================

    resize() {

        this.width =
            window.innerWidth;

        this.height =
            window.innerHeight;

        this.canvas.width =
            this.width;

        this.canvas.height =
            this.height;
    }

    // =========================================
    // Events
    // =========================================

    setupEvents() {

        // =====================================
        // Resize
        // =====================================

        window.addEventListener(
            "resize",
            () => this.resize()
        );

        // =====================================
        // Keyboard
        // =====================================

        window.addEventListener(
            "keydown",
            (e) => {

                this.keys[e.code] = true;

                // Pause
                if (
                    e.code ===
                    this.settings.getKeybind(
                        "pause"
                    )
                ) {

                    this.paused =
                        !this.paused;
                }

                // Inventory
                if (
                    e.code ===
                    this.settings.getKeybind(
                        "inventory"
                    )
                ) {

                    this.inventoryUI
                        .toggle();
                }

                // Crafting
                if (
                    e.code ===
                    this.settings.getKeybind(
                        "crafting"
                    )
                ) {

                    this.craftingUI
                        .toggle();
                }
            }
        );

        window.addEventListener(
            "keyup",
            (e) => {

                this.keys[e.code] = false;
            }
        );

        // =====================================
        // Mouse
        // =====================================

        this.canvas.addEventListener(
            "mousemove",
            (e) => {

                this.mouse.x =
                    e.clientX;

                this.mouse.y =
                    e.clientY;
            }
        );

        this.canvas.addEventListener(
            "mousedown",
            () => {

                this.mouse.down = true;
            }
        );

        this.canvas.addEventListener(
            "mouseup",
            () => {

                this.mouse.down = false;
            }
        );

        // =====================================
        // Prevent Right Click
        // =====================================

        this.canvas.addEventListener(
            "contextmenu",
            (e) => {

                e.preventDefault();
            }
        );
    }

    // =========================================
    // Generate World
    // =========================================

    generateWorld() {

        // Rooms
        for (
            let i = 0;
            i < 12;
            i++
        ) {

            this.rooms.push({

                x:
                    i * 700,

                y:
                    200 +
                    Math.sin(i) * 150,

                width: 650,

                height: 500,

                color:
                    i % 2 === 0
                    ? "#1a2038"
                    : "#232b45"
            });
        }

        // Platforms
        for (
            let i = 0;
            i < 50;
            i++
        ) {

            this.platforms.push({

                x:
                    Math.random() * 7000,

                y:
                    200 +
                    Math.random() * 900,

                width:
                    150 +
                    Math.random() * 200,

                height: 20,

                color: "#56627a"
            });
        }

        // Destructibles
        for (
            let i = 0;
            i < 25;
            i++
        ) {

            this.destructibles.push({

                x:
                    Math.random() * 7000,

                y:
                    500 +
                    Math.random() * 600,

                width: 50,

                height: 50,

                health: 50,

                maxHealth: 50,

                color: "#8a5a3c"
            });
        }

        // Camera Bounds
        this.camera.worldWidth =
            8000;

        this.camera.worldHeight =
            3000;
    }

    // =========================================
    // Spawn Enemies
    // =========================================

    spawnEnemies() {

        for (
            let i = 0;
            i < 40;
            i++
        ) {

            this.enemies.push(

                new Enemy(

                    this,

                    500 +
                    Math.random() * 6000,

                    300 +
                    Math.random() * 1500
                )
            );
        }

        // Boss
        this.enemies.push(

            new BossEnemy(

                this,

                5000,
                500
            )
        );
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        if (
            this.paused ||
            this.gameOver
        ) {

            return;
        }

        // =====================================
        // Systems
        // =====================================

        this.background.update(
            deltaTime
        );

        this.camera.update(
            deltaTime
        );

        this.animations.update(
            deltaTime
        );

        this.shaders.update(
            deltaTime
        );

        this.screenEffects.update(
            deltaTime
        );

        // =====================================
        // Player
        // =====================================

        this.player.update(
            deltaTime
        );

        // =====================================
        // Enemies
        // =====================================

        for (
            let i =
                this.enemies.length - 1;
            i >= 0;
            i--
        ) {

            const enemy =
                this.enemies[i];

            enemy.update(deltaTime);

            // Remove Dead
            if (
                enemy.health <= 0
            ) {

                this.spawnLoot(
                    enemy.x,
                    enemy.y
                );

                this.enemies.splice(
                    i,
                    1
                );
            }
        }

        // =====================================
        // Projectiles
        // =====================================

        for (
            let i =
                this.projectiles.length - 1;
            i >= 0;
            i--
        ) {

            const projectile =
                this.projectiles[i];

            projectile.update(
                deltaTime
            );

            if (
                projectile.dead
            ) {

                this.projectiles.splice(
                    i,
                    1
                );
            }
        }

        // =====================================
        // Particles
        // =====================================

        for (
            let i =
                this.particles.length - 1;
            i >= 0;
            i--
        ) {

            const particle =
                this.particles[i];

            particle.update(
                deltaTime
            );

            if (
                particle.dead
            ) {

                this.particles.splice(
                    i,
                    1
                );
            }
        }

        // =====================================
        // UI
        // =====================================

        this.notifications.update(
            deltaTime
        );

        this.mobileControls.update(
            deltaTime
        );
    }

    // =========================================
    // Render
    // =========================================

    render() {

        // Background
        this.background.draw(
            this.ctx
        );

        // Camera
        this.camera.apply(
            this.ctx
        );

        // =====================================
        // World
        // =====================================

        this.renderer.drawWorld(
            this.ctx
        );

        this.renderer.drawPlatforms(
            this.ctx
        );

        this.renderer.drawDestructibles(
            this.ctx
        );

        // =====================================
        // Entities
        // =====================================

        this.player.draw(
            this.ctx
        );

        for (
            const enemy of
            this.enemies
        ) {

            enemy.draw(
                this.ctx
            );
        }

        for (
            const projectile of
            this.projectiles
        ) {

            projectile.draw(
                this.ctx
            );
        }

        for (
            const particle of
            this.particles
        ) {

            particle.draw(
                this.ctx
            );
        }

        // =====================================
        // Effects
        // =====================================

        this.animations.draw(
            this.ctx
        );

        // =====================================
        // Reset Camera
        // =====================================

        this.camera.reset(
            this.ctx
        );

        // =====================================
        // UI
        // =====================================

        this.hud.draw(
            this.ctx
        );

        this.inventoryUI.draw(
            this.ctx
        );

        this.craftingUI.draw(
            this.ctx
        );

        this.towerUI.draw(
            this.ctx
        );

        this.settingsMenu.draw(
            this.ctx
        );

        this.notifications.draw(
            this.ctx
        );

        this.mobileControls.draw(
            this.ctx
        );

        this.screenEffects.draw(
            this.ctx
        );
    }

    // =========================================
    // Game Loop
    // =========================================

    loop(timestamp) {

        this.deltaTime =
            (
                timestamp -
                this.lastTime
            ) / 1000;

        this.lastTime =
            timestamp;

        // Prevent Lag Spikes
        if (
            this.deltaTime > 0.1
        ) {

            this.deltaTime = 0.1;
        }

        this.update(
            this.deltaTime
        );

        this.render();

        requestAnimationFrame(
            this.loop.bind(this)
        );
    }

    // =========================================
    // Spawn Loot
    // =========================================

    spawnLoot(x, y) {

        const rarities = [

            "common",
            "uncommon",
            "rare",
            "epic",
            "legendary"
        ];

        const rarity =
            rarities[
                Math.floor(
                    Math.random() *
                    rarities.length
                )
            ];

        this.lootDrops.push({

            x,
            y,

            rarity,

            icon: "♦"
        });
    }

    // =========================================
    // Spawn Particles
    // =========================================

    createParticles(
        x,
        y,
        amount = 10
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            this.particles.push(

                new Particle(
                    this,
                    x,
                    y
                )
            );
        }
    }
}

// =========================================
// Start Game
// =========================================

window.addEventListener(
    "load",
    () => {

        new Game();
    }
);
