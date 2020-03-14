import { objMap } from '../util2';
import { dContainer, sprite } from '../asprite';

import { allPos, pos2key } from '../util';

export default function Board(play, ctx) {

  const { textures, canvas } = ctx;

  let tileSize,
      bounds;

  let tetris;

  this.init = (data) => {

    tileSize = data.tileSize;
    bounds = data.bounds;
    tetris = data.tetris;

    initContainer();
  };

  this.update = delta => {
    objMap(dTiles, (_, tile) => {
      tile.setColor();
    });

    let current = tetris.current();

    if (current) {
      current.tiles.forEach(({ key, color }) => {

        let dTile = dTiles[key];

        dTile.setColor(color);
      });
    }
  };

  const dTiles = {};

  let bg;

  const initContainer = () => {
    bg = sprite(textures['debugO']);
    bg.width = bounds.w;
    bg.height = bounds.h;
    container.addChild(bg);

    allPos.forEach(pos => {
      let dTile = new Tile(play, ctx);
      dTile.init({pos, tileSize});
      container.addChild(dTile.container);
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
      d.texture = textures['hud'];
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
