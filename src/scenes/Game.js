class Game extends Phaser.Scene {
    constructor() {
        super('gameScene')
    }

    preload() {
        this.load.image('background', 'assets/img/sample.jpg');
    }

    create() {
        game.settings = { centerX: 0, centerY: 0 };  // for centering camera later
        this.add.image(0, 0, 'background').setOrigin(0);  // sample background image
        this.text = this.add.text(game.config.width/2, game.config.height/2, `GAME WINDOW IS ${game.config.width} x ${game.config.height}`, { fill: '#ffffff' })
            .setOrigin(0.5);

        let resizeScreen = () => {
            game.config.width = $('#game').width();
            game.config.height = $('#game').height();
            this.updateSize.bind(this)();
        };
        $(window).resize(function() {
            console.log('resize');
            resizeScreen();
            // call to update border boxes here
        });

        resizeScreen();
        this.updateScreenLocation();
    }

    init() {
    }

    // https://github.com/nathanaltice/CameraLucida/blob/master/src/scenes/FixedController.js
    update() {
        this.updateScreenLocation();
        // https://www.w3schools.com/jsref/prop_win_screentop.asp
        // console.log(`
        //     top: ${window.screenTop}
        //     left: ${window.screenLeft}
        // `);
    }

    updateScreenLocation() {
        game.settings.centerX = game.config.width/2 + window.screenX;
        game.settings.centerY = game.config.height/2 + window.screenY;
        this.cameras.main.centerOn(game.settings.centerX, game.settings.centerY);
    }

    updateSize() {
        this.text.setText(`GAME WINDOW IS ${game.config.width} x ${game.config.height}`);
    }
}