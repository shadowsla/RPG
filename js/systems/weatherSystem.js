// =========================================
// Ultimate Tower RPG - weatherSystem.js
// =========================================

// =========================================
// Weather System
// =========================================

export class WeatherSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Current Weather
        // =====================================

        this.currentWeather = "clear";

        this.weatherTimer = 0;

        this.weatherDuration = 90;

        // =====================================
        // Weather Types
        // =====================================

        this.weatherTypes = [

            "clear",

            "rain",

            "storm",

            "snow",

            "ash",

            "fog",

            "sandstorm",

            "bloodRain",

            "voidStorm",

            "meteorShower"
        ];

        // =====================================
        // Particles
        // =====================================

        this.particles = [];

        // =====================================
        // Wind
        // =====================================

        this.windForce = 0;

        // =====================================
        // Lightning
        // =====================================

        this.lightningTimer = 0;

        this.lightningFlash = 0;
    }

    // =========================================
    // Set Weather
    // =========================================

    setWeather(type) {

        this.currentWeather = type;

        this.weatherTimer = 0;

        this.particles = [];

        this.game.notifications.add(

            `Weather Changed: ${this.formatWeather(type)}`,

            "info"
        );

        // =====================================
        // Weather Effects
        // =====================================

        switch(type) {

            case "rain":

                this.windForce = 50;

                break;

            case "storm":

                this.windForce = 120;

                break;

            case "snow":

                this.windForce = 20;

                break;

            case "ash":

                this.windForce = 40;

                break;

            case "fog":

                this.windForce = 10;

                break;

            case "sandstorm":

                this.windForce = 180;

                break;

            case "bloodRain":

                this.windForce = 70;

                break;

            case "voidStorm":

                this.windForce = 250;

                break;

            case "meteorShower":

                this.windForce = 100;

                break;

            default:

                this.windForce = 0;
        }
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        this.weatherTimer +=
            deltaTime;

        // =====================================
        // Auto Change Weather
        // =====================================

        if (
            this.weatherTimer >=
            this.weatherDuration
        ) {

            this.randomizeWeather();
        }

        // =====================================
        // Spawn Particles
        // =====================================

        this.spawnWeatherParticles();

        // =====================================
        // Update Particles
        // =====================================

        for (
            let i =
                this.particles.length - 1;
            i >= 0;
            i--
        ) {

            const particle =
                this.particles[i];

            particle.x +=
                particle.vx * deltaTime;

            particle.y +=
                particle.vy * deltaTime;

            particle.life -=
                deltaTime;

            // Remove
            if (

                particle.life <= 0 ||

                particle.y > 4000 ||

                particle.x < -500 ||

                particle.x > 12000
            ) {

                this.particles.splice(
                    i,
                    1
                );
            }
        }

        // =====================================
        // Apply Wind
        // =====================================

        this.applyWind(deltaTime);

        // =====================================
        // Lightning
        // =====================================

        if (
            this.currentWeather === "storm" ||

            this.currentWeather === "voidStorm"
        ) {

            this.updateLightning(
                deltaTime
            );
        }

        // =====================================
        // Weather Effects
        // =====================================

        this.applyWeatherEffects(
            deltaTime
        );
    }

    // =========================================
    // Random Weather
    // =========================================

    randomizeWeather() {

        const weather =

            this.weatherTypes[
                Math.floor(
                    Math.random() *
                    this.weatherTypes.length
                )
            ];

        this.setWeather(weather);
    }

    // =========================================
    // Spawn Particles
    // =========================================

    spawnWeatherParticles() {

        let spawnCount = 0;

        switch(this.currentWeather) {

            case "rain":
                spawnCount = 12;
                break;

            case "storm":
                spawnCount = 20;
                break;

            case "snow":
                spawnCount = 8;
                break;

            case "ash":
                spawnCount = 10;
                break;

            case "fog":
                spawnCount = 4;
                break;

            case "sandstorm":
                spawnCount = 25;
                break;

            case "bloodRain":
                spawnCount = 15;
                break;

            case "voidStorm":
                spawnCount = 30;
                break;

            case "meteorShower":
                spawnCount = 5;
                break;
        }

        for (
            let i = 0;
            i < spawnCount;
            i++
        ) {

            this.spawnParticle();
        }
    }

    // =========================================
    // Spawn Particle
    // =========================================

    spawnParticle() {

        const particle = {

            x:
                Math.random() * 11000,

            y: -50,

            vx:
                this.windForce *
                0.5,

            vy:
                200 +
                Math.random() * 600,

            size:
                2 +
                Math.random() * 6,

            life:
                4 +
                Math.random() * 3,

            color:
                this.getParticleColor()
        };

        // Snow
        if (
            this.currentWeather === "snow"
        ) {

            particle.vy =

                60 +
                Math.random() * 80;

            particle.vx +=

                Math.sin(Date.now()) * 20;
        }

        // Fog
        if (
            this.currentWeather === "fog"
        ) {

            particle.vy = 0;

            particle.size =

                40 +
                Math.random() * 120;

            particle.life = 10;
        }

        // Meteor
        if (
            this.currentWeather ===
            "meteorShower"
        ) {

            particle.vx =

                -300 +
                Math.random() * 100;

            particle.vy =

                800 +
                Math.random() * 300;

            particle.size =

                10 +
                Math.random() * 20;
        }

        this.particles.push(
            particle
        );
    }

    // =========================================
    // Particle Color
    // =========================================

    getParticleColor() {

        switch(this.currentWeather) {

            case "rain":
                return "#66aaff";

            case "storm":
                return "#88ccff";

            case "snow":
                return "#ffffff";

            case "ash":
                return "#777777";

            case "fog":
                return "rgba(220,220,220,0.1)";

            case "sandstorm":
                return "#d2b48c";

            case "bloodRain":
                return "#cc0000";

            case "voidStorm":
                return "#7700ff";

            case "meteorShower":
                return "#ff6600";

            default:
                return "#ffffff";
        }
    }

    // =========================================
    // Wind
    // =========================================

    applyWind(deltaTime) {

        const player =
            this.game.player;

        if (
            !player
        ) {

            return;
        }

        player.vx +=

            this.windForce *

            0.01 *

            deltaTime;

        // Clamp
        if (
            player.vx > 800
        ) {

            player.vx = 800;
        }

        if (
            player.vx < -800
        ) {

            player.vx = -800;
        }
    }

    // =========================================
    // Lightning
    // =========================================

    updateLightning(deltaTime) {

        this.lightningTimer +=
            deltaTime;

        this.lightningFlash -=
            deltaTime;

        if (
            Math.random() > 0.985
        ) {

            this.triggerLightning();
        }
    }

    // =========================================
    // Trigger Lightning
    // =========================================

    triggerLightning() {

        this.lightningFlash = 0.15;

        this.game.screenEffects
            .flash("#ffffff");

        this.game.camera.shake(
            8,
            0.2
        );

        // Random Lightning Strike
        if (
            Math.random() > 0.6
        ) {

            const strikeX =

                Math.random() * 10000;

            // Damage Nearby
            for (
                const enemy of
                this.game.enemies
            ) {

                const distance =

                    Math.abs(
                        enemy.x - strikeX
                    );

                if (
                    distance < 200
                ) {

                    enemy.health -= 80;
                }
            }
        }
    }

    // =========================================
    // Weather Effects
    // =========================================

    applyWeatherEffects(deltaTime) {

        const player =
            this.game.player;

        switch(this.currentWeather) {

            // =================================
            // Rain
            // =================================

            case "rain":

                player.friction = 0.92;

                break;

            // =================================
            // Snow
            // =================================

            case "snow":

                player.friction = 0.96;

                break;

            // =================================
            // Sandstorm
            // =================================

            case "sandstorm":

                player.stamina -=

                    5 * deltaTime;

                break;

            // =================================
            // Blood Rain
            // =================================

            case "bloodRain":

                this.game.enemies.forEach(

                    enemy => {

                        enemy.damage *=
                            1.0005;
                    }
                );

                break;

            // =================================
            // Void Storm
            // =================================

            case "voidStorm":

                player.mana -=

                    8 * deltaTime;

                break;
        }
    }

    // =========================================
    // Draw
    // =========================================

    draw(ctx) {

        // =====================================
        // Lightning Flash
        // =====================================

        if (
            this.lightningFlash > 0
        ) {

            ctx.save();

            ctx.globalAlpha =
                this.lightningFlash;

            ctx.fillStyle =
                "#ffffff";

            ctx.fillRect(

                0,
                0,

                ctx.canvas.width,

                ctx.canvas.height
            );

            ctx.restore();
        }

        // =====================================
        // Draw Particles
        // =====================================

        ctx.save();

        for (
            const particle of
            this.particles
        ) {

            ctx.globalAlpha =

                Math.max(
                    0,
                    particle.life / 5
                );

            ctx.fillStyle =
                particle.color;

            // =================================
            // Rain
            // =================================

            if (

                this.currentWeather === "rain" ||

                this.currentWeather === "storm" ||

                this.currentWeather === "bloodRain"
            ) {

                ctx.fillRect(

                    particle.x,

                    particle.y,

                    2,

                    particle.size * 4
                );
            }

            // =================================
            // Snow / Ash
            // =================================

            else if (

                this.currentWeather === "snow" ||

                this.currentWeather === "ash" ||

                this.currentWeather === "sandstorm"
            ) {

                ctx.beginPath();

                ctx.arc(

                    particle.x,

                    particle.y,

                    particle.size,

                    0,

                    Math.PI * 2
                );

                ctx.fill();
            }

            // =================================
            // Fog
            // =================================

            else if (
                this.currentWeather === "fog"
            ) {

                ctx.beginPath();

                ctx.arc(

                    particle.x,

                    particle.y,

                    particle.size,

                    0,

                    Math.PI * 2
                );

                ctx.fill();
            }

            // =================================
            // Meteors
            // =================================

            else if (
                this.currentWeather ===
                "meteorShower"
            ) {

                ctx.fillStyle =
                    "#ff6600";

                ctx.fillRect(

                    particle.x,

                    particle.y,

                    particle.size,

                    particle.size * 2
                );

                // Trail
                ctx.globalAlpha *= 0.5;

                ctx.fillRect(

                    particle.x + 10,

                    particle.y - 40,

                    particle.size * 0.5,

                    40
                );
            }

            // =================================
            // Void Storm
            // =================================

            else if (
                this.currentWeather ===
                "voidStorm"
            ) {

                ctx.beginPath();

                ctx.arc(

                    particle.x,

                    particle.y,

                    particle.size,

                    0,

                    Math.PI * 2
                );

                ctx.fill();

                ctx.strokeStyle =
                    "#ffffff";

                ctx.stroke();
            }
        }

        ctx.restore();

        // =====================================
        // Weather UI
        // =====================================

        ctx.save();

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "20px Arial";

        ctx.fillText(

            `Weather: ${this.formatWeather(this.currentWeather)}`,

            20,

            350
        );

        ctx.restore();
    }

    // =========================================
    // Format Weather
    // =========================================

    formatWeather(weather) {

        return weather

            .replace(
                /([A-Z])/g,
                " $1"
            )

            .replace(/^./, c =>
                c.toUpperCase()
            );
    }
}
