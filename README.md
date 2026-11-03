# Lacak Aduan

Prototipe sederhana untuk menampung, menelusuri, dan menindaklanjuti aduan warga di Kelurahan Sukamaju. Aplikasi ini dibuat dengan HTML, CSS, dan JavaScript murni tanpa proses build. Fokus utamanya adalah simulasi alur aduan dari warga sampai ke petugas, bukan sistem layanan publik yang siap dipakai secara operasional.

> Peringatan penting: versi yang berjalan saat ini adalah demo lokal. Data disimpan di browser (`localStorage`/`sessionStorage`) dan tidak dikirim ke server pihak ketiga dalam konfigurasi default. Login dan otorisasi petugas di sisi browser hanya untuk simulasi demonstrasi dan bukan mekanisme keamanan yang valid untuk data riil.

## Daftar isi

- [Ringkasan proyek](#ringkasan-proyek)
- [Fitur utama](#fitur-utama)
- [Mulai cepat](#mulai-cepat)
- [Cara menggunakan](#cara-menggunakan)
- [Akun demo](#akun-demo)
- [Aturan demo: kategori, prioritas, dan target](#aturan-demo-kategori-prioritas-dan-target)
- [Penyimpanan dan privasi](#penyimpanan-dan-privasi)
- [Struktur berkas](#struktur-berkas)
- [Backend Google Sheets (opsional)](#backend-google-sheets-opsional)
- [Batasan dan pengembangan lanjutan](#batasan-dan-pengembangan-lanjutan)
- [Pemecahan masalah](#pemecahan-masalah)

## Ringkasan proyek

Lacak Aduan adalah demo interaktif yang mencontohkan bagaimana warga dapat:

- membuat aduan tanpa login,
- mendapat nomor pelacakan,
- melihat status aduan dan riwayat tindak lanjut,
- membalas permintaan informasi dari petugas,
- dan memberi rating setelah aduan ditutup.

Sementara itu, petugas demo dapat:

- melihat daftar aduan,
- memfilter berdasarkan status dan prioritas,
- mengubah prioritas dan unit penanggung jawab,
- menulis catatan tindak lanjut,
- meminta informasi tambahan,
- dan memperbarui status aduan.

Proyek ini dirancang untuk keperluan demonstrasi, pembelajaran, dan validasi alur proses, bukan untuk dipakai dalam pelayanan publik nyata tanpa review keamanan dan operasional yang memadai.

## Fitur utama

### Untuk warga

- Membuat aduan tanpa membuat akun.
- Menerima nomor pelacakan setelah aduan dikirim.
- Memilih kategori, lokasi, dan deskripsi peristiwa.
- Menambahkan foto bukti (opsional).
- Memilih titik lokasi melalui peta atau menggunakan lokasi perangkat.
- Melacak status aduan dan riwayat perkembangan melalui nomor yang diterima.
- Membaca papan umum berisi daftar aduan, status, umur laporan, dan peta sebaran.
- Memberikan balasan ketika petugas meminta informasi tambahan.
- Memberi rating setelah aduan ditutup.

### Untuk petugas demo

- Melihat daftar aduan dan memfilter berdasarkan status serta prioritas.
- Mengubah prioritas dan unit penanggung jawab (hanya admin demo).
- Menulis catatan tindak lanjut dengan visibilitas publik atau internal.
- Meminta informasi tambahan ke warga.
- Mengubah status aduan sesuai urutan yang telah ditentukan.
- Menyertakan foto bukti pada catatan tindakan.
- Melihat ringkasan aktivitas, keterlambatan terhadap target, waktu penyelesaian rata-rata, dan rating.

## Mulai cepat

Tidak ada instalasi dependensi dan tidak ada proses build.

1. Buka [index.html](./index.html) langsung di browser, atau jalankan folder proyek di VS Code dan buka file tersebut dengan Live Server.
2. Jika ingin memakai peta dan font eksternal, sambungkan perangkat ke internet.
3. Izinkan akses lokasi jika ingin menggunakan tombol "Gunakan lokasi perangkat". Jika tidak, Anda tetap bisa memilih titik di peta atau mengisi lokasi secara manual.

Catatan: tanpa koneksi internet, fungsi formulir dan pelacakan lokal masih bisa berjalan, tetapi peta dan font eksternal mungkin tidak tampil dengan baik.

## Cara menggunakan

### Membuat dan melacak aduan

1. Buka menu "Buat aduan".
2. Isi kategori, lokasi kejadian, dan deskripsi masalah. Deskripsi minimal 15 karakter.
3. Nama, titik peta, dan foto bersifat opsional.
4. Setelah dikirim, salin atau catat nomor aduan yang muncul.
5. Buka menu "Lacak aduan", masukkan nomor aduan, dan klik "Cari aduan".
6. Jika petugas meminta informasi tambahan, jawab dari halaman pelacakan. Aduan yang sudah ditutup bisa diberi rating.

Foto yang dikirim harus berupa gambar dengan ukuran maksimal 2 MB. Aplikasi akan mengecilkan ukuran gambar hingga maksimal 1280 piksel dan mengubahnya menjadi JPEG sebelum disimpan di browser.

### Mengelola aduan sebagai petugas

1. Buka "Masuk petugas".
2. Gunakan salah satu akun demo yang tersedia di bawah.
3. Pilih aduan dari daftar atau menu pilihan aduan.
4. Atur prioritas. Hanya akun admin demo yang dapat mengubah unit penanggung jawab.
5. Tulis catatan minimal 10 karakter dan pilih visibilitasnya. Catatan permintaan informasi harus bersifat publik agar dapat dibaca warga.
6. Pilih status berikutnya sesuai urutan yang ditentukan, atau pilih "Tolak aduan" jika diperlukan.

Urutan status demo adalah:

Diterima → Diverifikasi → Diproses → Selesai

Aduan yang sudah selesai atau ditolak dianggap tertutup dan tidak dapat diubah lagi melalui dashboard demo.

## Akun demo

| Peran | Nama pengguna | Kata sandi | Akses demo |
| --- | --- | --- | --- |
| Admin | `admin` | `admin123` | Melihat semua aduan dan mengubah unit penanggung jawab |
| Petugas jalan | `petugas` | `aduan123` | Melihat aduan untuk Seksi Pemeliharaan Jalan |

Kredensial ini tertanam di JavaScript dan dapat dilihat siapapun. Pembatasan akses berdasarkan peran juga dilakukan di browser. Akun ini hanya untuk simulasi data demo, bukan autentikasi yang aman.

## Aturan demo: kategori, prioritas, dan target

Target waktu dihitung sejak aduan dibuat. Nilai berikut hanya simulasi dalam kode dan bukan standar pelayanan resmi.

| Kategori | Unit rekomendasi demo | Prioritas normal |
| --- | --- | ---: |
| Jalan rusak | Seksi Pemeliharaan Jalan | 7 hari |
| Sampah | Dinas Kebersihan | 3 hari |
| Lampu jalan | Seksi Sarana Umum | 5 hari |
| Air dan drainase | Tim Drainase | 2 hari |
| Layanan administrasi | Bagian Pelayanan Kelurahan | 5 hari |
| Lainnya | Koordinasi Lintas Instansi | 7 hari |

Penyesuaian prioritas:

- Darurat menggunakan target 1 hari.
- Tinggi menggunakan target maksimum 2 hari atau 65% dari target kategori (dibulatkan ke atas).
- Normal menggunakan target kategori sesuai tabel.
- Dashboard dan pelacakan menandai aduan yang sudah melewati target.

## Penyimpanan dan privasi

### Demo lokal

- Aduan, foto, riwayat, aktivitas, balasan, dan rating disimpan di `localStorage` browser dengan kunci aplikasi `la-v2`.
- Sesi login disimpan sementara di `sessionStorage`.
- Data tidak dibagikan ke perangkat lain atau server pihak ketiga.
- Data contoh awal ditampilkan untuk kebutuhan demonstrasi.
- Aduan yang dibuat pengguna tetap tersimpan di browser yang sama tempat aplikasi dijalankan.
- Menghapus data browser dapat menghapus aduan dan bukti yang terkait.
- Catatan internal disembunyikan dari antarmuka publik, tetapi tetap ada di penyimpanan lokal browser dan bukan mekanisme keamanan.
- Lokasi laporan baru dibulatkan hingga tiga angka desimal sebelum disimpan.

### Backend opsional

Backend Google Apps Script di [backend/Code.gs](./backend/Code.gs) adalah komponen terpisah dan belum terhubung ke antarmuka [index.html](./index.html). Saat ini, demo lokal tidak membaca atau menulis data ke Google Sheets. Lihat bagian berikutnya untuk detail batasan dan konfigurasi awal.

## Struktur berkas

| Berkas | Tanggung jawab |
| --- | --- |
| [index.html](./index.html) | Struktur halaman, navigasi, formulir, papan aduan, dan dashboard |
| [style.css](./style.css) | Tema, tata letak, responsivitas, dan gaya komponen |
| [script.js](./script.js) | Data demo, penyimpanan lokal, validasi form, peta, pelacakan, dan dashboard |
| [backend/Code.gs](./backend/Code.gs) | Fungsi backend Google Apps Script untuk Google Sheets |

## Backend Google Sheets (opsional)

Backend menyediakan fungsi server berikut:

| Fungsi | Kegunaan |
| --- | --- |
| `setupSpreadsheet()` | Menyimpan ID spreadsheet dan membuat sheet `Aduan` beserta header jika diperlukan |
| `listPublicComplaints()` | Mengambil ringkasan hingga 500 aduan |
| `getPublicComplaint(code)` | Mengambil detail publik dan riwayat dengan isi catatan internal dikosongkan |
| `createComplaint(input)` | Memvalidasi dan menyimpan aduan |
| `listStaffComplaints()` | Mengambil aduan sesuai hak akses petugas yang diverifikasi server |
| `updateComplaint(input)` | Mengubah prioritas, unit (admin), status, atau meminta informasi |
| `submitResidentReply(input)` | Menyimpan balasan atas permintaan informasi |
| `submitRating(input)` | Menyimpan rating untuk aduan tertutup |

### Menyiapkan spreadsheet dan Apps Script

1. Buat atau buka Google Spreadsheet tujuan, lalu pilih **Ekstensi → Apps Script**.
2. Salin isi [backend/Code.gs](./backend/Code.gs) ke editor Apps Script, simpan, lalu jalankan `setupSpreadsheet()` satu kali. Berikan izin yang diminta. Fungsi ini akan membuat sheet bernama `Aduan`.
3. Pada **Setelan project → Properti skrip**, tambahkan properti `STAFF_ACCESS`. Gunakan email petugas sebagai kunci JSON, contoh:

   ```json
   {
     "admin@contoh.go.id": {
       "role": "admin",
       "name": "Admin Sukamaju"
     },
     "petugas@contoh.go.id": {
       "role": "petugas",
       "unit": "Seksi Pemeliharaan Jalan",
       "name": "Petugas Jalan"
     }
   }
   ```

   Nilai `role` yang diterima adalah `admin` atau `petugas`. Petugas perlu memiliki `unit` yang sesuai dengan unit aduan. Admin dapat melihat semua aduan dan mengubah unit.
4. Tinjau identitas eksekusi dan audiens pada setelan deployment aplikasi web Google Apps Script. Backend bergantung pada ketersediaan email dari `Session.getActiveUser()`, sehingga perlu diperiksa sesuai akun dan kebijakan Google Workspace yang digunakan.
5. Hubungkan antarmuka secara eksplisit ke fungsi server dengan `google.script.run`, lalu pindahkan seluruh operasi baca/tulis ke backend sebelum menganggap data tersentralisasi. Langkah integrasi ini belum dikerjakan di proyek saat ini.

Data inti disimpan sebagai JSON di kolom `Data aduan (JSON)`. Beberapa nilai ringkas juga ditulis pada kolom terpisah. Backend memvalidasi kategori, input teks, koordinat, bukti, prioritas, unit, akses petugas, dan urutan status. Catatan internal tidak disertakan dalam isi catatan pada hasil `getPublicComplaint()`.

> Jangan deploy backend sebagai layanan nyata sebelum meninjau otorisasi dan privasi. Balasan warga dan rating saat ini hanya memeriksa nomor aduan, sehingga nomor pelacakan saja belum merupakan autentikasi pelapor yang memadai. Detail publik juga memuat deskripsi dan koordinat yang harus ditinjau untuk mencegah kebocoran informasi sensitif.

Bukti yang dikirim ke backend dibatasi sampai 40.000 karakter dan ukuran JSON untuk satu aduan hingga 45.000 karakter. Untuk penggunaan di luar demo, simpan berkas secara terkontrol di penyimpanan yang sesuai dan simpan referensi yang aksesnya dibatasi, bukan data gambar besar di sel spreadsheet. Jangan menaruh rahasia server atau kredensial spreadsheet di JavaScript browser.

## Batasan dan pengembangan lanjutan

Fitur berikut belum tersedia atau belum diintegrasikan:

- Koneksi frontend dengan Apps Script dan sinkronisasi lintas perangkat.
- Autentikasi petugas yang aman pada antarmuka lokal dan autentikasi pelapor untuk balasan/rating.
- Notifikasi email atau kanal eksternal.
- Pengelolaan akun, unit, konfigurasi target, dan proses eskalasi yang dapat dikonfigurasi.
- Penandaan dan pengaitan aduan duplikat, pembukaan kembali aduan, dan verifikasi hasil oleh warga.
- Analitik periode dengan definisi statistik operasional.
- Pengelolaan siklus hidup data, kontrol akses foto, backup, pemulihan, dan audit trail yang tahan perubahan.
- Penyaringan atau moderasi deskripsi dan lokasi sebelum dipublikasikan ke papan terbuka.

Gunakan hanya data fiktif saat demonstrasi. Jangan mengklaim layanan ini siap digunakan instansi pemerintah sebelum keamanan, privasi, otorisasi, penyimpanan, dan prosedur operasional ditinjau serta disiapkan.

## Pemecahan masalah

| Gejala | Kemungkinan penyebab / tindakan |
| --- | --- |
| Peta kosong atau tidak muncul | Periksa koneksi internet dan pastikan Leaflet/OpenStreetMap tidak diblokir. Formulir dan pelacakan lokal tetap dapat dipakai tanpa peta. |
| Lokasi perangkat tidak ditemukan | Izinkan akses lokasi pada browser dan pastikan halaman dijalankan dalam konteks yang mendukung geolokasi. Atau pilih titik peta dan/atau masukkan koordinat secara manual. |
| Foto gagal dikirim | Pastikan file berupa gambar dan berukuran maksimal 2 MB. Penyimpanan browser juga dapat penuh; bersihkan data demo yang tidak dibutuhkan. |
| Nomor aduan tidak ditemukan | Pastikan nomor sudah lengkap dan buka aplikasi pada browser/profil yang sama dengan tempat aduan dibuat. Mode lokal tidak menyinkronkan data antarperangkat. |
| Login petugas gagal | Gunakan salah satu kredensial demo yang tercantum dan perhatikan huruf serta kata sandi. |
| Backend tidak menyimpan data | Backend belum terhubung ke UI. Periksa juga ID spreadsheet, izin Apps Script, properti `STAFF_ACCESS`, dan konfigurasi identitas deployment. |

## Validasi

Belum ada perintah build atau test otomatis yang dikonfigurasi dalam proyek. Perubahan JavaScript terakhir telah diperiksa dengan `node --check`, dan aturan dasar backend diuji dengan smoke test lokal untuk urutan status, validasi visibilitas, serta penyembunyian catatan internal. Pengujian langsung terhadap Google Sheets, konfigurasi Apps Script, perangkat mobile, dan deployment belum dilakukan.

## Lisensi

Proyek ini dibuat untuk demonstrasi internal dan pembelajaran. Gunakan dengan bijak dan jangan langsung menganggapnya siap dipakai untuk sistem layanan publik nyata tanpa review keamanan, privasi, dan prosedur operasional yang sesuai.
#   L a c a k - a d u a n  
 