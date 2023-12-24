class Player {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public positiion: { x: number; y: number },
    public dimension: { width: number; height: number },
    public color: string,
    public spead: number,
    public cavasBounds: { width: number; height: number },
  ) {
    this.ctx = ctx;
    this.positiion = positiion;
    this.dimension = dimension;
    this.color = color;
    this.spead = spead;
    this.cavasBounds = cavasBounds;
  }

  /**
   * Draws the player on the canvas.
   */
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.positiion.x,
      this.positiion.y,
      this.dimension.width,
      this.dimension.height,
    );
  }

  /**
   * Checks if the player's position is within the canvas bounds and adjusts it if necessary.
   */
  checkBounds() {
    if (this.positiion.x < 0) {
      this.positiion.x = 0;
    }
    if (this.positiion.x > this.cavasBounds.width - this.dimension.width) {
      this.positiion.x = this.cavasBounds.width - this.dimension.width;
    }
    if (this.positiion.y < 0) {
      this.positiion.y = 0;
    }
    if (this.positiion.y > this.cavasBounds.height - this.dimension.height) {
      this.positiion.y = this.cavasBounds.height - this.dimension.height;
    }
  }

  /**
   * Moves the player in the specified direction.
   * @param direction - The direction to move the player ('left', 'right', 'up', 'down').
   */
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

  /**
   * Handles the keydown event and performs the corresponding action based on the pressed key.
   * @param e - The KeyboardEvent object representing the keydown event.
   */
  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        this.move('left');
        break;
      case 'ArrowRight':
        this.move('right');
        break;
      case 'ArrowUp':
        this.move('up');
        break;
      case 'ArrowDown':
        this.move('down');
        break;
      default:
        break;
    }
  };

  playerPosition() {
    return this.positiion;
  }

  /**
   * Renders the player controls.
   * @returns {JSX.Element} The player controls JSX element.
   */
  controls(): JSX.Element {
    const playerControls = (
      <div className="block md:hidden w-[200px] h-[150px]">
        <div className="flex flex-col items-center h-full w-full justify-between">
          <button onClick={() => this.move('up')}>Up</button>
          <div className="flex flex-row justify-between w-full">
            <button onClick={() => this.move('left')}>Left</button>
            <button onClick={() => this.move('right')}>Right</button>
          </div>
          <button onClick={() => this.move('down')}>Down</button>
        </div>
      </div>
    );

    return playerControls;
  }
}

export default Player;
