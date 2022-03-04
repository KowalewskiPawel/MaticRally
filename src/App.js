import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import track from "./assets/tracks/test.jpg";
import car from "./assets/cars/car.png";

const App = () => {
  const { Moralis, authenticate, logout, isAuthenticated, user } = useMoralis();
  const [game, setGame] = useState(null);

  useEffect(() => {
    let carSprite;
    let cursors = null;
    let velocity = 0;

    setGame({
      width: 800,
      height: 600,
      type: Phaser.AUTO,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: {
        preload: function () {
          this.load.setCORS("anonymous");
          this.textures.addBase64("car", car);
          this.load.image("background", track);
        },
        create: async function () {
          this.add.image(400, 300, "background").setScale(0.9);
          carSprite = await this.physics.add
            .sprite(500, 200, "car")
            .setScale(0.4)
            .refreshBody();

          this.physics.p2.enable(carSprite);
          carSprite.body.angle = 90;

          cursors = await this.input.keyboard.createCursorKeys();
        },
        update: async function () {
          if (cursors.up.isDown && velocity <= 400) {
            velocity += 7;
          } else {
            if (velocity >= 7) velocity -= 7;
          }

          carSprite.body.velocity.x =
            velocity * Math.cos((carSprite.angle - 90) * 0.01745);
          carSprite.body.velocity.y =
            velocity * Math.sin((carSprite.angle - 90) * 0.01745);

          if (cursors.left.isDown)
            carSprite.body.angularVelocity = -5 * (velocity / 1000);
          else if (cursors.right.isDown)
            carSprite.body.angularVelocity = 5 * (velocity / 1000);
          else carSprite.body.angularVelocity = 0;
        },
      },
    });
  }, []);

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
