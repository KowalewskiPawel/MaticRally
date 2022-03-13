import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import { Game, Preloader, Garage } from "./game/scenes";

const App = () => {
  const { Moralis, authenticate, logout, isAuthenticated, user } = useMoralis();
  const [game, setGame] = useState(null);

  useEffect(() => {
    setGame({
      width: 1024,
      height: 768,
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
      scene: [Preloader, Game, Garage]
    });
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
