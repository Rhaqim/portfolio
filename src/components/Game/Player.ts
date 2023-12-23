class Player {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public positiion: { x: number; y: number },
    public color: string,
    public spead: number,
    public cavasBounds: { width: number; height: number },
  ) {
    this.ctx = ctx;
    this.positiion = positiion;
    this.color = color;
    this.spead = spead;
    this.cavasBounds = cavasBounds;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.positiion.x, this.positiion.y, 10, 10);
  }

  move(direction: string) {
    switch (direction) {
      case 'left':
        this.positiion.x -= this.spead;
        break;
      case 'right':
        this.positiion.x += this.spead;
        break;
      case 'up':
        this.positiion.y -= this.spead;
        break;
      case 'down':
        this.positiion.y += this.spead;
        break;
      default:
        break;
    }
    this.checkBounds();
  }

  checkBounds() {
    if (this.positiion.x < 0) {
      this.positiion.x = 0;
    }
    if (this.positiion.x > this.cavasBounds.width - 10) {
      this.positiion.x = this.cavasBounds.width - 10;
    }
    if (this.positiion.y < 0) {
      this.positiion.y = 0;
    }
    if (this.positiion.y > this.cavasBounds.height - 10) {
      this.positiion.y = this.cavasBounds.height - 10;
    }
  }
}
