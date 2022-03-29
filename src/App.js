import Phaser from "phaser";
import { ethers } from "ethers";
import { IonPhaser } from "@ion-phaser/react";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import { Game, Preloader, Garage } from "./game/scenes";
import { CONTRACT_ADDRESS } from "./consts";
import Rally3 from "./abi/Rally3.json";
import disconnectWalletBtn from "./game/assets/images/buttons/disconnect_wallet_button.png"
import connectWalletBtn from "./game/assets/images/buttons/connect_wallet_button.png"
import welcomeImg from "./game/assets/images/welcome.png"

import transformDriverData from "./utils";

const App = () => {
  const { Moralis, authenticate, logout, isAuthenticated, user } = useMoralis();
  const [game, setGame] = useState(null);
  const [driverNFT, setDriverNFT] = useState(null);
  const [dappContract, setDappContract] = useState(null);
  const [nftAd, setNftAd] = useState(null);

  useEffect(() => {
    setGame({
      width: 1024,
      height: 768,
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
      scene: [Preloader, Game, Garage],
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
      window.Moralis = Moralis;
      window.user = user;

      try {
        memberNFT = await dappContract.checkIfUserHasNFT();
        if (memberNFT) {
          setDriverNFT(transformDriverData(memberNFT));
          window.memberNFT = driverNFT;
        }
      } catch (error) {
        window.memberNFT = null;
      }
    };

    fetchNFTMetadata();
  }, [isAuthenticated, user, driverNFT]);

  if (!isAuthenticated) {
    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <div style={{
          width: 513,
          height: 436,
          display: "flex",
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${welcomeImg})`
        }} >
          <button style={{
            margin: 0,
            padding: 0,
            border: "none",
            backgroundColor: "transparent"
          }} onClick={() => authenticate()}>
            <img src={connectWalletBtn}></img>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <IonPhaser game={game} initialize={true} />
      <button style={{
        margin: 0,
        padding: 0,
        border: "none",
        backgroundColor: "transparent"
      }} onClick={() => logout()}>
        <img src={disconnectWalletBtn}></img>
      </button>
    </div>
  );
};

export default App;
