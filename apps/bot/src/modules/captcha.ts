import { resolve } from 'node:path';
import {
  type Canvas,
  GlobalFonts,
  type SKRSContext2D,
  createCanvas,
} from '@napi-rs/canvas';
import { Random } from './random';
GlobalFonts.registerFromPath(
  resolve(__dirname, '../fonts/OpenSans-Regular.ttf'),
  'Captcha',
);

const rnd = new Random(Date.now());

export class Captcha {
  private canvas: Canvas;
  private width: number;
  private height: number;
  private ctx: SKRSContext2D;
  private option: CaptchaOption;
  private coord: [[number, number]];
  private _text: string;
  constructor(w = 300, h = 100, option: CaptchaOption = {}) {
    this.width = w;
    this.height = h;
    this.option = option;
    this.option.color = option.color ?? '#32cf7e';
    this.option.chars = option.chars ?? 6;

    this._text = getRandomText(this.option.chars);
    this.coord = this.getRandomCoord(this.option.chars);

    this.canvas = createCanvas(w, h);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'miter';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.globalAlpha = 1;
  }

  drawDecoy(option?: drawDecoyOption) {
    const opt = {
      ...this.option,
      color: '#646566',
      size: 20,
      opacity: 0.8,
      amount: Math.floor((this.width * this.height) / 5000),
      ...option,
    };
    const decoyText = getRandomText(opt.amount);
    this.ctx.font = `${opt.size}px Captcha`;
    this.ctx.globalAlpha = opt.opacity;
    this.ctx.fillStyle = opt.color;
    for (const char of decoyText)
      this.ctx.fillText(
        char,
        rnd.nextInt(30, this.width - 30),
        rnd.nextInt(30, this.height - 30),
      );
  }

  drawLine(option: drawLineOption = {}) {
    const opt = {
      ...this.option,
      color: this.option.color ?? '#32cf7e',
      opacity: 1,
      blur: 5,
      ...option,
    };
    this.ctx.strokeStyle = opt.color;
    this.ctx.globalAlpha = opt.opacity;
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.coord[0][0],
      this.coord[0][1] + rnd.nextInt(-opt.blur, opt.blur),
    );
    for (let i = 1; i < this.coord.length; i++)
      this.ctx.lineTo(
        this.coord[i][0],
        this.coord[i][1] + rnd.nextInt(-opt.blur, opt.blur),
      );
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawText(option: drawTextOption = {}) {
    const opt = {
      ...this.option,
      color: this.option.color ?? '#32cf7e',
      opacity: 0.8,
      skew: true,
      size: 40,
      rotate: 5,
      ...option,
    };
    this.ctx.fillStyle = opt.color;
    this.ctx.globalAlpha = opt.opacity;
    this.ctx.font = `${opt.size}px Captcha`;
    for (let i = 0; i < this.coord.length; i++) {
      this.ctx.save();
      this.ctx.translate(...this.coord[i]);
      if (opt.skew)
        this.ctx.transform(1, Math.random(), rnd.nextInt(20) / 100, 1, 0, 0);
      if (opt.rotate)
        this.ctx.rotate((rnd.nextInt(-opt.rotate, opt.rotate) * Math.PI) / 100);
      this.ctx.fillText(this._text[i], 0, 0);
      this.ctx.restore();
    }
    return this;
  }

  get text() {
    return this._text;
  }

  toBuffer() {
    return this.canvas.toBuffer('image/jpeg');
  }

  private getRandomCoord(chars: number) {
    const coords: number[][] = [];
    const gap = Math.floor(this.width / chars);
    for (let i = 0; i < chars; i++)
      coords.push([15 + gap * (i + 0.2), rnd.nextInt(30, this.height - 30)]);
    return coords.sort(([a], [b]) => a - b) as [[number, number]];
  }

  static create(
    option: CaptchaOption & { w?: number; h?: number } = {},
    decoy: drawDecoyOption = {},
    line: drawLineOption & { amount?: number } = {},
    text: drawTextOption = {},
  ) {
    const captcha = new Captcha(option.w ?? 300, option.h ?? 100, option);
    captcha.drawDecoy(decoy);
    for (let i = 0; i < (line.amount ?? 1); i++) captcha.drawLine(line);
    captcha.drawText(text);

    return { image: captcha.toBuffer(), text: captcha._text };
  }
}

interface CaptchaOption {
  chars?: number;
  size?: number;
  color?: string;
}

interface drawDecoyOption {
  color?: string;
  size?: number;
  opacity?: number;
  amount?: number;
}

interface drawTextOption {
  color?: string;
  size?: number;
  skew?: boolean;
  rotate?: number;
  opacity?: number;
}

interface drawLineOption {
  blur?: number;
  color?: string;
  opacity?: number;
}

function getRandomText(length: number) {
  return new Int8Array(length).reduce(
    (p) => p + String.fromCharCode(rnd.nextInt(65, 90)),
    '',
  );
}
