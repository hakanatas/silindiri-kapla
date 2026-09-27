/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 8. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Ne kadar kâğıt?', en: 'How much paper?',
      note: 'Bu silindir biçimindeki kutuyu kapaklarıyla birlikte kaplamak istiyoruz. Ne kadar kâğıt gerekir?' },
    { scene: 2, start: 10.8, end: 19.2, tr: 'Açınımı hatırlayalım', en: 'Remember the net',
      note: 'Yarıçap 2, yükseklik 5 santimetre. Yan yüzü açalım: taban dairesi bir tur yuvarlanıyor, 2 pi r, yaklaşık 12 santimetre.' },
    { scene: 2, start: 19.4, end: 27.8, tr: '2 daire, 1 dikdörtgen', en: 'Two circles, one rectangle',
      note: 'Açınım iki daire ve bir dikdörtgen. Kutunun yüzey alanı, açınımın alanına eşit.' },
    { scene: 3, start: 28.8, end: 36.2, tr: 'Yan yüz ve tabanlar', en: 'The side and the bases',
      note: 'Pi yaklaşık 3. Yan yüz 12 çarpı 5, 60 santimetrekare. Bir taban pi r kare, 3 çarpı 4, 12.' },
    { scene: 3, start: 36.4, end: 45.8, tr: '84 cm²', en: '84 cm²',
      note: 'İki taban 24. Toplam 60 artı 24, 84 santimetrekare. Genel olarak: 2 pi r kare artı 2 pi r h.' },
    { scene: 4, start: 46.8, end: 55.0, tr: 'Kapaksız bardak', en: 'A cup without a lid',
      note: 'Yarıçapı 3, yüksekliği 4 santimetre olan kapaksız bir bardak. Yan yüz 2 çarpı 3 çarpı 3 çarpı 4, 72.' },
    { scene: 4, start: 55.2, end: 63.8, tr: 'Tek taban: 99 cm²', en: 'One base: 99 cm²',
      note: 'Kapak yok, tek taban: 3 çarpı 9, 27. Toplam 99 santimetrekare. Önce açınıma bakıp parçaları topluyoruz.' },
    { scene: 5, start: 64.8, end: 72.0, tr: 'Yükseklik iki katı', en: 'Twice as tall',
      note: 'İlk kutunun yüksekliği 10 olsun. Yan yüz 12 çarpı 10, 120; toplam 144.' },
    { scene: 5, start: 72.2, end: 79.8, tr: 'İki katı değil', en: 'Not twice as much',
      note: '144, 84 ün iki katı değil. Yalnızca yan yüz iki katına çıktı, tabanlar aynı kaldı.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Yan yüz + 2 taban', en: 'The side + two bases',
      note: 'Aklında kalsın: silindirin yüzey alanı yan yüz ile iki tabanın alanları toplamı.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'S = 2πr² + 2πrh!', en: 'S = 2πr² + 2πrh!',
      note: 'S eşittir 2 pi r kare artı 2 pi r h!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
