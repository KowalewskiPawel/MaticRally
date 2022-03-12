import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { useMoralis, useNFTBalances } from "react-moralis";
import { useEffect, useState } from "react";
import { connect } from "@textile/tableland";

import track from "./game/assets/tracks/test.jpg";
import car from "./game/assets/cars/car.png";

const img = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDEuMTUgNjUuMjQiPjxkZWZzPjxzdHlsZT4uYSwuYntmaWxsOiNkOTIzMmU7fS5he2ZpbGwtcnVsZTpldmVub2RkO308L3N0eWxlPjwvZGVmcz48dGl0bGU+bWljcm9zdHJhdGVneS1sb2dvX3JlZDwvdGl0bGU+PHBhdGggY2xhc3M9ImEiIGQ9Ik0xODUuMTIsNDMuNzlsNS44LTEuMTItNC44NS0xLjA3LDIuNTQtMy4wNy00LjQzLDEuMThMMTg1LDM1LjMzbC0zLjA4LDItMS40Mi01LjY4LTEuMjUsNi41MS0zLjc4LTIuOSwxLjI0LDMuOS0zLjU1LS42NCwzLDMuMjUtNS4wOSwxLDUuMTUsMS4xMi0yLjA3LDIuMzEsMy4xOS0uMjMtMS40OCw0LjM2LDMuNTUtMy42LDEsNS44LDEuMTItNS44LDIuNzIsMi45TDE4NCw0NmwzLjkxLDEuMzdabS0yLTEuNTRhMi40LDIuNCwwLDEsMS0yLjQxLTIuNEEyLjQxLDIuNDEsMCwwLDEsMTgzLjE0LDQyLjI1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNi45NCAtMzEuNjcpIi8+PHBhdGggY2xhc3M9ImIiIGQ9Ik01MTQsNTUuMThoMC44OWMwLjYsMCwuNzMuMjksMC43MywwLjZzLTAuMTMuNTctLjczLDAuNkg1MTR2LTEuMlptMC43NywxLjY2YTAuNzQsMC43NCwwLDAsMSwuNTguMTgsMS41MiwxLjUyLDAsMCwxLC4yMy44Niw3LjEsNy4xLDAsMCwwLC4xNC43MWgwLjU3YTUuNTYsNS41NiwwLDAsMS0uMjQtMS4xNiwwLjczLDAuNzMsMCwwLDAtLjU5LTAuNzloMGEwLjkzLDAuOTMsMCwwLDAsLjczLTAuOTQsMS4wOCwxLjA4LDAsMCwwLTEuMzItMWgtMS4zOHYzLjg4SDUxNFY1Ni44NWgwLjc1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNi45NCAtMzEuNjcpIi8+PHBhdGggY2xhc3M9ImIiIGQ9Ik01MTcuNTEsNTYuNjVhMi44LDIuOCwwLDEsMS0yLjgtMi44QTIuOCwyLjgsMCwwLDEsNTE3LjUxLDU2LjY1Wm0tMi44LTMuMzZhMy4zNiwzLjM2LDAsMSwwLDMuMzcsMy4zNkEzLjM2LDMuMzYsMCwwLDAsNTE0LjcxLDUzLjI5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNi45NCAtMzEuNjcpIi8+PHBhdGggY2xhc3M9ImIiIGQ9Ik0xNTEuMjgsNDEuMThMMTQ2LjU2LDU3LjZhNDcuMjUsNDcuMjUsMCwwLDAtMS4wNSw1LjU1aC0wLjM5bC01Ljc3LTIySDEyMy43MUwxMTYuOTQsODNoMTQuN2wxLjc3LTE3Ljg2YzAuMTctMS42Ni4yOC0zLjM4LDAuMzktNWgwLjVhMjguNjUsMjguNjUsMCwwLDAsLjk1LDUuMjJMMTQwLjY4LDgzaDguODhsNi0xOC43NWEzNi4wOCwzNi4wOCwwLDAsMCwxLTQuMTZoMC4yN0wxNTguOTMsODNoMTQuN2wtNi44Ny00MS44MkgxNTEuMjhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE2Ljk0IC0zMS42NykiLz48cGF0aCBjbGFzcz0iYiIgZD0iTTE4OCw2My44MVY1My41NUgxNzMuNjhWODNIMTg4VjczLjI0YzEuODksNi43OCw3Ljg5LDEwLjQzLDE1LjczLDEwLjQzYTIzLjcyLDIzLjcyLDAsMCwwLDcuMjEtMS4zOWwwLjYxLTEyLjA5Yy0xLjY2LDEuMTctMy4zMywyLjI3LTUuNTQsMi4yN2E0LjMsNC4zLDAsMSwxLC4yOC04LjYsOC4zMyw4LjMzLDAsMCwxLDUuMjcsMi40NFY1NC4zOGEyOS4zLDI5LjMsMCwwLDAtOS0xLjVBMTQuODEsMTQuODEsMCwwLDAsMTg4LDYzLjgxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNi45NCAtMzEuNjcpIi8+PHBhdGggY2xhc3M9ImIiIGQ9Ik00OTUuODksNTNsLTUuMTEsMTEuNTQtMS40Myw0LjQ5SDQ4OWwtMC4xMi00LjQ5TDQ4Ny40LDUzSDQ1OC44NmwtMC4yOCw0LjIxaC0wLjM5YTguMDUsOC4wNSwwLDAsMC03LjgzLTQuODhjLTcuMTMsMC0xMi40Nyw2LjE1LTE0LjQ4LDEyLjU5LTAuNzUtNy42LTcuMS0xMi4wNy0xNS42Mi0xMi4wN2ExOS44OSwxOS44OSwwLDAsMC0xNi4xMyw3Ljg3bDEuMTEtNy00LjguMjJMNDAyLDQ0LjA2SDM4Ny41OUwzODYsNTMuOTRsLTMtLjE5LDAtLjE1SDM2OWwtMC4xLDMuNWgtMC4zNGMtMS42NS0yLjg5LTQuMzktNC4xNi03Ljk0LTQuMTYtNywwLTEyLjExLDUuNjUtMTQuMzIsMTEuODRsMS44NC0xMS42MmMtNC44LS4xMS03LjU0LjcyLTEwLjcxLDQuNmgtMC4zM2wxLTMuOTRIMzIzLjc1bC00Ljg4LjIsMS41Ni05Ljg3SDMwNkwzMDQuNDUsNTQsMzAxLDUzLjhsLTEuNDIsOWMtMS40Ni0yLjk0LTQuNTMtNC42Ni04LjQ2LTUuNTdsLTMuMzEtLjc4Yy0xLjEyLS4yOC0zLTAuNS0yLjczLTIuMDUsMC4yOC0xLjcyLDIuMjktMi4yMiwzLjYzLTIuMjJBMTMuNiwxMy42LDAsMCwxLDI5Nyw1NS4zbDUuOC0xMC43MWEyMiwyMiwwLDAsMC0xMi42OC0zLjY2Yy05LjEsMC0xOSw1LjU1LTIwLjU5LDE1LjQ4LTEsNi41NSwzLjQsMTAsOS4xNywxMS4wOWwzLDAuNTZjMS4zNCwwLjI4LDMuMzEuNDQsMywyLjMzcy0yLjc4LDIuNS00LjI4LDIuNWExMy41NywxMy41NywwLDAsMS04Ljg4LTMuODNzLTAuMzEtLjI5LTAuODQtMC44NGMtMC4yMy0xMC04LjI3LTE1LjMzLTE3Ljg0LTE1LjMzLTYuMzMsMC0xMiwyLjMzLTE1LjE2LDYuNzlWNTIuODhjLTQuODItLjExLTcuNDMuNzItMTAsNC42aC0wLjMzbDAuMzMtMy45NEgyMTMuNFY4M2gxNC4zMVY3MS42OWMwLTMuNjYsMS44OS01Ljg4LDUuNi01Ljg4YTUuNTcsNS41NywwLDAsMSwxLjg4LjMzLDE3Ljg1LDE3Ljg1LDAsMCwwLS4xOSwyLjVjMCw5Ljc2LDguNjYsMTUsMTcuODYsMTVhMjAuODQsMjAuODQsMCwwLDAsMTEuNjMtMy4zMywzMy45LDMzLjksMCwwLDAsMTUuMzIsMy43NWM5LDAsMTguOTItNC45NCwyMC41LTE0LjkyYTEyLjA3LDEyLjA3LDAsMCwwLDAtNC4xOWwyLjQ3LS4xOS0yLjksMTguM2gxNC40MmwyLjktMTguMyw0LjgsMC4yOS0yLjg4LDE4LjE5SDMzMy40bDEuNzktMTEuMzJjMC41OC0zLjY2LDIuODEtNS44OCw2LjUzLTUuODhhNi4yMyw2LjIzLDAsMCwxLDMuODIsMS40MWMtMC4wNy4zMy0uMTQsMC42Ni0wLjE5LDEtMS4xMyw3LjE1LDIsMTUuMjUsMTAsMTUuMjUsNCwwLDYuNjYtMS43Nyw5LjcxLTQuNTVoMC4zM0wzNjQuMzQsODNoMTRsMi44Ny0xOC4xMSwzLjA4LS4yNEwzODEuNDIsODNoMTQuNDJsMi45LTE4LjMsMy4xNSwwLjE4YTE4Ljc1LDE4Ljc1LDAsMCwwLTEsMy44N2MtMS42LDEwLjE1LDYuMTIsMTQuOTIsMTUuMzksMTQuOTIsNi43NywwLDE1LjIyLTMuMjcsMTguMjMtMTAuMzdINDIwLjUzYTMuNTYsMy41NiwwLDAsMS0zLjI3LDIuNDRjLTMsMC0zLTIuNjYtMi41OC01SDQzNWMwLDYuMzgsMy40NSwxMi40NiwxMC40MiwxMi40NiwzLjM4LDAsNy40Ny0xLjY2LDkuNDItNC44OGgwLjM5bC0wLjc1LDNjLTAuOTEsMy42Ni0zLjY5LDYuNDktNy41Nyw2LjQ5YTE0LjQzLDE0LjQzLDAsMCwxLTkuNzUtMy42bC00Ljc0LDkuOTMsMS4zNywwLjVhMzIuMTYsMzIuMTYsMCwwLDAsMTIuMjgsMi4zM2MxMC4yNiwwLDIwLjQzLTQuNjYsMjIuMjUtMTYuMTRsNC4xNC0yNi4xNiw3Ljg5LDI0Ljk0LTEwLDE1LjA5aDE1LjA4TDUxMC45Miw1M2gtMTVaTTI1My41MSw3Mi42YTQsNCwwLDAsMS00LTQsNCw0LDAsMSwxLDgsMEE0LDQsMCwwLDEsMjUzLjUxLDcyLjZabTExMy42NS00LjUzYy0wLjM2LDIuMjctMS44MSw0LjQ0LTQuNTMsNC40NHMtMy40LTItMy00LjMyYTQuNjEsNC42MSwwLDAsMSw0LjM2LTRDMzY2LjIzLDY0LjEzLDM2Ny41Miw2NS43OSwzNjcuMTYsNjguMDdabTU1LjQtMy41NCwwLDAuMTdINDE1LjRsMC0uMjRhNC4zOSw0LjM5LDAsMCwxLDMuMjgtMy45MywzLjkyLDMuOTIsMCwwLDEsLjc1LTAuMDcsMywzLDAsMCwxLDIuMzMsMUEzLjczLDMuNzMsMCwwLDEsNDIyLjU2LDY0LjUzWk00NTcsNjcuODFjLTAuMzUsMi4yMi0xLjgyLDQuMS00LjI2LDQuMXMtMy43Ni0xLjc3LTMuMzktNC4xNkE0Ljg1LDQuODUsMCwwLDEsNDU0LDYzLjU0QzQ1Ni4zNiw2My41NCw0NTcuMzYsNjUuNTksNDU3LDY3LjgxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNi45NCAtMzEuNjcpIi8+PC9zdmc+';




