import Phaser from "phaser";
import { connect } from "@textile/tableland";

import terrainsAtlasJSON from "../assets/spritesheets/terrains.json";
import terrainsAtlasPNG from "../assets/spritesheets/terrains.png";
import roadsAtlasJSON from "../assets/spritesheets/roads.json";
import roadsAtlasPNG from "../assets/spritesheets/roads.png";
import carsAtlasJSON from "../assets/spritesheets/cars.json";
import carsAtlasPNG from "../assets/spritesheets/cars.png";
import objectsAtlasJSON from "../assets/spritesheets/objects_spritesheet.json";
import objectAtlasPNG from "../assets/spritesheets/objects_spritesheet.png";

export class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: "preload" });
  }

  preload() {
    this.load.image("roads-tileset", roadsAtlasPNG);
    this.load.image("terrains-tileset", terrainsAtlasPNG);
    this.load.atlas("roads", roadsAtlasPNG, roadsAtlasJSON);
    this.load.atlas("terrains", terrainsAtlasPNG, terrainsAtlasJSON);
    this.load.atlas("cars", carsAtlasPNG, carsAtlasJSON);
    this.load.atlas("objects", objectAtlasPNG, objectsAtlasJSON);
    this.fetchAds();
  }

  create() {
    this.scene.start("garage");
  }

  async fetchAds() {
    const tbl = await connect({ network: "testnet" });
    const fetchNft = await tbl.query(
      "SELECT image FROM adsnft1_402 WHERE id=0;"
    );

    window.nftAd = fetchNft.data.rows[0][0];
  }
}
