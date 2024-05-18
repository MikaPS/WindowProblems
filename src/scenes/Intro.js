class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  preload() {
    this.load.image("background", "assets/img/graphpaper_background.jpg");
    // font https://www.dafont.com/handwriting-17.font
    this.load.bitmapFont(
      "font",
      "assets/font/handwriting.png",
      "assets/font/handwriting.xml"
    );
  }

  create() {
    this.originalW = game.config.width;
    this.originalH = game.config.height;

    this.add.image(0, 0, "background").setOrigin(0); // sample background image

    game.settings = {
      centerX: 0,
      centerY: 0,
      cache: {
        x: 0,
        y: 0,
      },
    };
    let resizeScreen = () => {
      game.config.width = $("#game").width();
      game.config.height = $("#game").height();
    };
    $(window).resize(function () {
      resizeScreen();
    });
    resizeScreen();
    this.title = this.add.bitmapText(
      this.originalW * 0.1,
      this.originalH * 0.1,
      "font",
      "Window Problems",
      48
    );

    this.instructions = this.add.bitmapText(
      this.originalW * 0.05,
      this.originalH * 0.25,
      "font",
      "Have fun smashing items into each other in this ragdoll simulator" +
        "\n\n- Move your window to one of the corners to start spawning objects" +
        "\n\n- If objects touch each other, they will explode in opposite directions and disappear",
      32
    );

    this.add.bitmapText(
      this.originalW * 0.05,
      this.originalH * 0.6,
      "font",
      "To start the game,\nresize your screen to only show the START button!",
      48
    );

    this.add.bitmapText(
      this.originalW * 0.5,
      this.originalH * 0.8,
      "font",
      "----------\n| START |\n----------",
      52
    );

    console.log(game.settings.cache.x + game.config.width);
  }

  update() {
    if (
      (game.settings.cache.x >= this.originalW * 0.3 ||
        game.settings.cache.x + game.config.width >= this.originalW * 0.7) &&
      game.settings.cache.y >= this.originalH * 0.7
    ) {
      setTimeout(() => {
        this.scene.start("gameScene");
      }, 2000);
    }
    this.updateScreenLocation();
  }

  updateScreenLocation() {
    if (
      game.settings.cache.x !== window.screenX &&
      game.settings.cache.y !== window.screenY
    ) {
      game.settings.cache = { x: window.screenX, y: window.screenY };
      game.settings.centerX = game.config.width / 2 + window.screenX;
      game.settings.centerY = game.config.height / 2 + window.screenY;

      this.cameras.main.centerOn(game.settings.centerX, game.settings.centerY);
    }
  }
}
