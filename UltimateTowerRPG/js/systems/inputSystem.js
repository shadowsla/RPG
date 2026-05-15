// =========================================
// Ultimate Tower RPG - inputSystem.js
// =========================================

// =========================================
// Input System
// =========================================

export class InputSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Keys
        // =====================================

        this.keys = {};

        this.keysPressed = {};

        this.keysReleased = {};

        // =====================================
        // Mouse
        // =====================================

        this.mouse = {

            x: 0,

            y: 0,

            worldX: 0,

            worldY: 0,

            left: false,

            right: false,

            middle: false
        };

        // =====================================
        // Gamepad
        // =====================================

        this.gamepad = null;

        this.gamepadConnected = false;

        // =====================================
        // Mobile
        // =====================================

        this.touch = {

            active: false,

            x: 0,

            y: 0
        };

        // =====================================
        // Keybinds
        // =====================================

        this.keybinds = {

            // Movement
            moveLeft: [
                "KeyA",
                "ArrowLeft"
            ],

            moveRight: [
                "KeyD",
                "ArrowRight"
            ],

            jump: [
                "Space",
                "KeyW",
                "ArrowUp"
            ],

            crouch: [
                "KeyS",
                "ArrowDown"
            ],

            sprint: [
                "ShiftLeft"
            ],

            dodge: [
                "KeyQ"
            ],

            climb: [
                "KeyE"
            ],

            // Combat
            attack: [
                "Mouse0"
            ],

            heavyAttack: [
                "Mouse2"
            ],

            parry: [
                "KeyF"
            ],

            ability1: [
                "Digit1"
            ],

            ability2: [
                "Digit2"
            ],

            ability3: [
                "Digit3"
            ],

            ability4: [
                "Digit4"
            ],

            ultimate: [
                "KeyR"
            ],

            // UI
            inventory: [
                "KeyI"
            ],

            map: [
                "KeyM"
            ],

            quests: [
                "KeyJ"
            ],

            settings: [
                "Escape"
            ],

            interact: [
                "KeyE"
            ],

            chat: [
                "Enter"
            ],

            pause: [
                "Escape"
            ]
        };

        // =====================================
        // Double Tap
        // =====================================

        this.doubleTapTime = 250;

        this.lastTap = {};

        // =====================================
        // Initialize
        // =====================================

        this.setupListeners();
    }

    // =========================================
    // Setup
    // =========================================

    setupListeners() {

        // =====================================
        // Keyboard Down
        // =====================================

        window.addEventListener(

            "keydown",

            (event) => {

                // Prevent Repeat
                if (
                    !this.keys[event.code]
                ) {

                    this.keysPressed[
                        event.code
                    ] = true;
                }

                this.keys[event.code] = true;

                // Prevent Scroll
                if (

                    [
                        "Space",
                        "ArrowUp",
                        "ArrowDown",
                        "ArrowLeft",
                        "ArrowRight"
                    ].includes(event.code)
                ) {

                    event.preventDefault();
                }

                // Double Tap
                this.handleDoubleTap(
                    event.code
                );
            }
        );

        // =====================================
        // Keyboard Up
        // =====================================

        window.addEventListener(

            "keyup",

            (event) => {

                this.keys[event.code] = false;

                this.keysReleased[
                    event.code
                ] = true;
            }
        );

        // =====================================
        // Mouse Move
        // =====================================

        window.addEventListener(

            "mousemove",

            (event) => {

                const rect =

                    this.game.canvas
                    .getBoundingClientRect();

                this.mouse.x =

                    event.clientX -
                    rect.left;

                this.mouse.y =

                    event.clientY -
                    rect.top;

                // World Position
                this.mouse.worldX =

                    this.mouse.x +

                    this.game.camera.x;

                this.mouse.worldY =

                    this.mouse.y +

                    this.game.camera.y;
            }
        );

        // =====================================
        // Mouse Down
        // =====================================

        window.addEventListener(

            "mousedown",

            (event) => {

                switch(event.button) {

                    case 0:

                        this.mouse.left = true;

                        this.keysPressed[
                            "Mouse0"
                        ] = true;

                        break;

                    case 1:

                        this.mouse.middle = true;

                        break;

                    case 2:

                        this.mouse.right = true;

                        this.keysPressed[
                            "Mouse2"
                        ] = true;

                        break;
                }
            }
        );

        // =====================================
        // Mouse Up
        // =====================================

        window.addEventListener(

            "mouseup",

            (event) => {

                switch(event.button) {

                    case 0:

                        this.mouse.left = false;

                        break;

                    case 1:

                        this.mouse.middle = false;

                        break;

                    case 2:

                        this.mouse.right = false;

                        break;
                }
            }
        );

        // =====================================
        // Prevent Right Click Menu
        // =====================================

        window.addEventListener(

            "contextmenu",

            (event) => {

                event.preventDefault();
            }
        );

        // =====================================
        // Touch Start
        // =====================================

        window.addEventListener(

            "touchstart",

            (event) => {

                const touch =
                    event.touches[0];

                this.touch.active = true;

                this.touch.x =
                    touch.clientX;

                this.touch.y =
                    touch.clientY;
            }
        );

        // =====================================
        // Touch End
        // =====================================

        window.addEventListener(

            "touchend",

            () => {

                this.touch.active = false;
            }
        );

        // =====================================
        // Gamepad Connected
        // =====================================

        window.addEventListener(

            "gamepadconnected",

            (event) => {

                this.gamepad =
                    event.gamepad;

                this.gamepadConnected =
                    true;

                console.log(
                    "Gamepad connected"
                );
            }
        );

        // =====================================
        // Gamepad Disconnected
        // =====================================

        window.addEventListener(

            "gamepaddisconnected",

            () => {

                this.gamepad = null;

                this.gamepadConnected =
                    false;
            }
        );
    }

    // =========================================
    // Update
    // =========================================

    update() {

        // =====================================
        // Reset Pressed
        // =====================================

        this.keysPressed = {};

        this.keysReleased = {};

        // =====================================
        // Update Gamepad
        // =====================================

        this.updateGamepad();
    }

    // =========================================
    // Gamepad
    // =========================================

    updateGamepad() {

        if (
            !this.gamepadConnected
        ) {

            return;
        }

        const pads =
            navigator.getGamepads();

        this.gamepad =
            pads[0];

        if (
            !this.gamepad
        ) {

            return;
        }

        // =====================================
        // Left Stick
        // =====================================

        const leftX =
            this.gamepad.axes[0];

        const leftY =
            this.gamepad.axes[1];

        // Deadzone
        if (
            Math.abs(leftX) > 0.2
        ) {

            if (
                leftX < 0
            ) {

                this.keys["ArrowLeft"] =
                    true;
            }

            else {

                this.keys["ArrowRight"] =
                    true;
            }
        }

        if (
            Math.abs(leftY) > 0.2
        ) {

            if (
                leftY < 0
            ) {

                this.keys["ArrowUp"] =
                    true;
            }

            else {

                this.keys["ArrowDown"] =
                    true;
            }
        }

        // =====================================
        // Buttons
        // =====================================

        if (
            this.gamepad.buttons[0]
            .pressed
        ) {

            this.keys["Space"] = true;
        }

        if (
            this.gamepad.buttons[2]
            .pressed
        ) {

            this.keys["Mouse0"] = true;
        }

        if (
            this.gamepad.buttons[1]
            .pressed
        ) {

            this.keys["KeyQ"] = true;
        }
    }

    // =========================================
    // Check Action
    // =========================================

    isActionPressed(action) {

        const binds =
            this.keybinds[action];

        if (
            !binds
        ) {

            return false;
        }

        for (
            const key of binds
        ) {

            if (
                this.keys[key]
            ) {

                return true;
            }
        }

        return false;
    }

    // =========================================
    // Just Pressed
    // =========================================

    wasActionPressed(action) {

        const binds =
            this.keybinds[action];

        if (
            !binds
        ) {

            return false;
        }

        for (
            const key of binds
        ) {

            if (
                this.keysPressed[key]
            ) {

                return true;
            }
        }

        return false;
    }

    // =========================================
    // Released
    // =========================================

    wasActionReleased(action) {

        const binds =
            this.keybinds[action];

        if (
            !binds
        ) {

            return false;
        }

        for (
            const key of binds
        ) {

            if (
                this.keysReleased[key]
            ) {

                return true;
            }
        }

        return false;
    }

    // =========================================
    // Double Tap
    // =========================================

    handleDoubleTap(code) {

        const now =
            performance.now();

        if (
            this.lastTap[code]
        ) {

            const difference =

                now -
                this.lastTap[code];

            if (
                difference <
                this.doubleTapTime
            ) {

                this.keysPressed[
                    `${code}_DOUBLE`
                ] = true;
            }
        }

        this.lastTap[code] = now;
    }

    // =========================================
    // Check Double Tap
    // =========================================

    wasDoubleTapped(code) {

        return !!this.keysPressed[
            `${code}_DOUBLE`
        ];
    }

    // =========================================
    // Movement Axis
    // =========================================

    getMovementX() {

        let movement = 0;

        if (
            this.isActionPressed(
                "moveLeft"
            )
        ) {

            movement--;
        }

        if (
            this.isActionPressed(
                "moveRight"
            )
        ) {

            movement++;
        }

        return movement;
    }

    // =========================================
    // Vertical Axis
    // =========================================

    getMovementY() {

        let movement = 0;

        if (
            this.isActionPressed(
                "jump"
            )
        ) {

            movement--;
        }

        if (
            this.isActionPressed(
                "crouch"
            )
        ) {

            movement++;
        }

        return movement;
    }

    // =========================================
    // Rebind Key
    // =========================================

    rebindKey(
        action,
        newKey
    ) {

        if (
            !this.keybinds[action]
        ) {

            return;
        }

        this.keybinds[action][0] =
            newKey;

        this.saveKeybinds();
    }

    // =========================================
    // Save
    // =========================================

    saveKeybinds() {

        localStorage.setItem(

            "towerRPG_keybinds",

            JSON.stringify(
                this.keybinds
            )
        );
    }

    // =========================================
    // Load
    // =========================================

    loadKeybinds() {

        const saved =
            localStorage.getItem(
                "towerRPG_keybinds"
            );

        if (
            !saved
        ) {

            return;
        }

        try {

            this.keybinds =
                JSON.parse(saved);

        } catch(error) {

            console.error(
                "Failed to load keybinds",
                error
            );
        }
    }

    // =========================================
    // Vibration
    // =========================================

    vibrate(
        duration = 100
    ) {

        if (
            navigator.vibrate
        ) {

            navigator.vibrate(
                duration
            );
        }
    }

    // =========================================
    // Gamepad Vibration
    // =========================================

    vibrateGamepad(
        weak = 0.5,
        strong = 1,
        duration = 150
    ) {

        if (

            this.gamepad &&

            this.gamepad.vibrationActuator
        ) {

            this.gamepad
                .vibrationActuator
                .playEffect(

                    "dual-rumble",

                    {

                        duration,

                        weakMagnitude:
                            weak,

                        strongMagnitude:
                            strong
                    }
                );
        }
    }

    // =========================================
    // Any Input
    // =========================================

    anyInputPressed() {

        return (

            Object.keys(
                this.keysPressed
            ).length > 0
        );
    }

    // =========================================
    // Clear Input
    // =========================================

    clearAllInput() {

        this.keys = {};

        this.keysPressed = {};

        this.keysReleased = {};

        this.mouse.left = false;

        this.mouse.right = false;

        this.mouse.middle = false;
    }
}