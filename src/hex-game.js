import {HexLinesContext} from 'hex-lines';
import {Vec3} from 'ga';
import {cleanUpList} from './utils.js';

export class Game {
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

    initInput();

    let lastTime = 0;
    while (true) {
      ++this.frame;
      this.time = await new Promise(requestAnimationFrame);
      this.timeDelta = Math.min(1000 / 30, this.time - lastTime);
      lastTime = this.time;

      for (const entity of this.entities) {
        if (entity.alive) {
          entity.update?.(this.timeDelta, this.time);
        }
      }

      cleanUpList(
        this.entities,
        entity => entity.alive,
        entity => entity.destroy?.(),
      );

      this.hexLines.clear();
      for (const entity of this.entities) {
        entity.draw?.(this.hexLines);
      }
      this.hexLines.draw();

      clearInputs();
    }
  }

  static add(entity) {
    console.assert(started);
    this.entities.push(entity);
    entity?.init?.();
  }
}

export class Pointer {
  static [0] = {down: false, held: false};
  static [1] = {down: false, held: false};
  static [2] = {down: false, held: false};
  static move = false;
  static position = new Vec3();
  static screenPosition = new Vec3();
}

let started = false;

function initInput() {
  window.addEventListener('pointerdown', event => {
    const button = Pointer[event.button];
    button.down = true;
    button.held = true;
  });
  window.addEventListener('pointerup', event => {
    const button = Pointer[event.button];
    button.held = false;
  });
  window.addEventListener('pointermove', event => {
    Pointer.move = true;
    Pointer.screenPosition.setXyz(event.clientX, event.clientY);
    Pointer.position.setXyz(
      event.clientX - Game.width / 2,
      -(event.clientY - Game.height / 2),
    );
  });
}

function clearInputs() {
  for (let i = 0; i < 3; ++i) {
    Pointer[i].down = false;
  }
  Pointer.move = false;
}
