import Environment from "./Environment";
import Player from "./Player";

/**
 * Represents the game state.
 */
class Game {
  /**
   * Creates an instance of the Game class.
   * @param ctx - The canvas rendering context.
   * @param player - The player object.
   * @param environment - The environment object.
   */
  constructor(
    public ctx: CanvasRenderingContext2D,
    public player: Player,
    public environment: Environment,
  ) {
    this.ctx = ctx;
    this.player = player;
    this.environment = environment;
  }

  /**
   * Updates the game state.
   */
  update = () => {
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.environment.draw();
    this.player.draw();
  };

  /**
   * The game loop that continuously updates the game state.
   */
  gameLoop = () => {
    this.update();
    requestAnimationFrame(this.gameLoop);
  };

  /**
   * Starts the game.
   */
  start = async () => {
    await this.environment.draw();
    this.gameLoop();
  };
}

export default Game;
