class Game extends Phaser.Scene {
    constructor() {
        super('gameScene')
    }

    create() {
        this.text = this.add.text(game.config.width/2, game.config.height/2, `GAME WINDOW IS ${game.config.width} x ${game.config.height}`, { fill: '#ffffff' })
            .setOrigin(0.5);
        let resizeScreen = () => {
            game.config.width = $('#game').width();
            game.config.height = $('#game').height();
            this.updateSize.bind(this)()
        };
        $("#game").resize(function() {
        });
        $(window).resize(function() {
            console.log('resize');
            resizeScreen();
        });
    }

    init() {
    }

    update() {
    }

    updateSize() {
        this.text.setText(`GAME WINDOW IS ${game.config.width} x ${game.config.height}`);
    }
}