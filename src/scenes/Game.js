class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
  }

  preload() {
    //Used from https://www.deviantart.com/rawen713/art/Graph-Paper-150326645
    this.load.image("background", "assets/img/graphpaper_background.jpg");

    this.load.audio("paper1", "assets/sound/106127__j1987__crumple.wav");
    this.load.audio("paper2", "assets/sound/508597__drooler__crumple-06.ogg");
    this.load.audio("paper3", "assets/sound/540262__zepurple__uncrumpling-paper.wav");
    this.load.audio("destruction", "assets/sound/641486__duskbreaker__8bit-explosion.wav");
    this.load.audio("spawn", "assets/sound/476840__jackyyang09__paper-scrawling.wav");
  }

  create() {
    this.P_sound = false;
    this.paper1 = this.sound.add("paper1");
    this.paper2 = this.sound.add("paper2");
    this.paper3 = this.sound.add("paper3");
    this.destruction = this.sound.add("destruction");
    this.spawn = this.sound.add("spawn");
    // window physics by lyssa
    game.settings = { centerX: 0, centerY: 0, cache: { x: 0, y: 0 } }; // for centering camera later
    this.add.image(0, 0, "background").setOrigin(0); // sample background image
    this.text = this.add
      .text(
        game.config.width / 2,
        game.config.height / 2,
        `GAME WINDOW IS ${game.config.width} x ${game.config.height}`,
        { fill: "#ffffff" }
      )
      .setOrigin(0.5);

    let resizeScreen = () => {
      game.config.width = $("#game").width();
      game.config.height = $("#game").height();
      this.updateSize.bind(this)();
    };
    $(window).resize(function () {
      console.log("resize");
      resizeScreen();
      // call to update border boxes here
    });

    resizeScreen();
    this.updateScreenLocation();

    // matter physics by mika
    // Chaos score text
    this.explodedObjects = 0;
    this.explodedText = this.add.text(
      game.config.width * 0.85,
      game.config.height * 0.05,
      "Chaos Score:\n" + this.explodedObjects
    );
    this.explodedText.setColor("#000000");
    // Explosion when two objects collide
    this.matter.world.on("collisionstart", (event) => {
      event.pairs.forEach((pair) => {
        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;
        // Makes sure we dont collide with the world bounds
        if (
          bodyA.label != "Rectangle Body" &&
          bodyB.label != "Rectangle Body"
        ) {
          this.collisionExplosion(bodyA, bodyB);
        }
      });
    });

    // mouse movements
    this.matter.add.mouseSpring();

    // SPAWN STUFF
    this.input.on(
      "pointerdown",
      function (pointer, event) {
        if (pointer.leftButtonDown()) {
          // this.crashingObjects(game.config.width, game.config.height);
          this.airDropObjects(
            window.screenLeft,
            window.screenLeft + game.config.width,
            window.screenTop,
            window.screenTop + game.config.height
          );
          this.spawn.play();
        }
      },
      this
    );

    // RIGHT CLICK FOR EXPLOSIONS
    this.input.mouse.disableContextMenu();
    this.input.on(
      "pointerdown",
      function (pointer) {
        if (pointer.rightButtonDown()) {
          // Get all bodies within a certain distance from the pointer
          let bodies = this.matter.world.localWorld.bodies;
          let explosionRadius = 100;
          for (let i = 0; i < bodies.length; i++) {
            let body = bodies[i];
            if (
              Phaser.Math.Distance.Between(
                body.position.x,
                body.position.y,
                pointer.x,
                pointer.y
              ) < explosionRadius
            ) {
              this.collisionExplosion(body, body);
            }
          }
        }
      },
      this
    );
  }

  init() {}

  // https://github.com/nathanaltice/CameraLucida/blob/master/src/scenes/FixedController.js
  update() {
    this.updateScreenLocation();
    this.updateTextLocation();
    this.explodedText.text = "Chaos Score:\n" + this.explodedObjects;

    // https://www.w3schools.com/jsref/prop_win_screentop.asp
    // console.log(`
    //     top: ${window.screenTop}
    //     left: ${window.screenLeft}
    // `);
    if(this.paper1.isPlaying || this.paper2.isPlaying || this.paper3.isPlaying){
      this.P_sound = true;
    } else {
      this.P_sound = false;
    }
  }

  // Updated chaos score
  updateTextLocation() {
    this.explodedText.x = game.config.width * 0.85;
    this.explodedText.y = game.config.height * 0.05;
  }

  // helper functions for window
  updateScreenLocation() {
    if (
      game.settings.cache.x !== window.screenX &&
      game.settings.cache.y !== window.screenY
    ) {
      // console.log("screen moved");
      // console.log(game.settings.cache, window.screenX, window.screenY);
      game.settings.cache = { x: window.screenX, y: window.screenY };
      game.settings.centerX = game.config.width / 2 + window.screenX;
      game.settings.centerY = game.config.height / 2 + window.screenY;
      this.cameras.main.centerOn(game.settings.centerX, game.settings.centerY);
      this.updateWorldBounds();
    }
  }
  updateSize() {
    this.text.setText(
      `GAME WINDOW IS ${game.config.width} x ${game.config.height}`
    );
    this.updateWorldBounds();
  }
  updateWorldBounds() {
    var i = Phaser.Math.Between(1, 3);
    if(i == 1 && this.P_sound == false){
      this.paper1.play();
    } else if(i == 2 && this.P_sound == false){
      this.paper2.play();
    } else if (i == 3 && this.P_sound == false){
      this.paper3.play();
    }
    this.matter.world.setBounds(
      game.settings.cache.x,
      game.settings.cache.y,
      game.config.width,
      game.config.height,
      1000
    );
  }

  // helper functions for matter
  airDropObjects(startX, endX, startY, endY) {
    let side = Math.random() * 8;
    let size = game.config.width / 50 + game.config.height / 50;
    let x = Math.random() * (endX - startX) + startX;
    let y = Math.random() * (endY - startY) + startY;
    let body = this.matter.add.polygon(x, y, side, size);
    let colors = [0xff0000, 0x00ff00, 0x0000ff];
    let color = Math.floor(Math.random() * colors.length);
    this.matter.world.setBodyRenderStyle(body, colors[color], 1, 2);
  }

  collisionExplosion(bodyA, bodyB) {
    // find the correct direction for explosion
    let directionX = bodyA.position.x - bodyB.position.x;
    let directionY = bodyA.position.y - bodyB.position.y;

    if (directionX < 0) {
      directionX = -0.1;
    } else {
      directionX = 0.1;
    }
    if (directionY < 0) {
      directionY = -0.1;
    } else {
      directionY = 0.1;
    }
    // apply force to the body
    let magnitude = 1;

    // introducing a delay between the explosion and destroying the object
    setTimeout(() => {
      this.updated = false;
      this.matter.applyForce(bodyB, {
        x: directionX * magnitude,
        y: directionY * magnitude,
      });

      setTimeout(() => {
        this.matter.world.remove(bodyB);
        if (this.updated == false) {
          this.updated = true;
          this.explodedObjects += 1;
          this.destruction.play();
        }
      }, 2000);
    }, 50);
  }
}
