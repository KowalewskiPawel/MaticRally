import Phaser from "phaser";

import trackJSON from "../assets/tracks/long_with_os.json";
import terrainsAtlasJSON from "../assets/spritesheets/terrains.json";
import terrainsAtlasPNG from "../assets/spritesheets/terrains.png";
import roadsAtlasJSON from "../assets/spritesheets/roads.json";
import roadsAtlasPNG from "../assets/spritesheets/roads.png";
import carsAtlasJSON from "../assets/spritesheets/cars.json";
import carsAtlasPNG from "../assets/spritesheets/cars.png";
import objectsAtlasJSON from "../assets/spritesheets/objects_spritesheet.json";
import objectAtlasPNG from "../assets/spritesheets/objects_spritesheet.png";

export class Preload extends Phaser.Scene {
  constructor() {
    super({ key: "preload" });
  }

  preload() {
    this.load.setCORS("anonymous");
    this.load.image("roads-tileset", roadsAtlasPNG);
    this.load.image("terrains-tileset", terrainsAtlasPNG);
    this.load.atlas("roads", roadsAtlasPNG, roadsAtlasJSON);
    this.load.atlas("terrains", terrainsAtlasPNG, terrainsAtlasJSON);
    this.load.atlas("cars", carsAtlasPNG, carsAtlasJSON);
    this.load.tilemapTiledJSON("track_1", trackJSON);
    this.load.atlas("objects", objectAtlasPNG, objectsAtlasJSON);
  }

  create() {
    this.scene.start("garage");
    var atlasTexture = this.textures.get("cars");
    var frames = atlasTexture.getFrameNames();
    console.log(frames);
  }

  async update() {}
}
