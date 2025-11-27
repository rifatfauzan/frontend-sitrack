# SiTrack - Sistem Informasi Tracking PT. Glorious Interbuana

SiTrack adalah sistem informasi manajemen logistik yang dirancang khusus untuk PT. Glorious Interbuana. Aplikasi ini menyediakan solusi komprehensif untuk mengelola operasi transportasi, mulai dari manajemen kendaraan, pemesanan pelanggan, hingga pelaporan dan analitik.

## Fitur Utama

### Manajemen Master Data
- **Manajemen Kendaraan (Trucks)**: Pendaftaran, editing, dan monitoring kendaraan
- **Manajemen Sopir**: Pengelolaan data driver dan assignment
- **Manajemen Pelanggan**: Database pelanggan dan informasi kontak
- **Manajemen Chassis**: Tracking chassis dan container loads
- **Manajemen Asset**: Inventory dan tracking aset perusahaan

### Operasional
- **Customer Booking**: Sistem pemesanan dan penjadwalan dari pelanggan
- **Vehicle Out/In**: Tracking keluar masuk kendaraan
- **SPJ (Surat Perintah Jalan)**: Manajemen surat jalan dan dokumentasi
- **Request Asset**: Sistem permintaan dan alokasi aset

### Reporting & Analytics
- **Dashboard Analytics**: Visualisasi data operasional dengan chart dan grafik
- **Report Truck**: Laporan kondisi dan maintenance kendaraan
- **Komisi**: Perhitungan dan tracking komisi
- **Notification System**: Sistem notifikasi real-time

### User Management
- **Multi-role Access**: Admin, Manager, Supervisor, Operasional, Mekanik
- **Authentication**: Secure login system
- **Authorization**: Role-based access control

## Tech Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: PrimeVue + Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Charts**: Chart.js + Vue-ChartJS
- **Icons**: PrimeIcons + Heroicons
- **Notifications**: Vue Toastification
- **Data Tables**: PrimeVue DataTable

## Prerequisites

Pastikan sistem Anda memiliki:
- **Node.js** (versi 18 atau lebih baru)
- **npm** atau **yarn**
- **Git**

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd frontend-sitrack/sitrack-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Buat file `.env` di root directory dan konfigurasi:
```env
VITE_API_URL=http://localhost:3000
PORT=4173
```

### 4. Development Server
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`

### 5. Build untuk Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

## Tutorial Penggunaan

### Login ke Sistem
1. Buka aplikasi di browser
2. Masukkan username dan password yang telah diberikan
3. Klik tombol "Login"
4. Sistem akan mengarahkan ke dashboard sesuai role user

### Dashboard Overview
Dashboard menampilkan:
- **Statistik Order**: Grafik bulanan pemesanan
- **Customer Statistics**: Distribusi transaksi pelanggan
- **Quick Access**: Menu cepat ke fitur utama

### Manajemen Kendaraan
#### Menambah Kendaraan Baru:
1. Navigasi ke **"List Vehicle"** di sidebar
2. Klik tombol **"Tambah Vehicle"**
3. Isi form dengan data kendaraan:
   - Vehicle ID dan informasi dasar
   - Nomor plat, STNK, dan KIR
   - Spesifikasi teknis (mesin, chassis, dll)
   - Dokumen perizinan
4. Klik **"Simpan"** untuk menyimpan data

#### Melihat Detail Kendaraan:
1. Di halaman List Vehicle, klik pada baris kendaraan
2. Sistem akan menampilkan detail lengkap
3. Status dokumen akan ditampilkan dengan color coding:
   - Hijau: Masih berlaku
   - Kuning: Akan expired (< 30 hari)
   - Merah: Sudah expired

### Customer Booking
#### Membuat Booking Baru:
1. Pilih **"Customer Booking"** di sidebar
2. Klik **"Tambah Order"**
3. Isi informasi booking:
   - Data pelanggan
   - Rute dan tujuan
   - Jenis muatan
   - Jadwal pickup dan delivery
4. Assign kendaraan dan sopir
5. Simpan order

#### Tracking Order:
1. Di halaman Order List, lihat status real-time
2. Klik detail order untuk informasi lengkap
3. Update status sesuai progress

### Vehicle Out/In Process
#### Vehicle Out:
1. Pilih **"Vehicle Out"** di sidebar
2. Pilih kendaraan yang akan keluar
3. Verifikasi dokumen dan kondisi kendaraan
4. Input waktu keluar dan tujuan
5. Generate SPJ (Surat Perintah Jalan)

#### Vehicle In:
1. Pilih **"Vehicle In"** di sidebar
2. Scan atau input nomor kendaraan
3. Verifikasi kondisi kembali
4. Input waktu masuk dan kondisi
5. Update status di sistem

### Reporting
#### Generate Report:
1. Pilih menu **"Reporting"** di sidebar
2. Pilih jenis laporan yang diinginkan
3. Set periode tanggal
4. Klik **"Generate Report"**
5. Export ke PDF atau Excel jika diperlukan

### Maintenance Management
#### Report Truck:
1. Navigasi ke **"Report Truck"**
2. Klik **"Tambah Report"**
3. Pilih kendaraan dan jenis maintenance
4. Input detail perbaikan dan spare part
5. Upload foto jika diperlukan
6. Simpan report

## Development Guide

### Project Structure
```
sitrack-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, styles
│   ├── components/        # Reusable Vue components
│   ├── interfaces/        # TypeScript interfaces
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── views/            # Page components
│   └── main.ts           # App entry point
├── package.json
└── vite.config.ts
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

### Code Style
- Menggunakan TypeScript untuk type safety
- ESLint + Prettier untuk code formatting
- Composition API untuk Vue components
- Pinia untuk state management

### Adding New Features
1. Buat interface di `src/interfaces/`
2. Buat store di `src/stores/`
3. Buat view components di `src/views/`
4. Update router di `src/router/index.ts`
5. Test functionality

## Deployment

### Railway Deployment
Aplikasi dikonfigurasi untuk deployment di Railway:
- Port: 4173 (configurable via environment)
- Host: 0.0.0.0
- Allowed hosts: sitrack.up.railway.app

### Environment Variables
```env
VITE_API_URL=<backend-api-url>
PORT=4173
```

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Secure API communication
- Input validation dan sanitization