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

var backgroundData = [
    {name: 'Green Forest Front', image: 'green-forest-front'},
    {name: 'Green Forest Back', image: 'green-forest-back'},
    {name: 'Yellow Forest Front', image: 'yellow-forest-front'},
    {name: 'Yellow Forest Back', image: 'yellow-forest-back'},
    {name: 'Red Forest Front', image: 'red-forest-front'},
    {name: 'Red Forest Back', image: 'red-forest-back'},
    {name: 'Ice Front', image: 'ice-front'},
    {name: 'Ice Back', image: 'ice-back'},
    {name: 'Farm Front', image: 'farm-front'},
    {name: 'Farm Back', image: 'farm-back'},
];

var clickerData = [
    {name: 'T-Rex', image: 'trex'},
    {name: 'Velociraptor', image: 'velociraptor'},
    {name: 'Dinobird', image: 'dinobird'},
    {name: 'Chickensaur', image: 'chickensaur'},
    {name: 'Chicken', image: 'chicken'}
];

var producerData = [
    {name: 'T-Rex', image: 'trexP'},
    {name: 'Velociraptor', image: 'velociraptorP'},
    {name: 'Dinobird', image: 'dinobirdP'},
    {name: 'Chickensaur', image: 'chickensaurP'},
    {name: 'Chicken', image: 'chickenP'},
    {name: 'WINNER', image: 'winner'}
];

var musicData = [
    {name: 'egg lsadsdlasd', song: 'egg_lsadsdlasd'},
    {name: 'Spelunky 2 - Egg radio', song: 'spelunky2_egg_radio'},
    {name: 'The hidden egg', song: 'the_hidden_egg'},
    {name: 'Little Nest Egg', song: 'little_nest_egg'},
    {name: 'The Song of Egg', song: 'the_song_of_egg'}
];

var sfxData = [
    {name: 'T-Rex Roar', sound: 'trex_roar'},
    {name: 'Velociraptor Roar', sound: 'velociraptor_roar'},
    {name: 'Dinobird Roar', sound: 'dinobird_roar'},
    {name: 'Chickensaur Roar', sound: 'chickensaur_roar'},
    {name: 'Chicken Roar', sound: 'chicken_roar'},
    {name: 'Chicken Man', sound: 'chicken_man'}
];

var playerWonGame = false;

var timer = 0;

var backgroundImage;
var foregroundImage;

var clickerIdx = 0;
var clicker;
var clickerPower = 1;

var babyPower = 1;
var babyCost = 10;
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
    if (eggCount > babyCost) {
        eggCount -= babyCost;
        babyCost *= 2;
        eggsPerSecond += babyPower;

        eggsSpent += babyCost;
    }
}

