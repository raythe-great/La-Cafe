/* =====================================================
   Script halaman WiFi (wifi.html)
   - Tampilkan nama & password WiFi
   - Tombol salin
   - QR WiFi (format standar WIFI:T:...;S:...;P:...;;)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  bindCafeData();
  document.title = `WiFi - ${CAFE_DATA.name}`;

  const ssid = String(CAFE_DATA.wifi_ssid || "");
  const password = String(CAFE_DATA.wifi_password || "");

  // Jenis pengaman: WPA (umum), WEP, atau nopass (tanpa password)
  let type = String(CAFE_DATA.wifi_security || (password ? "WPA" : "nopass")).toUpperCase();
  if (type !== "WEP" && type !== "NOPASS") type = "WPA";
  const open = type === "NOPASS";

  // Jika WiFi tanpa password, sembunyikan baris & tombol password
  if (open) {
    document.getElementById("passRow").hidden = true;
    document.getElementById("copyPass").hidden = true;
  }

  /* ---------- Tombol salin ---------- */
  document.getElementById("copyPass").addEventListener("click", async () => {
    const ok = await copyText(password);
    showToast(ok ? "Password WiFi berhasil disalin!" : "Gagal menyalin, silakan salin manual.");
  });

  document.getElementById("copySsid").addEventListener("click", async () => {
    const ok = await copyText(ssid);
    showToast(ok ? "Nama WiFi berhasil disalin!" : "Gagal menyalin, silakan salin manual.");
  });

  /* ---------- QR WiFi ---------- */
  // Karakter khusus \ ; , : " harus diberi garis miring di depannya
  const esc = (value) => value.replace(/([\\;,:"])/g, "\\$1");

  if (ssid) {
    const payload = open
      ? `WIFI:T:nopass;S:${esc(ssid)};;`
      : `WIFI:T:${type};S:${esc(ssid)};P:${esc(password)};;`;

    try {
      const canvas = drawQR(payload);
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "QR code untuk tersambung ke WiFi");
      document.getElementById("qrBox").appendChild(canvas);
      document.getElementById("wifiQr").hidden = false;
    } catch (err) {
      /* jika QR gagal dibuat, halaman tetap menampilkan nama & password */
    }
  }
});
