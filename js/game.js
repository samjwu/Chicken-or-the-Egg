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
    {name: 'Chicken', image: 'chicken'},
    {name: 'WINNER', image: 'blank'}
];

var producerData = [
    {name: 'T-Rex', image: 'trexP'},
    {name: 'Velociraptor', image: 'velociraptorP'},
    {name: 'Dinobird', image: 'dinobirdP'},
    {name: 'Chickensaur', image: 'chickensaurP'},
    {name: 'Chicken', image: 'chickenP'},
    {name: 'WINNER', image: 'blank'}
];

var playerWonGame = false;

var clickerIdx = 0;
var clicker;
var clickerPower = 1;

var timer = 0;

var babyPower = 1;
var buyCost = 10;
var buyBabyButton;
var babyText;
var babyImage;
var babyCostText;

var upgradeCost = 100;
var buyUpgradeButton;
var upgradeText;
var upgradeImage;
var upgradeCostText;

var eggCount = 0;
var eggCountText;

var eggsPerSecond = 0;
var eggsPerSecondText;

var totalEggs = 0;
var totalEggsText;
var totalEggsCountText;

var eggsSpent = 0;
var eggsSpentText;
var eggsSpentCountText;

var timesClicked = 0;
var timesClickedText;
var timesClickedCountText;

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

    timesClicked++;
}

function clickedBuyBaby() {
    if (eggCount > buyCost) {
        eggCount -= buyCost;
        buyCost *= 2;
        eggsPerSecond += babyPower;

        eggsSpent += buyCost;
    }
}

function clickedUpgrade() {
    if (playerWonGame) {
        return;
    }

    if (eggCount > upgradeCost) {
        eggCount -= upgradeCost;
        upgradeCost *= 10;
        clickerPower *= 10;
        babyPower *= 4;

        eggsSpent += upgradeCost;

        clickerIdx++;
        if (clickerIdx == 4) {
            playerWonGame = true;
        }
    }
}

function getScore() {
    eggCount = parseInt(localStorage.getItem('eggCount')) || 0;
    eggsPerSecond = parseInt(localStorage.getItem('eggsPerSecond')) || 0;

    timesClicked = parseInt(localStorage.getItem('timesClicked')) || 0;
    totalEggs = parseInt(localStorage.getItem('totalEggs')) || 0;
    eggsSpent = parseInt(localStorage.getItem('eggsSpent')) || 0;
}

