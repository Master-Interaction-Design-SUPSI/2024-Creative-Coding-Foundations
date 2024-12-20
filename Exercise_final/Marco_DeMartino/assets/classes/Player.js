class Player extends Sprite {
  constructor({ collisionBlocks = [], imageSrc, frameRate, animations, loop }) {
    super({ imageSrc, frameRate, animations, loop });
    this.position = {
      x: 200,
      y: 300,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.sides = {
      bottom: this.position.y + this.height,
    };

    this.gravity = 1;

    this.collisionBlocks = collisionBlocks;
    console.log(this.collisionBlocks);

    this.trapBlocks = trapBlocks;
  }

  update() {
    // c.fillStyle = "rgba(0, 0, 255, 0.5)";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    this.position.x += this.velocity.x;

    this.updateHitbox();

    this.checkForHorizontalCollisions();

    this.applyGravity();

    this.updateHitbox();

    /* c.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.width,
      this.hitbox.height
    );
    */

    this.checkForVerticalCollisions();

    this.checkForTrapCollisions();
  }

  handleInput(keys) {
    if (player.preventInput) return;
    player.velocity.x = 0;
    if (keys.ArrowRight.pressed) {
      player.switchSprite("runRight");
      player.velocity.x = 3;
      player.lastDIrection = "right";
    } else if (keys.ArrowLeft.pressed) {
      player.velocity.x = -3;
      player.switchSprite("runLeft");
      player.lastDIrection = "left";
    } else {
      if (player.lastDIrection === "left") player.switchSprite("idleLeft");
      else player.switchSprite("idle");
    }
  }

  switchSprite(name) {
    if (this.image === this.animations[name].image) return;
    this.currentFrame = 0;
    this.image = this.animations[name].image;
    this.frameRate = this.animations[name].frameRate;
    this.frameBuffer = this.animations[name].frameBuffer;
    this.loop = this.animations[name].loop;
    this.currentAnimation = this.animations[name];
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 65,
        y: this.position.y + 60,
      },
      width: 50,
      height: 60,
    };
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        this.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
          collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
          collisionBlock.position.y &&
        this.hitbox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      // if a collision exist
      if (
        this.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
          collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
          collisionBlock.position.y &&
        this.hitbox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        // collision x axis if going left
        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
        if (this.velocity.x > 0) {
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
      }
    }
  }

  checkForTrapCollisions() {
    const marginX = 10; // margine collisione

    for (let i = 0; i < this.trapBlocks.length; i++) {
      const trapBlock = this.trapBlocks[i];

      // riduzione zona collisione
      const reducedTrap = {
        x: trapBlock.position.x + marginX,
        y: trapBlock.position.y,
        width: trapBlock.width - 2 * marginX,
        height: trapBlock.height,
      };

      if (
        this.hitbox.position.x <= reducedTrap.x + reducedTrap.width &&
        this.hitbox.position.x + this.hitbox.width >= reducedTrap.x &&
        this.hitbox.position.y + this.hitbox.height >= reducedTrap.y &&
        this.hitbox.position.y <= reducedTrap.y + reducedTrap.height
      ) {
        console.log("Trap collision!");
        levels[level].init();
        player.switchSprite("idle");
        player.preventInput = false;
      }
    }
  }
}
