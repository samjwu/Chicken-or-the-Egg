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

var clickerData = [
    {name: 'T-Rex', image: 'trex'},
    {name: 'Velociraptor', image: 'velociraptor'},
    {name: 'Dinobird', image: 'dinobird'},
    {name: 'Chickensaur', image: 'chickensaur'},
    {name: 'Chicken', image: 'chicken'}
];

var clickerIdx = 0;
var clicker;
var clickerPower = 1;
var babyPower = 1;

var timer = 0;

var buyCost = 10;
var upgradeCost = 100;

var eggCount = 0;
var eggCountText;

var totalEggs = 0;
var totalEggsText;
var totalEggsCountText;

var eggsPerSecond = 0;
var eggsPerSecondText;

var upgradeButtons = [];
var infoPanel;
var playTime;

var game = new Phaser.Game(config);

const eggShellColor = 0xf0ead6;
const upgradeColor = 0xffa500;

const formatEggCount = (eggs) => {
    return eggs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clickedClicker() {
    eggCount += clickerPower;
    totalEggs += clickerPower;
}

function clickedBuyBaby() {
    if (eggCount > buyCost) {

    }
}

function clickedUpgrade() {

}

function getScore() {
    eggCount = parseInt(localStorage.getItem('eggCount')) || 0;
    totalEggs = parseInt(localStorage.getItem('totalEggs')) || 0;
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
    
    this.bg2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "forest-back");
    this.bg2.setOrigin(0, 0);
    this.bg2.setScrollFactor(0);

    var upgradePanel = this.add.rectangle(110, game.config.height/2, 200, game.config.height-20, eggShellColor);
    upgradePanel.setStrokeStyle(5, 0x000000);

    var buyBabyButton = this.add.rectangle(upgradePanel.x, 150, 150, 150, upgradeColor);
    this.add.text(buyBabyButton.x, buyBabyButton.y - buyBabyButton.height/2 - 30, 'Buy Baby\n' + clickerData[clickerIdx].name, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    this.add.image(buyBabyButton.x, buyBabyButton.y, clickerData[clickerIdx].image);
    this.add.text(buyBabyButton.x, buyBabyButton.y + buyBabyButton.height/2 + 20, 'Price: ' + buyCost, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    var buyUpgradeButton = this.add.rectangle(upgradePanel.x, 450, 150, 150, upgradeColor);
    this.add.text(buyUpgradeButton.x, buyUpgradeButton.y - buyUpgradeButton.height/2 - 30, '(D)Evolve to\n' + clickerData[clickerIdx+1].name, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    this.add.image(buyUpgradeButton.x, buyUpgradeButton.y, clickerData[clickerIdx+1].image);
    this.add.text(buyUpgradeButton.x, buyUpgradeButton.y + buyUpgradeButton.height/2 + 20, 'Price: ' + upgradeCost, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    upgradeButtons.push(buyBabyButton);
    upgradeButtons.push(buyUpgradeButton);

    infoPanel = this.add.rectangle(game.config.width - 110, game.config.height/2, 200, game.config.height-20, eggShellColor);
    infoPanel.setStrokeStyle(5, 0x000000);
    this.add.text(infoPanel.x, 40, 'Seconds played\nthis session:', { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    playTime = this.add.text(infoPanel.x, 80, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    clicker = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'trex').setInteractive({
        pixelPerfect: true
    });
    clicker.setScale(2);

    eggCountText = this.add.text(
        clicker.x - clicker.displayWidth/2, 10, 'Eggs: ' + formatEggCount(eggCount), 
        { fontSize: '20px', fill: '#ffffff' }
    );

    totalEggsText = this.add.text(
        infoPanel.x, 120, 'Total Eggs Made:', 
        { fontSize: '19px', fill: '#000000' }
    ).setOrigin(0.5);
    totalEggsCountText = this.add.text(infoPanel.x, 140, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    
    eggsPerSecondText = this.add.text(
        clicker.x - clicker.displayWidth/2, this.game.config.height - 30, 'Eggs Per Second: ' + formatEggCount(eggsPerSecond), 
        {fontSize: '20px', fill: '#ffffff' }
    );
      
    buyBabyButton.on('pointerdown', clickedBuyBaby);
    buyUpgradeButton.on('pointerdown', clickedUpgrade)
    clicker.on('pointerdown', clickedClicker);
}

function update () {
    var promptText = this.add.text(clicker.x - clicker.displayWidth/2, clicker.y + clicker.displayHeight/2, 'Click to make some eggs!',
        {fontSize: '20px', fill: '#ffffff' }
    );

    var now = game.getTime();
    var dt = (now - clock) / 1000;
    timer += dt;
    playTime.setText(Math.round(timer));
    
    totalEggs += dt * eggsPerSecond;
    totalEggsCountText.setText(formatEggCount(Math.round(totalEggs)));

    eggCount += dt * eggsPerSecond;
    eggCountText.setText('Eggs: ' + formatEggCount(Math.round(eggCount)));
    
    localStorage.setItem('eggCount', eggCount);
    localStorage.setItem('totalEggs', totalEggs);
    localStorage.setItem('eggsPerSecond', eggsPerSecond);
    // TODO: total time played, eggs spent, times clicked

    clock = now;
}
