gameOverState = { }
    
gameOverState.preload = function() { 
game.load.image("sad_zelda", "assets/images/sad_zelda.jpg");  
    
}

gameOverState.create = function() { 
 
    
    game.add.sprite(0, 0, "sad_zelda");

    var textStyle = {font: "20px Palatino Linotype", fill: "#ffffff", align: "center"}

    this.title = game.add.text(game.width * 0.22, game.height * 0.2, "GAME OVER", textStyle);
    this.title.fixedToCamera = true;
    this.title.anchor.setTo(0.5, 0.5);  
    
    var scoreTitle = game.add.text(game.width * 0.22, game.height * 0.3, "Your Score", textStyle);
    scoreTitle.anchor.setTo(0.5, 0.5);

    var scoreValue = game.add.text(game.width * 0.22, game.height * 0.35, game.global.score, textStyle);
    scoreValue.anchor.setTo(0.5, 0.5);

    this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
}
    
gameOverState.update = function() { 
    if (this.restartKey.isDown) {
        game.state.start("MainGame");
    }
}
