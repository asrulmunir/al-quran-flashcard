# Flashcard Arab Al-Quran

Aplikasi web yang direka untuk membantu pengguna menghafal perkataan dan ayat Arab dari Al-Quran Suci melalui flashcard interaktif.

## Ciri-ciri

### 🎯 Mod Pembelajaran
- **Arab → Terjemahan**: Tunjukkan teks Arab, dedahkan terjemahan
- **Terjemahan → Arab**: Tunjukkan terjemahan, dedahkan teks Arab  
- **Mod Campuran**: Bertukar-tukar secara rawak antara kedua-dua mod

### 📖 Sesi Boleh Disesuaikan
- Pilih mana-mana Surah dari 1-114
- Pilih dari pelbagai terjemahan (Bahasa Inggeris, Melayu, Cina, Tamil)
- Tetapkan julat ayat khusus untuk pembelajaran fokus
- Panjang sesi boleh laras

### 🎴 Flashcard Interaktif
- Animasi flip kad yang cantik
- Penjejakan kemajuan dengan bar kemajuan visual
- Penilaian kendiri dengan tiga tahap kesukaran:
  - ✅ Betul
  - ⚠️ Sukar  
  - ❌ Salah

### 🎮 Navigasi & Kawalan
- Pintasan papan kekunci untuk pembelajaran cekap:
  - `Space/Enter`: Dedahkan jawapan
  - `←/→`: Navigasi antara kad
  - `1/2/3`: Tandakan sebagai Betul/Sukar/Salah
- Kawalan tetikus/sentuh untuk semua interaksi
- Set semula sesi untuk memulakan semula

### 📊 Penjejakan Kemajuan
- Statistik masa nyata semasa pembelajaran
- Ringkasan penyiapan sesi
- Mod ulangkaji untuk kad sukar
- Analitik prestasi

### 📱 Reka Bentuk Responsif
- Berfungsi pada desktop, tablet, dan peranti mudah alih
- Antara muka mesra sentuh
- Dioptimumkan untuk pelbagai saiz skrin
- Ciri kebolehcapaian disertakan

## Memulakan

### Prasyarat
- Pelayar web moden dengan JavaScript diaktifkan
- Sambungan internet (untuk akses API)

### Pemasangan
1. Klon atau muat turun repositori ini
2. Buka `index.html` dalam pelayar web anda
3. Tiada persediaan tambahan diperlukan!

### Penggunaan
1. **Sediakan Sesi**:
   - Pilih Surah dari dropdown
   - Pilih bahasa terjemahan pilihan anda
   - Tetapkan julat ayat yang ingin anda pelajari
   - Pilih mod pembelajaran
   - Klik "Mulakan Sesi Pembelajaran"

2. **Belajar**:
   - Baca soalan di hadapan kad
   - Klik "Tunjukkan Jawapan" atau tekan Space/Enter
   - Nilai pengetahuan anda dan klik butang yang sesuai
   - Navigasi menggunakan kekunci anak panah atau butang

3. **Ulangkaji**:
   - Lihat statistik sesi anda
   - Ulangkaji kad sukar jika diperlukan
   - Mulakan sesi baharu

## Integrasi API

Aplikasi ini menggunakan Al-Quran API (https://quran-api.asrulmunir.workers.dev) yang menyediakan:
- Teks Al-Quran lengkap dalam bahasa Arab
- Terjemahan pelbagai bahasa
- Akses ayat demi ayat
- Keupayaan carian

## Struktur Fail

```
al-quran-flashcard/
├── index.html          # Struktur HTML utama
├── styles.css          # Gaya CSS dan animasi
├── script.js           # Fungsi JavaScript
├── api-spec.yaml       # Spesifikasi API
└── README.md           # Fail ini
```

## Keserasian Pelayar

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Ciri-ciri Terperinci

### Penjelasan Mod Pembelajaran

**Mod Arab → Terjemahan**
- Sempurna untuk mereka yang belajar memahami teks Arab
- Menunjukkan ayat Arab asal
- Mendedahkan terjemahan sebagai jawapan

**Mod Terjemahan → Arab**
- Bagus untuk latihan menghafal
- Menunjukkan terjemahan dahulu
- Mendedahkan teks Arab sebagai jawapan

**Mod Campuran**
- Menggabungkan kedua-dua mod secara rawak
- Menyediakan latihan bervariasi
- Mengekalkan sesi pembelajaran menarik

### Pintasan Papan Kekunci

| Kekunci | Tindakan |
|---------|----------|
| `Space` atau `Enter` | Dedahkan jawapan |
| `←` | Kad sebelumnya |
| `→` | Kad seterusnya |
| `1` | Tandakan sebagai Betul |
| `2` | Tandakan sebagai Sukar |
| `3` | Tandakan sebagai Salah |

### Ciri Kebolehcapaian

- Sokongan mod kontras tinggi
- Navigasi papan kekunci
- Mesra pembaca skrin
- Sokongan gerakan berkurangan untuk pengguna sensitif
- Penunjuk fokus untuk semua elemen interaktif

## Penyesuaian

Aplikasi boleh disesuaikan dengan mudah dengan mengubah suai:

- **Warna**: Kemas kini sifat CSS khusus dalam `styles.css`
- **Fon**: Tukar keluarga fon dalam CSS
- **Endpoint API**: Ubah suai `apiBaseUrl` dalam `script.js`
- **Tetapan Lalai**: Laraskan nilai lalai dalam JavaScript

## Menyumbang

Sila sumbang dengan:
1. Melaporkan pepijat
2. Mencadangkan ciri baharu
3. Menghantar pull request
4. Menambah baik dokumentasi

## Lesen

Projek ini adalah sumber terbuka. Teks Al-Quran dan terjemahan disediakan di bawah lesen masing-masing melalui Al-Quran API.

## Penghargaan

- Al-Quran API oleh Asrul Munir
- Tanzil.net untuk teks Al-Quran
- Penyedia terjemahan untuk sokongan pelbagai bahasa
- Google Fonts untuk tipografi (Amiri dan Inter)

## Sokongan

Jika anda menghadapi sebarang masalah atau mempunyai soalan:
1. Periksa konsol pelayar untuk mesej ralat
2. Pastikan anda mempunyai sambungan internet yang stabil
3. Cuba muat semula halaman
4. Periksa sama ada API boleh diakses

---

**Semoga alat ini membantu dalam perjalanan anda mempelajari dan menghafal Al-Quran Suci. Barakallahu feek!** 🤲
