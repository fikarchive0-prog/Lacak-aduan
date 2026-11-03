# Lacak Aduan

Proyek demo website untuk mengelola aduan masyarakat secara sederhana dan interaktif. Aplikasi ini dibuat dengan HTML, CSS, dan JavaScript murni tanpa proses build, dan fokus utamanya adalah simulasi alur aduan mulai dari pengiriman laporan hingga penanganan oleh petugas.

## Deskripsi

Aplikasi ini menampilkan dua sisi penggunaan:

- Sisi warga: membuat aduan, mendapatkan nomor pelacakan, melihat status, membalas permintaan informasi, dan memberi rating setelah aduan selesai.
- Sisi petugas: melihat daftar aduan, memfilter berdasarkan status dan prioritas, mengubah prioritas, menambahkan catatan tindak lanjut, dan memperbarui status aduan.

Semua data disimpan di browser menggunakan `localStorage`, sehingga aplikasi ini cocok untuk demo lokal dan pembelajaran, bukan untuk sistem layanan publik yang siap pakai secara produksi.

## Fitur utama

- Formulir pengiriman aduan dengan kategori, lokasi, deskripsi, dan foto opsional
- Nomor pelacakan aduan otomatis
- Peta lokasi publik dan penunjuk lokasi saat membuat aduan
- Dashboard petugas dengan filter status dan prioritas
- Catatan tindak lanjut yang bisa bersifat publik atau internal
- Permintaan informasi tambahan dari petugas ke warga
- Rating untuk aduan yang sudah ditutup
- Tema terang dan gelap
- Data demo yang langsung tersedia saat aplikasi dibuka

## Akun demo

| Peran | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Petugas | `petugas` | `aduan123` |

## Cara menjalankan

1. Buka file `index.html` di browser, atau jalankan folder proyek di VS Code dengan Live Server.
2. Pastikan koneksi internet tersedia jika ingin menggunakan peta dan font eksternal.
3. Jika ingin memakai fitur lokasi perangkat, izinkan akses lokasi di browser.

### Jalankan secara lokal

```bash
cd D:\Lacak-aduan-main
python -m http.server 8000
```

Lalu buka:

```text
http://localhost:8000
```

## Struktur file

- `index.html` — struktur halaman utama
- `style.css` — tampilan dan responsivitas design
- `script.js` — logika aplikasi, data demo, validasi, peta, dan dashboard
- `README.md` — dokumentasi proyek

## Alur kerja aplikasi

1. Warga mengisi form aduan.
2. Sistem membuat nomor aduan otomatis.
3. Petugas melihat daftar aduan dan memprosesnya.
4. Status aduan berubah sesuai tahapan.
5. Warga dapat melacak dan memberi respons jika petugas meminta informasi tambahan.
6. Setelah aduan selesai, warga dapat memberikan rating.

## Batasan

- Data bersifat lokal di browser dan tidak terhubung ke backend server.
- Login petugas hanya simulasi untuk demo.
- Aplikasi bukan sistem autentikasi keamanan yang siap dipakai di lingkungan produksi.
- Fitur peta dan font eksternal memerlukan koneksi internet.

## Catatan penting

Proyek ini dibuat untuk pembelajaran, demonstrasi, dan validasi alur kerja. Jika ingin dikembangkan ke sistem nyata, perlu ditambahkan backend yang aman, autentikasi yang valid, penyimpanan yang aman, serta pengelolaan data yang lebih terstruktur.

## Lisensi

Proyek ini dibuat untuk demonstrasi internal dan pembelajaran. Gunakan dengan bijak dan jangan langsung menganggapnya siap dipakai untuk sistem layanan publik nyata tanpa review keamanan, privasi, dan prosedur operasional yang sesuai.

Untuk penggunaan umum, file ini disediakan untuk keperluan demo dan pembelajaran.