function clickedUpgrade() {
    if (playerWonGame == true) {
        playerWonGame = true;
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

function getStoredValues() {
    playerWonGame = localStorage.getItem('isWinner') || false;

    timer = parseInt(localStorage.getItem('totalTimePlayed')) || 0;

    clickerIdx = parseInt(localStorage.getItem('clickerIdx')) || 0;
    clickerPower = parseInt(localStorage.getItem('clickerPower')) || 1;

    babyPower = parseInt(localStorage.getItem('babyPower')) || 1;
    babyCost = parseInt(localStorage.getItem('babyCost')) || 10;

    upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 100;

    eggCount = parseInt(localStorage.getItem('eggCount')) || 0;
    eggsPerSecond = parseInt(localStorage.getItem('eggsPerSecond')) || 0;

    timesClicked = parseInt(localStorage.getItem('timesClicked')) || 0;
    totalEggs = parseInt(localStorage.getItem('totalEggs')) || 0;
    eggsSpent = parseInt(localStorage.getItem('eggsSpent')) || 0;
}

function resetGameValues() {
    localStorage.setItem('isWinner', false);
    playerWonGame = false;

    localStorage.setItem('totalTimePlayed', 0);
    timer = 0;

    localStorage.setItem('clickerIdx', 0);
    clickerIdx = 0;
    localStorage.setItem('clickerPower', 1);
    clickerPower = 199999999;

    localStorage.setItem('babyPower', 1);
    babyPower = 1;
    localStorage.setItem('babyCost', 10);
    babyCost = 10;

    localStorage.setItem('upgradeCost', 100);
    upgradeCost = 100;

    localStorage.setItem('eggCount', 0);
    eggCount = 0;
    localStorage.setItem('eggsPerSecond', 0);
    eggsPerSecond = 0;
    
    localStorage.setItem('timesClicked', 0);
    timesClicked = 0;
    localStorage.setItem('totalEggs', 0);
    totalEggs = 0;
    localStorage.setItem('eggsSpent', 0);
    eggsSpent = 0;
}

function preload () {
    this.load.audio('egg_lsadsdlasd', 'assets/sounds/music/egg_lsadsdlasd.mp3');
    this.load.audio('spelunky2_egg_radio', 'assets/sounds/music/spelunky2_egg_radio.mp3');
    this.load.audio('the_hidden_egg', 'assets/sounds/music/the_hidden_egg.mp3');
    this.load.audio('little_nest_egg', 'assets/sounds/music/little_nest_egg.mp3');
    this.load.audio('the_song_of_egg', 'assets/sounds/music/the_song_of_egg.mp3');

    this.load.audio('trex_roar', 'assets/sounds/sfx/trex_roar.wav');
    this.load.audio('velociraptor_roar', 'assets/sounds/sfx/velociraptor_roar.wav');
    this.load.audio('dinobird_roar', 'assets/sounds/sfx/dinobird_roar.wav');
    this.load.audio('chickensaur_roar', 'assets/sounds/sfx/chickensaur_roar.wav');
    this.load.audio('chicken_roar', 'assets/sounds/sfx/chicken_roar.wav');
    this.load.audio('chicken_man', 'assets/sounds/sfx/chicken_man.wav');

    this.load.image('green-forest-front', 'assets/images/backgrounds/parallax/battleback1-1.png');
    this.load.image('green-forest-back', 'assets/images/backgrounds/parallax/battleback1-2.png');
    this.load.image('yellow-forest-front', 'assets/images/backgrounds/parallax/battleback6-1.png');
    this.load.image('yellow-forest-back', 'assets/images/backgrounds/parallax/battleback6-2.png');
    this.load.image('red-forest-front', 'assets/images/backgrounds/parallax/battleback7-1.png');
    this.load.image('red-forest-back', 'assets/images/backgrounds/parallax/battleback7-2.png');
    this.load.image('ice-front', 'assets/images/backgrounds/parallax/battleback2-1.png');
    this.load.image('ice-back', 'assets/images/backgrounds/parallax/battleback2-2.png');
    this.load.image('farm-front', 'assets/images/backgrounds/parallax/battleback10-1.png');
    this.load.image('farm-back', 'assets/images/backgrounds/parallax/battleback10-2.png');

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

    this.load.image('winner', 'assets/images/other/winner.png');
    this.load.image('resetButton', 'assets/images/other/reset.png');
}

function create () {
    getStoredValues();

    clock = game.getTime();

    backgroundImage = this.bg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, backgroundData[clickerIdx*2+1].image);
    this.bg1.setOrigin(0, 0);
    this.bg1.setScrollFactor(0);

    foregroundImage = this.bg2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, backgroundData[clickerIdx*2].image);
    this.bg2.setOrigin(0, 0);
    this.bg2.setScrollFactor(0);

    var upgradePanel = this.add.rectangle(110, game.config.height/2, 200, game.config.height-20, eggShellColor);
    upgradePanel.setStrokeStyle(5, 0x000000);

    buyBabyButton = this.add.sprite(upgradePanel.x, 150, 'blank').setInteractive({
        pixelPerfect: true
    });
    babyText = this.add.text(buyBabyButton.x, buyBabyButton.y - buyBabyButton.height/2 - 30, 'Buy Baby\n' + producerData[clickerIdx].name, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    babyImage = this.add.image(buyBabyButton.x, buyBabyButton.y, 'blank');
    babyCostText = this.add.text(buyBabyButton.x, buyBabyButton.y + buyBabyButton.height/2 + 20, 'Price: ' + babyCost, { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

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
    this.add.text(infoPanel.x, 40, 'Total seconds\nplayed:', { fontSize: '19px', fill: '#000000'}).setOrigin(0.5);
    playTime = this.add.text(infoPanel.x, 80, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    clicker = this.add.sprite(this.game.config.width/2, this.game.config.height/2, clickerData[clickerIdx].image).setInteractive({
        pixelPerfect: true
    });
    clicker.setScale(2);

    resetButton = this.add.sprite(infoPanel.x, this.game.config.height - 40, 'resetButton').setInteractive({
        pixelPerfect: true
    });

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
        infoPanel.x, 180, 'Total Eggs Made:', 
        { fontSize: '19px', fill: '#000000' }
    ).setOrigin(0.5);
    totalEggsCountText = this.add.text(infoPanel.x, 200, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
    
    eggsSpentText = this.add.text(
        infoPanel.x, 240, 'Total Eggs Spent:', 
        { fontSize: '19px', fill: '#000000' }
    ).setOrigin(0.5);
    eggsSpentCountText = this.add.text(infoPanel.x, 260, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);
      
    buyBabyButton.on('pointerdown', clickedBuyBaby);
    buyUpgradeButton.on('pointerdown', clickedUpgrade)
    clicker.on('pointerdown', clickedClicker);
    resetButton.on('pointerdown', resetGameValues);
}

function update () {
    var promptText = this.add.text(clicker.x - clicker.displayWidth/2, clicker.y + clicker.displayHeight/2, 'Click to make some eggs!',
        {fontSize: '20px', fill: '#ffffff' }
    );

    var now = game.getTime();
    var dt = (now - clock) / 1000;
    timer += dt;
    playTime.setText(Math.round(timer));
    
    backgroundImage.setTexture(backgroundData[clickerIdx*2+1].image);
    foregroundImage.setTexture(backgroundData[clickerIdx*2].image);

    babyText.setText('Buy Baby\n' + producerData[clickerIdx].name);
    babyImage.setTexture(clickerData[clickerIdx].image);
    babyCostText.setText('Price: ' + babyCost);

    if (playerWonGame == true || clickerIdx == 4) {
        upgradeText.setText('EGGxcellent!\nEGGxtraordinary!\nEGGxquisite!');
        buyUpgradeButton.setInteractive(false);
        upgradeCostText.setText('WINNER WINNER\nCHICKEN DINNER!');
    } else {
        upgradeText.setText('(D)Evolve to\n' + producerData[clickerIdx+1].name);
        upgradeCostText.setText('Price: ' + upgradeCost);
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
    
    localStorage.setItem('isWinner', playerWonGame);

    localStorage.setItem('totalTimePlayed', timer);

    localStorage.setItem('clickerIdx', clickerIdx);
    localStorage.setItem('clickerPower', clickerPower);

    localStorage.setItem('babyPower', babyPower);
    localStorage.setItem('babyCost', babyCost);

    localStorage.setItem('upgradeCost', upgradeCost);

    localStorage.setItem('eggCount', eggCount);
    localStorage.setItem('eggsPerSecond', eggsPerSecond);
    
    localStorage.setItem('timesClicked', timesClicked);
    localStorage.setItem('totalEggs', totalEggs);
    localStorage.setItem('eggsSpent', eggsSpent);

    clock = now;
}
