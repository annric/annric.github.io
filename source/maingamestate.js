var mainGameState = { } 

mainGameState.preload = function() {
    console.log("Pre-loading the game!");
    
    game.load.image("space-bg", "assets/images/zelda_bg.jpg");
    game.load.image("player-ship", "assets/images/link_withsword.png");
    game.load.image("asteroid-medium-01", "assets/images/red_chuchu.png"); 
    game.load.image("asteroid-medium-02", "assets/images/green_chuchu.png");
    game.load.image("player-bullet", "assets/images/bullet-plasma.png");
    game.load.image("spirit", "assets/images/spirit_blue.png");

    game.load.audio("game-music", "assets/music/02-overworld.mp3"); 
    game.load.audio("gameover-music", "assets/music/AOL_Flute.wav");
    
    game.load.audio('player_fire_01', 'assets/audio/LOZ_Sword_Shoot.wav');
    game.load.audio('player_fire_02', 'assets/audio/player_fire_02.mp3');
    game.load.audio('player_fire_03', 'assets/audio/player_fire_03.mp3');
    game.load.audio('player_fire_04', 'assets/audio/player_fire_04.mp3');
    game.load.audio('player_fire_05', 'assets/audio/player_fire_05.mp3');
    game.load.audio('player_fire_06', 'assets/audio/player_fire_06.mp3');    
}

mainGameState.create = function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, "space-bg");

    var shipX = game.width * 0.5;
    var shipY = game.height * 0.955;

    this.cursors = game.input.keyboard.createCursorKeys();        

    this.playerShip = game.add.sprite(shipX, shipY, 'player-ship');
    this.playerShip.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.playerShip);
    this.playerShip.body.immovable = true;
    
    this.music = game.add.audio("game-music");
    this.music.play();
    this.music.volume = 0.9;
    this.music.loopFull();     
    
    this.asteroidTimer = 2.0;   
    this.asteroids = game.add.group();   

    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);    
    this.playerBullets = game.add.group();
    this.fireTimer = 0.4;
    
    this.playerFireSfx = [];
    this.playerFireSfx.push(game.add.audio("player_fire_01"));
/*
    this.playerFireSfx.push(game.add.audio("player_fire_02"));
    this.playerFireSfx.push(game.add.audio("player_fire_03"));
    this.playerFireSfx.push(game.add.audio("player_fire_04"));
    this.playerFireSfx.push(game.add.audio("player_fire_05"));
    this.playerFireSfx.push(game.add.audio("player_fire_06"));    */
    
    var textStyle = {font: "14px Arial", fill: "#ccddff", align: "center"}

    this.scoreTitle = game.add.text(game.width * 0.75, 10, "SCORE", textStyle);
    this.scoreTitle.fixedToCamera = true;
    this.scoreTitle.anchor.setTo(0.5, 0.5);

    this.scoreValue = game.add.text(game.width * 0.75, 30, "0", textStyle);
    this.scoreValue.fixedToCamera = true;
    this.scoreValue.anchor.setTo(0.5, 0.5);

    this.playerScore = 0;    
    
    this.livesTitle = game.add.text(game.width * 0.25, 10, "LIVES", textStyle);
    this.livesTitle.fixedToCamera = true;
    this.livesTitle.anchor.setTo(0.5, 0.5);

    this.livesValue = game.add.text(game.width * 0.25, 30, "0", textStyle);
    this.livesValue.fixedToCamera = true;
    this.livesValue.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(this.playerShip);

    this.lives = 3;
    
    //NYYY SPIRITS
    this.spiritTimer = 8.0;   
    this.spirit = game.add.group(); 
}

