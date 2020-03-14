import { dContainer, sprite, nContainer } from '../asprite';

export default function Play(play, ctx) {

  const { textures } = ctx;

  let scoreDisplay;

  let tetris;

  let bounds;

  this.init = data => {
    bounds = data.bounds;
    tetris = data.tetris;
    initContainer();
  };

  this.update = delta => {
    let score = tetris.score();
    scoreDisplay.setData({ number: score });
  };

  const initContainer = () => {

    let bg = sprite(textures['debugO']);
    bg.width = bounds.w;
    bg.height = bounds.h;
    container.addChild(bg);


    scoreDisplay = nContainer(textures, 0);
    scoreDisplay.width = bounds.w;
    scoreDisplay.height = bounds.h;
    container.addChild(scoreDisplay);
  };

  const container = this.container = dContainer();

  this.render = () => {
  };

}
