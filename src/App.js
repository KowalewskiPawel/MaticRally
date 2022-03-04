import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

const App = () => {
  const { Moralis, authenticate, logout, isAuthenticated, user } = useMoralis();
  const [game, setGame] = useState(null);

  useEffect(() => {
    setGame({
      width: 800,
      height: 600,
      type: Phaser.AUTO,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      scene: {
        preload: function () {},
        create: async function () {},
        update: async function () {},
      },
    });
  }, [user]);

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
