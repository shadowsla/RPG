// =========================================
// Ultimate Tower RPG - mobileControls.js
// =========================================

export class MobileControls {

    constructor(game, player) {

        this.game = game;

        this.player = player;

        // =====================================
        // Mobile Detection
        // =====================================

        this.enabled =
            this.isMobileDevice();

        // =====================================
        // Movement
        // =====================================

        this.moveX = 0;
        this.moveY = 0;

        this.joystickActive = false;

        this.joystickStartX = 0;
        this.joystickStartY = 0;

        this.joystickCurrentX = 0;
        this.joystickCurrentY = 0;

        this.maxJoystickDistance = 50;

        // =====================================
        // Elements
        // =====================================

        this.mobileControls =
            document.getElementById(
                "mobileControls"
            );

        this.joystickBase =
            document.getElementById(
                "joystickBase"
            );

        this.joystickStick =
            document.getElementById(
                "joystickStick"
            );

        this.attackButton =
            document.getElementById(
                "attackButton"
            );

        this.jumpButton =
            document.getElementById(
                "jumpButton"
            );

        this.dodgeButton =
            document.getElementById(
                "dodgeButton"
            );

        this.skillButton =
            document.getElementById(
                "skillButton"
            );

        // =====================================
        // Setup
        // =====================================

        if (this.enabled) {

            this.mobileControls.style.display =
                "block";

            this.initializeControls();

        } else {

            this.mobileControls.style.display =
                "none";
        }
    }

    // =========================================
    // Detect Mobile Device
    // =========================================

    isMobileDevice() {

        return (
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0
        );
    }

    // =========================================
    // Initialize Controls
    // =========================================

    initializeControls() {

        this.setupJoystick();

        this.setupButtons();
    }

    // =========================================
    // Setup Joystick
    // =========================================

    setupJoystick() {

        // Touch Start
        this.joystickBase.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                const touch =
                    event.touches[0];

                this.joystickActive = true;

                this.joystickStartX =
                    touch.clientX;

                this.joystickStartY =
                    touch.clientY;
            }
        );

        // Touch Move
        this.joystickBase.addEventListener(
            "touchmove",
            (event) => {

                event.preventDefault();

                if (!this.joystickActive) {
                    return;
                }

                const touch =
                    event.touches[0];

                let deltaX =
                    touch.clientX -
                    this.joystickStartX;

                let deltaY =
                    touch.clientY -
                    this.joystickStartY;

                const distance =
                    Math.sqrt(
                        deltaX * deltaX +
                        deltaY * deltaY
                    );

                // Clamp distance
                if (
                    distance >
                    this.maxJoystickDistance
                ) {

                    const angle =
                        Math.atan2(
                            deltaY,
                            deltaX
                        );

                    deltaX =
                        Math.cos(angle) *
                        this.maxJoystickDistance;

                    deltaY =
                        Math.sin(angle) *
                        this.maxJoystickDistance;
                }

                this.joystickCurrentX = deltaX;
                this.joystickCurrentY = deltaY;

                // Normalize movement
                this.moveX =
                    deltaX /
                    this.maxJoystickDistance;

                this.moveY =
                    deltaY /
                    this.maxJoystickDistance;

                // Move joystick stick
                this.joystickStick.style.transform =
                    `translate(${deltaX}px, ${deltaY}px)`;
            }
        );

        // Touch End
        this.joystickBase.addEventListener(
            "touchend",
            () => {

                this.resetJoystick();
            }
        );
    }

    // =========================================
    // Reset Joystick
    // =========================================

    resetJoystick() {

        this.joystickActive = false;

        this.moveX = 0;
        this.moveY = 0;

        this.joystickCurrentX = 0;
        this.joystickCurrentY = 0;

        this.joystickStick.style.transform =
            `translate(0px, 0px)`;
    }

    // =========================================
    // Setup Buttons
    // =========================================

    setupButtons() {

        // =====================================
        // Attack
        // =====================================

        this.attackButton.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                if (
                    this.player.attack
                ) {

                    this.player.attack();
                }

                this.animateButton(
                    this.attackButton
                );
            }
        );

        // =====================================
        // Jump
        // =====================================

        this.jumpButton.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                if (
                    this.player.jump
                ) {

                    this.player.jump();
                }

                this.animateButton(
                    this.jumpButton
                );
            }
        );

        // =====================================
        // Dodge
        // =====================================

        this.dodgeButton.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                if (
                    this.player.dodgeRoll
                ) {

                    this.player.dodgeRoll();
                }

                this.animateButton(
                    this.dodgeButton
                );
            }
        );

        // =====================================
        // Skill
        // =====================================

        this.skillButton.addEventListener(
            "touchstart",
            (event) => {

                event.preventDefault();

                if (
                    this.player.useSkill
                ) {

                    this.player.useSkill(0);
                }

                this.animateButton(
                    this.skillButton
                );
            }
        );
    }

    // =========================================
    // Animate Button
    // =========================================

    animateButton(button) {

        button.style.transform =
            "scale(0.9)";

        setTimeout(() => {

            button.style.transform =
                "scale(1)";

        }, 100);
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        if (!this.enabled) {
            return;
        }

        // =====================================
        // Movement
        // =====================================

        const moveSpeed =
            this.player.speed *
            deltaTime;

        this.player.x +=
            this.moveX * moveSpeed;

        this.player.y +=
            this.moveY * moveSpeed;

        // =====================================
        // Clamp Player To Screen
        // =====================================

        this.player.x = Math.max(
            0,
            Math.min(
                this.game.width -
                this.player.width,
                this.player.x
            )
        );

        this.player.y = Math.max(
            0,
            Math.min(
                this.game.height -
                this.player.height,
                this.player.y
            )
        );
    }

    // =========================================
    // Draw Debug
    // =========================================

    draw(ctx) {

        if (!this.enabled) {
            return;
        }

        // Optional debug visuals
    }

    // =========================================
    // Enable / Disable
    // =========================================

    setEnabled(enabled) {

        this.enabled = enabled;

        this.mobileControls.style.display =
            enabled
                ? "block"
                : "none";
    }
}
