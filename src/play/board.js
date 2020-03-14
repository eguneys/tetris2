import { objMap } from '../util2';
import { dContainer, sprite } from '../asprite';

import { allPos, pos2key } from '../util';
import * as v from '../vec2';

export default function Board(play, ctx) {

  const { textures, canvas } = ctx;

  let boardMargin,
      tileSize,
      bounds;

  let tetris;

  this.init = (data) => {

    boardMargin = data.boardMargin;
    tileSize = data.tileSize;
    bounds = data.bounds;
    tetris = data.tetris;

    initContainer();
  };

  const renderTile = ({key, color}) => {
    let dTile = dTiles[key];
    dTile.setColor(color);
  };

  this.update = delta => {
    objMap(dTiles, (_, tile) => {
      tile.setColor();
    });

    let current = tetris.current();

    if (current) {
      current.tiles.forEach(renderTile);
    }

    let tiles = tetris.tiles();

    objMap(tiles, (_, tile) => renderTile(tile));
  };

  const dTiles = {};

  let bg;

  const initContainer = () => {
    bg = sprite(textures['debugO']);
    bg.width = bounds.w;
    bg.height = bounds.h;
    container.addChild(bg);

    let tilesContainer = dContainer();
    tilesContainer.position.set(boardMargin, boardMargin);
    tilesContainer.width = bounds.w - boardMargin * 2.0;
    tilesContainer.height = bounds.h - boardMargin * 2.0;
    container.addChild(tilesContainer);

    allPos.forEach(pos => {
      let dTile = new Tile(play, ctx);
      dTile.init({pos, tileSize});
      tilesContainer.addChild(dTile.container);
      dTiles[pos2key(pos)] = dTile;
    });
  };

  const container = this.container = dContainer();

  this.render = () => {
  };

}

function Tile(play, ctx) {
  const { textures } = ctx;

  let d;

  let pos,
      tileSize;

  this.init = data => {
    pos = data.pos;
    tileSize = data.tileSize;

    initContainer();
  };

  this.update = delta => {
  };

  this.setColor = (color) => {
    if (color) {
      d.visible = true;
      d.texture = textures.colors[color];
    } else {
      d.visible = false;
    }
  };

  const initContainer = () => {
    d = sprite();
    d.position.set(pos[0] * tileSize, pos[1] * tileSize);
    d.width = tileSize;
    d.height = tileSize;
    container.addChild(d);
  };

  const container = this.container = dContainer();

  this.render = () => {
  };

}
