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
}

var trexClicker;
function create () {
    trexClicker = this.add.sprite(450, 290, 'trex');
    trexClicker.setOrigin(0.5, 0.5);
}

function update () {
    const style = { color: "#ffffff" };
    this.add.text(trexClicker.x - trexClicker.displayWidth/2, trexClicker.y + trexClicker.displayWidth/2, 'Make some eggs!', style);
}
