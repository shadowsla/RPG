// =========================================
// Ultimate Tower RPG - multiplayer.js
// =========================================

// =========================================
// Multiplayer System
// =========================================

export class MultiplayerSystem {

    constructor(game) {

        this.game = game;

        // =====================================
        // Network
        // =====================================

        this.socket = null;

        this.connected = false;

        this.roomId = null;

        this.playerId = null;

        // =====================================
        // Players
        // =====================================

        this.players = {};

        this.localPlayer = null;

        // =====================================
        // Match Settings
        // =====================================

        this.maxPlayers = 4;

        this.gameMode = "co-op";

        this.isHost = false;

        // =====================================
        // Sync
        // =====================================

        this.syncRate = 1000 / 20;

        this.syncTimer = 0;

        // =====================================
        // Chat
        // =====================================

        this.chatMessages = [];

        this.maxChatMessages = 8;

        // =====================================
        // Ping
        // =====================================

        this.ping = 0;

        this.lastPingTime = 0;

        // =====================================
        // Ready State
        // =====================================

        this.readyPlayers = new Set();
    }

    // =========================================
    // Connect
    // =========================================

    connect(serverURL) {

        try {

            this.socket =
                new WebSocket(serverURL);

            // =================================
            // Open
            // =================================

            this.socket.onopen = () => {

                this.connected = true;

                console.log(
                    "Connected to server"
                );

                this.game.ui?.addNotification(

                    "Connected to Multiplayer Server",

                    "success"
                );

                this.send({

                    type: "join",

                    username:
                        this.game.player.name ||

                        "Player",

                    class:
                        this.game.player.class ||

                        "Warrior"
                });
            };

            // =================================
            // Message
            // =================================

            this.socket.onmessage =

                (event) => {

                    const data =
                        JSON.parse(
                            event.data
                        );

                    this.handleMessage(
                        data
                    );
                };

            // =================================
            // Close
            // =================================

            this.socket.onclose = () => {

                this.connected = false;

                console.log(
                    "Disconnected"
                );

                this.game.ui?.addNotification(

                    "Disconnected from server",

                    "danger"
                );
            };

            // =================================
            // Error
            // =================================

            this.socket.onerror =

                (error) => {

                    console.error(
                        "Socket Error:",
                        error
                    );
                };

        } catch(error) {

            console.error(
                "Failed to connect:",
                error
            );
        }
    }

    // =========================================
    // Disconnect
    // =========================================

    disconnect() {

        if (
            this.socket
        ) {

            this.socket.close();
        }

        this.connected = false;

        this.players = {};
    }

    // =========================================
    // Send
    // =========================================

    send(data) {

        if (

            !this.connected ||

            !this.socket
        ) {

            return;
        }

        this.socket.send(

            JSON.stringify(data)
        );
    }

    // =========================================
    // Handle Messages
    // =========================================

    handleMessage(data) {

        switch(data.type) {

            // =================================
            // Welcome
            // =================================

            case "welcome":

                this.playerId =
                    data.playerId;

                this.roomId =
                    data.roomId;

                this.isHost =
                    data.host;

                break;

            // =================================
            // Player Joined
            // =================================

            case "playerJoined":

                this.addPlayer(
                    data.player
                );

                break;

            // =================================
            // Player Left
            // =================================

            case "playerLeft":

                this.removePlayer(
                    data.playerId
                );

                break;

            // =================================
            // State Update
            // =================================

            case "playerUpdate":

                this.updatePlayer(
                    data.player
                );

                break;

            // =================================
            // Chat
            // =================================

            case "chat":

                this.receiveChat(
                    data
                );

                break;

            // =================================
            // Enemy Spawn
            // =================================

            case "enemySpawn":

                this.spawnEnemy(
                    data.enemy
                );

                break;

            // =================================
            // Enemy Damage
            // =================================

            case "enemyDamage":

                this.damageEnemy(
                    data
                );

                break;

            // =================================
            // Loot
            // =================================

            case "lootDrop":

                this.spawnLoot(
                    data.loot
                );

                break;

            // =================================
            // Ping
            // =================================

            case "pong":

                this.handlePong(
                    data
                );

                break;

            // =================================
            // Ready
            // =================================

            case "playerReady":

                this.readyPlayers.add(
                    data.playerId
                );

                break;
        }
    }

