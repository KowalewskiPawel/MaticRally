import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import trackJSON from "./game/assets/tracks/track_1.json"
import track from "./game/assets/tracks/Road_1.png";
import car from "./game/assets/cars/car_red_1.png";
import { Game } from "./game/scenes/Game";

const App = () => {
  const { Moralis, authenticate, logout, isAuthenticated, user } = useMoralis();
  const [game, setGame] = useState(null);

  useEffect(() => {
    let carSprite;
    let cursors;
    let tracker1;
    let tracker2;

    setGame({
      width: 800,
      height: 600,
      type: Phaser.AUTO,
      physics: {
        default: "matter",
        matter: {
          debug: true,
          gravity: {
            x: 0,
            y: 0
          }
        }
      },
      scene: Game
      // scene: {
      //   preload: function () {
      //     this.load.setCORS("anonymous");
      //     this.textures.addBase64("car", car);
      //     this.load.image("background", track);
      //     this.load.tilemapTiledJSON('track_1', trackJSON);
          
      //   },

      //   create: async function () {
      //     const trackMap = this.make.tilemap({key: 'track_1'})
      //     console.log(trackMap)
      //     // trackMap.createStaticLayer(0);
      //     const grass = trackMap.addTilesetImage('grass');

      //     const road = trackMap.addTilesetImage('asphalt_road');
      //     trackMap.createLayer('grass', grass, 0,0);
      //     // this.add.image(400, 300, "background").setScale(0.6);

      //     carSprite = this.matter.add.image(400, 300, 'car').setScale(0.6);
      //     carSprite.setAngle(0);
      //     carSprite.setFrictionAir(0.1);
      //     carSprite.setMass(200);
      //     // carSprite.body.setInertia(15);

      //     this.cameras.main.startFollow(carSprite, true);

      //     // this.matter.world.setBounds(0, 0, 800, 600);

      //     tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
      //     tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

      //     cursors = await this.input.keyboard.createCursorKeys();
      //     console.log(carSprite)
      //   },
      //   update: async function () {
      //     var point1 = carSprite.getTopRight();
      //     var point2 = carSprite.getBottomRight();
      //     tracker1.setPosition(point1.x, point1.y);
      //     tracker2.setPosition(point2.x, point2.y);
      //     const isMoving = cursors.up.isDown || cursors.down.isDown;

      //     // if (cursors.up.isDown) {
      //     //   carSprite.thrust(2);
      //     // }
      //     // else if (cursors.down.isDown) {
      //     //   carSprite.thrustBack(0.5);
      //     // }

      //     if(isMoving) {
      //       const moveDir = cursors.up.isDown ? 1 : -1;

      //       if (cursors.left.isDown) {
      //         carSprite.setAngle(carSprite.angle -= 4 * moveDir)
      //       }
            
      //       if (cursors.right.isDown) {
      //         carSprite.setAngle(carSprite.angle += 4 * moveDir)
      //       }

      //       const rotation = Phaser.Math.DegToRad(carSprite.angle)
      //       const vec = new Phaser.Math.Vector2()
      //       vec.setToPolar(rotation, 1)
      //       carSprite.applyForce({x: vec.x * moveDir, y: vec.y * moveDir}, {x: 750, y: 0})
      //     }
      //   },
      // },
    });
    console.log({ cursors })
  },
    []);

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate()}>Connect Wallet</button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => logout()}>Disconnect Wallet</button>
      <IonPhaser game={game} initialize={true} />
    </>
  );
};

export default App;
