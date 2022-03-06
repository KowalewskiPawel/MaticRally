import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import track from "./game/assets/tracks/test.jpg";
import car from "./game/assets/cars/car.png";

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
      scene: {
        physics: {
          default: "matter",
          arcade: {
            debug: true,
          },
          matter: {
            debug: true,
            gravity: {
              x: 0,
              y: 0
            }
          }
        },
        preload: function () {
          this.load.setCORS("anonymous");
          this.textures.addBase64("car", car);
          this.load.image("background", track);
        },

        create: async function () {
          this.add.image(400, 300, "background").setScale(0.9);

          carSprite = this.matter.add.image(400, 300, 'car');
          carSprite.setAngle(0);
          carSprite.setFrictionAir(0.1);
          carSprite.setMass(10);

          this.matter.world.setBounds(0, 0, 800, 600);

          tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
          tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

          cursors = await this.input.keyboard.createCursorKeys();
        },
        update: async function () {
          var point1 = carSprite.getTopRight();
          var point2 = carSprite.getBottomRight();

          tracker1.setPosition(point1.x, point1.y);
          tracker2.setPosition(point2.x, point2.y);
          const isMoving = cursors.up.isDown || cursors.down.isDown;

          if (cursors.up.isDown) {
            carSprite.thrust(0.025);
          }
          else if (cursors.down.isDown) {
            carSprite.thrustBack(0.025);
          }

          if(isMoving) {
            const moveDir = cursors.up.isDown ? 1 : -1;

            if (cursors.left.isDown) {
              carSprite.setAngle(carSprite.angle -= 1 * moveDir)
            }
            
            if (cursors.right.isDown) {
              carSprite.setAngle(carSprite.angle += 1 * moveDir)
            }
          }

          // console.log({isMoving, angle: carSprite.angle})

        },
      },
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
