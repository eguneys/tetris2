import { dContainer, sprite } from '../asprite';

import Tetris from '../tetris';

import Board from './board';
import Next from './next';
import Score from './score';

import { rows, cols } from '../util';

export default function Play(ctx) {

  const { textures, canvas, config: { 
    cols,
    rows,
    speed,
    level
  } } = ctx;

  let tetris = new Tetris({
    cols,
    rows,
    speed,
    level
  });

  let boundsF = canvas.responsiveBounds(({ width, height }) => {
    let marginW = width * 0.01,
        marginH = height * 0.01;

    let boardW = width * 0.63,
        tileSize = boardW / cols;

    let nextWholdW = width - boardW - marginW * 4,
        nextW = nextWholdW * 0.5 - marginW;

    let scoreW = boardW;

    let scoreH = 2 * tileSize,
        scoreX = (width - scoreW) * 0.5,
        scoreY = marginH * 2,
        scoreBottom = scoreY + scoreH;

    let boardH = rows * tileSize,
        boardX = (width - boardW) * 0.5,
        boardY = scoreBottom + marginH * 4,
        boardRight = boardX + boardW;

    let nextH = nextW * 2.0,
        nextX = boardRight + marginW,
        nextY = scoreBottom + marginH * 2;

    return {
      next: bounds(nextX, nextY, nextW, nextH),
      board: bounds(boardX, boardY, boardW, boardH),
      score: bounds(scoreX, scoreY, scoreW, scoreH),
      tileSize,
      width,
      height
    };
  });

  let board = new Board(this, ctx),
      next = new Next(this, ctx),
      score = new Score(this, ctx);

  let bs;

  this.init = data => {
    bs = boundsF();

    board.init({ tileSize: bs.tileSize, bounds: bs.board, tetris });
    next.init({ bounds: bs.next, tetris });
    score.init({ bounds: bs.score, tetris });

    initContainer();
  };

  this.update = delta => {
    tetris.update(delta);
    board.update(delta);
    next.update(delta);
    score.update(delta);
  };

  const addChild = (child, x, y) => {
    child.position.set(x, y);
    container.addChild(child);
  };

  const initContainer = () => {

    addChild(board.container, bs.board.x, bs.board.y);
    addChild(next.container, bs.next.x, bs.next.y);
    addChild(score.container, bs.score.x, bs.score.y);

  };

  const container = this.container = dContainer();

  this.render = () => {
    board.render();
    next.render();
    score.render();
  };

}

const bounds = (x, y, w, h) => ({
  x,y,w,h
});
