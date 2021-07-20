var config = {
    type: Phaser.AUTO,
    width: 800,
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

    this.load.image('forest-front', 'assets/images/backgrounds/parallax/battleback1-1.png');
    this.load.image('forest-back', 'assets/images/backgrounds/parallax/battleback1-2.png');
}

var trexClicker;
function create () {
    trexClicker = this.add.sprite(500, 290, 'trex');
    trexClicker.setOrigin(0.5, 0.5);

    background = this.add.group();
    backgroundImages = ['forest-front', 'forest-back'];
    // backgroundImages.forEach(function (image) {
    //     var bg = this.scene.add.tileSprite(0, 0, this.world.width, this.world.height, image, '', background);
    //     bg.tileScale.setTo(4,4);
    // });
}

function update () {
    const style = { color: "#ffffff" };
    this.add.text(trexClicker.x - trexClicker.displayWidth/2, trexClicker.y + trexClicker.displayWidth/2, 'Make some eggs!', style);
}
