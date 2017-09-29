// JW PROJECT

const kPlayerSpeed = 200;
const kPlayerBulletSpeed = 200;
const kAsteroidSpeed = 100;
const kAsteroidSpawnTime = 2.0;
const kPlayerFireTime = 0.3;
const kAsteroidScore = 20;
const kInvulnerabilityTime = 2.0;


var mainGameState = { }
    
mainGameState.preload = function() { 
    game.load.image("space-bg", "assets/images/zelda_bg.jpg");
    game.load.image("player-ship", "assets/images/link_withsword.png");
    game.load.image("player-bullet", "assets/images/player-bullet.png");
    game.load.image("asteroid-medium-01", "assets/images/red_chucchu.png");

    game.load.audio('player_fire_01', 'assets/audio/player_fire_01.mp3');
    game.load.audio('player_fire_02', 'assets/audio/player_fire_02.mp3');
    game.load.audio('player_fire_03', 'assets/audio/player_fire_03.mp3');
    game.load.audio('player_fire_04', 'assets/audio/player_fire_04.mp3');
    game.load.audio('player_fire_05', 'assets/audio/player_fire_05.mp3');
    game.load.audio('player_fire_06', 'assets/audio/player_fire_06.mp3');        
}
    
mainGameState.create = function() { 
    game.add.sprite(0, 0, "space-bg");

    var shipX = game.width * 0.5;
    var shipY = game.height * 0.9;

    this.playerShip = game.add.sprite(shipX, shipY, 'player-ship');
    this.playerShip.anchor.setTo(0.5, 0.5);

    this.asteroidTimer = kAsteroidSpawnTime;
    this.asteroids = [];        

    this.playerBulletTimer = kPlayerFireTime;
    this.playerBullets = [];

    this.cursors = game.input.keyboard.createCursorKeys();
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(this.playerShip);

    this.playerShip.body.immovable = true;   

    this.playerFireSfx = [];
    this.playerFireSfx.push(game.add.audio("player_fire_01"));
    this.playerFireSfx.push(game.add.audio("player_fire_02"));
    this.playerFireSfx.push(game.add.audio("player_fire_03"));
    this.playerFireSfx.push(game.add.audio("player_fire_04"));
    this.playerFireSfx.push(game.add.audio("player_fire_05"));
    this.playerFireSfx.push(game.add.audio("player_fire_06"));        

    this.createUI();

    this.invulnerabilityTime = kInvulnerabilityTime;
    this.score = 0;      
    this.lives = 3;
}
    
 mainGameState.createUI = function() {
    var textStyle = {font: "16px Arial", fill: "#ffffff", align: "center"}

    this.scoreTitle = game.add.text(game.width * 0.85, 30, "SCORE", textStyle);
    this.scoreTitle.fixedToCamera = true;
    this.scoreTitle.anchor.setTo(0.5, 0.5);

    this.scoreValue = game.add.text(game.width * 0.85, 60, "0", textStyle);
    this.scoreValue.fixedToCamera = true;
    this.scoreValue.anchor.setTo(0.5, 0.5);    

    this.livesTitle = game.add.text(game.width * 0.15, 30, "LIVES", textStyle);
    this.livesTitle.fixedToCamera = true;
    this.livesTitle.anchor.setTo(0.5, 0.5);

    this.livesValue = game.add.text(game.width * 0.15, 60, "0", textStyle);
    this.livesValue.fixedToCamera = true;
    this.livesValue.anchor.setTo(0.5, 0.5); 
}
    
mainGameState.update = function() { 
    console.log("Hello")
    
    this.handleUserInput();
    this.handleCollisions();
    this.updateAsteroids();
    this.updatePlayerBullets();
    this.updateUI();
    this.updateInvulnerability();

    if ( this.lives <= 0 ) {
        game.state.start("GameOver");
    }
}
    
mainGameState.render = function() {     
    game.debug.body(this.playerShip);
}
    
mainGameState.handleUserInput = function() {
    if ( this.cursors.left.isDown ) {
        this.playerShip.body.velocity.x = -kPlayerSpeed;
    } else if ( this.cursors.right.isDown ) {
        this.playerShip.body.velocity.x = kPlayerSpeed;
    } else {
        this.playerShip.body.velocity.x = 0;
    }

    if ( this.fireKey.isDown ) {
        this.firePlayerBullet();
    }
}
    
mainGameState.handleCollisions = function() {
    game.physics.arcade.collide(this.playerShip, this.asteroids, this.onPlayerAsteroidCollision, null, this);
    game.physics.arcade.collide(this.asteroids, this.playerBullets, this.onBulletAsteroidCollision, null, this);
}
    
mainGameState.spawnAsteroid = function() {
    var x = game.width * Math.random();
    var asteroid = game.add.sprite(x, 0, "asteroid-medium-01");
    asteroid.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(asteroid);
    asteroid.body.setCircle(40);
    asteroid.body.velocity.setTo(0, kAsteroidSpeed);
    asteroid.body.immovable = true;
    asteroid.health = 100;
    asteroid.body.angularVelocity = game.rnd.integerInRange(-100, 100);

    this.asteroids.push(asteroid);
}
    
mainGameState.updateAsteroids = function() {
    this.asteroidTimer -= game.time.physicsElapsed;

    if ( this.asteroidTimer < 0 ) {
        this.asteroidTimer = kAsteroidSpawnTime;
        this.spawnAsteroid();
    }

    for (i in this.asteroids) {
        var asteroid = this.asteroids[i];

        if ( asteroid.y > game.height + asteroid.height) {
            asteroid.destroy();
        }

        if ( asteroid.alive == false ) {
            this.asteroids.splice(i, 1);
        }
    }  
}
    
mainGameState.updatePlayerBullets = function() {
    if ( this.playerBulletTimer >= 0 ) {
        this.playerBulletTimer -= game.time.physicsElapsed;  
    }

    for (i in this.playerBullets) {
        var bullet = this.playerBullets[i];

        if ( bullet.y < 0 - bullet.height ) {
            bullet.destroy();
        }

        if ( bullet.alive == false ) {
            this.playerBullets.splice(i, 1);
        }
    }        
}
    
mainGameState.updateUI = function() {
    this.scoreValue.setText(this.score);
    this.livesValue.setText(this.lives);
},
    
mainGameState.updateInvulnerability = function() {
    if ( this.invulnerabilityTime > 0 ) {
        this.playerShip.alpha = 0.5;
        this.invulnerabilityTime -= game.time.physicsElapsed;

        if ( this.invulnerabilityTime < 0 ) {
            this.playerShip.alpha = 1.0;
        }
    }         
}

mainGameState.firePlayerBullet = function() {
    if ( this.playerBulletTimer < 0 ) {
        this.playerBulletTimer = kPlayerFireTime; 

        var bullet = game.add.sprite(this.playerShip.x, this.playerShip.y - 40, "player-bullet");
        bullet.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(bullet);
        bullet.body.velocity.setTo(0, -kPlayerBulletSpeed);
        this.playerBullets.push(bullet);

        var fireSfxIndex = Math.floor((Math.random() * 10000) % this.playerFireSfx.length);
        this.playerFireSfx[fireSfxIndex].play();
    }
}

mainGameState.onBulletAsteroidCollision = function(asteroid, bullet) {
    asteroid.damage(20);
    bullet.destroy();
    
    this.score += kAsteroidScore;
}

mainGameState.onPlayerAsteroidCollision = function(object1, object2) {
    object2.destroy(); 

    if ( this.invulnerabilityTime <= 0 ) {
        this.lives -= 1;
        this.invulnerabilityTime = kInvulnerabilityTime;
    }        
}