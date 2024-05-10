let config = {
    type: Phaser.AUTO,
    width: 640, 
    height: 360,
    zoom: 1,
    scale: {
        parent: 'game',
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ Game ]
}
let game = new Phaser.Game(config)

// global variables
