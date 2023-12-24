import exp from 'constants';

class Environment {
  constructor(
    public ctx: CanvasRenderingContext2D,
    public cavasBounds: { width: number; height: number },
    public image: string,
  ) {
    this.ctx = ctx;
    this.cavasBounds = cavasBounds;
    this.image = image;
  }

  loadImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = this.image;
    });
  };

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
