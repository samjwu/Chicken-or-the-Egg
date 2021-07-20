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

function create () {
    var trexClicker = this.add.sprite(450, 290, 'trex');
    trexClicker.setOrigin(0.5, 0.5);
}

function update () {
    var textConfig = {
        x: 0,
        y: 0,
        text: 'Make some eggs!',
        style: {
            color: "#ffffff"
        }
    };
    // this.add.text(textConfig);
    const style = { color: "#ffffff" };
    this.add.text(0, 0, 'Make some eggs!', style);
}
