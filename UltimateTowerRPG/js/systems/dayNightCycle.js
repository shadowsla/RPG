// =========================================
// Ultimate Tower RPG - dayNightCycle.js
// =========================================

// =========================================
// Day Night Cycle System
// =========================================

export class DayNightCycle {

    constructor(game) {

        this.game = game;

        // =====================================
        // Time
        // =====================================

        this.currentTime = 8;

        this.minutes = 0;

        this.day = 1;

        // =====================================
        // Time Speed
        // =====================================

        this.timeScale = 60;

        // 1 real second = 1 game minute

        this.timeAccumulator = 0;

        // =====================================
        // Day Settings
        // =====================================

        this.sunriseTime = 6;

        this.sunsetTime = 18;

        this.noonTime = 12;

        this.midnightTime = 0;

        // =====================================
        // Lighting
        // =====================================

        this.lightLevel = 1;

        this.skyColor = "#87ceeb";

        this.fogColor = "#d7ecff";

        // =====================================
        // Weather Link
        // =====================================

        this.weatherMultiplier = 1;

        // =====================================
        // Events
        // =====================================

        this.events = [];

        // =====================================
        // Moon
        // =====================================

        this.moonPhase = 0;

        // =====================================
        // Stars
        // =====================================

        this.stars = [];

        this.generateStars();

        // =====================================
        // Colors
        // =====================================

        this.colors = {

            dawn: "#ffb36b",

            morning: "#87ceeb",

            noon: "#6fc3ff",

            evening: "#ff9966",

            dusk: "#6f6bb3",

            night: "#081020",

            midnight: "#020612"
        };
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Advance Time
        // =====================================

        this.advanceTime(
            deltaTime
        );

        // =====================================
        // Update Lighting
        // =====================================

        this.updateLighting();

        // =====================================
        // Check Events
        // =====================================

        this.checkEvents();
    }

    // =========================================
    // Advance Time
    // =========================================

    advanceTime(deltaTime) {

        this.timeAccumulator +=

            deltaTime *
            this.timeScale;

        // =====================================
        // Minutes
        // =====================================

        while (
            this.timeAccumulator >= 1
        ) {

            this.timeAccumulator--;

            this.minutes++;

            // ================================
            // Hour
            // ================================

            if (
                this.minutes >= 60
            ) {

                this.minutes = 0;

                this.currentTime++;

                // ============================
                // New Day
                // ============================

                if (
                    this.currentTime >= 24
                ) {

                    this.currentTime = 0;

                    this.day++;

                    this.nextMoonPhase();
                }
            }
        }
    }

    // =========================================
    // Lighting
    // =========================================

    updateLighting() {

        const hour =
            this.currentTime +

            this.minutes / 60;

        // =====================================
        // Sunrise
        // =====================================

        if (

            hour >= 5 &&

            hour < 8
        ) {

            const progress =

                (hour - 5) / 3;

            this.lightLevel =

                0.25 +
                progress * 0.75;

            this.skyColor =
                this.interpolateColor(

                    this.colors.night,

                    this.colors.morning,

                    progress
                );
        }

        // =====================================
        // Day
        // =====================================

        else if (

            hour >= 8 &&

            hour < 17
        ) {

            this.lightLevel = 1;

            this.skyColor =
                this.colors.noon;
        }

        // =====================================
        // Sunset
        // =====================================

        else if (

            hour >= 17 &&

            hour < 20
        ) {

            const progress =

                (hour - 17) / 3;

            this.lightLevel =

                1 -
                progress * 0.7;

            this.skyColor =
                this.interpolateColor(

                    this.colors.evening,

                    this.colors.night,

                    progress
                );
        }

        // =====================================
        // Night
        // =====================================

        else {

            this.lightLevel = 0.25;

            this.skyColor =
                this.colors.night;
        }

        // =====================================
        // Midnight Darker
        // =====================================

        if (

            hour >= 0 &&

            hour <= 3
        ) {

            this.lightLevel = 0.15;

            this.skyColor =
                this.colors.midnight;
        }

        // =====================================
        // Weather Influence
        // =====================================

        this.lightLevel *=
            this.weatherMultiplier;

        // =====================================
        // Apply To Lighting System
        // =====================================

        if (
            this.game.lighting
        ) {

            this.game.lighting
                .ambientDarkness =

                1 -
                this.lightLevel;
        }
    }

    // =========================================
    // Draw Sky
    // =========================================

