/* SAHNE 1 — KUTU (0–10 s)  Ne kadar kâğıt?
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function dashL(ctx, p, q, a, seed, color, w = 2.5) {
    if (a <= 0) return; const n = Math.max(6, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 14));
    for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w, alpha: a, seed: seed + j, taper: [0, 0], color });
  }
  function seg2(ctx, p, q, a, k, seed, color, w = 3.5) { if (a > 0 && k > 0) Ink.path(ctx, [p, [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]], { w, alpha: a, seed, taper: [0, 0], color }); }
  function dot(ctx, p, a, color) { if (a <= 0) return; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fillStyle = color ? `rgba(${color},${a})` : `rgba(${LI.INK_RGB},${a})`; ctx.fill(); }
  function txt(ctx, env, p, s, a, hot, sz = 0.8) { if (a > 0) F().T(ctx, s, p[0], p[1], { size: KD.L(env).G.s * sz, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  function arcAt(ctx, C, r, u0, u1, a, seed, color) {
    if (a <= 0) return; const P = []; for (let j = 0; j <= 16; j++) { const u = lerp(u0, u1, j / 16); P.push([C[0] + r * Math.cos(u), C[1] + r * Math.sin(u)]); }
    Ink.path(ctx, P, { w: 2.5, alpha: a, seed, taper: [0, 0], color });
  }
  const lerpP = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  function fillP(ctx, P, fill) { ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
  const AMB = (a) => `rgba(${LI.AMBER_RGB},${0.3 * a})`;
  function edge(ctx, p, q, a, k, seed, color, w = 3.5) { if (a > 0 && k > 0) Ink.path(ctx, [p, lerpP(p, q, k)], { w, alpha: a, seed, taper: [0, 0], color }); }
  function ellP(C, rx, ry, u0, u1, n = 28) { const P = []; for (let j = 0; j <= n; j++) { const u = lerp(u0, u1, j / n); P.push([C[0] + rx * Math.cos(u), C[1] + ry * Math.sin(u)]); } return P; }
  function curve(ctx, P, a, seed, hidden, color, w = 3.5) { if (a <= 0 || P.length < 2) return; if (hidden) { for (let j = 0; j < P.length - 1; j += 2) Ink.path(ctx, [P[j], P[j + 1]], { w: 2.5, alpha: a * 0.6, seed: seed + j, taper: [0, 0], color }); } else Ink.path(ctx, P, { w, alpha: a, seed, taper: [0, 0], color }); }
  const part = (P, k) => P.slice(0, Math.max(2, Math.ceil(P.length * k)));
  /** the parameters of the can as a function of time: [r, h, lids] */
  function can(t) {
    if (t < 46.4) return { r: 2, h: 5, lids: 2 };
    if (t < 64.4) return { r: 3, h: 4, lids: 1 };
    const e = inOut(seg(t, 66.4, 68.4)); return { r: 2, h: lerp(5, 10, e), lids: 2 };
  }
  function solid(ctx, env, t, t0, a, c, hl, lab) {
    const S = KD.L(env).SB, k0 = S.c * (c.lids === 1 ? 0.75 : 1) * (c.h > 6 ? 0.62 : 1), r = c.r * k0 * 0.75, ry = r * 0.3, h = c.h * k0 * 0.75, top = [S.x, S.y - h / 2], bot = [S.x, S.y + h / 2];
    if (hl.side > 0) fillP(ctx, [[bot[0] - r, bot[1]], ...ellP(bot, r, ry, Math.PI, 0), [top[0] + r, top[1]], ...ellP(top, r, ry, 0, Math.PI)], AMB(a * hl.side));
    if (hl.circ > 0 && c.lids === 2) fillP(ctx, ellP(top, r, ry, 0, 2 * Math.PI), AMB(a * hl.circ));
    const k = seg(t, t0, t0 + 1.2);
    curve(ctx, part(ellP(top, r, ry, 0, 2 * Math.PI, 40), k), a, 3001, false, c.lids === 1 ? undefined : undefined);
    curve(ctx, part(ellP(bot, r, ry, 0, Math.PI, 20), k), a, 3002); curve(ctx, part(ellP(bot, r, ry, Math.PI, 2 * Math.PI, 20), k), a, 3003, true);
    edge(ctx, [top[0] - r, top[1]], [bot[0] - r, bot[1]], a, k, 3004); edge(ctx, [top[0] + r, top[1]], [bot[0] + r, bot[1]], a, k, 3005);
    const v = a * lab; if (v > 0) {
      dashL(ctx, top, [top[0] + r, top[1]], v * 0.8, 3006, LI.AMBER_RGB);
      txt(ctx, env, [top[0] + r / 2, top[1] - ry - 24], `r = ${c.r}`, v, true, 0.72);
      txt(ctx, env, [top[0] + r + 70, S.y], `h = ${Math.round(c.h)}`, v, true, 0.72);
    }
  }
  /** net: rectangle (2πr × h) with the circles above and below, fitted into NB */
  function net(ctx, env, t, t0, a, c, hl, roll) {
    const N = KD.L(env).NB, W = 2 * Math.PI * c.r, Ht = c.h + 4 * c.r, u = Math.min(N.w / W, N.h / Ht);
    const M = (p) => [N.x + (p[0] - W / 2) * u, N.y + (p[1] - c.h / 2) * u];
    const k = roll ? seg(t, t0, t0 + 3.6) : seg(t, t0, t0 + 0.8), x = W * k;
    if (a <= 0 || k <= 0) return { M, u, W };
    if (hl.side > 0) fillP(ctx, [[0, 0], [x, 0], [x, c.h], [0, c.h]].map(M), AMB(a * hl.side));
    Ink.path(ctx, [M([0, 0]), M([Math.max(0.01, x), 0])], { w: 3.5, alpha: a, seed: 3010, taper: [0, 0] });
    Ink.path(ctx, [M([0, c.h]), M([Math.max(0.01, x), c.h])], { w: 3.5, alpha: a, seed: 3011, taper: [0, 0] });
    Ink.path(ctx, [M([0, 0]), M([0, c.h])], { w: 3.5, alpha: a, seed: 3012, taper: [0, 0] });
    if (k >= 1) Ink.path(ctx, [M([W, 0]), M([W, c.h])], { w: 3.5, alpha: a, seed: 3013, taper: [0, 0] });
    if (roll) { const rr = a * (1 - seg(t, t0 + 3.7, t0 + 4.1)); if (rr > 0) { const C = M([x, -c.r]), ang = -x / c.r; curve(ctx, ellP(C, c.r * u, c.r * u, 0, 2 * Math.PI, 36), rr, 3014, false, LI.AMBER_RGB, 3); dot(ctx, [C[0] + c.r * u * Math.cos(ang + Math.PI / 2), C[1] + c.r * u * Math.sin(ang + Math.PI / 2)], rr, LI.AMBER_RGB); } }
    const kc = seg(t, t0 + (roll ? 4.0 : 0.8), t0 + (roll ? 5.0 : 1.6));
    const cs = c.lids === 2 ? [[c.r, -c.r], [c.r, c.h + c.r]] : [[c.r, c.h + c.r]];
    if (kc > 0) cs.forEach(([cx, cy], i) => { const C = M([cx, cy]); if (hl.circ > 0) fillP(ctx, ellP(C, c.r * u, c.r * u, 0, 2 * Math.PI), AMB(a * hl.circ)); curve(ctx, part(ellP(C, c.r * u, c.r * u, -Math.PI / 2, 1.5 * Math.PI, 40), kc), a, 3016 + i); });
    return { M, u, W };
  }
  function dimsNet(ctx, env, R, c, a, lw, lh) {
    if (a <= 0 || !R.M) return; const s = KD.L(env).G.s;
    F().T(ctx, lw, R.M([R.W / 2, 0])[0] + 0, R.M([0, 0])[1] + 30, { size: s * 0.72, alpha: a, halo: true, color: A.amber });
    F().T(ctx, lh, R.M([R.W, c.h / 2])[0] + 70, R.M([R.W, c.h / 2])[1], { size: s * 0.72, alpha: a, halo: true, color: A.amber });
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bu kutuyu kaplamak için ne kadar kâğıt gerekir?'],
      [10.6, 27.8, 'Açınımı hatırlayalım'],
      [28.4, 45.8, 'Parçaların alanlarını toplayalım (π ≈ 3)'],
      [46.4, 63.8, 'Kapaksız bir bardak'],
      [64.4, 79.8, 'Yükseklik iki katı olursa?'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t), c = can(t), w = (x, y) => win(t, x, y);
    const aA = a * w(5.0, 45.8), aB = a * w(46.8, 63.8), aC = a * w(64.8, 79.8);
    const hl = { side: w(29.2, 33.6) + w(37.4, 45.8) * 0 + w(47.6, 53.0) + w(68.6, 73.0), circ: w(33.8, 37.2) + w(53.2, 56.8) };
    solid(ctx, env, t, 5.2, aA, c, hl, w(11.2, 45.8)); solid(ctx, env, t, 46.8, aB, c, hl, w(47.2, 63.8)); solid(ctx, env, t, 64.8, aC, c, hl, w(65.2, 79.8));
    const R1 = net(ctx, env, t, 11.4, aA, c, hl, true), R2 = net(ctx, env, t, 47.2, aB, c, hl, false), R3 = net(ctx, env, t, 65.2, aC, c, hl, false);
    dimsNet(ctx, env, R1, c, aA * w(16.6, 45.8), '2πr ≈ 12', 'h = 5');
    dimsNet(ctx, env, R2, c, aB * w(48.4, 63.8), '2πr ≈ 18', 'h = 4');
    dimsNet(ctx, env, R3, c, aC * w(66.0, 79.8), '2πr ≈ 12', `h = ${Math.round(c.h)}`);
    tally(ctx, env, t, [[11.4, 27.8, 'r = 2 cm, h = 5 cm, π ≈ 3'], [16.6, 27.8, 'Boyu: 2πr ≈ 2 · 3 · 2 = 12 cm'], [18.6, 27.8, 'Eni: h = 5 cm'], [20.4, 27.8, '2 daire + 1 dikdörtgen', true]]);
    tally(ctx, env, t, [[29.4, 45.8, 'Yan yüz: 12 · 5 = 60 cm²'], [33.8, 45.8, 'Bir taban: πr² ≈ 3 · 4 = 12 cm²'], [35.8, 45.8, 'İki taban: 24 cm²'], [38.4, 45.8, 'Toplam: 60 + 24 = 84 cm²', true]]);
    tally(ctx, env, t, [[47.6, 63.8, 'r = 3 cm, h = 4 cm, kapak yok'], [49.4, 63.8, 'Yan yüz: 2 · 3 · 3 · 4 = 72'], [53.4, 63.8, 'Tek taban: 3 · 9 = 27'], [56.4, 63.8, 'Toplam: 72 + 27 = 99 cm²', true]]);
    tally(ctx, env, t, [[66.0, 79.8, 'r = 2 cm, h = 10 cm'], [68.8, 79.8, 'Yan yüz: 12 · 10 = 120'], [70.8, 79.8, 'Toplam: 120 + 24 = 144 cm²'], [73.4, 79.8, '144 ≠ 2 · 84 = 168', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Kapaklarıyla birlikte, hiç boşluk kalmadan'],
      [11.4, 27.8, 'Yan yüzü açalım: daire bir tur yuvarlanıyor'],
      [29.4, 45.8, 'Yüzey alanı: bütün parçaların alanları toplamı'],
      [47.4, 63.8, 'Kapak yoksa tek taban sayılır'],
      [65.4, 79.8, 'Yalnızca yan yüz uzuyor']]);
    exprs(ctx, t, at(W, 1), [[20.4, 27.8, 'Dikdörtgenin boyu taban çevresi kadar'],
      [38.4, 45.8, 'Yan yüz 2πr · h, tabanlar 2 · πr²'],
      [57.0, 63.8, 'Önce açınıma bak, sonra topla'],
      [73.4, 79.8, 'Yükseklik iki katı, yüzey alanı iki katı değil']]);
    exprs(ctx, t, at(W, 2), [[23.6, 27.8, 'Yüzey alanı = açınımın alanı', true], [41.4, 45.8, 'S = 2πr² + 2πrh', true],
      [60.0, 63.8, 'Bardak: πr² + 2πrh', true], [76.0, 79.8, 'Tabanlar aynı kaldı: 24 cm²', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Açınım: 2 daire ve 1 dikdörtgen', 80.6], ['Yan yüz: 2πr · h', 81.6], ['Tabanlar: 2 · πr²', 82.6], ['S = 2πr² + 2πrh!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A can', nameTr: 'Kutu', concept: 'How much paper?', conceptTr: 'Ne kadar kâğıt?', render });
})(window.LI = window.LI || {});
