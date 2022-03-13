import Phaser from "phaser";
import { ethers } from "ethers";
import { IonPhaser } from "@ion-phaser/react";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { Game, Preloader, Garage } from "./game/scenes";
import { CONTRACT_ADDRESS } from "./consts";
import Rally3 from "./abi/Rally3.json";

import transformDriverData from "./utils";

const App = () => {
  const { Moralis, authenticate, logout, isAuthenticated, user } = useMoralis();
  const [game, setGame] = useState(null);
  const [driverNFT, setDriverNFT] = useState(null);
  const [dappContract, setDappContract] = useState(null);

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
            y: 0,
          },
        },
      },
      scene: [Preloader, Game, Garage]
    });
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const dappContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Rally3.abi,
        signer
      );
      let memberNFT;

      setDappContract(dappContract);
      window.dappContract = dappContract;

      try {
        memberNFT = await dappContract.checkIfUserHasNFT();
      } catch (error) {
        window.memberNFT = null;
      }

      if (memberNFT) {
        setDriverNFT(transformDriverData(memberNFT));
        window.memberNFT = driverNFT;
      }
    };

    fetchNFTMetadata();
  }, [isAuthenticated, user]);

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
