interface Particle {
  u: number;
  v: number;
  size: number;
  speedMult: number;
  colorIdx: number;
  blendNext: number;
  drift: number;
  driftAmp: number;
}

interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
  colorIdx: number;
}

interface TorusColor {
  r: number;
  g: number;
  b: number;
}

interface TorusOptions {
  majorRadius?: number;
  minorRadius?: number;
  particleCount?: number;
  speed?: number;
  glowIntensity?: number;
}

export default class TorusField {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[] = [];
  ambient: AmbientParticle[] = [];
  R = 180;
  r = 70;
  count = 1400;
  ambientCount = 60;
  speed = 1;
  tiltX = 0.45;
  tiltZ = 0.15;
  fov = 600;
  glowIntensity = 1;
  running = true;
  _raf: number | null = null;
  w = 0;
  h = 0;
  cx = 0;
  cy = 0;
  colors: TorusColor[] = [
    { r: 34, g: 197, b: 94 },
    { r: 239, g: 68, b: 68 },
    { r: 59, g: 130, b: 246 },
  ];

  constructor(canvas: HTMLCanvasElement, opts: TorusOptions = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.R = opts.majorRadius || 180;
    this.r = opts.minorRadius || 70;
    this.count = opts.particleCount || 1400;
    this.speed = opts.speed || 1;
    this.glowIntensity = opts.glowIntensity || 1;
    this._resize();
    this._initParticles();
    this._initAmbient();
    window.addEventListener('resize', () => this._resize());
    this._animate(0);
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.parentElement
      ? this.canvas.parentElement.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cx = this.w / 2;
    this.cy = this.h * 0.45;
  }

  _initParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const colorIdx = Math.floor(v / (Math.PI * 2) * 3) % 3;
      this.particles.push({
        u, v,
        size: 0.6 + Math.random() * 1.8,
        speedMult: 0.7 + Math.random() * 0.6,
        colorIdx,
        blendNext: Math.random(),
        drift: Math.random() * Math.PI * 2,
        driftAmp: Math.random() * 3,
      });
    }
  }

  _initAmbient() {
    this.ambient = [];
    for (let i = 0; i < this.ambientCount; i++) {
      this.ambient.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        size: 0.5 + Math.random() * 1.5,
        alpha: 0.05 + Math.random() * 0.15,
        speed: 0.0002 + Math.random() * 0.0005,
        phase: Math.random() * Math.PI * 2,
        colorIdx: Math.floor(Math.random() * 3),
      });
    }
  }

  _blendColor(idx: number, blend: number) {
    const c1 = this.colors[idx];
    const c2 = this.colors[(idx + 1) % 3];
    const t = blend * 0.3;
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t),
    };
  }

  _animate(timestamp: number) {
    if (!this.running) return;
    const ctx = this.ctx;
    const t = timestamp * 0.0002 * this.speed;

    ctx.clearRect(0, 0, this.w, this.h);

    for (const a of this.ambient) {
      const ax = this.cx + a.x * this.w * 0.5 + Math.sin(t * 2 + a.phase) * 30;
      const ay = this.cy + a.y * this.h * 0.4 + Math.cos(t * 1.5 + a.phase) * 20;
      const c = this.colors[a.colorIdx];
      const glow = this.glowIntensity;
      ctx.beginPath();
      ctx.arc(ax, ay, a.size * 2 * glow, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(ax, ay, 0, ax, ay, a.size * 2 * glow);
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${a.alpha * glow})`);
      grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    const cosX = Math.cos(this.tiltX);
    const sinX = Math.sin(this.tiltX);
    const cosZ = Math.cos(this.tiltZ + t * 0.1);
    const sinZ = Math.sin(this.tiltZ + t * 0.1);

    interface SortedParticle { x: number; y: number; z: number; size: number; colorIdx: number; blend: number; }
    const sorted: SortedParticle[] = [];

    for (const p of this.particles) {
      const u = p.u + t * p.speedMult;
      const v = p.v + Math.sin(t * 0.5 + p.drift) * 0.02;
      const driftX = Math.sin(t + p.drift) * p.driftAmp;
      const driftY = Math.cos(t * 0.7 + p.drift) * p.driftAmp;

      const x = (this.R + this.r * Math.cos(v)) * Math.cos(u) + driftX;
      const y = (this.R + this.r * Math.cos(v)) * Math.sin(u) + driftY;
      const z = this.r * Math.sin(v);

      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x1 = x * cosZ - y1 * sinZ;
      const y2 = x * sinZ + y1 * cosZ;

      sorted.push({ x: x1, y: y2, z: z1, size: p.size, colorIdx: p.colorIdx, blend: p.blendNext });
    }

    sorted.sort((a, b) => a.z - b.z);

    for (const p of sorted) {
      const scale = this.fov / (this.fov + p.z + this.R + this.r);
      const px = this.cx + p.x * scale;
      const py = this.cy + p.y * scale;
      const sz = Math.max(0.3, p.size * scale);

      const depth = (p.z + this.R + this.r) / (2 * (this.R + this.r));
      const alpha = (0.15 + 0.6 * depth) * this.glowIntensity;
      const c = this._blendColor(p.colorIdx, p.blend);

      ctx.beginPath();
      ctx.arc(px, py, sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
      ctx.fill();

      if (sz > 1.2 && this.glowIntensity > 0.5) {
        ctx.beginPath();
        ctx.arc(px, py, sz * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(px, py, 0, px, py, sz * 3);
        grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    this._raf = requestAnimationFrame((ts) => this._animate(ts));
  }

  setSpeed(s: number) { this.speed = s; }
  setGlow(g: number) { this.glowIntensity = g; }

  destroy() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }
}
