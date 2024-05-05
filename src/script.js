class Introduction extends Phaser.Scene {
  constructor() {
    super("Introduction");
  }

  preload() {}

  create() {
    // Create Matter physics world
    this.matter.world.setBounds(0, 0, 800, 600);

    // Create two boxes and a ground
    const boxA = this.matter.add.rectangle(400, 200, 80, 80);
    const boxB = this.matter.add.rectangle(450, 50, 80, 80);
    const ground = this.matter.add.rectangle(400, 610, 810, 60, {
      isStatic: true,
    });

    this.add
      .text(400, 50, "Phaser Scene with Matter.js Integration", {
        fill: "#ffffff",
      })
      .setOrigin(0.5);
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
      debug: true, // Set to true to see Matter.js debug information
    },
  },
};

const game = new Phaser.Game(config);
