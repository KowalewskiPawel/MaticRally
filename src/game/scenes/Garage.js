import Phaser from "phaser";

export class Garage extends Phaser.Scene {
  constructor() {
    super({ key: "garage" });
  }

  preload() {
    this.load.setCORS("anonymous");
  }

  create() {
    this.add.image(0, 0, "car_black_small_3");
  }

  async update() {}
}
