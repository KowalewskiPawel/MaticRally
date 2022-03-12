import Phaser from 'phaser';
import asphalt_road_tiles from '../assets/tiles/asphalt_road';
import grass_textures_tiles from '../assets/tiles/grass';
import objects_textures from '../assets/objects';
import cars_textures from '../assets/cars';
import barrel from "../../game/assets/objects/barrel_red.png";

import car from "../assets/cars/car_red_1.png";
import landTiles from "../assets/tilesets/land_tiles.png";
import trackJSON from "../assets/tracks/long_one.json";
import track1JSON from "../assets/tracks/track_1.json";

export class Game extends Phaser.Scene {
  cursors;
  carSprite;
  carsNames = {};
  tentsGroup = {};
  tracker1;
  tracker2;

  constructor() {
    super();
  }

  preload() {
    Object.keys(asphalt_road_tiles).forEach((tile) => {
      this.textures.addBase64(tile, asphalt_road_tiles[tile]);
    });
    Object.keys(grass_textures_tiles).forEach((tile) => {
      this.textures.addBase64(tile, grass_textures_tiles[tile]);
    });
    Object.keys(objects_textures).forEach((texture) => {
      this.textures.addBase64(texture, objects_textures[texture]);
    });
    Object.keys(cars_textures).forEach((car) => {
      this.carsNames[car] = car;
      this.textures.addBase64(car, cars_textures[car]);
    });

    this.load.setCORS("anonymous");
    this.load.image("land_tiles_set", landTiles);
    this.load.tilemapTiledJSON("track_1", trackJSON);
    this.load.tilemapTiledJSON("track_11", track1JSON);
    this.textures.addBase64("barrel", barrel);
  }

  async create() {
    const tileMap = this.make.tilemap({ key: "track_1" });
    const tileMap1 = this.make.tilemap({ key: "track_11" });
    console.log(this);

    const asphalt_tiles = Object.keys(asphalt_road_tiles).map((tile) => {
      return tileMap1.addTilesetImage(
        `../tiles/asphalt_road/${tile}.png`,
        tile
      );
    });
    const grass_tiles = Object.keys(grass_textures_tiles).map((tile) => {
      return tileMap1.addTilesetImage(`../tiles/grass/${tile}.png`, tile);
    });
    const objects_images = Object.keys(objects_textures).map(
      async (texture) => {
        const onList = this.textures.list[texture];
        if (onList) {
          const src = this.textures.list[texture].source[0];
          return tileMap1.addTilesetImage(
            `../objects/${texture}.png`,
            texture,
            src.width,
            src.height
          );
        } else {
          await this.textures.on("onload", (key, loaded) => {
            if (key === texture) {
              const src = loaded.source[0];
              return tileMap1.addTilesetImage(
                `../objects/${texture}.png`,
                texture,
                src.width,
                src.height
              );
            }
          });
        }
      }
    );
    this.tentsGroup = this.add.group();
    const tentsLayer = tileMap1.getObjectLayer("tents");
    // const pickupsGameObjects = tileMap1.createFromObjects('tents');
    // pickupsGameObjects.forEach((object) => {
    //     console.log(object)
    //     // const sprite = {}
    //     // sprite.setVisible(true);
    //     // // sprite.setDepth(9);
    //     this.tentsGroups.add(object);
    // });

    const barrelsLayer = tileMap1.getObjectLayer("tires");

    tileMap1.createLayer("grass", grass_tiles);
    tileMap1.createLayer("track", asphalt_tiles);

    this.carSprite = this.matter.add.image(4000, 2300, "car_red_1");

    this.carSprite.setFrictionAir(0.1);
    this.carSprite.setMass(400);

    this.cameras.main.startFollow(this.carSprite, true);

    this.tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
    this.tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

    this.cursors = await this.input.keyboard.createCursorKeys();

    tentsLayer.objects.forEach((obj) => {
      // this.tentsGroups.create(obj.x, obj.y, objects_images)
      // console.log(this.tentsGroups);

      this.matter.add.image(obj.x, obj.y, "tent_red", undefined, {
        isStatic: true,
      });
    });

    barrelsLayer.objects.forEach((obj) => {
      // this.tentsGroups.create(obj.x, obj.y, objects_images)
      // console.log(obj);

      this.platforms = this.matter.add.sprite(
        obj.x,
        obj.y,
        "tires_red",
        undefined,
        {
          isStatic: false,
          mass: 1000,
        }
      );
    });
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