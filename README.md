# Bulk Sender TEA

Script untuk mengirim native TEA atau token ERC-20 ke banyak alamat sekaligus, dengan fitur manual dan auto daily transaction.

## Fitur

- Kirim native TEA atau ERC-20 token ke banyak address.
- Input dari file `recipients.txt`.
- Opsi pengiriman manual atau otomatis setiap hari jam **10 pagi WIB (03:00 UTC)**.
- Support `screen` untuk running di VPS terus-menerus.
- Log lengkap hasil transaksi ke `logs.txt` + waktu WIB.

## Instalasi

### 1. Clone Repo

```bash
git clone https://github.com/robynasuro/bulk-sender-tea.git
cd bulk-sender-tea
```

### 2. Install Dependency

```bash
npm install ethers dotenv readline node-cron
```

### 3. Setup `.env`

Buat file `.env` dengan isi seperti ini:

```
PRIVATE_KEY=0xPRIVATEKEYKAMU
RPC_URL=https://rpc-sepolia.tea.xyz
TOKEN_CONTRACT=0xAlamatTokenKamu
TOKEN_SYMBOL=TOKEN
TOKEN_DECIMALS=18
USE_ERC20=false
TX_INTERVAL_MS=2000
```

### 4. Siapkan `recipients.txt`

Isi dengan list address tujuan, 1 address per baris:

```
0x123...
0x456...
```

## Menjalankan Script

### Mode Manual

```bash
node index.js
```

Pilih:
- 1 → Manual TX (Native TEA / ERC-20)
- Masukkan jumlah transaksi dan jumlah token per address.

### Mode Auto Daily TX (Jam 10 WIB)

```bash
node index.js
```

Pilih:
- 2 → Auto Daily TX
- Isi jumlah token per address dan jumlah transaksi per hari.

> **Note:** Auto daily akan berjalan otomatis setiap hari jam **10:00 WIB** (03:00 UTC).

## Jalankan di VPS dengan `screen`

Supaya script jalan terus walau keluar terminal:

```bash
screen -S bulk-sender
node index.js
```

Untuk keluar dari `screen` tanpa mematikan proses:

```
Ctrl + A lalu tekan D
```

Untuk masuk lagi ke session:

```bash
screen -r bulk-sender
```

## Log

Hasil transaksi akan tercatat di file `logs.txt` lengkap dengan:
- Tipe transaksi (TEA/ERC-20)
- Alamat pengirim & penerima
- Tx hash dengan link explorer
- Timestamp waktu WIB

---

Selamat ngirim massal, bro! Kalau mau update script, tinggal `git pull` aja, atau ambil file spesifik pakai `curl`.

```
curl -o index.js https://raw.githubusercontent.com/robynasuro/bulk-sender-tea/main/index.js
```