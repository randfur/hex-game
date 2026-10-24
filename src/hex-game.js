import {HexLinesContext} from '../third-party/hex-lines/src/hex-lines.js';

let started = false;

export class HexGame {
  static entities = [];

  static width = null;
  static height = null;

  static canvas = null;
  static hexLinesContext = null;

  static async init(hexLinesContextOptions) {
    console.assert(!started);
    started = true;

    ({
      width: this.width,
      height: this.height,
      hexLinesContext: this.HexLinesContext,
      canvas: this.canvas,
    } = HexLinesContext.setupFullPageContext(hexLinesContextOptions));
    const hexLines = this.hexLinesContext.createLines();

    let lastTime = 0;
    while (true) {
      const time = await new Promise(requestAnimationFrame);
      const timeDelta = Math.min(1000 / 30, time - lastTime);
      lastTime = time;

      for (const entity of this.entities) {
        if (entity.alive) {
          entity.update?.(time, timeDelta);
        }
      }

      cleanUpList(this.entities, entity => entity.alive, entity => entity.destroy?.());

      hexLines.clear();
      for (const entity of this.entities) {
        entity.draw?.(hexLines);
      }
      hexLines.draw();
    }
  }

  constructor(entities, width, height) {
    this.alive = true;
    this.entities = entities;
    this.width = width;
    this.height = height;
  }
}

export const hg = HexGame;