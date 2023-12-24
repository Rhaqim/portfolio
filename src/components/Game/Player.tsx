import { PlayerableCharacters } from './players.type';

/**
 * Represents a player in the game.
 */
class Player {
  /**
   * Creates a new instance of the Player class.
   * @param ctx The canvas rendering context.
   * @param character The player's character.
   * @param position The player's position.
   * @param dimension The player's dimension.
   * @param color The player's color.
   * @param speed The player's speed.
   * @param canvasBounds The bounds of the canvas.
   */
  constructor(
    public ctx: CanvasRenderingContext2D,
    public character: PlayerableCharacters,
    public position: { x: number; y: number },
    public dimension: { width: number; height: number },
    public color: string,
    public speed: number,
    public canvasBounds: { width: number; height: number },
  ) {
    this.ctx = ctx;
    this.character = character;
    this.position = position;
    this.dimension = dimension;
    this.color = color;
    this.speed = speed;
    this.canvasBounds = canvasBounds;
  }

  private action = 'Idle';

  /**
   * Loads the image asynchronously for the character selected.
   * @returns A promise that resolves to the loaded image.
   */
  loadImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = `/game/sprites/${this.character}/${this.action}.png`;
    });
  };

  sprite = async () => {
    const img = await this.loadImage();
    const frameWidth = 128;
    const frameHeight = 128;

    const cols = 8;

    let currentFrame = 0;

    const framesPerRow = img.width / frameWidth;

    const drawPlayer = () => {
      const row = Math.floor(currentFrame / framesPerRow);
      const col = Math.floor(currentFrame % framesPerRow);

      this.ctx.drawImage(
        img,
        col * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        this.position.x,
        this.position.y,
        frameWidth,
        frameHeight,
      );

      currentFrame = ++currentFrame % cols;
    };

    // setInterval(drawPlayer, 100);
    drawPlayer();
  };

  /**
   * Draws an image on the canvas at the specified position and dimension.
   */
  drawImage = async () => {
    const img = await this.loadImage();
    this.ctx.drawImage(
      img,
      this.position.x,
      this.position.y,
      this.dimension.width,
      this.dimension.height,
    );
  };

  /**
   * Draws the player on the canvas.
   */
  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.dimension.width,
      this.dimension.height,
    );
  }

  /**
   * Checks if the player's position is within the canvas bounds and adjusts it if necessary.
   */
  checkBounds() {
    if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.x > this.canvasBounds.width - this.dimension.width) {
      this.position.x = this.canvasBounds.width - this.dimension.width;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
    }
    if (this.position.y > this.canvasBounds.height - this.dimension.height) {
      this.position.y = this.canvasBounds.height - this.dimension.height;
    }
  }

  /**
   * Moves the player in the specified direction.
   * @param direction - The direction to move the player ('left', 'right', 'up', 'down').
   */
  move(direction: string) {
    switch (direction) {
      case 'left':
        this.position.x -= this.speed;
        this.action = 'Walk';
        this.sprite;
        break;
      case 'right':
        this.position.x += this.speed;
        this.action = 'Walk';
        this.action = 'Walk';
        this.sprite;
        break;
      case 'up':
        this.position.y -= this.speed;
        this.action = 'Walk';
        this.sprite;
        break;
      case 'down':
        this.position.y += this.speed;
        this.action = 'Walk';
        this.sprite;
        break;
      default:
        this.action = 'Idle';
        this.sprite;
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
    return this.position;
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

class AnimateSprite {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public image: HTMLImageElement,
    public position: { x: number; y: number },
    public dimension: { width: number; height: number },
    public frames: { x: number; y: number },
    public speed: number,
    public canvasBounds: { width: number; height: number },
  ) {
    this.ctx = ctx;
    this.image = image;
    this.position = position;
    this.dimension = dimension;
    this.frames = frames;
    this.speed = speed;
    this.canvasBounds = canvasBounds;
  }

  drawFrame(frameX: number, frameY: number, canvasX: number, canvasY: number) {
    this.ctx.drawImage(
      this.image,
      frameX * this.dimension.width,
      frameY * this.dimension.height,
      this.dimension.width,
      this.dimension.height,
      canvasX,
      canvasY,
      this.dimension.width,
      this.dimension.height,
    );
  }

  updateFrame() {
    this.position.x = this.position.x + this.speed;
    if (this.position.x > this.canvasBounds.width) {
      this.position.x = 0 - this.dimension.width;
    }
  }

  render() {
    this.updateFrame();
    this.drawFrame(
      this.frames.x,
      this.frames.y,
      this.position.x,
      this.position.y,
    );
  }
}
