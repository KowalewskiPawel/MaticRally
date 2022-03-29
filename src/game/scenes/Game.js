import Phaser from 'phaser';

import trackJSON from "../assets/tracks/long_with_os.json";


export class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  competitors = {};

  preload() {
    this.load.setCORS("anonymous");
    this.load.tilemapTiledJSON("track_1", trackJSON);
  }

  async create() {
    // TO REMOVE
    var atlasTexture = this.textures.get("cars");
    var frames = atlasTexture.getFrameNames();

    const trackMap = this.make.tilemap({ key: "track_1" });

    const asphalt_tiles = trackMap.addTilesetImage("roads", "roads-tileset");
    const grass_tiles = trackMap.addTilesetImage(
      "terrains",
      "terrains-tileset"
    );

    trackMap.createLayer("grass", grass_tiles);
    trackMap.createLayer("track", asphalt_tiles);

    this.carSprite = this.matter.add.image(5450, 36400, "cars", "car_red_1");

    // LOAD OBSTACLES

    const tires = trackMap.getObjectLayer("tires");
    tires.objects.forEach((o) => {
      this.matter.add.image(o.x, o.y, "objects", "tires_red.png", {
        mass: 1000,
        chamfer: 32,
      });
    });

    // LOAD NFT BANNERS
    const nftBanners = trackMap.getObjectLayer("nft-banners").objects;
    this.loadNFTs(nftBanners);

    // START STOP LINES
    const startStop = trackMap.getObjectLayer("start-stop").objects;

    this.startLine = this.matter.add.rectangle(
      startStop[0].x + 170,
      startStop[0].y,
      startStop[0].width,
      100,
      {
        isSensor: true,
        isStatic: true,
      }
    );

    this.stopLine = this.matter.add.rectangle(
      startStop[1].x + 170,
      startStop[1].y - 400,
      startStop[1].width,
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
    };

    let query = new window.Moralis.Query("PlayerPosition");
    let subscription = await query.subscribe();
    subscription.on("create", (plocation) => {
      if (plocation.get("player") !== window.user.get("ethAddress")) {
        if (this.competitors[plocation.get("player")] === undefined) {
          this.competitors[plocation.get("player")] = this.matter.add.image(
            plocation.get("x"),
            plocation.get("y"),
            "cars",
            "car_red_1"
          );
        } else {
          this.competitors[plocation.get("player")].x = plocation.get("x");
          this.competitors[plocation.get("player")].y = plocation.get("y");
        }
      }
    });
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

    if (
      this.carSprite.lastX !== this.carSprite.x ||
      this.carSprite.lastY !== this.carSprite.y
    ) {
      let userPosition = window.user;

      const PlayerPosition = window.Moralis.Object.extend("PlayerPosition");
      const playerPosition = new PlayerPosition();

      playerPosition.set("player", userPosition.get("ethAddress"));
      playerPosition.set("x", this.carSprite.x);
      playerPosition.set("y", this.carSprite.y);

      this.carSprite.lastX = this.carSprite.x;
      this.carSprite.lastY = this.carSprite.y;

      await playerPosition.save();
    }
  }

  loadNFTs(nftBanners) {
    console.log(window.nftAd);
    if (nftBanners) {
      nftBanners.forEach((banner) => {
        this.load.image(`nft-banner-${banner.id}`, window.nftAd);
        this.load.on(Phaser.Loader.Events.COMPLETE, () => {
          this.add
            .image(
              banner.x + banner.width / 2,
              banner.y,
              `nft-banner-${banner.id}`
            )
            .setScale(0.3);
        });
      });
      this.load.start();
    }
  }
}