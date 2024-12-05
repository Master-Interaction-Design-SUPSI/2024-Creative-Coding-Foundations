window.addEventListener("keydown", (event) => {
  if (player.preventInput) return;
  switch (event.code) {
    case "Space":
      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];

        if (
          player.hitbox.position.x <= door.position.x + door.width &&
          player.hitbox.position.x + player.hitbox.width >= door.position.x &&
          player.hitbox.position.y + player.hitbox.height >= door.position.y &&
          player.hitbox.position.y <= door.position.y + door.height
        ) {
          player.velocity.x = 0;
          player.velocity.y = 0;
          player.preventInput = true;
          player.switchSprite("enterDoor");
          door.play();
          return;
        }
      }

      if (player.velocity.y === 0) {
        if (event.repeat) {
          return;
        }
        player.velocity.y = -20;
      }

      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  console.log(event.code);
  switch (event.code) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
