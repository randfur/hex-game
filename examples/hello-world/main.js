import {hg} from '../../src/hex-game.js'

function main() {
  hg.init();
  hg.entities.push(new HelloWorld());
}

class HelloWorld {
  constructor() {
    this.alive = true;
  }

  draw(hexLines) {
    hexLines.addPoints([
      {position: new Vec3(
  }
}

main();