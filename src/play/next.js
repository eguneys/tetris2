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
    // let header = sprite(textures['hud']);
    // header.width = bounds.w;
    // header.height = bounds.h * 0.2;
    // container.addChild(header);

    let nextLabel = sprite(textures['labelNext']);
    nextLabel.width = bounds.w;
    nextLabel.height = bounds.h * 0.2;
    container.addChild(nextLabel);

    let bg = sprite(textures['debugO']);
    bg.width = bounds.w;
    bg.height = bounds.h;
    container.addChild(bg);

  };

  const container = this.container = dContainer();

  this.render = () => {
  };

}
