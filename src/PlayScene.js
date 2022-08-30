import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    const { height, width } = this.game.config;
    this.gameSpeed = 7;
    this.isGameRunning = false;
    this.respawnTime = 0;
    this.score = 0;
    this.dude = '';

    const atlasTexture = this.textures.get('alec');
    const frames = atlasTexture.getFrameNames();
    for (let i = 0; i < frames.length; i += 1) {
      let x = 0;
      this.dude = this.add.image(x, height, 'alec', frames[i]).setOrigin(0, 1);
      x += 1;
      console.log(this.dude);
    }

    this.jumpSound = this.sound.add('jump', { volume: 0.2 });
    this.hitSound = this.sound.add('hit', { volume: 0.2 });
    this.reachSound = this.sound.add('reach', { volume: 0.2 });

    this.startTrigger = this.physics.add
      .sprite(0, 10)
      .setOrigin(0, 1)
      .setImmovable();
    this.ground = this.add
      .tileSprite(0, height, width, 26, 'ground')
      .setOrigin(0, 1);

    this.scoreText = this.add
      .text(width, 0, '00000', {
        fill: '#535353',
        font: '900 35px Courier',
        resolution: 5,
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = this.add
      .text(0, 0, '00000', {
        fill: '#535353',
        font: '900 35px Courier',
        resolution: 5,
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.environment = this.add.group();
    this.environment.addMultiple([
      this.add.image(width / 2, 170, 'cloud'),
      this.add.image(width - 80, 80, 'cloud'),
      this.add.image(width / 1.3, 100, 'cloud'),
    ]);
    this.environment.setAlpha(0);

    this.gameOverScreen = this.add
      .container(width / 2, height / 2 - 50)
      .setAlpha(0);
    this.gameOverText = this.add.image(0, 0, 'game-over');
    this.restart = this.add.image(0, 80, 'restart').setInteractive();
    this.gameOverScreen.add([this.gameOverText, this.restart]);

    this.obsticles = this.physics.add.group();
    // this.anims.play();
    this.initAnims();
    this.initStartTrigger();
    this.initColliders();
    this.handleInputs();
    this.handleScore();
  }

  initColliders() {
    this.physics.add.collider(
      this.dude,
      this.obsticles,
      () => {
        this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

        const highScore = this.highScoreText.text.substr(
          this.highScoreText.text.length - 5
        );
        const newScore =
          Number(this.scoreText.text) > Number(highScore)
            ? this.scoreText.text
            : highScore;

        this.highScoreText.setText(`HI ${newScore}`);
        this.highScoreText.setAlpha(1);

        this.physics.pause();
        this.isGameRunning = false;
        this.anims.pauseAll();
        this.dude.setTexture('dino-hurt');
        this.respawnTime = 0;
        this.gameSpeed = 7;
        this.gameOverScreen.setAlpha(1);
        this.score = 0;
        this.hitSound.play();
      },
      null,
      this
    );
  }

  initStartTrigger() {
    const { width, height } = this.game.config;
    this.physics.add.overlap(
      this.startTrigger,
      this.dude,
      () => {
        if (this.startTrigger.y === 10) {
          this.startTrigger.body.reset(0, height);
          return;
        }

        this.startTrigger.disableBody(true, true);

        const startEvent = this.time.addEvent({
          delay: 1000 / 60,
          loop: true,
          callbackScope: this,
          callback: () => {
            this.dude.setVelocityX(80);
            this.dude.play('dino-run', 1);

            if (this.ground.width < width) {
              this.ground.width += 17 * 2;
            }

            if (this.ground.width >= 1000) {
              this.ground.width = width;
              this.isGameRunning = true;
              this.dude.setVelocityX(0);
              this.scoreText.setAlpha(1);
              this.environment.setAlpha(1);
              startEvent.remove();
            }
          },
        });
      },
      null,
      this
    );
  }

  initAnims() {
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('alec', { start: 1, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('alec', {
        start: 7,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
    const run = this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('alec', {
        start: 1,
        end: 8,
      }),
      frameRate: 15,
      repeat: -1,
    });
    this.anims.play('alec', 'run');
    // this.anims.create({
    //   key: 'enemy-dino-fly',
    //   frames: this.anims.generateFrameNumbers('enemy-bird', {
    //     start: 0,
    //     end: 1,
    //   }),
    //   frameRate: 6,
    //   repeat: -1,
    // });
  }

  handleScore() {
    this.time.addEvent({
      delay: 1000 / 10,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) {
          return;
        }

        this.score += 1;
        this.gameSpeed += 0.01;

        if (this.score % 100 === 0) {
          this.reachSound.play();

          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true,
          });
        }

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 5 - String(this.score).length; i++) {
          score.unshift(0);
        }

        this.scoreText.setText(score.join(''));
      },
    });
  }

  handleInputs() {
    this.restart.on('pointerdown', () => {
      this.dude.setVelocityY(0);
      this.dude.body.height = 92;
      this.dude.body.offset.y = 0;
      this.physics.resume();
      this.obsticles.clear(true, true);
      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
    });

    this.input.keyboard.on('keydown_SPACE', () => {
      if (!this.dude.body.onFloor() || this.dude.body.velocity.x > 0) {
        return;
      }

      this.jumpSound.play();
      this.dude.body.height = 92;
      this.dude.body.offset.y = 0;
      this.dude.setVelocityY(-1600);
      this.dude.setTexture('dino', 0);
    });

    this.input.keyboard.on('keydown_DOWN', () => {
      if (!this.dude.body.onFloor() || !this.isGameRunning) {
        return;
      }

      this.dude.body.height = 58;
      this.dude.body.offset.y = 34;
    });

    this.input.keyboard.on('keyup_DOWN', () => {
      if (this.score !== 0 && !this.isGameRunning) {
        return;
      }

      this.dude.body.height = 92;
      this.dude.body.offset.y = 0;
    });
  }

  placeObsticle() {
    const obsticleNum = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);

    let obsticle;
    if (obsticleNum > 6) {
      const enemyHeight = [20, 50];
      obsticle = this.obsticles
        .create(
          this.game.config.width + distance,
          this.game.config.height - enemyHeight[Math.floor(Math.random() * 2)],
          `enemy-bird`
        )
        .setOrigin(0, 1);
      obsticle.play('enemy-dino-fly', 1);
      obsticle.body.height = obsticle.body.height / 1.5;
    } else {
      obsticle = this.obsticles
        .create(
          this.game.config.width + distance,
          this.game.config.height,
          `obsticle-${obsticleNum}`
        )
        .setOrigin(0, 1);

      obsticle.body.offset.y = +10;
    }

    obsticle.setImmovable();
  }

  update(time, delta) {
    if (!this.isGameRunning) {
      return;
    }

    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), -0.5);

    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1500) {
      this.placeObsticle();
      this.respawnTime = 0;
    }

    this.obsticles.getChildren().forEach((obsticle) => {
      if (obsticle.getBounds().right < 0) {
        this.obsticles.killAndHide(obsticle);
      }
    });

    this.environment.getChildren().forEach((env) => {
      if (env.getBounds().right < 0) {
        env.x = this.game.config.width + 30;
      }
    });

    if (this.dude.body.deltaAbsY() > 0) {
      this.dude.anims.stop();
      this.dude.setTexture('dino', 0);
    } else {
      this.dude.body.height <= 58
        ? this.dude.play('dino-down-anim', true)
        : this.dude.play('dino-run', true);
    }
  }
}

export default PlayScene;
