// =====================================================================
// DATA CAFE - EDIT FILE INI SAJA UNTUK MENGGANTI SEMUANYA
// (nama, WiFi, sosmed, alamat, jam buka, dan daftar menu)
//
// Aturan: tulis seperti JSON. Semua nama kunci pakai tanda kutip dua,
// teks pakai tanda kutip dua, jangan ada koma setelah item terakhir,
// dan jangan menulis komentar di dalam data.
//
// - Nomor pemesanan memakai nomor di "whatsapp" (format wa.me/62...).
// - Menu sedang habis? Tambahkan "available": false pada menu itu.
// - Nilai "id" setiap menu harus beda-beda.
// - Foto sendiri: taruh file foto di folder yang sama dengan file ini,
//   lalu isi "image" dengan nama filenya, misalnya "latte.jpg".
// =====================================================================
const CAFE_DATA = {
  "name": "La'Cafe",
  "tagline": "Italiano.",
  "about": "One and only Fancy cafe in indonesia.",
  "order_greeting": "Gracias Sir', saya mau pesan:",

  "wifi_ssid": "L'aC",
  "wifi_password": "AnjayAlok",

  "instagram": "https://instagram.com/La'Cafe",
  "tiktok": "https://tiktok.com/@la'cafe",
  "whatsapp": "https://wa.me/6285161164102",
  "facebook": "https://facebook.com/la'cafe",

  "address": "Jl. Raya Dangdeur",
  "map_query": "Jl. Raya Dangdeur, Kab. bandung",
  "hours": [
    { "day": "Senin - Jumat", "time": "08.00 - 22.00" },
    { "day": "Sabtu - Minggu", "time": "09.00 - 23.00" }
  ],

  "menu": [
    { "id": 1, "name": "Espresso", "category": "Kopi", "price": 18000,
      "description": "Shot tunggal pekat dengan crema tebal.",
      "image": "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=70" },
    { "id": 2, "name": "Cafe Latte", "category": "Kopi", "price": 28000,
      "description": "Espresso dengan susu lembut dan latte art.",
      "image": "https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=600&q=70" },
    { "id": 3, "name": "Kopi Susu Aren", "category": "Kopi", "price": 25000,
      "description": "Kopi susu dengan gula aren asli, manis pas.",
      "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=70" },

    { "id": 4, "name": "Matcha Latte", "category": "Non-Kopi", "price": 30000,
      "description": "Matcha premium dengan susu creamy.",
      "image": "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=70" },
    { "id": 5, "name": "Coklat Panas", "category": "Non-Kopi", "price": 26000,
      "description": "Coklat pekat hangat dengan topping marshmallow.",
      "image": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=70" },
    { "id": 6, "name": "Lemon Tea", "category": "Non-Kopi", "price": 20000,
      "description": "Teh segar dengan perasan lemon asli.",
      "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=70" },

    { "id": 7, "name": "Nasi Goreng Senja", "category": "Makanan", "price": 35000,
      "description": "Nasi goreng bumbu spesial dengan telur dan ayam suwir.",
      "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=70" },
    { "id": 8, "name": "Chicken Katsu", "category": "Makanan", "price": 38000,
      "description": "Ayam katsu renyah dengan saus dan nasi hangat.",
      "image": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=70" },
    { "id": 9, "name": "Club Sandwich", "category": "Makanan", "price": 32000,
      "description": "Roti panggang isi ayam, telur, dan sayuran segar.",
      "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=70" },

    { "id": 10, "name": "Butter Croissant", "category": "Dessert", "price": 22000,
      "description": "Croissant berlapis, renyah di luar, lembut di dalam.",
      "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=70" },
    { "id": 11, "name": "Cheesecake", "category": "Dessert", "price": 33000,
      "description": "Cheesecake lembut dengan base biskuit.",
      "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=70" },
    { "id": 12, "name": "Tiramisu", "category": "Dessert", "price": 35000,
      "description": "Dessert klasik Italia dengan rasa kopi dan kakao.",
      "image": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=70" }
  ]
};