    drawSky(ctx) {

        // =====================================
        // Gradient
        // =====================================

        const gradient =
            ctx.createLinearGradient(

                0,
                0,

                0,
                this.game.canvas.height
            );

        gradient.addColorStop(
            0,
            this.skyColor
        );

        gradient.addColorStop(
            1,
            "#1b2438"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(

            0,
            0,

            this.game.canvas.width,

            this.game.canvas.height
        );

        // =====================================
        // Stars
        // =====================================

        if (
            this.isNight()
        ) {

            this.drawStars(ctx);
        }

        // =====================================
        // Sun
        // =====================================

        if (
            this.isDay()
        ) {

            this.drawSun(ctx);
        }

        // =====================================
        // Moon
        // =====================================

        else {

            this.drawMoon(ctx);
        }
    }

    // =========================================
    // Draw Sun
    // =========================================

    drawSun(ctx) {

        const timePercent =

            (this.currentTime - 6) / 12;

        const x =

            timePercent *
            this.game.canvas.width;

        const y =

            250 -

            Math.sin(
                timePercent * Math.PI
            ) * 180;

        // Glow
        const gradient =
            ctx.createRadialGradient(

                x,
                y,
                10,

                x,
                y,
                80
            );

        gradient.addColorStop(
            0,
            "rgba(255,255,180,1)"
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,180,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            80,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Sun Core
        ctx.fillStyle =
            "#fff6a3";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            35,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Draw Moon
    // =========================================

    drawMoon(ctx) {

        const timePercent =

            ((this.currentTime + 6) % 24) /
            12;

        const x =

            timePercent *
            this.game.canvas.width;

        const y =

            220 -

            Math.sin(
                timePercent * Math.PI
            ) * 150;

        ctx.fillStyle =
            "#dde7ff";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            30,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Moon Phase Shadow
        ctx.fillStyle =
            "rgba(0,0,0,0.35)";

        ctx.beginPath();

        ctx.arc(

            x +
            this.moonPhase * 6,

            y,

            30,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }

    // =========================================
    // Stars
    // =========================================

    generateStars() {

        for (
            let i = 0;
            i < 200;
            i++
        ) {

            this.stars.push({

                x:
                    Math.random() * 1920,

                y:
                    Math.random() * 500,

                size:
                    Math.random() * 2 + 1,

                alpha:
                    Math.random()
            });
        }
    }

    // =========================================
    // Draw Stars
    // =========================================

    drawStars(ctx) {

        for (
            const star of
            this.stars
        ) {

            const twinkle =

                Math.sin(
                    performance.now() *
                    0.001 +
                    star.x
                ) * 0.5 + 0.5;

            ctx.fillStyle =

                `rgba(255,255,255,${
                    star.alpha * twinkle
                })`;

            ctx.beginPath();

            ctx.arc(

                star.x,

                star.y,

                star.size,

                0,

                Math.PI * 2
            );

            ctx.fill();
        }
    }

    // =========================================
    // Time String
    // =========================================

    getTimeString() {

        const hours =
            String(
                this.currentTime
            ).padStart(2, "0");

        const mins =
            String(
                this.minutes
            ).padStart(2, "0");

        return `${hours}:${mins}`;
    }

    // =========================================
    // Day Or Night
    // =========================================

    isDay() {

        return (

            this.currentTime >=
            this.sunriseTime &&

            this.currentTime <
            this.sunsetTime
        );
    }

    isNight() {

        return !this.isDay();
    }

    // =========================================
    // Moon Phase
    // =========================================

    nextMoonPhase() {

        this.moonPhase++;

        if (
            this.moonPhase > 7
        ) {

            this.moonPhase = 0;
        }
    }

    // =========================================
    // Events
    // =========================================

    addEvent(event) {

        this.events.push(event);
    }

    checkEvents() {

        for (
            const event of
            this.events
        ) {

            if (

                event.hour ===
                this.currentTime &&

                event.minute ===
                this.minutes
            ) {

                event.callback?.();
            }
        }
    }

    // =========================================
    // Color Interpolation
    // =========================================

    interpolateColor(
        color1,
        color2,
        factor
    ) {

        const c1 =
            this.hexToRgb(color1);

        const c2 =
            this.hexToRgb(color2);

        const r = Math.round(

            c1.r +

            (c2.r - c1.r) *
            factor
        );

        const g = Math.round(

            c1.g +

            (c2.g - c1.g) *
            factor
        );

        const b = Math.round(

            c1.b +

            (c2.b - c1.b) *
            factor
        );

        return `rgb(${r},${g},${b})`;
    }

    // =========================================
    // Hex To RGB
    // =========================================

    hexToRgb(hex) {

        const result =
            /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
            .exec(hex);

        return result
            ? {

                r:
                    parseInt(
                        result[1],
                        16
                    ),

                g:
                    parseInt(
                        result[2],
                        16
                    ),

                b:
                    parseInt(
                        result[3],
                        16
                    )
            }
            : {

                r: 255,

                g: 255,

                b: 255
            };
    }

    // =========================================
    // Skip Time
    // =========================================

    skipHours(hours) {

        this.currentTime += hours;

        while (
            this.currentTime >= 24
        ) {

            this.currentTime -= 24;

            this.day++;
        }

        this.updateLighting();
    }

    // =========================================
    // Set Weather Influence
    // =========================================

    setWeatherMultiplier(value) {

        this.weatherMultiplier =
            value;
    }
}