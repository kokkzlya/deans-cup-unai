# Dean's Cup UNAI 2026 - Portal Jadwal Pertandingan Olahraga 🏆

Portal web resmi 1-page untuk jadwal pertandingan, skor terkini, dan informasi turnamen olahraga tahunan **Dean's Cup 2026** Fakultas Ekonomi, Universitas Advent Indonesia (UNAI).

## 🚀 Fitur Utama

- **Single Page Application (SPA) Bersih & Responsif**:
  - **Filter Interaktif Cabor**: Futsal Putra, Basket 3x3, E-Sport (LoL Wild Rift), Badminton Ganda.
  - **Filter Tanggal & Hari**: Day 1 hingga Finals.
  - **Filter Status Tanding**: Live Sekarang, Akan Datang, dan Selesai.
  - **Pencarian Real-Time**: Cari tim, babak penyisihan/final, prodi, atau venue lapangan secara instan.
- **Kartu Pertandingan Lengkap**:
  - Skor langsung (live score) dengan indikator animasi radar berdenyut.
  - Modal rincian pertandingan interaktif.
  - Tombol salin info jadwal ke clipboard dengan notifikasi toast.
- **Klasemen Sementara Babak Grup**:
  - Tabel poin grup Futsal & Basket lengkap dengan status kualifikasi.
- **Panduan Venue Kampus UNAI**:
  - Gymnasium UNAI (Court A & B), Lapangan Futsal Outdoor, dan Student Center Hall.
- **Desain Modern & Aksesibel**:
  - Tipografi Google Fonts (*Plus Jakarta Sans* & *Outfit*).
  - Tema Gelap (Dark Mode) default dengan pengalih ke Mode Terang (Light Mode).
  - Countdown timer menuju penutupan dan puncak Grand Final.

## 🛠️ Tech Stack & Keamanan

- **Backend**: Python 3.12+, FastAPI, Jinja2, Uvicorn.
- **Frontend**: Semantic HTML5, Vanilla CSS3 (Custom Design System, Glassmorphism, CSS Variables), Vanilla JavaScript.
- **Keamanan**:
  - Zero `innerHTML` (menggunakan `document.createElement`, `textContent`, `replaceChildren`).
  - Strict Content-Security-Policy (CSP), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`.
  - Input sanitization & safe output encoding.

## 🏃 Cara Menjalankan

### Menggunakan Poetry
```bash
poetry install
poetry run uvicorn deanscupunai.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Menggunakan Pip & Requirements
```bash
pip install -r requirements.txt
uvicorn deanscupunai.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Menggunakan Docker Compose
```bash
docker compose up -d --build
```

Kunjungi `http://127.0.0.1:8000` di peramban.

## 🧪 Menjalankan Pengujian (Pytest)
```bash
pytest -v
```