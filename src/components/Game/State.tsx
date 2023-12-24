import Environment from "./Environment";
import Player from "./Player";

class Game {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public player: Player,
    public environment: Environment,
  ) {
    this.ctx = ctx;
    this.player = player;
    this.environment = environment;
  }

  update = () => {
    // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.environment.draw();
    this.player.draw();
  };

  gameLoop = () => {
    this.update();
    requestAnimationFrame(this.gameLoop);
  };

  start = async () => {
    await this.environment.draw();
    this.gameLoop();
  };
}

export default Game;
