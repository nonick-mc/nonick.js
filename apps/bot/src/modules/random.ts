export class Random {
  private x: number;
  private y: number;
  private z: number;
  private w: number;

  constructor(private _seed = 2 ** 34) {
    this.x = 2 ** 28;
    this.y = 2 ** 30;
    this.z = 2 ** 32;
    this.w = _seed;
  }

  next() {
    const t = this.x ^ (this.x << 11);
    [this.x, this.y, this.z] = [this.y, this.z, this.w];
    this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8));
    return this.w;
  }

  nextInt(_min: number, _max = 0) {
    const [min, max] = _min > _max ? [_max, _min] : [_min, _max];
    const r = Math.abs(this.next());
    return min + (r % (max + 1 - min));
  }

  get seed() {
    return this._seed;
  }
}
