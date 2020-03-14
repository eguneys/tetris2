import { dContainer, sprite } from '../asprite';

export default function Play(play, ctx) {

  const { textures, canvas } = ctx;

  let tetris;

  
  let bounds;

  this.init = data => {
    bounds = data.bounds;
    tetris = data.tetris;
    initContainer();
  };

  this.update = delta => {
  };

  const initContainer = () => {

    let bg = sprite(textures['debugO']);
    bg.width = bounds.w;
    bg.height = bounds.h;
    container.addChild(bg);

  };

  const container = this.container = dContainer();

  this.render = () => {
  };

}
