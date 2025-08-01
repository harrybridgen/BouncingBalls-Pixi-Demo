import { Graphics, Container, Application } from 'pixi.js';

export class BouncingCircle extends Container {
  radius: number;
  vx: number;
  vy: number;
  shape: Graphics;

  constructor(radius: number, color: number, speed: number, app: Application) {
    super();

    this.radius = radius;

    this.shape = new Graphics();
    this.shape.circle(0, 0, radius);
    this.shape.fill({ color });
    this.addChild(this.shape);

    this.x = app.screen.width / 2;
    this.y = app.screen.height / 2;

    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(app: Application) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.radius > app.screen.width || this.x - this.radius < 0) {
      this.vx *= -1;
      this.x = Math.max(this.radius, Math.min(app.screen.width - this.radius, this.x));
    }
    if (this.y + this.radius > app.screen.height || this.y - this.radius < 0) {
      this.vy *= -1;
      this.y = Math.max(this.radius, Math.min(app.screen.height - this.radius, this.y));
    }
  }
  isOutside(app: Application): boolean {
    return (
      this.x - this.radius < 0 ||
      this.x + this.radius > app.screen.width ||
      this.y - this.radius < 0 ||
      this.y + this.radius > app.screen.height
    );
  }
  
  checkCollision(other: BouncingCircle, app: Application) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = this.radius + other.radius;

    if (distance < minDist) {
      const tempVx = this.vx;
      const tempVy = this.vy;
      this.vx = other.vx;
      this.vy = other.vy;
      other.vx = tempVx;
      other.vy = tempVy;

      const overlap = 0.5 * (minDist - distance + 1);
      const nx = dx / distance;
      const ny = dy / distance;

      this.x += nx * overlap;
      this.y += ny * overlap;
      other.x -= nx * overlap;
      other.y -= ny * overlap;
      
      this.clampPosition(app);
      other.clampPosition(app);
    }
  }
  clampPosition(app: Application) {
    this.x = Math.max(this.radius, Math.min(app.screen.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(app.screen.height - this.radius, this.y));
  }
  
}
