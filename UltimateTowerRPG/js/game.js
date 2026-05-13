// =========================================
// Ultimate Tower RPG - game.js
// =========================================

import { Player } from "./player.js";

import { Enemy } from "./enemy.js";

import { BossEnemy } from "./bossEnemy.js";

import { Renderer } from "./renderer.js";

import { Camera } from "./camera.js";

import { Background } from "./background.js";

import { Animations } from "./animations.js";

import { Shaders } from "./shaders.js";

import { ScreenEffects } from "./screenEffects.js";

import { Settings } from "./settings.js";

import { HUD } from "./hud.js";

import { InventoryUI } from "./inventoryUI.js";

import { CraftingUI } from "./craftingUI.js";

import { Menus } from "./menus.js";

import { TowerUI } from "./TowerUI.js";

import { SettingsMenu } from "./settingsMenu.js";

import { Notifications } from "./notifications.js";

import { MobileControls } from "./mobileControls.js";

// =========================================
// Main Game Class
// =========================================

export class Game {

    constructor(canvasId = "gameCanvas") {

        // =====================================
        // Canvas
        // =====================================

        this.canvas =
            document.getElementById(
                canvasId
            );

        this.ctx =
            this.canvas.getContext("2d");

        // =====================================
        // Screen
        // =====================================

        this.width =
            window.innerWidth;

        this.height =
            window.innerHeight;

        this.canvas.width =
            this.width;

        this.canvas.height =
            this.height;

        // =====================================
        // Core State
        // =====================================

        this.running = true;

        this.paused = false;

        this.gameOver = false;

        this.debug = false;

        this.deltaTime = 0;

        this.lastTime = 0;

        // =====================================
        // Input
        // =====================================

        this.keys = {};

        this.mouse = {

            x: 0,
            y: 0,

            down: false,

            rightDown: false
        };

        // =====================================
        // World
        // =====================================

        this.gravity = 1800;

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
                500
            );

        this.enemies = [];

        this.projectiles = [];

        this.particles = [];

        this.effects = [];

        // =====================================
        // Tower Progression
        // =====================================

        this.floor = 1;

        this.maxFloor = 999;

        this.score = 0;

        this.gold = 0;

        this.enemyMultiplier = 1;

        // =====================================
        // Modes
        // =====================================

        this.hardcoreMode = false;

        this.endlessMode = false;

        this.challengeModifiers = [];

        // =====================================
        // Systems
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

        this.inventoryUI =
            new InventoryUI(this);

        this.craftingUI =
            new CraftingUI(this);

        this.menus =
            new Menus(this);

        this.towerUI =
            new TowerUI(this);

        this.settingsMenu =
            new SettingsMenu(this);

        this.notifications =
            new Notifications(this);

        this.mobileControls =
            new MobileControls(this);

        // =====================================
        // Initialize
        // =====================================

        this.setupEvents();

        this.generateFloor();

        this.spawnEnemies();

        // =====================================
        // Start Loop
        // =====================================

