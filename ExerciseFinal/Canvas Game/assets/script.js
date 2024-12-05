const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 64 * 16; // 1024
canvas.height = 64 * 9; // 576

let parsedCollisions;
let collisionBlocks;
let trapBlocks;
let backgroundLevel1;

let doors;

const player = new Player({
  imageSrc: "./assets/img/knight/idle.png",
  frameRate: 3,
  animations: {
    idle: {
      frameRate: 3,
      frameBuffer: 30,
      loop: true,
      imageSrc: "./assets/img/knight/idle.png",
    },
    idleLeft: {
      frameRate: 3,
      frameBuffer: 30,
      loop: true,
      imageSrc: "./assets/img/knight/idleLeft.png",
    },
    runLeft: {
      frameRate: 3,
      frameBuffer: 40,
      loop: true,
      imageSrc: "./assets/img/knight/moveLeft.png",
    },
    runRight: {
      frameRate: 3,
      frameBuffer: 40,
      loop: true,
      imageSrc: "./assets/img/knight/moveRight.png",
    },
    enterDoor: {
      frameRate: 4,
      frameBuffer: 40,
      loop: false,
      imageSrc: "./assets/img/knight/enterDoor.png",
      onComplete: () => {
        console.log("completed animation");
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++;

            if (level === 4) level = 1;
            levels[level].init();
            player.switchSprite("idle");
            player.preventInput = false;
            gsap.to(overlay, {
              opacity: 0,
            });
          },
        });
      },
    },
  },
});

let level = 1;
let levels = {
  1: {
    init: () => {
      parsedTraps = traps1.parse2D();
      trapBlocks = parsedTraps.createTrapObjectsFrom2D();
      player.trapBlocks = trapBlocks;
      parsedCollisions = collisionsLevel1.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      if (player.currentAnimation) player.currentAnimation.isActive = false;
      player.position.x = 96;
      player.position.y = 200;

      backgroundLevel1 = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: "./assets/img/backgroundLevel1.png",
      });

      doors = [
        new Sprite({
          position: {
            x: 776,
            y: 270,
          },
          imageSrc: "./assets/img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 20,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },

  2: {
    init: () => {
      parsedTraps = traps.parse2D();
      trapBlocks = parsedTraps.createTrapObjectsFrom2D();
      player.trapBlocks = trapBlocks;
      parsedCollisions = collisionsLevel2.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 96;
      player.position.y = 40;

      if (player.currentAnimation) player.currentAnimation.isActive = false;

      backgroundLevel1 = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: "./assets/img/backgroundLevel2.png",
      });

      doors = [
        new Sprite({
          position: {
            x: 791,
            y: 334,
          },
          imageSrc: "./assets/img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 20,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },

  3: {
    init: () => {
      parsedTraps = traps3.parse2D();
      trapBlocks = parsedTraps.createTrapObjectsFrom2D();
      player.trapBlocks = trapBlocks;
      parsedCollisions = collisionsLevel3.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 800;
      player.position.y = 40;

      if (player.currentAnimation) player.currentAnimation.isActive = false;

      backgroundLevel1 = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: "./assets/img/backgroundLevel3.png",
      });

      doors = [
        new Sprite({
          position: {
            x: 854,
            y: 400,
          },
          imageSrc: "./assets/img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 20,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },
};

const keys = {
  Space: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

const overlay = {
  opacity: 0,
};

function animate() {
  window.requestAnimationFrame(animate);

  backgroundLevel1.draw();
  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.draw();
  });

  trapBlocks.forEach((trapBlock) => trapBlock.draw());

  doors.forEach((door) => {
    door.draw();
  });

  player.handleInput(keys);
  player.draw();
  player.update();

  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}

levels[level].init();
animate();
