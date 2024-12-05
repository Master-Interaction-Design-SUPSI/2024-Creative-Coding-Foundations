class CollisionBlock {
  constructor({ position }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class trapBlock {
  constructor({ position }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
