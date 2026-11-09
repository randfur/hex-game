import {HexLinesContext} from 'hex-lines';

let started = false;

export class HexGame {
  static entities = [];

  static width = null;
  static height = null;

  static canvas = null;
  static hexLinesContext = null;
  static hexLines = null;

  static time = 0;
  static timeDelta = 0;
  static frame = 0;

  static async init(hexLinesContextOptions) {
    console.assert(!started);
    started = true;

    ({
      width: this.width,
      height: this.height,
      hexLinesContext: this.hexLinesContext,
      canvas: this.canvas,
    } = HexLinesContext.setupFullPageContext(hexLinesContextOptions));
    this.hexLines = this.hexLinesContext.createLines();

    let lastTime = 0;
    while (true) {
      ++this.frame;
      this.time = await new Promise(requestAnimationFrame);
      this.timeDelta = Math.min(1000 / 30, this.time - lastTime);
      lastTime = this.time;

      for (const entity of this.entities) {
        if (entity.alive) {
          entity.update?.(this.time, this.timeDelta);
        }
      }

      cleanUpList(this.entities, entity => entity.alive, entity => entity.destroy?.());

      this.hexLines.clear();
      for (const entity of this.entities) {
        entity.draw?.(this.hexLines);
      }
      this.hexLines.draw();
    }
  }

  constructor(entities, width, height) {
    this.alive = true;
    this.entities = entities;
    this.width = width;
    this.height = height;
  }
}

function cleanUpList(list, filter, destroy) {
  let newLength = 0;
  for (let i = 0; i < list.length; ++i) {
    if (filter(list[i])) {
      list[newLength++] = list[i];
    } else {
      destroy(list[i]);
    }
  }
  list.length = newLength;
}
