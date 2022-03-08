import Phaser from 'phaser';

import track from "../assets/tracks/Track01.png";
import car from "../assets/cars/car_red_1.png";
// import trackJson from "../assets/tracks/track_1.json"

export class Game extends Phaser.Scene {
    cursors;
    carSprite;
    tracker1;
    tracker2;

    constructor() {
        super()
     }

    preload() {
        this.load.setCORS("anonymous");
        this.textures.addBase64("car", car);
        this.load.image("background", track);
        // this.load.tilemapTiledJSON('track_1', trackJSON);
    }

    async create() {
        this.add.image(400, 300, "background").setScale(0.6);
        
        this.carSprite = this.matter.add.image(400, 300, 'car')
        this.carSprite.setScale(0.6)
        this.carSprite.setFrictionAir(0.1);
        this.carSprite.setMass(500);

        this.cameras.main.startFollow(this.carSprite, true);

        // // this.matter.world.setBounds(0, 0, 800, 600);

        this.tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
        this.tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

        this.cursors = await this.input.keyboard.createCursorKeys();
        console.log({carSprite: this.carSprite, cursors: this.cursors})
    }

    async update() {
        const point1 = this.carSprite.getTopRight();
        const point2 = this.carSprite.getBottomRight();
        this.tracker1.setPosition(point1.x, point1.y);
        this.tracker2.setPosition(point2.x, point2.y);
        const isMoving = this.cursors.up.isDown || this.cursors.down.isDown;

        if (this.cursors.up.isDown) {
          this.carSprite.thrust(2);
        }
        else if (this.cursors.down.isDown) {
          this.carSprite.thrustBack(0.5);
        }

        if (isMoving) {
            const moveDir = this.cursors.up.isDown ? 1 : -1;

            if (this.cursors.left.isDown) {
                this.carSprite.setAngle(this.carSprite.angle -= 4 * moveDir)
            }

            if (this.cursors.right.isDown) {
                this.carSprite.setAngle(this.carSprite.angle += 4 * moveDir)
            }

            const rotation = Phaser.Math.DegToRad(this.carSprite.angle)
            const vec = new Phaser.Math.Vector2()
            vec.setToPolar(rotation, 1)
            this.carSprite.applyForce({ x: vec.x * moveDir, y: vec.y * moveDir }, { x: 500, y: 0 })
        }
    }
}