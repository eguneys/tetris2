import * as PIXI from 'pixi.js';

export default function sprites(resources) {

  const texture = name => resources[name].texture;
  const ssTextures = name => resources[name].spritesheet.textures;

  const tss = {};

  
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ','].forEach(no =>
    tss['number' + no] = labelTexture(no + '')
  );

  let tTiles = texture('tiles');
  let colors = {
    blue: tetrisTileTextures(tTiles, [0, 0]),
    orange: tetrisTileTextures(tTiles, [0, 32 * 1]),
    cyan: tetrisTileTextures(tTiles, [0, 32 * 2]),
    red: tetrisTileTextures(tTiles, [0, 32 * 3]),
    green: tetrisTileTextures(tTiles, [0, 32 * 4]),
    yellow: tetrisTileTextures(tTiles, [0, 32 * 5]),
    purple: tetrisTileTextures(tTiles, [0, 32 * 6])
  };

  return {
    colors,
    'debugO': bgTexture('rgba(200, 100, 100, 0.1)'),
    'labelLevel': labelTexture('Level'),
    'labelNext': labelTexture('Next'),
    ...tss
  };
}

const tetrisTileTextures = (texture, frame) => {
  let rect = new PIXI.Rectangle(frame[0], frame[1], 32, 32);
  let t = new PIXI.Texture(texture);
  t.frame = rect;
  return t;
};

const animationTextures = (textures, rName, frames) => {
  let res = [];
  for (let i = 0; i < frames; i++) {
    let name = rName.replace('%', i);
    res.push(textures[name]);
  }
  return res;
};

const labelTexture = (label) => {
  return withCanvasTexture(label.length * 100 * 0.5, 100, (w, h, canvas, ctx) => {
    //ctx.fillStyle = 'red';
    //ctx.fillRect(0, 0, w, h);
    ctx.font = '50pt Baloo';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, 50);
    
    return canvas;
  });
};

const bgTexture = (color) => {
  return withCanvasTexture(256, 256, (w, h, canvas, ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    return canvas;
  });
};

function withCanvasTexture(width, height, f) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  f(width, height, canvas, canvas.getContext('2d'));
  const texture = PIXI.Texture.from(canvas);
  return texture;
}
