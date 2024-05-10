class Introduction extends Phaser.Scene {
  constructor() {
    super("Introduction");
  }

  preload() {}

  airDropObjects(maxX, maxY) {
    let x = Math.random() * maxX;
    let y = Math.random() * maxY;
    let side = Math.random() * 8;
    this.matter.add.polygon(x, y, side, maxX * 0.03 + maxY * 0.03);
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
        this.graphics.strokeRect(
          areaWidth * i,
          areaHeight * j,
          areaWidth,
          areaHeight
        );

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

  create() {
    this.graphics = this.add.graphics(); // only to draw the grid
    this.matter.world.setBounds(0, 0, 800, 600);

    this.add
      .text(
        400,
        50,
        "Right-click next to objects for explosion.\nLeft click the object on the spring to throw it."
      )
      .setOrigin(0.5);

    // adding random boxes to the scene
    let box1 = this.matter.add.rectangle(300, 450, 50, 50);
    let box2 = this.matter.add.rectangle(500, 450, 50, 50);
    this.ground = this.matter.add.rectangle(395, 600, 815, 50, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    // mouse movements
    this.matter.add.mouseSpring();

    // SPAWN STUFF
    this.input.on(
      "pointerdown",
      function (pointer, event) {
        if (pointer.leftButtonDown()) {
          this.crashingObjects(800, 600);
          this.airDropObjects(800, 600);
        }
      },
      this
    );

    // RIGHT CLICK FOR EXPLOSIONS
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

  update() {}
}

const config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  scene: [Introduction],
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);
