# CertiSafe — Sistem Manajemen Sertifikasi Karyawan

Prototipe web app (React + Vite) untuk manajemen sertifikasi karyawan: dashboard,
upload & verifikasi sertifikat, requirement matrix, perpindahan karyawan, dan notifikasi.

> **Catatan penting:** versi ini menyimpan data di `localStorage` browser (belum
> pakai database sungguhan), jadi data hanya tersimpan di browser/perangkat
> masing-masing, tidak otomatis sinkron antar pengguna. Cocok untuk demo/uji
> coba tampilan dan alur kerja. Untuk pemakaian produksi sungguhan (banyak
> pengguna, login aman, data tersimpan terpusat), langkah berikutnya adalah
> menghubungkan ke database (misalnya Supabase / Firebase / backend sendiri).

## Menjalankan di komputer sendiri (opsional, untuk cek dulu)

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

## Deploy ke Vercel (paling mudah)

**Cara 1 — lewat GitHub (disarankan):**
1. Buat repository baru di GitHub, lalu upload/push semua isi folder ini ke repo tersebut.
2. Buka [vercel.com](https://vercel.com) → login/daftar (bisa pakai akun GitHub).
3. Klik **"Add New… → Project"**, pilih repository yang tadi dibuat.
4. Vercel otomatis mendeteksi ini project **Vite** — biarkan pengaturan default:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Klik **Deploy**, tunggu 1–2 menit. Selesai — Anda akan dapat link seperti `https://certisafe-xxxx.vercel.app`.

**Cara 2 — lewat Vercel CLI (tanpa GitHub):**
```bash
npm install -g vercel
vercel
```
Ikuti instruksi di layar (login, pilih nama project, dsb). Setelah selesai jalankan `vercel --prod` untuk publish ke link final.

## Akun demo untuk login

- `admin@certisafe.com` / `admin123` — peran **HSE Admin**
- `hrd@certisafe.com` / `hrd123` — peran **HRD**

Atau daftar akun baru lewat halaman **Daftar Akun**.
