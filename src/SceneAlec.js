import Phaser from 'phaser';

export default class SceneAlec extends Phaser.Scene {
  constructor() {
    super('SceneAlec');
  }

  create() {
    const { height, width } = this.game.config;

    const atlasTexture = this.textures.get('alec');
    const frames = atlasTexture.getFrameNames();
    for (let i = 0; i < frames.length; i += 1) {
      const x = 0;
      this.add.image(x, height, 'alec', frames[i]).setOrigin(0, 1);
    }

    this.anims.play();
    this.ground = this.add
      .tileSprite(0, height, width, 26, 'ground')
      .setOrigin(0, 1);
  }
}
