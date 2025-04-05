# 💸 Bulk Sender TEA

Script sederhana untuk mengirim TEA native atau ERC-20 token ke banyak wallet secara massal di jaringan TEA Sepolia.

---

## ✨ Fitur
- Kirim TEA native atau token ERC-20
- Mode pengiriman **manual** atau **otomatis harian** (auto TX jam 10 pagi WIB)
- Randomisasi address dari `recipients.txt`
- Logging transaksi lengkap ke `logs.txt`
- Tampilkan **timestamp WIB** di log
- Fitur **cek saldo wallet** (native & ERC-20 dengan deteksi simbol otomatis)
- Support `screen` untuk jalan di VPS

---

## ⚙️ Requirement

### 1. Install Node.js (Minimal Versi 18)

Jika sebelumnya error seperti:

```
SyntaxError: Unexpected token '('
```

Berarti Node.js versi kamu terlalu lama. Lakukan reinstall dengan perintah ini:

```bash
sudo apt remove nodejs -y
sudo apt autoremove -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

### 2. Install Dependensi

```bash
npm install
```

---

## 📁 Setup File

### .env

Buat file `.env` di root project dengan isi seperti berikut:

```env
RPC_URL=https://rpc-sepolia.tea.xyz
PRIVATE_KEY=0xyourprivatekey
TX_INTERVAL_MS=2000

# Jika menggunakan ERC-20:
TOKEN_CONTRACT=0xYourERC20TokenAddress
TOKEN_SYMBOL=MYT
TOKEN_DECIMALS=18
```

> PRIVATE_KEY sebaiknya jangan dikasih ke orang lain ya brok!

---

### recipients.txt

Isi address tujuan (satu per baris), misalnya:

```
0x1234...
0x5678...
0x9abc...
```

---

## 🚀 Menjalankan Script

### 1. Manual TX

Kirim token langsung ke daftar address.

```bash
node index.js
```

Pilih menu:  
`1. Manual TX (Native TEA / ERC-20)`

Masukkan:
- Mode pengiriman (TEA native atau ERC-20)
- Jumlah per address
- Jumlah maksimal transaksi yang ingin dikirim

---

### 2. Auto Daily TX (Jalan tiap hari jam 10 WIB)

Pengiriman akan dilakukan otomatis setiap hari jam **10 pagi WIB (03:00 UTC)**.

```bash
node index.js
```

Pilih menu:  
`2. Auto Daily TX (Jam 10 WIB)`

Masukkan:
- Mode pengiriman
- Jumlah per address
- Jumlah transaksi per hari

> Gunakan `screen` agar proses tetap berjalan walaupun logout dari VPS.

---

### 3. Cek Saldo Wallet

```bash
node index.js
```

Pilih menu:  
`3. Cek Saldo Wallet`

Menampilkan:
- Saldo native TEA (dalam satuan TEA)
- Saldo ERC-20 (jika `TOKEN_CONTRACT` diatur)

---

## 🖥️ Jalankan di VPS (Pakai screen)

### Mulai screen baru

```bash
screen -S bulk
node index.js
```

### Keluar sementara dari screen

Tekan: `Ctrl+A`, lalu `D`

### Kembali ke screen

```bash
screen -r bulk
```

---

## 📜 Logs

Semua transaksi akan disimpan ke `logs.txt` dengan timestamp WIB:

```
[2025-04-05 10:00:00 WIB] [ERC-20] ✅ TX 1 | Sent 6900 MYT to 0x123... — https://sepolia.tea.xyz/tx/0xabc...
```

---

## 👨‍💻 Notes

- Jangan lupa upload `recipients.txt` ke VPS sebelum kirim
- Untuk ERC-20 pastikan `TOKEN_CONTRACT` benar dan token sudah terdeploy di jaringan TEA Sepolia
- Pastikan saldo wallet cukup untuk semua transaksi

---

Happy Sending! 🚀
