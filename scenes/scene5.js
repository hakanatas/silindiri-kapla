/* SAHNE 5 — İKİ KAT (64–80 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 5, start: 64, end: 80, name: "Twice as tall", nameTr: "İki kat", concept: "Only the side grows", conceptTr: "Yalnızca yan yüz", render });
})(window.LI = window.LI || {});
