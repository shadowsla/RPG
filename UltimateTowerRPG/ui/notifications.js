// =========================================
// Ultimate Tower RPG - notifications.js
// =========================================

export class Notifications {

    constructor(game) {

        this.game = game;

        this.notifications = [];

        this.maxNotifications = 6;
    }

    // =========================================
    // Add Notification
    // =========================================

    add(message, type = "info") {

        const notification = {

            id: Date.now() + Math.random(),

            message: message,

            type: type,

            life: 4,

            maxLife: 4,

            yOffset: 0
        };

        this.notifications.push(notification);

        // Limit notifications
        if (
            this.notifications.length >
            this.maxNotifications
        ) {

            this.notifications.shift();
        }
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        for (
            let i = this.notifications.length - 1;
            i >= 0;
            i--
        ) {

            const note =
                this.notifications[i];

            note.life -= deltaTime;

            note.yOffset +=
                20 * deltaTime;

            // Remove expired
            if (note.life <= 0) {

                this.notifications.splice(i, 1);
            }
        }
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        ctx.save();

        for (
            let i = 0;
            i < this.notifications.length;
            i++
        ) {

            const note =
                this.notifications[i];

            const x =
                this.game.width - 380;

            const y =
                30 + i * 75 - note.yOffset;

            const alpha =
                note.life / note.maxLife;

            ctx.globalAlpha = alpha;

            this.drawNotification(
                ctx,
                note,
                x,
                y
            );
        }

        ctx.restore();
    }

    // =========================================
    // Draw Single Notification
    // =========================================

    drawNotification(
        ctx,
        notification,
        x,
        y
    ) {

        const width = 340;
        const height = 60;

        // Background
        ctx.fillStyle =
            "rgba(10, 12, 25, 0.88)";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // Border Color
        ctx.fillStyle =
            this.getTypeColor(
                notification.type
            );

        ctx.fillRect(
            x,
            y,
            6,
            height
        );

        // Border Outline
        ctx.strokeStyle =
            "rgba(255,255,255,0.08)";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );

        // Icon
        ctx.font = "28px Arial";

        ctx.fillStyle =
            this.getTypeColor(
                notification.type
            );

        ctx.fillText(
            this.getTypeIcon(
                notification.type
            ),
            x + 18,
            y + 38
        );

        // Message
        ctx.fillStyle = "#ffffff";

        ctx.font = "18px Arial";

        ctx.fillText(
            notification.message,
            x + 60,
            y + 36
        );

        // Timer Bar Background
        ctx.fillStyle =
            "rgba(255,255,255,0.08)";

        ctx.fillRect(
            x + 15,
            y + 48,
            width - 30,
            6
        );

        // Timer Bar Fill
        const percent =
            notification.life /
            notification.maxLife;

        ctx.fillStyle =
            this.getTypeColor(
                notification.type
            );

        ctx.fillRect(
            x + 15,
            y + 48,
            (width - 30) * percent,
            6
        );
    }

    // =========================================
    // Notification Type Colors
    // =========================================

    getTypeColor(type) {

        switch(type) {

            case "success":
                return "#4dff88";

            case "warning":
                return "#ffcc33";

            case "danger":
                return "#ff5555";

            case "loot":
                return "#66b3ff";

            case "legendary":
                return "#ff9933";

            case "boss":
                return "#ff2222";

            case "quest":
                return "#cc66ff";

            case "rank":
                return "#ffe066";

            default:
                return "#72d9ff";
        }
    }

    // =========================================
    // Notification Icons
    // =========================================

    getTypeIcon(type) {

        switch(type) {

            case "success":
                return "✔";

            case "warning":
                return "⚠";

            case "danger":
                return "✖";

            case "loot":
                return "♦";

            case "legendary":
                return "★";

            case "boss":
                return "☠";

            case "quest":
                return "✦";

            case "rank":
                return "⬆";

            default:
                return "●";
        }
    }

    // =========================================
    // Helper Notifications
    // =========================================

    loot(message) {

        this.add(
            message,
            "loot"
        );
    }

    success(message) {

        this.add(
            message,
            "success"
        );
    }

    warning(message) {

        this.add(
            message,
            "warning"
        );
    }

    danger(message) {

        this.add(
            message,
            "danger"
        );
    }

    legendary(message) {

        this.add(
            message,
            "legendary"
        );
    }

    boss(message) {

        this.add(
            message,
            "boss"
        );
    }

    quest(message) {

        this.add(
            message,
            "quest"
        );
    }

    rank(message) {

        this.add(
            message,
            "rank"
        );
    }

    // =========================================
    // Clear All
    // =========================================

    clear() {

        this.notifications = [];
    }
}
