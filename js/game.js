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

var clicker = null;
var clickerPower = 1;

var timer;

var eggCount = 0;
var eggCountText = null;

var eggsPerSecond = 0;
var eggsPerSecondText = null;

var game = new Phaser.Game(config);

const eggShellColor = 0xf0ead6;

const formatEggCount = (eggs) => {
    return eggs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clickedClicker() {
    eggCount += clickerPower;
}

function getScore() {
    eggCount = parseInt(localStorage.getItem('eggCount')) || 0;
    eggsPerSecond = parseInt(localStorage.getItem('eggsPerSecond')) || 0;
}

function preload () {
    this.load.image('trex', 'assets/images/clicker/trex.png');
    this.load.image('velociraptor', 'assets/images/clicker/velociraptor.png');
    this.load.image('dinobird', 'assets/images/clicker/dinobird.png');
    this.load.image('chickensaur', 'assets/images/clicker/chickensaur.png');
    this.load.image('chicken', 'assets/images/clicker/chicken.png');

    this.load.image('forest-front', 'assets/images/backgrounds/parallax/battleback1-1.png');
    this.load.image('forest-back', 'assets/images/backgrounds/parallax/battleback1-2.png');
}

function create () {
    getScore();

    clock = game.getTime();

    this.bg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "forest-front");
    this.bg1.setOrigin(0, 0);
    this.bg1.setScrollFactor(0);
    // this.bg1.setScale(0.73,1);
    
    this.bg2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "forest-back");
    this.bg2.setOrigin(0, 0);
    this.bg2.setScrollFactor(0);
    // this.bg2.setScale(0.73,1);

    var upgadePanel = this.add.rectangle(110, game.config.height/2, 200, game.config.height-20, eggShellColor);

    upgadePanel.setStrokeStyle(5, 0x000000);
    
    var clickerData = [
        {name: 'T-Rex', image: 'trex'},
        {name: 'Velociraptor', image: 'velociraptor'},
        {name: 'Dinobird', image: 'dinobird'},
        {name: 'Chickensaur', image: 'chickensaur'},
        {name: 'Chicken', image: 'chicken'}
    ];

    clicker = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'trex').setInteractive({
        pixelPerfect: true
    });

    eggCountText = this.add.text(
        clicker.x - clicker.displayWidth/2, 0, 'Eggs: ' + formatEggCount(eggCount), 
        { fontSize: '20px', fill: '#ffffff' }
    );
    
    eggsPerSecondText = this.add.text(
        clicker.x - clicker.displayWidth/2, eggCountText.displayHeight, 'Eggs Per Second: ' + formatEggCount(eggsPerSecond), 
        {fontSize: '20px', fill: '#ffffff' }
    );
      
    clicker.on('pointerdown', clickedClicker);
}

function update () {
    var promptText = this.add.text(clicker.x - clicker.displayWidth/2, clicker.y + clicker.displayHeight/2, 'Make some eggs!',
        {fontSize: '20px', fill: '#ffffff' }
    );

    var now = game.getTime();
    var dt = (now - clock) / 1000;
    
    eggCount += dt * eggsPerSecond;
    eggCountText.setText('Eggs: ' + formatEggCount(Math.round(eggCount)));
    localStorage.setItem('eggCount', eggCount);
    localStorage.setItem('eggsPerSecond', eggsPerSecond);

    clock = now;
}
