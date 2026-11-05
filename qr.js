/* =====================================================
   Script pembuat QR menu (qr.html)
   Membuat QR untuk tiap meja: menu.html?meja=1, menu.html?meja=2, ...
   Pustaka QR: qrcode.js (QR Code Generator for JavaScript, lisensi MIT)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  bindCafeData();
  document.title = `QR Menu - ${CAFE_DATA.name}`;

  const urlInput = document.getElementById("menuUrl");
  const urlHelp = document.getElementById("urlHelp");
  const countInput = document.getElementById("tableCount");
  const generalBox = document.getElementById("withGeneral");
  const grid = document.getElementById("qrGrid");
  const statusEl = document.getElementById("qrStatus");

  /* ---------- Tebak alamat menu dari alamat halaman ini ---------- */
  function guessMenuUrl() {
    if (location.protocol !== "http:" && location.protocol !== "https:") return "";
    return new URL("menu.html", location.href).href;
  }

  // drawQR() ada di common.js (dipakai juga oleh halaman WiFi)

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "qr";
  }

  function download(canvas, filename) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }, "image/png");
  }

  /* ---------- Kartu QR ---------- */
  function addCard(label, link) {
    const card = el("div", "qr-card");

    const canvas = drawQR(link);
    canvas.className = "qr-canvas";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", `QR menu ${label}`);

    const btn = el("button", "qr-dl", "Unduh PNG");
    btn.type = "button";
    btn.addEventListener("click", () => download(canvas, `qr-${slug(CAFE_DATA.name)}-${slug(label)}.png`));

    card.append(
      el("div", "qr-cafe", CAFE_DATA.name),
      canvas,
      el("div", "qr-label", label),
      el("div", "qr-hint", "Scan untuk lihat menu & pesan"),
      btn
    );
    grid.appendChild(card);
  }

  /* ---------- Buat semua QR ---------- */
  function generate() {
    let base;
    try {
      base = new URL(urlInput.value.trim());
      if (base.protocol !== "http:" && base.protocol !== "https:") throw new Error("protokol");
    } catch (err) {
      showToast("Alamat menu belum benar. Contoh: https://namamu.github.io/cafe/menu.html");
      return;
    }

    const count = Math.max(1, Math.min(60, parseInt(countInput.value, 10) || 1));
    countInput.value = String(count);
    grid.innerHTML = "";

    let total = 0;

    if (generalBox.checked) {
      const general = new URL(base.href);
      general.searchParams.delete("meja");
      addCard("Menu", general.href);
      total++;
    }

    for (let n = 1; n <= count; n++) {
      const link = new URL(base.href);
      link.searchParams.set("meja", String(n));
      addCard(`Meja ${n}`, link.href);
      total++;
    }

    statusEl.textContent = `${total} QR siap. Tekan "Cetak / Simpan PDF" atau unduh satu per satu.`;
  }

  /* ---------- Pasang event ---------- */
  document.getElementById("btnGenerate").addEventListener("click", generate);
  document.getElementById("btnPrint").addEventListener("click", () => {
    if (grid.children.length === 0) generate();
    if (grid.children.length > 0) window.print();
  });

  /* ---------- Mulai ---------- */
  const guessed = guessMenuUrl();
  if (guessed) {
    urlInput.value = guessed;
    urlHelp.textContent = "Alamat terisi otomatis dari website ini.";
    generate();
  } else {
    urlHelp.textContent =
      "Buka halaman ini dari website yang sudah online supaya terisi otomatis, atau ketik alamatnya sendiri.";
  }
});
