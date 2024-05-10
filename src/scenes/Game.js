class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
  }

  preload() {
    //Used from https://www.deviantart.com/rawen713/art/Graph-Paper-150326645
    this.load.image("background", "assets/img/graphpaper_background.jpg");
  }

  create() {
    /*
    Tried working on Matter.js
    const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

    // create an engine
    const engine = Engine.create();

    var render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
      }
    });
    */
    // window physics by lyssa
    game.settings = { centerX: 0, centerY: 0 }; // for centering camera later
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
    this.graphics = this.add.graphics(); // only to draw the grid

    // this.add
    //   .text(
    //     400,
    //     50,
    //     "Right-click next to objects for explosion.\nLeft click the object on the spring to throw it."
    //   )
    //   .setOrigin(0.5);

    // adding random boxes to the scene
    // let box1 = this.matter.add.rectangle(300, 450, 50, 50);
    // let box2 = this.matter.add.rectangle(500, 450, 50, 50);

    // mouse movements
    this.matter.add.mouseSpring();

    // SPAWN STUFF
    this.input.on(
      "pointerdown",
      function (pointer, event) {
        if (pointer.leftButtonDown()) {
          this.crashingObjects(game.config.width, game.config.height);
          this.airDropObjects(
            window.screenLeft,
            window.screenLeft + game.config.width,
            window.screenTop,
            window.screenTop + game.config.height,
          );
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
              // find the correct direction for explosion
              let directionX = body.position.x - pointer.x;
              let directionY = body.position.y - pointer.y;

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
              // Apply force to the body
              let magnitude = 1;
              this.matter.applyForce(body, {
                x: directionX * magnitude,
                y: directionY * magnitude,
              });
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
		this.updateWorldBounds();
		// https://www.w3schools.com/jsref/prop_win_screentop.asp
		// console.log(`
		//     top: ${window.screenTop}
		//     left: ${window.screenLeft}
		// `);
	}

	// helper functions for window
	updateScreenLocation() {
		game.settings.centerX = game.config.width / 2 + window.screenX;
		game.settings.centerY = game.config.height / 2 + window.screenY;
		this.cameras.main.centerOn(game.settings.centerX, game.settings.centerY);
	}
	updateSize() {
		this.text.setText(`GAME WINDOW IS ${game.config.width} x ${game.config.height}`);
		this.updateWorldBounds();
	}
	updateWorldBounds() {
		this.matter.world.setBounds(window.screenLeft, window.screenTop, game.config.width, game.config.height);
	}

  // helper functions for matter
  airDropObjects(startX, endX, startY, endY) {
    let side = Math.random() * 8;
    let size = game.config.width / 50 + game.config.height / 50;
    let x = Math.random() * (endX - startX) + startX;
    let y = Math.random() * (endY - startY) + startY;
    this.matter.add.polygon(x, y, side, size /*, {
      render: {
        strokeStyle: 'black',
        lineWidth: 4
      }
    }*/);
  }

  crashingObjects(maxX, maxY) {
    let gridSize = 4;
    let maxAllowed = 3;
    let areaWidth = maxX / gridSize;
    let areaHeight = maxY / gridSize;

    // go through each grid cell
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // draws the grid (FOR DEBUGGING)
        // this.graphics.strokeRect(
        //   areaWidth * i,
        //   areaHeight * j,
        //   areaWidth,
        //   areaHeight
        // );

        let count = 0;

        // go through all bodies in the world
        for (let k = 0; k < this.matter.world.localWorld.bodies.length; k++) {
          let body = this.matter.world.localWorld.bodies[k];
          // check if it's in a specific area and add it to a count
          if (
            body.position.x > areaWidth * i &&
            body.position.x < areaWidth * i + areaWidth &&
            body.position.y > areaHeight * j &&
            body.position.y < areaHeight * j + areaHeight
          ) {
            count++;
          }
        }

        // check if there are too many bodies
        if (count >= maxAllowed) {
          for (let k = 0; k < this.matter.world.localWorld.bodies.length; k++) {
            let body = this.matter.world.localWorld.bodies[k];
            // delete all the over crowding bodies
            if (
              body.position.x > areaWidth * i &&
              body.position.x < areaWidth * i + areaWidth &&
              body.position.y > areaHeight * j &&
              body.position.y < areaHeight * j + areaHeight
            ) {
              if (body != this.ground) {
                this.matter.world.remove(body);
              }
            }
          }

          return true;
        }
      }
    }
    return false;
  }
}
