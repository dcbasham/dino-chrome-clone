import Phaser from 'phaser';

const character = {};
export default class SceneAlec extends Phaser.Scene {
  constructor() {
    super('SceneAlec');
  }

  create() {
    const { height, width } = this.game.config;
    const atlasTexture = this.textures.get('alec');
    console.log('atlas', atlasTexture);
    const { frames } = atlasTexture;
    console.log('frames', frames);
    this.character = this.physics.add
      .sprite(0, height, 'alec')
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .setBodySize(44, 92)
      .setDepth(1)
      .setOrigin(0, 1);

    this.ground = this.add
      .tileSprite(0, height, width, 26, 'ground')
      .setOrigin(0, 1);
  }
}