mainGameState.update = function() {
    if ( this.cursors.left.isDown ) {
        this.playerShip.body.velocity.x = -200;
    } else if ( this.cursors.right.isDown ) {
        this.playerShip.body.velocity.x = 300;
    } else {
        this.playerShip.body.velocity.x = 0;
    }
    
    this.asteroidTimer -= game.time.physicsElapsed;

    if ( this.asteroidTimer <= 0.0 ) {
        this.spawnAsteroid();
        this.asteroidTimer = 2.0;
    }    
        
    // Clean up any asteroids that have moved off the bottom of the screen
    for( var i = 0; i < this.asteroids.children.length; i++ ) {
        if ( this.asteroids.children[i].y > (game.height + 200) ) {
            this.asteroids.children[i].destroy();
        }
    }  
    
    if ( this.fireKey.isDown ) {
        this.spawnPlayerBullet();
    }        
    
    if ( this.fireTimer >= 0 ) {
        this.fireTimer -= game.time.physicsElapsed;
    }       
    
    for (var i = 0; i < this.playerBullets.children.length; i++) {
        if ( this.playerBullets.children[i].y < -200 ) {
            this.playerBullets.children[i].destroy();
        }
    }
    
    game.physics.arcade.collide(this.asteroids, this.playerBullets, this.onAsteroidBulletCollision, null, this);   
    game.physics.arcade.collide(this.playerShip, this.asteroids, this.onPlayerAsteroidCollision, null, this);
    
//Collision - För Spirits
    game.physics.arcade.collide(this.playerShip, this.spirit, this.onPlayerSpiritCollision, null, this);

//Collisions - Om man skjuter Spirit    
    game.physics.arcade.collide(this.playerBullets, this.spirit, this.onFireSpiritCollision, null, this);
    
//Men detta tillhör ovan
    this.scoreValue.setText(this.playerScore);    
    this.livesValue.setText(this.lives);   
    
    if ( this.lives <= 0 ) {
        game.state.start("GameOver");
    }    
 
    
//FÖR att Spawna SPIRIT - NU
    
    this.spiritTimer -= game.time.physicsElapsed;

    if ( this.spiritTimer <= 0.0 ) {
        this.spawnSpirit();
        this.spiritTimer = 25.0;
    }    
        
    // Clean up any spirits that have moved off the bottom of the screen
    for( var i = 0; i < this.spirit.children.length; i++ ) {
        if ( this.spirit.children[i].y > (game.height + 200) ) {
            this.spirit.children[i].destroy();
        }
    }  
 
}

mainGameState.spawnPlayerBullet = function() {
    if ( this.fireTimer < 0 ) {
        this.fireTimer = 0.4;

        var bullet = game.add.sprite(this.playerShip.x, this.playerShip.y, "player-bullet");
        bullet.anchor.setTo(-0.308, 0.9);

        game.physics.arcade.enable(bullet);
        bullet.body.velocity.setTo(0, -200);

        this.playerBullets.add(bullet);
        
        var index = game.rnd.integerInRange(0, this.playerFireSfx.length - 1);
        this.playerFireSfx[index].play();        
    }
}

mainGameState.spawnAsteroid = function() {
    var chuchus = [
        "asteroid-medium-01","asteroid-medium-02"
    ]
    var whichChuchu = game.rnd.integerInRange(0, chuchus.length - 1);
    
    // Setup and create our asteroid
    var x = game.rnd.integerInRange(0, game.width);
    var asteroid = game.add.sprite(x, 0, chuchus[whichChuchu]);
    asteroid.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(asteroid);
    asteroid.body.velocity.setTo(0, 150);

    // Add to the 'asteroids' group
    this.asteroids.add(asteroid);
}

mainGameState.onAsteroidBulletCollision = function(object1, object2) {
    object1.pendingDestroy = true;
    object2.pendingDestroy = true;
    
    this.playerScore += 50;    
}

mainGameState.onPlayerAsteroidCollision = function(object1, object2) {
    if ( object1.key.includes("asteroid") ) {
        object1.pendingDestroy = true;
    } else {
        object2.pendingDestroy = true;
    }

    this.lives -= 1;
}

//Lade till NU!!! 

mainGameState.spawnSpirit= function() {
    // Setup and create our spirit
    var x = game.rnd.integerInRange(0, game.width);
    var spirit = game.add.sprite(x, 0, "spirit");
    spirit.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(spirit);
    spirit.body.velocity.setTo(0, 400);

    // Add to the 'spirit' group
    this.spirit.add(spirit);    
}

mainGameState.onPlayerSpiritCollision = function(object1, object2) {
    if ( object1.key.includes("spirit") ) {
        object1.pendingDestroy = true;
    } else {
        object2.pendingDestroy = true;
    }
      
        if ( this.lives <= 2 ) {
        this.lives += 1;
    }   

}

mainGameState.onFireSpiritCollision = function(object1, object2) {
    if ( object1.key.includes("spirit") ) {
        object1.pendingDestroy = true;
    } else {
        object2.pendingDestroy = true;
    }
        this.lives -= 1;
    }   
