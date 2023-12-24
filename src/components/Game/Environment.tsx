/**
 * Represents the game environment.
 */
class Environment {
  /**
   * Creates an instance of the Environment class.
   * @param ctx - The canvas rendering context.
   * @param cavasBounds - The bounds of the canvas.
   * @param image - The image URL to be loaded.
   */
  constructor(
    public ctx: CanvasRenderingContext2D,
    public cavasBounds: { width: number; height: number },
    public image: string,
  ) {
    this.ctx = ctx;
    this.cavasBounds = cavasBounds;
    this.image = image;
  }

  /**
   * Loads the image asynchronously.
   * @returns A promise that resolves to the loaded image.
   */
  loadImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = this.image;
    });
  };

  /**
   * Draws the image on the canvas.
   */
  draw = async () => {
    const img = await this.loadImage();
    this.ctx.drawImage(
      img,
      0,
      0,
      this.cavasBounds.width,
      this.cavasBounds.height,
    );
  };
}

export default Environment;