    // =========================================
    // Add Player
    // =========================================

    addPlayer(playerData) {

        this.players[
            playerData.id
        ] = {

            id:
                playerData.id,

            name:
                playerData.name,

            class:
                playerData.class,

            x:
                playerData.x || 0,

            y:
                playerData.y || 0,

            velocityX: 0,

            velocityY: 0,

            health:
                playerData.health || 100,

            maxHealth:
                playerData.maxHealth || 100,

            level:
                playerData.level || 1,

            direction: 1,

            animation: "idle",

            color:
                playerData.color ||

                "#66ccff",

            weapon:
                playerData.weapon ||

                "Sword",

            ping: 0
        };

        this.game.ui?.addNotification(

            `${playerData.name} joined the game`,

            "info"
        );
    }

    // =========================================
    // Remove Player
    // =========================================

    removePlayer(playerId) {

        const player =
            this.players[playerId];

        if (
            player
        ) {

            this.game.ui?.addNotification(

                `${player.name} left the game`,

                "danger"
            );
        }

        delete this.players[playerId];
    }

    // =========================================
    // Update Player
    // =========================================

    updatePlayer(playerData) {

        const player =
            this.players[playerData.id];

        if (
            !player
        ) {

            return;
        }

        // =====================================
        // Interpolation
        // =====================================

        player.targetX =
            playerData.x;

        player.targetY =
            playerData.y;

        player.health =
            playerData.health;

        player.animation =
            playerData.animation;

        player.direction =
            playerData.direction;

        player.level =
            playerData.level;
    }

    // =========================================
    // Update
    // =========================================

    update(deltaTime) {

        // =====================================
        // Sync Timer
        // =====================================

        this.syncTimer +=
            deltaTime * 1000;

        if (
            this.syncTimer >=
            this.syncRate
        ) {

            this.syncTimer = 0;

            this.syncPlayerState();
        }

        // =====================================
        // Interpolate Players
        // =====================================

        this.interpolatePlayers(
            deltaTime
        );

        // =====================================
        // Ping
        // =====================================

        this.updatePing();
    }

    // =========================================
    // Sync Player
    // =========================================

    syncPlayerState() {

        if (
            !this.connected
        ) {

            return;
        }

        const player =
            this.game.player;

        this.send({

            type: "playerUpdate",

            player: {

                x: player.x,

                y: player.y,

                velocityX:
                    player.velocityX,

                velocityY:
                    player.velocityY,

                health:
                    player.health,

                level:
                    player.level,

                direction:
                    player.direction,

                animation:
                    player.currentAnimation
            }
        });
    }

    // =========================================
    // Interpolation
    // =========================================

    interpolatePlayers(
        deltaTime
    ) {

        for (
            const player of
            Object.values(
                this.players
            )
        ) {

            if (
                player.targetX !==
                undefined
            ) {

                player.x +=

                    (player.targetX -
                    player.x) *

                    10 *

                    deltaTime;

                player.y +=

                    (player.targetY -
                    player.y) *

                    10 *

                    deltaTime;
            }
        }
    }

    // =========================================
    // Chat
    // =========================================

    sendChat(message) {

        if (
            !message.trim()
        ) {

            return;
        }

        this.send({

            type: "chat",

            message
        });
    }

    // =========================================
    // Receive Chat
    // =========================================

    receiveChat(data) {

        this.chatMessages.push({

            username:
                data.username,

            message:
                data.message,

            time:
                Date.now()
        });

        // Limit
        if (
            this.chatMessages.length >
            this.maxChatMessages
        ) {

            this.chatMessages.shift();
        }

        this.game.ui?.addNotification(

            `${data.username}: ${data.message}`,

            "info"
        );
    }

    // =========================================
    // Spawn Enemy
    // =========================================

    spawnEnemy(enemyData) {

        this.game.spawnEnemy?.(

            enemyData.type,

            enemyData.x,

            enemyData.y
        );
    }

    // =========================================
    // Damage Enemy
    // =========================================

    damageEnemy(data) {

        const enemy =
            this.game.enemies?.find(

                e => e.id === data.enemyId
            );

        if (
            enemy
        ) {

            enemy.takeDamage(
                data.damage
            );
        }
    }

