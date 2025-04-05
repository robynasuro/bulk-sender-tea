# 🔁 Bulk Sender TEA (Native & ERC-20)

Sebuah script bulk sender untuk mengirim token native TEA atau ERC-20 di jaringan TEA Sepolia secara **manual** maupun **otomatis setiap hari** jam 10 pagi Waktu Indonesia Barat (WIB).

## ✅ Fitur

- Kirim manual TEA atau ERC-20
- Kirim otomatis setiap hari jam 10 pagi (WIB)
- Auto random daftar address
- Delay antar transaksi
- Log lengkap ke `logs.txt` dengan waktu WIB

---

## ⚙️ Setup di VPS

### 1. Clone repo

```bash
git clone https://github.com/robynasuro/bulk-sender-tea.git
cd bulk-sender-tea
```

### 2. Install dependency

```bash
npm install
```

Jika error karena versi Node.js, lanjut ke langkah update di bawah.

---

## 🔁 Update / Install Node.js 18 (Wajib)

### Jika muncul error saat install `ethers` atau `node-cron`, itu karena Node.js terlalu lawas (v12).

### 💥 Solusi:

```bash
sudo apt remove nodejs libnode-dev libnode72 nodejs-doc -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

> ❗ Cek versi:
```bash
node -v  # harus muncul v18.x.x
```

---

## 📄 Konfigurasi

### 1. `.env` file

Buat file `.env` di root project:

```env
RPC_URL=https://rpc-sepolia.tea.xyz
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
TOKEN_CONTRACT=0xERC20_CONTRACT_ADDRESS
TOKEN_SYMBOL=TKN
TOKEN_DECIMALS=18
USE_ERC20=true
TX_INTERVAL_MS=2000
```

> Ganti `PRIVATE_KEY`, `TOKEN_CONTRACT`, dan lainnya sesuai kebutuhan.

### 2. Daftar Address

Buat file `recipients.txt` isi address per baris:

```
0xabc123...
0xdef456...
```

---

## 🚀 Cara Menjalankan

### 1. Jalankan script dengan screen

```bash
screen -S bulk
node index.js
```

### 2. Pilih Menu:

```
=== BULK SENDER TEA ===
1. Manual TX (Native TEA / ERC-20)
2. Auto Daily TX (Jam 10 WIB)
```

- **Manual TX** = sekali kirim
- **Auto Daily TX** = kirim otomatis setiap hari jam 10 pagi WIB

---

## 🧾 Logs

Semua transaksi disimpan di `logs.txt`, contoh:

```
[2025-04-05 10:00:01 WIB] ✅ TX 1 | Sent 6900 TOKEN to 0xabc... — https://sepolia.tea.xyz/tx/0x...
```

---

## 🛑 Stop Auto TX

Jika menjalankan di `screen`, keluar dari screen dengan:

```bash
CTRL + A lalu tekan D
```

Untuk kembali ke screen:

```bash
screen -r bulk
```

Untuk kill:

```bash
pkill node
```

---

## 🧯 Troubleshooting

### ❌ Error `Unexpected token` dari ethers

> Kemungkinan besar karena Node.js versi terlalu tua.

Solusi:

```bash
sudo apt remove nodejs libnode72 libnode-dev -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## ✍️ Author

Made with ❤️ by [@robynasuro](https://github.com/robynasuro)