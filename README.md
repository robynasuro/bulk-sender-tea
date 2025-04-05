
# 🧃 Bulk Sender TEA (Sepolia)

Script Node.js untuk mengirim native token (TEA) atau token ERC-20 ke banyak wallet secara otomatis di jaringan **TEA Sepolia**. Mendukung pengacakan address, delay antar transaksi, logging hasil transaksi, dan pilihan jumlah transaksi yang dikirim.

## 🛠️ Fitur
- Kirim TEA native token atau ERC-20.
- Input jumlah transaksi dan nominal token.
- Acak daftar penerima (`recipients.txt`).
- Delay antar transaksi untuk menghindari nonce error.
- Log hasil sukses/gagal lengkap ke `logs.txt`.

---

## 📁 Struktur File

```
bulk-sender-tea/
│
├── index.js              # Script utama
├── .env                  # Konfigurasi private
├── .env.example          # Contoh konfigurasi
├── recipients.txt        # Daftar wallet tujuan (satu address per baris)
├── logs.txt              # Hasil log transaksi
├── package.json          # Dependencies npm
└── README.md             # Dokumentasi ini
```

---

## ⚙️ Cara Pakai

### 1. Clone Repo
```bash
git clone https://github.com/robynasuro/bulk-sender-tea.git
cd bulk-sender-tea
```

### 2. Install Dependency
```bash
npm install
```

### 3. Setup File `.env`
Duplikat `.env.example` menjadi `.env` lalu isi:

```bash
cp .env.example .env
```

Edit `.env` kamu:

```env
PRIVATE_KEY=your_private_key
RPC_URL=https://tea-sepolia.g.alchemy.com/v2/your_api_key
CHAIN_ID=10218
SENDER_ADDRESS=your_address
TOKEN_CONTRACT=0xYourERC20Address
USE_ERC20=false                # ganti ke true jika ingin ERC-20
TOKEN_DECIMALS=18
TOKEN_SYMBOL=TEA
TX_INTERVAL_MS=2000           # Delay antar transaksi (ms)
```

### 4. Siapkan File `recipients.txt`
Masukkan satu address wallet tujuan per baris, contoh:

```
0xAbC123...
0xDef456...
0x789Ghi...
```

### 5. Jalankan Script
```bash
node index.js
```

Ikuti prompt:
- Masukkan jumlah transaksi (misal 150)
- Masukkan jumlah token (misal `0.1`)

### 6. Cek Log
Semua hasil tercatat di `logs.txt`, misal:

```
[TEA] ✅ Transaksi 3 | Berhasil mengirim 0.1 TEA ke 0xabc... dari 0xsender — Tx Hash: https://sepolia.tea.xyz/tx/0xhash
```

---

## 🧪 Deploy Token ERC-20

```bash
node deploy.js
```

Tambahkan ke `.env`:
```env
TOKEN_NAME=MyToken
TOKEN_SYMBOL=MTK
TOKEN_SUPPLY=1000000
```

Token akan langsung ter-deploy dan address ditampilkan di terminal.

---

## 💡 Tips
- Gunakan **delay minimal 1500–3000 ms** untuk menghindari `replacement transaction underpriced` dan `nonce too low`.
- Jika ingin test ERC-20, deploy token dummy dulu di TEA Sepolia dan isi `TOKEN_CONTRACT` di `.env`.

---

## 📦 Untuk VPS
Jika ingin pakai di VPS + `screen`, jalankan:
```bash
screen -S bulk
node index.js
```
Untuk kembali ke screen: `screen -r bulk`

---

## 🤝 Lisensi
MIT © 2025 - Open source & bebas digunakan.
