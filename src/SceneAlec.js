import Phaser from 'phaser';

export default class SceneAlec extends Phaser.Scene {
  constructor() {
    super('SceneAlec');
  }

  create() {
    const { height, width } = this.game.config;
    const atlasTexture = this.textures.get('alec');
    const { frames } = atlasTexture;

    console.log('atlas', atlasTexture);
    console.log('frames', frames);

    this.player = this.add.sprite(0, height, 'alec', frames).setOrigin(0, 1);
    console.log('this.player', this.player);
    this.ground = this.add
      .tileSprite(0, height, width, 26, 'ground')
      .setOrigin(0, 1);
    //   const frameNames = this.anims.generateFrameNames('alec', {
    //     start: 1,
    //     end: 9,
    //   });
    //   this.anims.create({
    //     key: 'walk',
    //     frames: frameNames,
    //     frameRate: 15,
    //     repeat: -1,
    //   });
    //   this.player.anims.play('walk');
    // }
  }
}
