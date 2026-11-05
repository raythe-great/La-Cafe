document.addEventListener("DOMContentLoaded", () => {
  bindCafeData();
  const $ = (id) => document.getElementById(id);
  const cartKey = "menu-cart-v1";
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(cartKey) || "{}"); } catch (err) {}
  const items = Array.isArray(CAFE_DATA.menu) ? CAFE_DATA.menu : [];
  const selected = items.filter((item, index) => Number(cart[String(item.id !== undefined ? item.id : index)]) > 0);
  const total = selected.reduce((sum, item, index) => {
    const key = String(item.id !== undefined ? item.id : items.indexOf(item));
    return sum + (Number(item.price) || 0) * Math.max(0, Math.floor(Number(cart[key]) || 0));
  }, 0);
  let orderInfo = {};
  try { orderInfo = JSON.parse(localStorage.getItem("payment-order-info-v1") || "{}"); } catch (err) {}
  $("total").textContent = formatRupiah(total);
  $("orderSummary").textContent = selected.length
    ? `${selected.length} jenis menu${orderInfo.name ? ` · Pemesan: ${orderInfo.name}` : ""}${orderInfo.table ? ` · Meja: ${orderInfo.table}` : ""}`
    : "Keranjang kosong. Silakan kembali ke menu dan pilih pesanan.";

  const paymentData = {
    bank: `<h3>Transfer Bank (contoh)</h3><p>Bank: <strong>BCA</strong></p><div class="copy-row"><strong id="accountNumber">1234567890</strong><button class="link-btn" type="button" data-copy="accountNumber">Salin nomor</button></div><p>Atas nama: <strong>Nama Pemilik</strong></p>`,
    ewallet: `<h3>E-Wallet (contoh)</h3><p>Provider: <strong>DANA / GoPay</strong></p><div class="copy-row"><strong id="walletNumber">081234567890</strong><button class="link-btn" type="button" data-copy="walletNumber">Salin nomor</button></div><p>Atas nama: <strong>Nama Pemilik</strong></p>`,
    qris: `<h3>QRIS (demo)</h3><div style="background:#fff;border:1px dashed #9aa6b2;border-radius:12px;padding:24px;text-align:center"><i class="fa-solid fa-qrcode" style="font-size:5rem"></i><p>Tempatkan gambar QRIS demo di sini</p><small>QR ini bukan kode pembayaran aktif.</small></div>`
  };
  function renderDetails() {
    const method = document.querySelector('input[name="method"]:checked').value;
    $("details").innerHTML = paymentData[method];
  }
  document.querySelectorAll('input[name="method"]').forEach((radio) => radio.addEventListener("change", renderDetails));
  $("details").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const text = $(button.dataset.copy).textContent;
    const ok = await copyText(text);
    button.textContent = ok ? "Tersalin!" : "Salin manual";
  });
  $("paidDemo").addEventListener("click", () => {
    $("status").textContent = "Pembayaran berhasil disimulasikan (DEMO). Tidak ada uang yang ditransfer.";
    $("status").style.fontWeight = "600";
  });
  renderDetails();
});