    // =========================================
    // Spawn Loot
    // =========================================

    spawnLoot(lootData) {

        this.game.spawnLoot?.(

            lootData.x,

            lootData.y,

            lootData.item
        );
    }

    // =========================================
    // Ping
    // =========================================

    updatePing() {

        if (
            Date.now() -
            this.lastPingTime >
            2000
        ) {

            this.lastPingTime =
                Date.now();

            this.send({

                type: "ping",

                time:
                    this.lastPingTime
            });
        }
    }

    // =========================================
    // Pong
    // =========================================

    handlePong(data) {

        this.ping =

            Date.now() -
            data.time;
    }

    // =========================================
    // Create Room
    // =========================================

    createRoom(settings = {}) {

        this.send({

            type: "createRoom",

            settings: {

                maxPlayers:
                    settings.maxPlayers || 4,

                gameMode:
                    settings.gameMode || "co-op",

                hardcore:
                    settings.hardcore || false,

                endless:
                    settings.endless || false
            }
        });
    }

    // =========================================
    // Join Room
    // =========================================

    joinRoom(roomId) {

        this.send({

            type: "joinRoom",

            roomId
        });
    }

    // =========================================
    // Ready
    // =========================================

    setReady(state = true) {

        this.send({

            type: "ready",

            ready: state
        });
    }

    // =========================================
    // Attack Sync
    // =========================================

    syncAttack(attackData) {

        this.send({

            type: "attack",

            attack: attackData
        });
    }

    // =========================================
    // Ability Sync
    // =========================================

    syncAbility(abilityData) {

        this.send({

            type: "ability",

            ability: abilityData
        });
    }

    // =========================================
    // Revive Player
    // =========================================

    revivePlayer(playerId) {

        this.send({

            type: "revive",

            playerId
        });
    }

    // =========================================
    // Draw Players
    // =========================================

    draw(ctx) {

        for (
            const player of
            Object.values(
                this.players
            )
        ) {

            this.drawPlayer(
                ctx,
                player
            );
        }

        // =====================================
        // Draw Chat
        // =====================================

        this.drawChat(ctx);

        // =====================================
        // Draw Ping
        // =====================================

        this.drawPing(ctx);
    }

    // =========================================
    // Draw Player
    // =========================================

    drawPlayer(
        ctx,
        player
    ) {

        ctx.save();

        // =====================================
        // Body
        // =====================================

        ctx.fillStyle =
            player.color;

        ctx.fillRect(

            player.x,

            player.y,

            50,

            80
        );

        // =====================================
        // Health Bar
        // =====================================

        ctx.fillStyle =
            "#222222";

        ctx.fillRect(

            player.x,

            player.y - 20,

            60,

            8
        );

        ctx.fillStyle =
            "#33ff66";

        ctx.fillRect(

            player.x,

            player.y - 20,

            60 *

            (player.health /
            player.maxHealth),

            8
        );

        // =====================================
        // Name
        // =====================================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "18px Arial";

        ctx.fillText(

            player.name,

            player.x,

            player.y - 30
        );

        // =====================================
        // Level
        // =====================================

        ctx.fillStyle =
            "#ffcc33";

        ctx.fillText(

            `Lv.${player.level}`,

            player.x,

            player.y + 100
        );

        ctx.restore();
    }

    // =========================================
    // Draw Chat
    // =========================================

    drawChat(ctx) {

        ctx.save();

        let y = 850;

        for (
            const message of
            this.chatMessages
        ) {

            ctx.fillStyle =
                "rgba(0,0,0,0.7)";

            ctx.fillRect(
                20,
                y - 20,
                500,
                30
            );

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "18px Arial";

            ctx.fillText(

                `${message.username}: ${message.message}`,

                30,

                y
            );

            y -= 35;
        }

        ctx.restore();
    }

    // =========================================
    // Draw Ping
    // =========================================

    drawPing(ctx) {

        ctx.save();

        ctx.fillStyle =
            this.ping < 60
            ? "#33ff66"
            : this.ping < 120
            ? "#ffcc33"
            : "#ff3333";

        ctx.font =
            "20px Arial";

        ctx.fillText(

            `Ping: ${this.ping}ms`,

            700,

            30
        );

        ctx.restore();
    }
}