const NFTBalances = () => {
  const { getNFTBalances, data, error, isLoading, isFetching } =
    useNFTBalances();
  return (
    <div>
      {error && <>{JSON.stringify(error)}</>}
      <button onClick={() => getNFTBalances({ params: { chain: "mumbai" } })}>
        Refetch NFTBalances
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const App = () => {
  const { Moralis, authenticate, logout, isAuthenticated, user } = useMoralis();
  const [game, setGame] = useState(null);
  const [nft, setNft] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      const tbl = await connect({ network: "testnet" });
      const fetchNft = await tbl.query(
        "SELECT image FROM adsnft1_402 WHERE id=0;"
      );
      setNft(fetchNft.data.rows[0][0]);
    };

    connectWallet();
  }, []);

  useEffect(() => {
    if (nft) {
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
                y: 0,
              },
            },
          },
          preload: async function () {
            this.load.setCORS("anonymous");
            this.textures.addBase64("car", car);
            this.shardsImg = new Image();
            console.log(nft);
            this.shardsImg.onload = () => {
              this.textures.addSpriteSheet("shards", this.shardsImg, {
                frameWidth: 160,
                frameHeight: 160,
              });
            };
            this.shardsImg.crossOrigin = "anonymous";
            this.shardsImg.src = nft;
            this.load.image("background", track);
          },

          create: async function () {
            this.add.image(400, 300, "background").setScale(0.9);
            this.add.image(100, 100, "shards");

            carSprite = this.matter.add.image(400, 300, "car").setScale(0.4);
            carSprite.setAngle(0);
            carSprite.setFrictionAir(0.1);
            carSprite.setMass(400);

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
              carSprite.thrust(0.45);
            } else if (cursors.down.isDown) {
              carSprite.thrustBack(0.25);
            }

            if (isMoving) {
              const moveDir = cursors.up.isDown ? 1 : -1;

              if (cursors.left.isDown) {
                carSprite.setAngle((carSprite.angle -= 1 * moveDir));
              }

              if (cursors.right.isDown) {
                carSprite.setAngle((carSprite.angle += 1 * moveDir));
              }
            }

            // console.log({isMoving, angle: carSprite.angle})
          },
        },
      });
    }
  }, [nft]);

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
      <NFTBalances />
      <IonPhaser game={game} initialize={true} />
    </>
  );
};

export default App;
