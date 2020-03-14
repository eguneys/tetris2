import * as PIXI from 'pixi.js';

export function graphics() {
  return new PIXI.Graphics();
}

export function dContainer() {
  return new PIXI.Container();
}

export function sprite(texture) {
  return new PIXI.Sprite(texture);
}

export function tsprite(texture, width, height) {
  return new PIXI.TilingSprite(texture, width, height);
}

export function pContainer() {
  return new PIXI.ParticleContainer();
}

export function nineSlice(texture, left, top = left, right = left, bottom = top) {
  return new PIXI.NineSlicePlane(texture, left, top, right, bottom);
}

export function text(txt, opts) {
  return new PIXI.Text(txt, opts);
}

export function asprite(textures, duration) {
  return new AnimatedSprite(textures, duration);
}

export function nContainer(textures, number) {
  return new NumberSprite(textures, number);
}

class AnimatedSprite extends PIXI.Sprite {
  constructor(textures, duration = 1000, loop = true) {
    super(textures[0]);

    this.loop = loop;
    this._textures = textures;
    this.duration = duration;
    this.lastTime = Date.now();
  }

  update() {
    let now = Date.now(),
        lastTime = this.lastTime,
        elapsed = (now - lastTime) / this.duration;

    if (elapsed >= 1) {
      if (this.loop) {
        this.lastTime = now;
      }
      elapsed = 0.9;
    }
    this.frame = Math.floor(elapsed * this._textures.length);
    this.texture = this._textures[this.frame];
  }
}


export default class NumberSprite extends PIXI.Container {

  constructor(textures, number) {
    super();

    this.textures = textures;
    this.number = number;

    this.sprites = [
      new PIXI.Sprite(textures['number0']),
      new PIXI.Sprite(textures['number1']),
      new PIXI.Sprite(textures['number2']),
      new PIXI.Sprite(textures['number3']),
      new PIXI.Sprite(textures['number4']),
      new PIXI.Sprite(textures['number5']),
      new PIXI.Sprite(textures['number6'])
    ];

    this.commas = [
      new PIXI.Sprite(textures['number,']),
      new PIXI.Sprite(textures['number,'])
    ];

    const placeSprite = (_, x) => {
      _.x = x;
      this.addChild(_);
    };

    let xOffset = 40,
        commaOffset = 30;

    let nextOffset = 0;

    placeSprite(this.sprites[6], nextOffset);
    nextOffset += commaOffset;
    placeSprite(this.commas[0], nextOffset);
    nextOffset += commaOffset;
    placeSprite(this.sprites[5], nextOffset);
    nextOffset += xOffset;
    placeSprite(this.sprites[4], nextOffset);
    nextOffset += xOffset;
    placeSprite(this.sprites[3], nextOffset);
    nextOffset += commaOffset;
    placeSprite(this.commas[1], nextOffset);
    nextOffset += commaOffset;
    placeSprite(this.sprites[2], nextOffset);
    nextOffset += xOffset;
    placeSprite(this.sprites[1], nextOffset);
    nextOffset += xOffset;
    placeSprite(this.sprites[0], nextOffset);


    this.updateChildren();
  }

  setData(data) {
    if (this.number !== data.number) {
      this.number = data.number;
      this.updateChildren();
    }
  }

  updateChildren() {
    const digits = digitize(this.number);

    this.sprites.forEach(_ => _.alpha = 0);

    this.commas.forEach(_ => _.alpha = 0);

    if (digits.length > 3) {
      this.commas[1].alpha = 1;
    }
    if (digits.length > 6) {
      this.commas[0].alpha = 1;
    }

    digits.forEach((digit, i) => {
      const sprite = this.sprites[digits.length - i - 1];
      sprite.alpha = 1;
      sprite.texture = this.textures['number' + digit];
    });

  }
}

function digitize(number) {
  const res = [];

  while (number > 0) {
    res.unshift(number % 10);
    number = (number - (number % 10)) / 10;
  }
  return res;
}
