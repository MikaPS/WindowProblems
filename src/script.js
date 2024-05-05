class Introduction extends Phaser.Scene {
  constructor() {
    super("Introduction");
  }

  preload() {}

  create() {
    // Create Matter physics world
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
    let ground = this.matter.add.rectangle(395, 600, 815, 50, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    });

    // LEFT CLICK THROWING MECHANIC
    let rockOptions = { density: 0.004 };
    let rock = this.matter.add.polygon(170, 450, 8, 20, rockOptions);
    let anchor = this.matter.add.rectangle(170, 450, 5, 5, { isStatic: true });
    // gives the elastic effect
    let elastic = this.matter.add.constraint(anchor, rock, 0.01, 0.01);
    this.matter.add.mouseSpring();
    this.input.on(
      "pointerdown",
      function (pointer) {
        if (pointer.leftButtonDown()) {
          let throwDistance = 20;
          if (
            Phaser.Math.Distance.Between(
              rock.position.x,
              rock.position.y,
              pointer.x,
              pointer.y
            ) < throwDistance
          ) {
            // find the correct direction for explosion
            this.directionX = rock.position.x - pointer.x;
            this.directionY = rock.position.y - pointer.y;
            if (this.directionX < 0) {
              this.directionX = -0.1;
            } else {
              this.directionX = 0.1;
            }
            if (this.directionY < 0) {
              this.directionY = -0.1;
            } else {
              this.directionY = 0.1;
            }
          }
        }
      },
      this
    );

    this.input.on(
      "pointerup",
      function (pointer) {
        if (pointer.leftButtonReleased()) {
          let dx = rock.position.x - anchor.position.x;
          let dy = rock.position.y - anchor.position.y;
          let constraintLength = Math.sqrt(dx * dx + dy * dy) / 30;

          console.log("here", constraintLength);
          let newRock = this.matter.add.polygon(170, 450, 8, 20, rockOptions);
          // Apply force to the body
          this.matter.applyForce(newRock, {
            x: this.directionX * constraintLength,
            y: this.directionY * constraintLength,
          });
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
