import { dContainer, sprite } from '../asprite';

export default function Play(play, ctx) {

  const { textures } = ctx;

  let bounds;

  this.init = data => {
    bounds = data.bounds;
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
