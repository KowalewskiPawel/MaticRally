import Phaser from "phaser";

import trackJSON from "../assets/tracks/long_with_os.json";
export class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  preload() {
    this.load.setCORS("anonymous");
    this.load.tilemapTiledJSON("track_1", trackJSON);
  }

  create() {
    const trackMap = this.make.tilemap({ key: "track_1" });

    const asphalt_tiles = trackMap.addTilesetImage("roads", "roads-tileset");
    const grass_tiles = trackMap.addTilesetImage(
      "terrains",
      "terrains-tileset"
    );
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

    trackMap.createLayer("grass", grass_tiles);
    trackMap.createLayer("track", asphalt_tiles);

    // this.carSprite = this.matter.add.image(4000, 2300, "car_red_1");
    var atlasTexture = this.textures.get("cars");
    var frames = atlasTexture.getFrameNames();
    console.log(frames);

    this.carSprite = this.matter.add.image(5450, 36400, "cars", "car_red_1");
    /*this.ghost = this.matter.add.image(5550, 36400, "cars", "car_blue_1", {
      mass: 400,
    });
    */

    const tires = trackMap.getObjectLayer("tires");
    tires.objects.forEach((o) => {
      this.matter.add.image(o.x, o.y, "objects", "tires_red.png", {
        mass: 1000,
        chamfer: 32,
      });
    });

    const startStop = trackMap.getObjectLayer("start-stop").objects[0];

    this.startLine = this.matter.add.rectangle(
      startStop.x + 170,
      startStop.y,
      startStop.width,
      100,
      {
        isSensor: true,
        isStatic: true,
      }
    );

    this.stopLine = this.matter.add.rectangle(
      startStop.x + 170,
      startStop.y - 400,
      startStop.width,
      100,
      {
        isSensor: true,
        isStatic: true,
      }
    );

    this.carSprite.setAngle(270);
    this.carSprite.setFrictionAir(0.01);
    this.carSprite.setMass(4000);

    this.cameras.main.startFollow(this.carSprite, true);

    this.tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
    this.tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.isStarted = false;

    this.timer = null;

    this.stageTime = this.add.text(this.cameras.x, this.cameras.y, "Time: ", {
      font: "20px Arial",
      fill: "black",
    });
    this.stageTime.setScrollFactor(0, 0);

    this.startTimer = () => {
      if (this.isStarted) {
        console.log(Math.round(this.timer.getElapsedSeconds() * 100) / 100);
        return;
      }
      this.isStarted = true;
      this.timer = this.time.addEvent({
        repeat: 99999999999999,
        timeScale: 1,
        paused: false,
      });

      this.stopTimer = () => {
        if (!this.isStarted) {
          return;
        }
        this.timer.paused = true;
      };

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
    };
  }

  async update() {
    const point1 = this.carSprite.getTopRight();
    const point2 = this.carSprite.getBottomRight();
    this.tracker1.setPosition(point1.x, point1.y);
    this.tracker2.setPosition(point2.x, point2.y);

    const isMoving = this.cursors.up.isDown || this.cursors.down.isDown;

    this.matter.overlap(this.carSprite, this.startLine, this.startTimer);
    this.matter.overlap(this.carSprite, this.stopLine, this.stopTimer);

    if (this.isStarted) {
      this.stageTime.setText(
        "Time: " + Math.round(this.timer.getElapsedSeconds() * 100) / 100
      );
    }

    if (this.cursors.up.isDown) {
      this.carSprite.thrust(0.2);
    } else if (this.cursors.down.isDown) {
      this.carSprite.thrustBack(0.25);
    }

    if (isMoving) {
      const moveDir = this.cursors.up.isDown ? 1 : -1;

      if (this.cursors.left.isDown) {
        this.carSprite.setAngle((this.carSprite.angle -= 1.8 * moveDir));
      }

      if (this.cursors.right.isDown) {
        this.carSprite.setAngle((this.carSprite.angle += 1.8 * moveDir));
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
