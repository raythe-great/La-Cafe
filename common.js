/* =====================================================
   Fungsi bersama (dipakai index.html, menu.html, qr.html)
   Harus dimuat SETELAH config.js
   ===================================================== */

/* Format angka jadi Rupiah, contoh: Rp 28.000 */
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(angka)
    .replace(/ /g, " ");
}

/* Buat elemen HTML dengan cepat (teks aman dari injeksi HTML) */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* Isi teks dan link dari config.js ke elemen data-text / data-href */
function bindCafeData() {
  document.querySelectorAll("[data-text]").forEach((node) => {
    const value = CAFE_DATA[node.dataset.text];
    node.textContent = value === undefined ? "" : value;
  });
  document.querySelectorAll("[data-href]").forEach((node) => {
    node.href = CAFE_DATA[node.dataset.href] || "#";
  });
}

/* Ambil nomor WhatsApp (angka saja) dari link wa.me di config.js */
function getWaNumber() {
  const found = String(CAFE_DATA.whatsapp || "").match(/\d{8,15}/);
  return found ? found[0] : "";
}

/* Daftar kategori unik, sesuai urutan di config.js */
function getCategories(menu) {
  const list = [];
  menu.forEach((item) => {
    if (!list.includes(item.category)) list.push(item.category);
  });
  return list;
}

/* Pasang gambar menu; jika gagal dimuat, tampil gradien coklat */
function appendMenuImage(parent, item) {
  if (!item.image) return;
  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.description ? `${item.name} - ${item.description}` : item.name;
  img.loading = "lazy";
  img.addEventListener("error", () => img.remove());
  parent.appendChild(img);
}

/* Notifikasi kecil di bawah layar (butuh <div id="toast">) */
let toastTimer;
function showToast(message) {
  const node = document.getElementById("toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2400);
}

/* Salin teks ke clipboard, dengan cadangan untuk browser lama */
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    /* lanjut ke cara cadangan */
  }

  try {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    temp.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    temp.remove();
    return ok;
  } catch (err) {
    return false;
  }
}

/* Gambar QR code ke elemen <canvas> (butuh qrcode.js dimuat lebih dulu) */
function drawQR(text) {
  const qr = qrcode(0, "M"); // 0 = ukuran otomatis, M = koreksi error sedang
  qr.addData(text);
  qr.make();

  const modules = qr.getModuleCount();
  const quiet = 4; // zona kosong di sekeliling QR (standar QR)
  const cell = Math.max(4, Math.floor(720 / (modules + quiet * 2)));
  const size = cell * (modules + quiet * 2);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#2b1a10";

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (qr.isDark(r, c)) ctx.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
    }
  }
  return canvas;
}
