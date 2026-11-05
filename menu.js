/* =====================================================
   Script halaman menu & pemesanan (menu.html)
   - Daftar menu per kategori + pencarian
   - Keranjang (tambah / kurang)
   - Kirim pesanan lewat WhatsApp
   - Nomor meja dari alamat: menu.html?meja=5
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  bindCafeData();
  document.title = `Menu - ${CAFE_DATA.name}`;

  /* ---------- Data menu ---------- */
  // "key" = penanda unik tiap menu (diambil dari id di config.js)
  const items = CAFE_DATA.menu.map((m, i) => ({
    ...m,
    key: String(m.id !== undefined ? m.id : i),
    price: Number(m.price) || 0,
  }));
  const categories = getCategories(items);
  const byKey = {};
  items.forEach((m) => {
    byKey[m.key] = m;
  });

  const params = new URLSearchParams(location.search);
  const tableFromUrl = (params.get("meja") || "").trim().slice(0, 10);

  /* ---------- Elemen ---------- */
  const $ = (id) => document.getElementById(id);
  const listEl = $("list");
  const catsEl = $("cats");
  const searchEl = $("search");
  const cartBar = $("cartBar");
  const cartCount = $("cartCount");
  const cartTotal = $("cartTotal");
  const backdrop = $("backdrop");
  const sheet = $("sheet");
  const cartList = $("cartList");
  const sheetTotal = $("sheetTotal");
  const tableInput = $("tableInput");
  const nameInput = $("nameInput");
  const noteInput = $("noteInput");
  const tableBadge = $("tableBadge");

  /* ---------- Keranjang (disimpan di HP supaya tidak hilang saat refresh) ---------- */
  const CART_KEY = "menu-cart-v1";
  const NAME_KEY = "menu-name-v1";

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
      const clean = {};
      Object.keys(raw).forEach((key) => {
        const qty = Math.floor(Number(raw[key]));
        const item = byKey[key];
        if (item && item.available !== false && qty > 0) clean[key] = Math.min(99, qty);
      });
      return clean;
    } catch (err) {
      return {};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      /* abaikan jika penyimpanan tidak tersedia */
    }
  }

  /* ---------- State ---------- */
  let activeCategory = "Semua";
  let query = "";
  let sheetOpen = false;
  const cart = loadCart();
  const controls = {}; // key -> elemen tombol/stepper di daftar menu

  /* ---------- Kategori ---------- */
  function renderCats() {
    catsEl.innerHTML = "";
    ["Semua", ...categories].forEach((cat) => {
      const btn = el("button", "filter-btn" + (cat === activeCategory ? " active" : ""), cat);
      btn.type = "button";
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderCats();
        renderList();
      });
      catsEl.appendChild(btn);
    });
  }

  /* ---------- Tombol tambah / stepper ---------- */
  function stepper(item, qty) {
    const box = el("div", "stepper");

    const minus = el("button", "", "−");
    minus.type = "button";
    minus.setAttribute("aria-label", `Kurangi ${item.name}`);
    minus.addEventListener("click", () => changeQty(item.key, -1));

    const plus = el("button", "", "+");
    plus.type = "button";
    plus.setAttribute("aria-label", `Tambah ${item.name}`);
    plus.addEventListener("click", () => changeQty(item.key, 1));

    box.append(minus, el("span", "", String(qty)), plus);
    return box;
  }

  function fillControl(ctrl, item) {
    ctrl.innerHTML = "";

    if (item.available === false) {
      ctrl.appendChild(el("span", "badge-habis", "Habis"));
      return;
    }

    const qty = cart[item.key] || 0;
    if (qty === 0) {
      const add = el("button", "add-btn", "+");
      add.type = "button";
      add.setAttribute("aria-label", `Tambah ${item.name}`);
      add.addEventListener("click", () => changeQty(item.key, 1));
      ctrl.appendChild(add);
    } else {
      ctrl.appendChild(stepper(item, qty));
    }
  }

  /* ---------- Daftar menu ---------- */
  function menuItem(item) {
    const soldOut = item.available === false;
    const card = el("article", "m-item" + (soldOut ? " soldout" : ""));

    const imgWrap = el("div", "m-img");
    appendMenuImage(imgWrap, item);

    const info = el("div", "m-info");
    info.appendChild(el("h3", "", item.name));
    if (item.description) info.appendChild(el("p", "", item.description));
    info.appendChild(el("span", "m-price", formatRupiah(item.price)));

    const ctrl = el("div", "m-ctrl");
    controls[item.key] = ctrl;
    fillControl(ctrl, item);

    card.append(imgWrap, info, ctrl);
    return card;
  }

  function renderList() {
    listEl.innerHTML = "";
    Object.keys(controls).forEach((key) => delete controls[key]);

    const q = query.trim().toLowerCase();
    let shown = 0;

    categories.forEach((cat) => {
      if (activeCategory !== "Semua" && cat !== activeCategory) return;

      const group = items.filter((m) => {
        if (m.category !== cat) return false;
        if (!q) return true;
        return `${m.name} ${m.description || ""}`.toLowerCase().includes(q);
      });
      if (group.length === 0) return;

      const section = el("section", "m-group");
      section.appendChild(el("h2", "", cat));
      group.forEach((m) => section.appendChild(menuItem(m)));
      listEl.appendChild(section);
      shown += group.length;
    });

    if (shown === 0) listEl.appendChild(el("p", "m-empty", "Menu tidak ditemukan."));
  }

  /* ---------- Hitung total ---------- */
  function totals() {
    let count = 0;
    let total = 0;
    Object.keys(cart).forEach((key) => {
      count += cart[key];
      total += cart[key] * byKey[key].price;
    });
    return { count, total };
  }

  function updateBar() {
    const { count, total } = totals();
    cartBar.hidden = count === 0;
    cartCount.textContent = String(count);
    cartTotal.textContent = formatRupiah(total);
  }

  function changeQty(key, delta) {
    const next = Math.max(0, Math.min(99, (cart[key] || 0) + delta));
    if (next === 0) delete cart[key];
    else cart[key] = next;

    saveCart();
    if (controls[key]) fillControl(controls[key], byKey[key]);
    updateBar();
    if (sheetOpen) renderSheet();
  }

  /* ---------- Lembar pesanan ---------- */
  function renderSheet() {
    const keys = Object.keys(cart);
    if (keys.length === 0) {
      closeSheet();
      return;
    }

    cartList.innerHTML = "";
    keys.forEach((key) => {
      const item = byKey[key];
      const li = el("li");

      const info = el("div", "cart-name");
      info.append(
        el("strong", "", item.name),
        el("span", "", `${cart[key]} × ${formatRupiah(item.price)} = ${formatRupiah(item.price * cart[key])}`)
      );

      li.append(info, stepper(item, cart[key]));
      cartList.appendChild(li);
    });

    sheetTotal.textContent = formatRupiah(totals().total);
  }

  function openSheet() {
    if (totals().count === 0) return;
    sheetOpen = true;
    renderSheet();
    sheet.classList.add("open");
    backdrop.classList.add("show");
    sheet.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeSheet() {
    sheetOpen = false;
    sheet.classList.remove("open");
    backdrop.classList.remove("show");
    sheet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  /* ---------- Susun pesan WhatsApp ---------- */
  function buildMessage() {
    const lines = [CAFE_DATA.order_greeting || "Halo, saya mau pesan:"];

    const table = tableInput.value.trim();
    const name = nameInput.value.trim();
    const note = noteInput.value.trim();

    if (table) lines.push(`Meja: ${table}`);
    if (name) lines.push(`Nama: ${name}`);
    lines.push("");

    Object.keys(cart).forEach((key) => {
      const item = byKey[key];
      lines.push(`${cart[key]}x ${item.name} - ${formatRupiah(item.price * cart[key])}`);
    });

    lines.push("");
    lines.push(`Total: ${formatRupiah(totals().total)}`);
    if (note) lines.push(`Catatan: ${note}`);

    return lines.join("\n");
  }

  function sendOrder() {
    if (totals().count === 0) return;

    const number = getWaNumber();
    if (!number) {
      showToast("Nomor WhatsApp cafe belum diatur.");
      return;
    }

    try {
      localStorage.setItem(NAME_KEY, nameInput.value.trim());
    } catch (err) {
      /* abaikan */
    }

    const url = `https://wa.me/${number}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank");
  }

  /* ---------- Pasang event ---------- */
  searchEl.addEventListener("input", () => {
    query = searchEl.value;
    renderList();
  });

  cartBar.addEventListener("click", openSheet);
  backdrop.addEventListener("click", closeSheet);
  $("closeSheet").addEventListener("click", closeSheet);
  $("sendOrder").addEventListener("click", sendOrder);

  $("goPayment").addEventListener("click", () => {
    if (totals().count === 0) return;
    const name = nameInput.value.trim();
    if (!name) {
      showToast("Isi nama pemesan terlebih dahulu.");
      nameInput.focus();
      return;
    }
    try {
      localStorage.setItem(NAME_KEY, name);
      localStorage.setItem("payment-order-info-v1", JSON.stringify({
        name,
        table: tableInput.value.trim(),
        note: noteInput.value.trim(),
        createdAt: new Date().toISOString()
      }));
    } catch (err) { /* abaikan jika penyimpanan tidak tersedia */ }
    window.location.href = "payment.html";
  });

  $("clearCart").addEventListener("click", () => {
    if (!confirm("Kosongkan semua pesanan?")) return;
    Object.keys(cart).forEach((key) => delete cart[key]);
    saveCart();
    renderList();
    updateBar();
    closeSheet();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sheetOpen) closeSheet();
  });

  /* ---------- Mulai ---------- */
  if (tableFromUrl) {
    tableBadge.textContent = `Meja ${tableFromUrl}`;
    tableBadge.hidden = false;
    tableInput.value = tableFromUrl;
  }

  try {
    nameInput.value = localStorage.getItem(NAME_KEY) || "";
  } catch (err) {
    /* abaikan */
  }

  renderCats();
  renderList();
  updateBar();
});
