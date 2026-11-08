import {HexGame} from '../../src/hex-game.js'
import {Vec3} from 'ga/src/vec3.js'

function main() {
  HexGame.init();
  HexGame.entities.push(new HelloWorld());
}

class HelloWorld {
  constructor() {
    this.alive = true;
    this.modelPoints = [
      new Vec3(-1, 0, 0),
      new Vec3(1, 0, 0),
      new Vec3(0, 1, 0),
    ];
  }

  draw() {
  }
}

main();