        requestAnimationFrame(
            this.loop.bind(this)
        );
    }

    // =========================================
    // Setup Events
    // =========================================

    setupEvents() {

        // =====================================
        // Resize
        // =====================================

        window.addEventListener(
            "resize",
            () => {

                this.resize();
            }
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

                // Debug
                if (
                    e.code === "F3"
                ) {

                    this.debug =
                        !this.debug;
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

                const rect =
                    this.canvas
                    .getBoundingClientRect();

                this.mouse.x =
                    e.clientX - rect.left;

                this.mouse.y =
                    e.clientY - rect.top;
            }
        );

        this.canvas.addEventListener(
            "mousedown",
            (e) => {

                if (e.button === 0) {

                    this.mouse.down = true;
                }

                if (e.button === 2) {

                    this.mouse.rightDown = true;
                }
            }
        );

        this.canvas.addEventListener(
            "mouseup",
            (e) => {

                if (e.button === 0) {

                    this.mouse.down = false;
                }

                if (e.button === 2) {

                    this.mouse.rightDown = false;
                }
            }
        );

        // Disable Context Menu
        this.canvas.addEventListener(
            "contextmenu",
            (e) => {

                e.preventDefault();
            }
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
    // Generate Floor
    // =========================================

    generateFloor() {

        this.rooms = [];

        this.platforms = [];

        this.destructibles = [];

        // =====================================
        // Procedural Rooms
        // =====================================

        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const room = {

                x:
                    i * 900,

                y:
                    200 +
                    Math.sin(i) * 120,

                width:
                    700 +
                    Math.random() * 250,

                height:
                    450 +
                    Math.random() * 120,

                color:
                    i % 2 === 0
                    ? "#1d2640"
                    : "#25304d"
            };

            this.rooms.push(room);
        }

        // =====================================
        // Platforms
        // =====================================

        for (
            let i = 0;
            i < 60;
            i++
        ) {

            this.platforms.push({

                x:
                    Math.random() * 8000,

                y:
                    200 +
                    Math.random() * 1800,

                width:
                    120 +
                    Math.random() * 240,

                height: 20,

                color: "#5d6a85"
            });
        }

        // =====================================
        // Destructibles
        // =====================================

        for (
            let i = 0;
            i < 35;
            i++
        ) {

            this.destructibles.push({

                x:
                    Math.random() * 8000,

                y:
                    500 +
                    Math.random() * 1500,

                width: 50,

                height: 50,

                health: 60,

                maxHealth: 60,

                color: "#8d5f3f"
            });
        }

        // =====================================
        // Camera Bounds
        // =====================================

        this.camera.worldWidth =
            9000;

        this.camera.worldHeight =
            3500;
    }

    // =========================================
    // Spawn Enemies
    // =========================================

    spawnEnemies() {

        this.enemies = [];

        const enemyCount =
            15 + this.floor * 2;

        for (
            let i = 0;
            i < enemyCount;
            i++
        ) {

            this.enemies.push(

                new Enemy(

                    this,

                    500 +
                    Math.random() * 7000,

                    300 +
                    Math.random() * 2000
                )
            );
        }

        // Boss Every 5 Floors
        if (
            this.floor % 5 === 0
        ) {

            this.enemies.push(

                new BossEnemy(

                    this,

                    4500,
                    700
                )
            );

            this.screenEffects
                .triggerBossWarning(
                    "FLOOR GUARDIAN"
                );
        }
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

            enemy.update(
                deltaTime
            );

            // Dead
            if (
                enemy.health <= 0
            ) {

                this.score += 100;

                this.gold +=
                    10 +
                    Math.floor(
                        Math.random() * 30
                    );

                this.spawnLoot(
                    enemy.x,
                    enemy.y
                );

                this.createParticles(
                    enemy.x,
                    enemy.y,
                    20
                );

                this.animations.play(
                    "explosion",
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
        // Notifications
        // =====================================

        this.notifications.update(
            deltaTime
        );

        // =====================================
        // Floor Complete
        // =====================================

        if (
            this.enemies.length === 0
        ) {

            this.nextFloor();
        }
    }

    // =========================================
    // Render
    // =========================================

    render() {

        this.renderer.render();

        if (this.debug) {

            this.drawDebug();
        }
    }

    // =========================================
    // Debug
    // =========================================

    drawDebug() {

        const ctx = this.ctx;

        ctx.save();

        ctx.fillStyle =
            "#00ff88";

        ctx.font =
            "16px monospace";

        ctx.fillText(
            `FPS: ${Math.round(
                1 / this.deltaTime
            )}`,
            20,
            30
        );

        ctx.fillText(
            `Enemies: ${this.enemies.length}`,
            20,
            55
        );

        ctx.fillText(
            `Particles: ${this.particles.length}`,
            20,
            80
        );

        ctx.fillText(
            `Floor: ${this.floor}`,
            20,
            105
        );

        ctx.restore();
    }

    // =========================================
    // Next Floor
    // =========================================

    nextFloor() {

        this.floor++;

        this.notifications.add(

            `Floor ${this.floor}`,

            "success"
        );

        this.screenEffects
            .triggerLevelUp();

        this.generateFloor();

        this.spawnEnemies();

        this.player.x = 400;

        this.player.y = 500;
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
            "legendary",
            "mythic"
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

            icon: "♦",

            pickupRadius: 40
        });
    }

    // =========================================
    // Particles
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

            this.particles.push({

                x,
                y,

                vx:
                    (Math.random() - 0.5) *
                    400,

                vy:
                    (Math.random() - 0.5) *
                    400,

                size:
                    2 +
                    Math.random() * 5,

                life: 1,

                update(deltaTime) {

                    this.x +=
                        this.vx *
                        deltaTime;

                    this.y +=
                        this.vy *
                        deltaTime;

                    this.life -=
                        deltaTime;
                },

                draw(ctx) {

                    ctx.save();

                    ctx.globalAlpha =
                        this.life;

                    ctx.fillStyle =
                        "#ffaa44";

                    ctx.beginPath();

                    ctx.arc(
                        this.x,
                        this.y,
                        this.size,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                    ctx.restore();
                },

                get dead() {

                    return this.life <= 0;
                }
            });
        }
    }

    // =========================================
    // Loop
    // =========================================

    loop(timestamp) {

        this.deltaTime =
            (
                timestamp -
                this.lastTime
            ) / 1000;

        this.lastTime =
            timestamp;

        // Lag Protection
        if (
            this.deltaTime > 0.1
        ) {

            this.deltaTime = 0.1;
        }

        this.update(
            this.deltaTime
        );

        this.render();

        if (this.running) {

            requestAnimationFrame(
                this.loop.bind(this)
            );
        }
    }
}
