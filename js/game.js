var config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {
    this.load.image('trex', 'assets/images/clicker/trex.png');
    this.load.image('velociraptor', 'assets/images/clicker/velociraptor.png');
    this.load.image('dinobird', 'assets/images/clicker/dinobird.png');
    this.load.image('chickensaur', 'assets/images/clicker/chickensaur.png');
    this.load.image('chicken', 'assets/images/clicker/chicken.png');

    this.load.image('forest-front', 'assets/images/backgrounds/parallax/battleback1-1.png');
    this.load.image('forest-back', 'assets/images/backgrounds/parallax/battleback1-2.png');
}

var trexClicker;
function create () {
    this.bg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "forest-front");
    this.bg1.setOrigin(0, 0);
    this.bg1.setScrollFactor(0);
    // this.bg1.setScale(0.73,1);
    
    this.bg2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "forest-back");
    this.bg2.setOrigin(0, 0);
    this.bg2.setScrollFactor(0);
    // this.bg2.setScale(0.73,1);
    
    trexClicker = this.add.sprite(550, 300, 'trex');
    trexClicker.setOrigin(0.5, 0.5);

    // background = this.add.group();
    // backgroundImages = ['forest-front', 'forest-back'];
    // backgroundImages.forEach(function (image) {
    //     var bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, image, '', background);
    //     bg.tileScale.setTo(4,4);
    // });
}

function update () {
    const style = { color: "#ffffff" };
    this.add.text(trexClicker.x - trexClicker.displayWidth/2, trexClicker.y + trexClicker.displayWidth/2, 'Make some eggs!', style);
}
