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

var musicConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
};

var sfxConfig = {
    mute: false,
    volume: 0.5,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 0
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

var musicLibrary = [];
var music;

var clickerIdx = 0;
var clicker;
var clickerPower = 1;
var promptText;
var eggsPerClickText;

var babyPower = 1;
var babyCost = 1;
var buyBabyButton;
var babyText;
var babyImage;
var babyCostText;

var upgradeCost = 100;
var buyUpgradeButton;
var upgradeText;
var upgradeImage;
var upgradeCostText;

var errorTextTimer = 0;
var cantBuyText;

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

var infoPanel;
var playTime;

var resetButton;
var confirmationBox;
var yesUpgrade;
var noUpgrade;
var yesReset;
var noReset;
var confirmUpgradeText;
var confirmResetText;

var game = new Phaser.Game(config);

const eggShellColor = 0xf0ead6;
const blackColor = 0x000000;

const formatEggCount = (eggs) => {
    return eggs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function playNewSong() {
    music.stop();
    music = musicLibrary[clickerIdx];
    music.play();
}

function highlightBuyBaby() {
    buyBabyButton.setScale(1.1);
    babyImage.setScale(1.1);
}

function unhighlightBuyBaby() {
    buyBabyButton.setScale(1);
    babyImage.setScale(1);
}

function clickedBuyBaby() {
    cantBuyText.setText('');

    if (eggCount >= babyCost) {
        buyBabyButton.setScale(1);
        babyImage.setScale(1);
        
        this.scene.sound.play(sfxData[clickerIdx].sound, sfxConfig);

        eggCount -= babyCost;
        babyCost *= 2;
        eggsPerSecond += babyPower;

        eggsSpent += babyCost;
    } else {
        cantBuyText.setText('Not enough eggs to buy a new baby!');
        errorTextTimer = 3;
    }
}

function unclickedBuyBaby() {
    buyBabyButton.setScale(1.1);
    babyImage.setScale(1.1);
}

function highlightUpgrade() {
    buyUpgradeButton.setScale(1.1);
    upgradeImage.setScale(1.1);
}

function unhighlightUpgrade() {
    buyUpgradeButton.setScale(1);
    upgradeImage.setScale(1);
}

function hideUpgrade() {
    confirmationBox.visible = false;
    yesUpgrade.visible = false;
    noUpgrade.visible = false;
    yesUpgrade.setInteractive(false);
    noUpgrade.setInteractive(false);
    confirmUpgradeText.visible = false;
}

function confirmationUpgrade() {
    confirmationBox.visible = true;
    yesUpgrade.visible = true;
    noUpgrade.visible = true;
    yesUpgrade.setInteractive({
        pixelPerfect: true
    });
    noUpgrade.setInteractive({
        pixelPerfect: true
    });
    confirmUpgradeText.visible = true;
    yesUpgrade.on('pointerdown', tryUpgrade);
    noUpgrade.on('pointerdown', hideUpgrade);
}

function clickedUpgrade() {
    if (playerWonGame == true || clickerIdx == 4) {
        this.scene.sound.play(sfxData[clickerIdx+1].sound, sfxConfig);
    } else {
        confirmationUpgrade();
    }
}

function tryUpgrade() {
    cantBuyText.setText('');

    if (eggCount >= upgradeCost) {
        buyUpgradeButton.setScale(1);
        upgradeImage.setScale(1);
        
        eggsSpent += eggCount;
        
        eggCount -= upgradeCost;
        upgradeCost *= 10;
        clickerPower *= 10;
        babyPower *= 10;
        babyCost = 1;
        eggsPerSecond = 0;
        
        var prestigeBonus = eggCount / upgradeCost;
        clickerPower = Math.round(clickerPower * (1 + prestigeBonus));
        babyPower = Math.round(babyPower * (1 + prestigeBonus));
        eggCount = 0;
        
        clickerIdx++;
        if (clickerIdx == 4) {
            playerWonGame = true;
        }

        playNewSong();
    } else {
        console.log('fail upg');
        cantBuyText.setText('Not enough eggs to (d)evolve!');
        errorTextTimer = 3;
    }

    hideUpgrade();
}

function unclickedUpgrade() {
    buyUpgradeButton.setScale(1.1);
    upgradeImage.setScale(1.1);
}

function highlightClicker() {
    clicker.setScale(3);
}

function unhighlightClicker() {
    clicker.setScale(2);
}

function clickedClicker() {
    clicker.setScale(2.75);
    eggCount += clickerPower;
    totalEggs += clickerPower;

    timesClicked++;
}

function unclickedClicker() {
    clicker.setScale(3);
}

function getStoredValues() {
    playerWonGame = localStorage.getItem('isWinner') || false;

    timer = parseInt(localStorage.getItem('totalTimePlayed')) || 0;

    clickerIdx = parseInt(localStorage.getItem('clickerIdx')) || 0;
    clickerPower = parseInt(localStorage.getItem('clickerPower')) || 1;

    babyPower = parseInt(localStorage.getItem('babyPower')) || 1;
    babyCost = parseInt(localStorage.getItem('babyCost')) || 1;

    upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 100;

    eggCount = parseInt(localStorage.getItem('eggCount')) || 0;
    eggsPerSecond = parseInt(localStorage.getItem('eggsPerSecond')) || 0;

    timesClicked = parseInt(localStorage.getItem('timesClicked')) || 0;
    totalEggs = parseInt(localStorage.getItem('totalEggs')) || 0;
    eggsSpent = parseInt(localStorage.getItem('eggsSpent')) || 0;
}

function hideReset() {
    confirmationBox.visible = false;
    yesReset.visible = false;
    noReset.visible = false;
    yesReset.setInteractive(false);
    noReset.setInteractive(false);
    confirmResetText.visible = false;
}

function confirmationReset() {
    confirmationBox.visible = true;
    yesReset.visible = true;
    noReset.visible = true;
    yesReset.setInteractive({
        pixelPerfect: true
    });
    noReset.setInteractive({
        pixelPerfect: true
    });
    confirmResetText.visible = true;
    yesReset.on('pointerdown', resetGameValues);
    noReset.on('pointerdown', hideReset);
}

function clickedReset() {
    confirmationReset();
}

function resetGameValues() {
    hideReset();

    localStorage.setItem('isWinner', false);
    playerWonGame = false;

    localStorage.setItem('totalTimePlayed', 0);
    timer = 0;

    localStorage.setItem('clickerIdx', 0);
    clickerIdx = 0;
    localStorage.setItem('clickerPower', 1);
    clickerPower = 1;

    localStorage.setItem('babyPower', 1);
    babyPower = 1;
    localStorage.setItem('babyCost', 1);
    babyCost = 1;

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

    playNewSong();
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
    this.load.image('yes', 'assets/images/other/yes.png');
    this.load.image('no', 'assets/images/other/no.png');
    this.load.image('resetButton', 'assets/images/other/reset.png');
}

function create () {
    getStoredValues();

    clock = game.getTime();

    for (var i=0; i<musicData.length; i++) {
        musicLibrary.push(this.sound.add(musicData[i].song, musicConfig));
    }
    music = musicLibrary[clickerIdx];
    music.play();

    backgroundImage = this.bg1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, backgroundData[clickerIdx*2+1].image);
    this.bg1.setOrigin(0, 0);
    this.bg1.setScrollFactor(0);

    foregroundImage = this.bg2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, backgroundData[clickerIdx*2].image);
    this.bg2.setOrigin(0, 0);
    this.bg2.setScrollFactor(0);

    var upgradePanel = this.add.rectangle(110, game.config.height/2, 200, game.config.height-20, eggShellColor);
    upgradePanel.setStrokeStyle(5, blackColor);

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

    infoPanel = this.add.rectangle(game.config.width - 110, game.config.height/2, 200, game.config.height-20, eggShellColor);
    infoPanel.setStrokeStyle(5, blackColor);
    this.add.text(infoPanel.x, 40, 'Total seconds\nplayed:', { fontSize: '19px', fill: '#000000'}).setOrigin(0.5);
    playTime = this.add.text(infoPanel.x, 80, formatEggCount(timer), { fontSize: '20px', fill: '#000000'}).setOrigin(0.5);

    clicker = this.add.sprite(this.game.config.width/2, this.game.config.height/2, clickerData[clickerIdx].image).setInteractive({
        pixelPerfect: true
    });
    clicker.setScale(2);

    promptText = this.add.text(clicker.x - clicker.displayWidth/2, clicker.y + clicker.displayHeight/2, 'Click to make some eggs!',
        {fontSize: '20px', fill: '#ffffff' }
    );

    cantBuyText = this.add.text(
        upgradePanel.x + upgradePanel.width/2 + 40, buyBabyButton.y - buyBabyButton.height/2, '', 
        {fontSize: '30px', fill: '#ff0000' }
    );

    resetButton = this.add.sprite(infoPanel.x, this.game.config.height - 40, 'resetButton').setInteractive({
        pixelPerfect: true
    });

    confirmationBox = this.add.rectangle(this.game.config.width/2, this.game.config.height/2-100, 600, 300, eggShellColor);
    confirmationBox.setStrokeStyle(5, blackColor);
    yesUpgrade = this.add.sprite(confirmationBox.x - 200, confirmationBox.y + 100, 'yes');
    noUpgrade = this.add.sprite(confirmationBox.x + 200, confirmationBox.y + 100, 'no');
    yesReset = this.add.sprite(confirmationBox.x - 200, confirmationBox.y + 100, 'yes');
    noReset = this.add.sprite(confirmationBox.x + 200, confirmationBox.y + 100, 'no');
    confirmUpgradeText = this.add.text(
        confirmationBox.x - 350, confirmationBox.y - 120, 
        '        Are you sure you want to (d)evolve?\n\
        This is equivalent to a soft reset/prestige.\n\n\
        Your eggs and eggs per second will be set\n\
        to 0, but in exchange you will have better\n\
        egg production multipliers, depending on\n\
        how many eggs you have when you (e)evolve.\n\n\
        TLDR: More eggs before (d)evolve,\n\
              More eggs you make after (d)evolve', 
        { fontSize: '20px', fill: '#000000' }
    );
    confirmResetText = this.add.text(
        confirmationBox.x - 350, confirmationBox.y - 120, 
        '        Are you sure you want to reset?\n\
        This is equivalent to a hard reset.\n\n\
        It will return everything to as it originally\n\
        was when the game began,\n\
        and there is no benefit.\n\n\
        TLDR: WHY WOULD YOU DO THIS???',  
        { fontSize: '20px', fill: '#000000' }
    );
    confirmationBox.visible = false;
    yesUpgrade.visible = false;
    noUpgrade.visible = false;
    yesReset.visible = false;
    noReset.visible = false;
    confirmUpgradeText.visible = false;
    confirmResetText.visible = false;

    eggCountText = this.add.text(
        clicker.x - clicker.displayWidth/2, 10, 'Eggs: ' + formatEggCount(eggCount), 
        { fontSize: '20px', fill: '#ffffff' }
    );

    eggsPerClickText = this.add.text(
        clicker.x - clicker.displayWidth/2, this.game.config.height - 60, 'Eggs Per Click: ' + formatEggCount(clickerPower), 
        {fontSize: '20px', fill: '#ffffff' }
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
      
    buyBabyButton.on('pointerover', highlightBuyBaby);
    buyBabyButton.on('pointerdown', clickedBuyBaby);
    buyBabyButton.on('pointerup', unclickedBuyBaby);
    buyBabyButton.on('pointerout', unhighlightBuyBaby);
    buyUpgradeButton.on('pointerover', highlightUpgrade);
    buyUpgradeButton.on('pointerdown', clickedUpgrade)
    buyUpgradeButton.on('pointerup', unclickedUpgrade);
    buyUpgradeButton.on('pointerout', unhighlightUpgrade);
    clicker.on('pointerover', highlightClicker);
    clicker.on('pointerdown', clickedClicker);
    clicker.on('pointerup', unclickedClicker);
    clicker.on('pointerout', unhighlightClicker);
    resetButton.on('pointerdown', clickedReset);
}

function update () {
    promptText.destroy();
    promptText = this.add.text(clicker.x - clicker.displayWidth/2, clicker.y + clicker.displayHeight/2, 'Click to make some eggs!',
        {fontSize: '20px', fill: '#ffffff' }
    );

    var now = game.getTime();
    var dt = (now - clock) / 1000;
    timer += dt;
    playTime.setText(Math.round(timer));

    errorTextTimer -= dt;
    if (errorTextTimer <= 0) {
        cantBuyText.setText('');
    }

    backgroundImage.setTexture(backgroundData[clickerIdx*2+1].image);
    foregroundImage.setTexture(backgroundData[clickerIdx*2].image);

    babyText.setText('Buy Baby\n' + producerData[clickerIdx].name);
    babyImage.setTexture(producerData[clickerIdx].image);
    babyCostText.setText('Price: ' + babyCost);

    if (playerWonGame == true || clickerIdx == 4) {
        upgradeText.setText('EGGxcellent!\nEGGxtraordinary!\nEGGxquisite!');
        upgradeCostText.setText('WINNER WINNER\nCHICKEN DINNER!');
    } else {
        upgradeText.setText('(D)Evolve to\n' + producerData[clickerIdx+1].name);
        upgradeCostText.setText('Price: ' + upgradeCost);
    }
    upgradeImage.setTexture(producerData[clickerIdx+1].image);

    clicker.setTexture(clickerData[clickerIdx].image);

    eggCount += dt * eggsPerSecond;
    eggCountText.setText('Eggs: ' + formatEggCount(Math.round(eggCount)));

    eggsPerClickText.setText('Eggs Per Click: ' + formatEggCount(Math.round(clickerPower)));
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
