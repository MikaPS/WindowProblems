let config = {
	type: Phaser.WEBGL,
	width: 800,
	height: 600,
	zoom: 1,
	scale: {
		parent: 'game',
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: "matter",
		matter: {
			debug: true,
		},
	},
	scene: [Game]
}
let game = new Phaser.Game(config)

// global variables
