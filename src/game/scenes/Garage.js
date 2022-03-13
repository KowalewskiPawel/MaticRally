import Phaser from "phaser";
import background from '../assets/images/garage-background.png'
import startRaceBtn from "../assets/images/buttons/start_race_button.png"
import mintRaceBtn from "../assets/images/buttons/mint_car_button.png"



export class Garage extends Phaser.Scene {

    constructor() {
        super({ key: 'garage' });
    }

    preload() {
        this.load.image('garage-background', background);
        this.textures.addBase64('button-start-race', startRaceBtn);
        this.textures.addBase64('button-mint-car', mintRaceBtn);
    }

    create() {
        this.canvas = this.sys.canvas;
        console.log(this.sys);

        this.add.image(this.canvas.width / 2, this.canvas.height / 2, 'garage-background');

        // Car Image
        const carImage = this.add.image(700, 320, 'cars', 'car_blue_1');
        carImage.setAngle(90).setScale(1.3);

        // BUTTONS
        // START RACE
        const startRaceButton = this.add.image(this.canvas.width / 2, this.canvas.height - 64, 'button-start-race');
        startRaceButton.setInteractive();
        startRaceButton.on('pointerdown', () => { console.log('pointerdown'); this.scene.start('game') });

        // MINT CAR

        const mintCarButton = this.add.image(700, 490, 'button-mint-car');
        mintCarButton.setInteractive();
        mintCarButton.on('pointerdown', () => { console.log('pointerup'); alert("NFT MINTED") });

    }

}
