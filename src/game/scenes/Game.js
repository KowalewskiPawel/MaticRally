import Phaser from 'phaser';
import asphalt_road_tiles from '../assets/tiles/asphalt_road';
import grass_textures_tiles from '../assets/tiles/grass';
import objects_textures from '../assets/objects';
// import cars_textures from '../assets/cars';

import landTiles from "../assets/tilesets/land_tiles.png";
import trackJSON from "../assets/tracks/long_with_os.json";
import terrainsAtlasJSON from "../assets/spritesheets/terrains.json"
import terrainsAtlasPNG from "../assets/spritesheets/terrains.png"
import roadsAtlasJSON from "../assets/spritesheets/roads.json"
import roadsAtlasPNG from "../assets/spritesheets/roads.png"
import carsAtlasJSON from "../assets/spritesheets/cars.json"
import carsAtlasPNG from "../assets/spritesheets/cars.png"

export class Game extends Phaser.Scene {
 
    constructor() {
        super({ key: 'game' });
    }

    preload() {
        this.load.setCORS("anonymous");
        this.load.image("roads-tileset", roadsAtlasPNG);
        this.load.image("terrains-tileset", terrainsAtlasPNG);
        this.load.atlas('roads', roadsAtlasPNG, roadsAtlasJSON);
        this.load.atlas('terrains', terrainsAtlasPNG, terrainsAtlasJSON);
        this.load.atlas('cars', carsAtlasPNG, carsAtlasJSON);
        this.load.tilemapTiledJSON("track_1", trackJSON);
    }

    create() {

        const trackMap = this.make.tilemap({ key: "track_1" });


        const asphalt_tiles = trackMap.addTilesetImage('roads', 'roads-tileset');
        const grass_tiles = trackMap.addTilesetImage('terrains', 'terrains-tileset');
        // const asphalt_tiles = Object.keys(asphalt_road_tiles).map((tile) => {
        //     const isLoaded = !!this.textures[tile];
        //     if(isLoaded) {
        //         return trackMap.addTilesetImage(
        //             `../tiles/asphalt_road/${tile}.png`,
        //             tile,
        //         )
        //     }
        //     this.textures.on('loadtexture', (key, texture) => {
        //         if (key == tile) {
        //             console.log({ key, texture })
        //             return trackMap.addTilesetImage(
        //                 `../tiles/asphalt_road/${tile}.png`,
        //                 tile,
        //             )
        //         }
        //     })
            // const onList = this.textures.list[tile];
            // if (onList) {
            //     return tileMap1.addTilesetImage(
            //         `../tiles/asphalt_road/${tile}.png`,
            //         tile,
            //     );
            // } else {
            //     this.textures.on("onload", (key) => {
            //         if (key === tile) {
            //             console.log("should add Tile")
            //             return tileMap1.addTilesetImage(
            //                 `../tiles/asphalt_road/${tile}.png`,
            //                 tile,
            //             );
            //         }
            //     });
            // }
        // });
        // const grass_tiles = Object.keys(grass_textures_tiles).map((tile) => {
        //     return trackMap.addTilesetImage(`../tiles/grass/${tile}.png`, tile);
        // });
        
        // this.tentsGroup = this.add.group();
        // const tentsLayer = trackMap.getObjectLayer("tents");
        // const pickupsGameObjects = tileMap1.createFromObjects('tents');
        // pickupsGameObjects.forEach((object) => {
        //     console.log(object)
        //     // const sprite = {}
        //     // sprite.setVisible(true);
        //     // // sprite.setDepth(9);
        //     this.tentsGroups.add(object);
        // });

        const barrelsLayer = trackMap.getObjectLayer("tires");
        console.log(trackMap);
        trackMap.createLayer("grass", grass_tiles);
        trackMap.createLayer("track", asphalt_tiles);

        // this.carSprite = this.matter.add.image(4000, 2300, "car_red_1");
        var atlasTexture = this.textures.get('cars');
        var frames = atlasTexture.getFrameNames();
        console.log(frames)
        this.carSprite = this.matter.add.image(5450, 36400, "cars", "car_red_1");
        this.ghost = this.matter.add.image(5550, 36400, "cars", "car_blue_1", {mass: 400});

        this.carSprite.setAngle(270);
        this.carSprite.setFrictionAir(0.1);
        this.carSprite.setMass(400);

        this.cameras.main.startFollow(this.carSprite, true);

        this.tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
        this.tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

        this.cursors = this.input.keyboard.createCursorKeys();

        // tentsLayer.objects.forEach((obj) => {
        //     // this.tentsGroups.create(obj.x, obj.y, objects_images)
        //     // console.log(this.tentsGroups);

        //     this.matter.add.image(obj.x, obj.y, "tent_red", undefined, {
        //         isStatic: true,
        //     });
        // });

        // barrelsLayer.objects.forEach((obj) => {
        //     // this.tentsGroups.create(obj.x, obj.y, objects_images)
        //     // console.log(obj);

        //     this.platforms = this.matter.add.sprite(
        //         obj.x,
        //         obj.y,
        //         "tires_red",
        //         undefined,
        //         {
        //             isStatic: false,
        //             mass: 1000,
        //         }
        //     );
        // });
    }

    async update() {
        const point1 = this.carSprite.getTopRight();
        const point2 = this.carSprite.getBottomRight();
        this.tracker1.setPosition(point1.x, point1.y);
        this.tracker2.setPosition(point2.x, point2.y);

        const isMoving = this.cursors.up.isDown || this.cursors.down.isDown;

        if (this.cursors.up.isDown) {
            this.carSprite.thrust(0.45);
        } else if (this.cursors.down.isDown) {
            this.carSprite.thrustBack(0.25);
        }

        if (isMoving) {
            const moveDir = this.cursors.up.isDown ? 1 : -1;

            if (this.cursors.left.isDown) {
                this.carSprite.setAngle((this.carSprite.angle -= 2 * moveDir));
            }

            if (this.cursors.right.isDown) {
                this.carSprite.setAngle((this.carSprite.angle += 2 * moveDir));
            }

            const rotation = Phaser.Math.DegToRad(this.carSprite.angle);
            const vec = new Phaser.Math.Vector2();
            vec.setToPolar(rotation, 1);
            this.carSprite.applyForce(
                { x: vec.x * moveDir, y: vec.y * moveDir },
                { x: 500, y: 0 }
            );
        }
    }

}