function preload () {
    this.load.image('trex', 'assets/images/clicker/trex.png');
    this.load.image('velociraptor', 'assets/images/clicker/velociraptor.png');
    this.load.image('dinobird', 'assets/images/clicker/dinobird.png');
    this.load.image('chickensaur', 'assets/images/clicker/chickensaur.png');
    this.load.image('chicken', 'assets/images/clicker/chicken.png');

    this.load.image('blank', 'assets/images/producer/blank.png');
    this.load.image('trexP', 'assets/images/producer/trex.png');
    this.load.image('velociraptorP', 'assets/images/producer/velociraptor.png');
    this.load.image('dinobirdP', 'assets/images/producer/dinobird.png');
    this.load.image('chickensaurP', 'assets/images/producer/chickensaur.png');
    this.load.image('chickenP', 'assets/images/producer/chicken.png');

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

    buyBabyButton = this.add.sprite(upgradePanel.x, 150, 'blank').setInteractive({
        pixelPerfect: true
    });
    babyText = this.add.text(buyBabyButton.x, buyBabyButton.y - buyBabyButton.height/2 - 30, 'Buy Baby\n' + producerData[clickerIdx].name, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    babyImage = this.add.image(buyBabyButton.x, buyBabyButton.y, 'blank');
    babyCostText = this.add.text(buyBabyButton.x, buyBabyButton.y + buyBabyButton.height/2 + 20, 'Price: ' + buyCost, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    buyUpgradeButton = this.add.sprite(upgradePanel.x, 450, 'blank').setInteractive({
        pixelPerfect: true
    });
    upgradeText = this.add.text(buyUpgradeButton.x, buyUpgradeButton.y - buyUpgradeButton.height/2 - 30, '(D)Evolve to\n' + producerData[clickerIdx+1].name, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    upgradeImage = this.add.image(buyUpgradeButton.x, buyUpgradeButton.y, 'blank');
    upgradeCostText = this.add.text(buyUpgradeButton.x, buyUpgradeButton.y + buyUpgradeButton.height/2 + 20, 'Price: ' + upgradeCost, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    upgradeButtons.push(buyBabyButton);
    upgradeButtons.push(buyUpgradeButton);

    infoPanel = this.add.rectangle(game.config.width - 110, game.config.height/2, 200, game.config.height-20, eggShellColor);
    infoPanel.setStrokeStyle(5, 0x000000);
    this.add.text(infoPanel.x, 40, 'Seconds played\nthis session:', { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    playTime = this.add.text(infoPanel.x, 80, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    clicker = this.add.sprite(this.game.config.width/2, this.game.config.height/2, clickerData[clickerIdx].image).setInteractive({
        pixelPerfect: true
    });
    clicker.setScale(2);

    eggCountText = this.add.text(
        clicker.x - clicker.displayWidth/2, 10, 'Eggs: ' + formatEggCount(eggCount), 
        { fontSize: '20px', fill: '#ffffff' }
    );

    eggsPerSecondText = this.add.text(
        clicker.x - clicker.displayWidth/2, this.game.config.height - 30, 'Eggs Per Second: ' + formatEggCount(eggsPerSecond), 
        {fontSize: '20px', fill: '#ffffff' }
    );

    timesClickedText = this.add.text(
        infoPanel.x, 120, 'Times Clicked:', 
        { fontSize: '19px', fill: '#000000' }
    ).setOrigin(0.5);
    timesClickedCountText = this.add.text(infoPanel.x, 140, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    totalEggsText = this.add.text(
        infoPanel.x, 240, 'Total Eggs Made:', 
        { fontSize: '19px', fill: '#000000' }
    ).setOrigin(0.5);
    totalEggsCountText = this.add.text(infoPanel.x, 260, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    
    eggsSpentText = this.add.text(
        infoPanel.x, 180, 'Total Eggs Spent:', 
        { fontSize: '19px', fill: '#000000' }
    ).setOrigin(0.5);
    eggsSpentCountText = this.add.text(infoPanel.x, 200, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
      
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
    
    babyText.setText('Buy Baby\n' + producerData[clickerIdx].name);
    babyImage.setTexture(clickerData[clickerIdx].image);
    babyCostText.setText('Price: ' + buyCost);

    if (!playerWonGame) {
        upgradeText.setText('(D)Evolve to\n' + producerData[clickerIdx+1].name);
        upgradeCostText.setText('Price: ' + upgradeCost);
    } else {
        upgradeText.setText('EGGxcellent!\nEGGxtraordinary!\nEGGxquisite!');
        upgradeCostText.setText('YOU WIN!');
    }
    upgradeImage.setTexture(clickerData[clickerIdx+1].image);

    clicker.setTexture(clickerData[clickerIdx].image);

    eggCount += dt * eggsPerSecond;
    eggCountText.setText('Eggs: ' + formatEggCount(Math.round(eggCount)));

    eggsPerSecondText.setText('Eggs Per Second: ' + formatEggCount(Math.round(eggsPerSecond)));
    
    timesClickedCountText.setText(formatEggCount(timesClicked));
    totalEggs += dt * eggsPerSecond;
    totalEggsCountText.setText(formatEggCount(Math.round(totalEggs)));
    eggsSpentCountText.setText(formatEggCount(Math.round(eggsSpent)));
    
    localStorage.setItem('eggCount', eggCount);
    localStorage.setItem('eggsPerSecond', eggsPerSecond);
    
    localStorage.setItem('timesClicked', timesClicked);
    localStorage.setItem('totalEggs', totalEggs);
    localStorage.setItem('eggsSpent', eggsSpent);
    // TODO: total time played, prices, evolution stage

    clock = now;
}
