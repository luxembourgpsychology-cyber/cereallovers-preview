// Cereal Lovers coffee pouch in 3D. The label is drawn as live type on a canvas,
// so it stays sharp at any size. One small WebGL scene per bag.
import * as THREE from 'three';
import { RoomEnvironment } from './RoomEnvironment.js';

const W = 1, H = 1.34, D = 0.40;          // pouch width, height, thickness
const TEX_W = 1024, TEX_H = Math.round(TEX_W * H / W);
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const SERIF = 'Didot, "Bodoni 72", "Iowan Old Style", Georgia, serif';

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const profile = u => Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 2.4)), 0.45);
const thick = v => (1 - smooth(0.80, 0.955, v)) * (0.58 + 0.42 * Math.pow(1 - v, 1.25));
const wrinkle = (u, v) => 0.010 * Math.sin(u * 7.3 + v * 2.1) * Math.sin(v * 11.0 + u * 1.7)
                       + 0.006 * Math.sin(u * 17.0 - v * 5.0);

function pouchGeometry(segU = 56, segV = 72) {
  const pos = [], uv = [], idx = [];
  const row = segU + 1;
  const surface = sign => {
    const base = pos.length / 3;
    for (let j = 0; j <= segV; j++) {
      const v = j / segV;
      for (let i = 0; i <= segU; i++) {
        const u = i / segU * 2 - 1, th = thick(v);
        const z = sign * (D / 2 * profile(u) * th + wrinkle(u, v) * th * D);
        const x = u * W / 2 * (1 - 0.045 * th * (1 - Math.abs(u) * 0.3));
        pos.push(x, v * H - H / 2, z);
        uv.push(sign > 0 ? (u + 1) / 2 : 1 - (u + 1) / 2, v);
      }
    }
    for (let j = 0; j < segV; j++) for (let i = 0; i < segU; i++) {
      const a = base + j * row + i, b = a + 1, c = a + row, d = c + 1;
      if (sign > 0) idx.push(a, b, d, a, d, c); else idx.push(a, d, b, a, c, d);
    }
    return base;
  };
  const front = surface(1), frontCount = idx.length;
  const back = surface(-1), backCount = idx.length - frontCount;
  // bottom gusset: close the lens between the two bottom edges
  const capStart = idx.length;
  for (let i = 0; i < segU; i++) {
    const f0 = front + i, f1 = f0 + 1, b0 = back + i, b1 = b0 + 1;
    idx.push(f0, b0, b1, f0, b1, f1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.addGroup(0, frontCount, 0);
  g.addGroup(frontCount, backCount, 1);
  g.addGroup(capStart, idx.length - capStart, 2);
  g.computeVertexNormals();
  return g;
}

function film(ctx) {
  ctx.fillStyle = '#1d1d1d'; ctx.fillRect(0, 0, TEX_W, TEX_H);
  const img = ctx.getImageData(0, 0, TEX_W, TEX_H), p = img.data;
  for (let i = 0; i < p.length; i += 4) { const n = (Math.random() - 0.5) * 9; p[i] += n; p[i + 1] += n; p[i + 2] += n; }
  ctx.putImageData(img, 0, 0);
  // heat seal at the top: fine vertical crimp
  const sealTop = 0, sealH = TEX_H * 0.045;
  ctx.fillStyle = '#242424'; ctx.fillRect(0, sealTop, TEX_W, sealH);
  ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 2;
  for (let x = 0; x < TEX_W; x += 7) { ctx.beginPath(); ctx.moveTo(x, sealTop); ctx.lineTo(x, sealTop + sealH); ctx.stroke(); }
}

function label(ctx, o, logo, withText) {
  const x0 = withText ? TEX_W * 0.10 : 0;
  const cTop = TEX_H * 0.12, cBot = TEX_H * 0.31, wBot = TEX_H * 0.49;
  ctx.fillStyle = o.colour; ctx.fillRect(x0, cTop, TEX_W - x0, cBot - cTop);
  ctx.fillStyle = '#f1ede5'; ctx.fillRect(x0, cBot, TEX_W - x0, wBot - cBot);
  // a hint of paper
  ctx.fillStyle = 'rgba(0,0,0,.05)'; ctx.fillRect(x0, cTop, 3, wBot - cTop);
  if (!withText) return;
  const ink = '#1b1b1b', L = TEX_W * 0.135;
  ctx.fillStyle = ink; ctx.textBaseline = 'alphabetic';
  ctx.font = `700 ${TEX_H * 0.074}px ${SANS}`;
  ctx.fillText('COFFEE', L - 4, TEX_H * 0.205);
  ctx.font = `500 ${TEX_H * 0.036}px ${SANS}`;
  ctx.fillText(o.origin, L, TEX_H * 0.247);
  ctx.font = `500 ${TEX_H * 0.0175}px ${SANS}`;
  ctx.fillText(o.lot, L, TEX_H * 0.284);
  if (logo) {
    const lw = TEX_W * 0.27, lh = lw / 1.805;
    ctx.drawImage(logo, L, TEX_H * 0.333, lw, lh);
  }
  // the vertical marks on the right: N° and the process note
  ctx.save();
  ctx.translate(TEX_W * 0.905, TEX_H * 0.165);
  ctx.rotate(Math.PI / 2);
  ctx.font = `italic 400 ${TEX_H * 0.088}px ${SERIF}`;
  ctx.fillText(o.num, 0, 0);
  ctx.restore();
  ctx.save();
  ctx.translate(TEX_W * 0.815, TEX_H * 0.335);
  ctx.rotate(Math.PI / 2);
  ctx.font = `italic 400 ${TEX_H * 0.021}px ${SERIF}`;
  o.note.forEach((line, i) => ctx.fillText(line, 0, i * TEX_H * 0.026));
  ctx.restore();
}

function textures(o, logo, maxAniso) {
  const mk = withText => {
    const c = document.createElement('canvas'); c.width = TEX_W; c.height = TEX_H;
    const ctx = c.getContext('2d');
    film(ctx); label(ctx, o, logo, withText);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso;
    return t;
  };
  return [mk(true), mk(false)];
}

function contactShadow() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  r.addColorStop(0, 'rgba(0,0,0,.5)'); r.addColorStop(.55, 'rgba(0,0,0,.18)'); r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.7, D * 2.6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = -H / 2 - 0.004;
  return m;
}

let logoPromise = null;
function loadLogo() {
  if (!logoPromise) logoPromise = new Promise(res => {
    const img = new Image(); img.onload = () => res(img); img.onerror = () => res(null);
    img.src = 'el/wordmark.svg';
  });
  return logoPromise;
}

export async function mountBag(canvas, o) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.92;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.05); key.position.set(-2.2, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9); rim.position.set(3, 1.5, -3); scene.add(rim);

  try { await document.fonts.ready; } catch (e) {}
  const logo = await loadLogo();
  const [frontTex, backTex] = textures(o, logo, renderer.capabilities.getMaxAnisotropy());
  const filmMat = map => new THREE.MeshStandardMaterial({ map, roughness: 0.6, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.55 });
  const bag = new THREE.Mesh(pouchGeometry(), [filmMat(frontTex), filmMat(backTex),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, side: THREE.DoubleSide })]);
  const rig = new THREE.Group(); rig.add(bag); rig.add(contactShadow()); scene.add(rig);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 0.24, 3.6); camera.lookAt(0, -0.02, 0);

  const fit = () => {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
  };
  fit(); new ResizeObserver(fit).observe(canvas);

  // motion: a slow idle sway, follows the pointer, spins when dragged
  let px = 0, drag = false, lastX = 0, spin = 0, yaw = o.yaw || -0.35, visible = false, raf = 0;
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect(); px = ((e.clientX - r.left) / r.width - 0.5) * 2;
    if (drag) { spin += (e.clientX - lastX) * 0.012; lastX = e.clientX; }
  });
  canvas.addEventListener('pointerleave', () => { px = 0; drag = false; });
  canvas.addEventListener('pointerdown', e => { drag = true; lastX = e.clientX; });
  addEventListener('pointerup', () => { drag = false; });

  const t0 = performance.now() + (o.phase || 0) * 1000;
  const frame = now => {
    raf = 0;
    const t = (now - t0) / 1000;
    const idle = reduce ? 0 : Math.sin(t * 0.55) * 0.42;
    if (!drag) spin *= 0.965;
    const target = (o.yaw || -0.35) + idle + px * 0.55 + spin;
    yaw += (target - yaw) * 0.07;
    rig.rotation.y = yaw;
    bag.position.y = reduce ? 0 : Math.sin(t * 1.1) * 0.018;
    bag.rotation.x = reduce ? 0 : Math.sin(t * 0.7) * 0.035;
    renderer.render(scene, camera);
    if (visible && !reduce) raf = requestAnimationFrame(frame);
  };
  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }), { rootMargin: '100px' }).observe(canvas);
  if (reduce) { canvas.addEventListener('pointermove', () => { if (!raf) raf = requestAnimationFrame(frame); }); }
  renderer.render(scene, camera);
  return renderer;
}
