import { Actions, PlayerableCharacters } from '../../types/players.type';

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
    this.dimension = dimension || { width: 10, height: 10 };
    this.color = color;
    this.speed = speed;
    this.canvasBounds = canvasBounds;
  }

  private actionFrames: Record<string, number> = {
    Idle: 6,
    Walk: 8,
    Attack_1: 6,
    Hurt: 2,
    Dead: 3,
  };

  private action = Actions.Attack1;

  public isMoving = false;

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
   * Loads the image asynchronously for the character selected.
   * @returns A promise that resolves to the loaded image.
   */
  loadImage = (): Promise<HTMLImageElement> => {
    const source = `/game/sprites/${this.character}/${this.action}.png`;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = source;
    });
  };

  draw = async () => {
    const img = await this.loadImage();
    const frameWidth = 128;
    const frameHeight = 128;

    const numFrames = this.actionFrames[this.action];

    let currentFrame = 0;

    const framesPerRow = img.width / frameWidth;

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

    currentFrame = ++currentFrame % numFrames;
  };

  sprite = async () => {
    const img = await this.loadImage();
    const frameWidth = 128;
    const frameHeight = 128;

    const numFrames = this.actionFrames[this.action];

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

      currentFrame = ++currentFrame % numFrames;

      if (this.isMoving) {
        window.requestAnimationFrame(drawPlayer);
      }
    };

    this.isMoving = true;
    requestAnimationFrame(drawPlayer);
  };

  stopAnimation() {
    this.isMoving = false;
  }

  /**
   * Moves the player in the specified direction.
   * @param direction - The direction to move the player ('left', 'right', 'up', 'down').
   */
  move(direction: string) {
    let deltaX = 0;
    let deltaY = 0;

    switch (direction) {
      case 'left':
        deltaX = -this.speed;
        break;
      case 'right':
        deltaX = this.speed;
        break;
      case 'up':
        deltaY = -this.speed;
        break;
      case 'down':
        deltaY = this.speed;
        break;
      default:
        this.stopAnimation();
        break;
    }

    this.position.x += deltaX;
    this.position.y += deltaY;
    this.action = Actions.Walk;
    this.sprite;
    this.checkBounds();
  }

  attack(e: MouseEvent) {
    console.log('attack', e.clientX, e.clientY);
    if (this.isMoving) {
      // If the player is already moving, stop the animation and return
      this.stopAnimation();
      return;
    }

    this.isMoving = true;

    const target = {
      x: e.clientX,
      y: e.clientY,
    };

    const deltaX = target.x - this.position.x;
    const deltaY = target.y - this.position.y;

    const angle = Math.atan2(deltaY, deltaX);

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    const magnitude = Math.sqrt(
      Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2),
    );

    const normalized = {
      x: velocity.x / magnitude,
      y: velocity.y / magnitude,
    };

    const move = () => {
      this.position.x += normalized.x * this.speed;
      this.position.y += normalized.y * this.speed;
    };

    const updateAnimation = () => {
      move();
      this.sprite(); // Assuming this triggers the sprite animation
      this.action = Actions.Attack1;
    };

    const distance = Math.sqrt(
      Math.pow(target.x - this.position.x, 2) +
        Math.pow(target.y - this.position.y, 2),
    );

    if (distance < 5) {
      // If the player is very close to the target, stop the animation and return
      this.stopAnimation();
      return;
    }

    // Use requestAnimationFrame for smoother animations
    const animate = () => {
      updateAnimation();

      const distanceAfterMove = Math.sqrt(
        Math.pow(target.x - this.position.x, 2) +
          Math.pow(target.y - this.position.y, 2),
      );

      if (distanceAfterMove < 5) {
        // If the player is very close to the target after move, stop the animation and return
        this.stopAnimation();
        this.action = Actions.Idle;
        this.sprite();
      } else {
        // Continue the animation
        window.requestAnimationFrame(animate);
      }
    };

    // Start the animation
    animate();
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

  handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        this.stopAnimation();
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
