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
    let tracker1;
    let tracker2;

    setGame({
      width: 800,
      height: 600,
      type: Phaser.AUTO,
      physics: {
        default: "matter",
        matter: {
          debug: false,
          gravity: {
            x: 0,
            y: 0,
          },
        },
      },
      scene: {
        preload: function () {
          this.load.setCORS("anonymous");
          this.textures.addBase64("car", car);
          this.load.image("background", track);
        },
        create: async function () {
          this.add.tileSprite(400, 300, 800, 600, "background");

          car = this.matter.add.image(400, 300, "car");
          car.setAngle(-90);
          car.setFrictionAir(0.1);
          car.setMass(10);

          this.matter.world.setBounds(0, 0, 800, 600);

          tracker1 = this.add.rectangle(0, 0, 4, 4, 0x00ff00);
          tracker2 = this.add.rectangle(0, 0, 4, 4, 0xff0000);

          cursors = this.input.keyboard.createCursorKeys();
        },
        update: async function () {
          var point1 = car.getTopRight();
          var point2 = car.getBottomRight();

          tracker1.setPosition(point1.x, point1.y);
          tracker2.setPosition(point2.x, point2.y);

          var speed = 0.25;
          // var angle = { x: speed * Math.cos(car.body.angle), y: speed * Math.sin(car.body.angle) };
          // var angle = { x: 0, y: 0 };

          if (cursors.left.isDown) {
            car.applyForceFrom(
              { x: point1.x, y: point1.y },
              { x: -speed * Math.cos(car.body.angle), y: 0 }
            );

            // Phaser.Physics.Matter.Matter.Body.setAngularVelocity(car.body, -0.05);
            // car.angle -= 4;
          } else if (cursors.right.isDown) {
            car.applyForceFrom(
              { x: point2.x, y: point2.y },
              { x: speed * Math.cos(car.body.angle), y: 0 }
            );

            // car.applyForceFrom();
            // Phaser.Physics.Matter.Matter.Body.setAngularVelocity(car.body, 0.05);
            // car.angle += 4;
          }

          if (cursors.up.isDown) {
            car.thrust(0.025);
          } else if (cursors.down.isDown) {
            car.thrustBack(0.1);
          }
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
