// =========================================
// Ultimate Tower RPG - camera.js
// =========================================

export class Camera {

    constructor(game) {

        this.game = game;

        // =====================================
        // Position
        // =====================================

        this.x = 0;
        this.y = 0;

        this.targetX = 0;
        this.targetY = 0;

        // =====================================
        // Settings
        // =====================================

        this.smoothness = 0.08;

        this.zoom = 1;

        this.targetZoom = 1;

        this.minZoom = 0.7;

        this.maxZoom = 2;

        // =====================================
        // Shake
        // =====================================

        this.shakePower = 0;

        this.shakeDuration = 0;

        this.shakeX = 0;

        this.shakeY = 0;

        // =====================================
        // Bounds
        // =====================================

        this.worldWidth = 8000;

        this.worldHeight = 8000;

        // =====================================
        // Cinematic
        // =====================================

        this.cinematicTarget = null;

        this.cinematicMode = false;

        // =====================================
        // Dead Zone
        // =====================================

        this.deadZone = {

            width: 120,
            height: 80
        };
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.updateTarget();

        this.updatePosition(deltaTime);

        this.updateZoom(deltaTime);

        this.updateShake(deltaTime);

        this.clampToWorld();
    }

    // =========================================
    // Update Target
    // =========================================

    updateTarget() {

        // Cinematic Camera
        if (
            this.cinematicMode &&
            this.cinematicTarget
        ) {

            this.targetX =
                this.cinematicTarget.x -
                this.game.width / 2;

            this.targetY =
                this.cinematicTarget.y -
                this.game.height / 2;

            return;
        }

        const player =
            this.game.player;

        if (!player) {
            return;
        }

        // Dead Zone Camera
        const centerX =
            this.x +
            this.game.width / 2;

        const centerY =
            this.y +
            this.game.height / 2;

        // Horizontal
        if (
            player.x <
            centerX -
            this.deadZone.width
        ) {

            this.targetX =
                player.x -
                this.deadZone.width -
                this.game.width / 2;

        } else if (
            player.x >
            centerX +
            this.deadZone.width
        ) {

            this.targetX =
                player.x +
                this.deadZone.width -
                this.game.width / 2;
        }

        // Vertical
        if (
            player.y <
            centerY -
            this.deadZone.height
        ) {

            this.targetY =
                player.y -
                this.deadZone.height -
                this.game.height / 2;

        } else if (
            player.y >
            centerY +
            this.deadZone.height
        ) {

            this.targetY =
                player.y +
                this.deadZone.height -
                this.game.height / 2;
        }
    }

    // =========================================
    // Smooth Movement
    // =========================================

    updatePosition(deltaTime) {

        this.x +=
            (
                this.targetX -
                this.x
            ) * this.smoothness;

        this.y +=
            (
                this.targetY -
                this.y
            ) * this.smoothness;
    }

    // =========================================
    // Zoom
    // =========================================

    updateZoom(deltaTime) {

        this.zoom +=
            (
                this.targetZoom -
                this.zoom
            ) * 0.08;
    }

    // =========================================
    // Shake
    // =========================================

    updateShake(deltaTime) {

        if (
            this.shakeDuration > 0
        ) {

            this.shakeDuration -=
                deltaTime;

            this.shakeX =
                (Math.random() - 0.5) *
                this.shakePower;

            this.shakeY =
                (Math.random() - 0.5) *
                this.shakePower;

        } else {

            this.shakeX = 0;
            this.shakeY = 0;
        }
    }

    // =========================================
    // Clamp
    // =========================================

    clampToWorld() {

        this.x = Math.max(
            0,
            Math.min(
                this.x,
                this.worldWidth -
                this.game.width
            )
        );

        this.y = Math.max(
            0,
            Math.min(
                this.y,
                this.worldHeight -
                this.game.height
            )
        );
    }

    // =========================================
    // Apply Camera
    // =========================================

    apply(ctx) {

        ctx.save();

        // Zoom
        ctx.scale(
            this.zoom,
            this.zoom
        );

        // Translation
        ctx.translate(

            -this.x + this.shakeX,

            -this.y + this.shakeY
        );
    }

    // =========================================
    // Reset Context
    // =========================================

    reset(ctx) {

        ctx.restore();
    }

    // =========================================
    // Screen Shake
    // =========================================

    shake(
        power = 10,
        duration = 0.3
    ) {

        this.shakePower = power;

        this.shakeDuration = duration;
    }

    // =========================================
    // Zoom Controls
    // =========================================

    setZoom(value) {

        this.targetZoom =
            Math.max(
                this.minZoom,
                Math.min(
                    value,
                    this.maxZoom
                )
            );
    }

    zoomIn() {

        this.setZoom(
            this.targetZoom + 0.1
        );
    }

    zoomOut() {

        this.setZoom(
            this.targetZoom - 0.1
        );
    }

    // =========================================
    // Cinematic
    // =========================================

    focusOn(
        target,
        zoom = 1.2
    ) {

        this.cinematicMode = true;

        this.cinematicTarget =
            target;

        this.setZoom(zoom);
    }

    stopFocus() {

        this.cinematicMode = false;

        this.cinematicTarget =
            null;

        this.setZoom(1);
    }

    // =========================================
    // Coordinate Conversion
    // =========================================

    screenToWorld(
        screenX,
        screenY
    ) {

        return {

            x:
                screenX / this.zoom +
                this.x,

            y:
                screenY / this.zoom +
                this.y
        };
    }

    worldToScreen(
        worldX,
        worldY
    ) {

        return {

            x:
                (worldX - this.x) *
                this.zoom,

            y:
                (worldY - this.y) *
                this.zoom
        };
    }

    // =========================================
    // Is On Screen
    // =========================================

    isOnScreen(
        x,
        y,
        width,
        height
    ) {

        return (

            x + width >
            this.x &&

            x <
            this.x +
            this.game.width &&

            y + height >
            this.y &&

            y <
            this.y +
            this.game.height
        );
    }

    // =========================================
    // Debug
    // =========================================

    drawDebug(ctx) {

        // Dead Zone
        ctx.save();

        ctx.strokeStyle =
            "#00ff88";

        ctx.lineWidth = 2;

        ctx.strokeRect(

            this.game.width / 2 -
            this.deadZone.width,

            this.game.height / 2 -
            this.deadZone.height,

            this.deadZone.width * 2,

            this.deadZone.height * 2
        );

        ctx.restore();
    }
}
