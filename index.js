require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const readline = require("readline");
const cron = require("node-cron");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function getTimestampWIB() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 60 * 60000);
  return `[${wib.toISOString().replace("T", " ").substring(0, 19)} WIB]`;
}

const TX_INTERVAL = parseInt(process.env.TX_INTERVAL_MS) || 2000;
const LOADING_DURATION = Math.max(1000, Math.floor(TX_INTERVAL * 0.8));

function getRecipients() {
  return fs
    .readFileSync("recipients.txt", "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

async function animateLoading() {
  const frames = ["⏳", "⌛", "🕓", "🕒", "🕑", "🕐"];
  const totalFrames = frames.length;
  const frameDuration = Math.floor(LOADING_DURATION / totalFrames);

  for (let i = 0; i < totalFrames; i++) {
    process.stdout.write(`\r${frames[i]} Menunggu TX berikutnya...`);
    await sleep(frameDuration);
  }
  process.stdout.write("\r                             \r");
}

async function sendTx(to, amount, useERC20, tokenContract, tokenSymbol, tokenDecimals, index, logs) {
  try {
    let tx;
    if (useERC20) {
      tx = await tokenContract.transfer(to, amount);
    } else {
      tx = await wallet.sendTransaction({ to, value: amount });
    }
    const txHash = tx.hash;
    const explorer = `https://sepolia.tea.xyz/tx/${txHash}`;
    const log = `${getTimestampWIB()} [${useERC20 ? "ERC-20" : "TEA"}] ✅ TX ${index + 1} | Sent ${ethers.formatUnits(amount, tokenDecimals)} ${tokenSymbol} to ${to} — ${explorer}`;
    console.log(log);
    logs.push(log);
    await animateLoading();
  } catch (err) {
    const log = `${getTimestampWIB()} [${useERC20 ? "ERC-20" : "TEA"}] ❌ TX ${index + 1} | Gagal ke ${to} — ${err.message}`;
    console.log(log);
    logs.push(log);
  }
}

async function executeTransactions(maxTx, amtRaw, useERC20) {
  const recipients = getRecipients().sort(() => Math.random() - 0.5);
  const tokenDecimals = parseInt(process.env.TOKEN_DECIMALS || "18");
  const tokenContractAddress = process.env.TOKEN_CONTRACT;

  let tokenSymbol = process.env.TOKEN_SYMBOL || "TOKEN";
  let tokenContract;

  if (useERC20) {
    const abi = [
      "function transfer(address to, uint amount) public returns (bool)",
      "function symbol() public view returns (string)",
    ];
    tokenContract = new ethers.Contract(tokenContractAddress, abi, wallet);
    try {
      tokenSymbol = await tokenContract.symbol();
    } catch {
      console.warn("⚠️ Gagal ambil simbol token. Pakai dari .env.");
    }
  } else {
    tokenSymbol = "TEA";
  }

  const amount = ethers.parseUnits(amtRaw, tokenDecimals);
  const logs = [];
  const totalTx = Math.min(maxTx, recipients.length);

  for (let i = 0; i < totalTx; i++) {
    const to = recipients[i];
    await sendTx(to, amount, useERC20, tokenContract, tokenSymbol, tokenDecimals, i, logs);
    await sleep(TX_INTERVAL);
  }

  fs.writeFileSync("logs.txt", logs.join("\n"), "utf-8");
}

async function manualTxMenu() {
  while (true) {
    const mode = await ask("Pilih mode (1: Native TEA, 2: ERC-20, 0: Kembali): ");
    if (mode.trim() === "0") return;

    const useERC20 = mode.trim() === "2";
    const maxTx = parseInt(await ask("Jumlah maksimal transaksi: "));
    const amount = await ask("Jumlah yang dikirim per address: ");

    await executeTransactions(maxTx, amount, useERC20);
    console.log("\n✅ Transaksi selesai.\n");
    const lanjut = await ask("Kembali ke menu utama? (y/n): ");
    if (lanjut.trim().toLowerCase() === "y") return;
  }
}

async function dailyTxSetup() {
  while (true) {
    const mode = await ask("Pilih mode (1: Native TEA, 2: ERC-20, 0: Kembali): ");
    if (mode.trim() === "0") return;

    const useERC20 = mode.trim() === "2";
    const amount = await ask("Jumlah yang dikirim per address: ");
    const maxTx = parseInt(await ask("Jumlah maksimal transaksi per hari: "));

    console.log("⏰ Auto daily TX diset untuk jam 10 pagi WIB (03:00 UTC).");
    cron.schedule(
      "0 3 * * *",
      async () => {
        console.log(`\n${getTimestampWIB()} ⏰ Auto daily TX dimulai...`);
        await executeTransactions(maxTx, amount, useERC20);
      },
      { timezone: "UTC" }
    );

    const kembali = await ask("Auto daily TX aktif ✅. Kembali ke menu utama? (y/n): ");
    if (kembali.trim().toLowerCase() === "y") {
      return;
    } else {
      console.log("⏳ Menunggu eksekusi auto daily TX berikutnya...");
      while (true) {
        await animateLoading();
        await sleep(1000);
      }
    }
  }
}

async function checkWalletBalance() {
  console.log(`\n=== CEK SALDO WALLET ===`);

  const walletAddress = wallet.address;
  const explorerLink = `https://sepolia.tea.xyz/address/${walletAddress}`;
  console.log(`📮 Address: ${walletAddress}`);
  console.log(`🔗 Explorer: ${explorerLink}`);

  const nativeBalance = await provider.getBalance(walletAddress);
  console.log(`💰 Native TEA: ${ethers.formatEther(nativeBalance)} TEA`);

  try {
    const tokenContract = new ethers.Contract(
      process.env.TOKEN_CONTRACT,
      [
        "function balanceOf(address account) public view returns (uint)",
        "function symbol() public view returns (string)",
      ],
      provider
    );
    const tokenBalance = await tokenContract.balanceOf(walletAddress);
    const symbol = await tokenContract.symbol();
    const decimals = parseInt(process.env.TOKEN_DECIMALS || "18");
    console.log(`🪙 ${symbol}: ${ethers.formatUnits(tokenBalance, decimals)} ${symbol}`);
  } catch {
    console.warn("⚠️ Gagal cek saldo token ERC-20. Cek .env TOKEN_CONTRACT valid.");
  }

  await ask("\nTekan Enter untuk kembali ke menu utama...");
}

async function mainMenu() {
  while (true) {
    console.clear();
    console.log(`
   ____ ____  _____    _    __  __ __  __ __     __
  / ___|  _ \\| ____|  / \\  |  \\/  |  \\/  |\\ \\   / /
 | |   | | | |  _|   / _ \\ | |\\/| | |\\/| | \\ \\ / / 
 | |___| |_| | |___ / ___ \\| |  | | |  | |  \\ V /  
  \\____|____/|_____/_/   \\_\\_|  |_|_|  |_|   \\_/   

             🧁 Bulk Sender TEA by 0xcreamy 🧁
    `);

    console.log("1. Manual TX (Native TEA / ERC-20)");
    console.log("2. Auto Daily TX (Jam 10 WIB)");
    console.log("3. Cek Saldo Wallet");
    console.log("4. Keluar");

    const choice = await ask("Pilih menu: ");
    if (choice.trim() === "1") {
      await manualTxMenu();
    } else if (choice.trim() === "2") {
      await dailyTxSetup();
    } else if (choice.trim() === "3") {
      await checkWalletBalance();
    } else if (choice.trim() === "4") {
      console.log("👋 Keluar dari aplikasi. Sampai jumpa!");
      rl.close();
      process.exit(0);
    } else {
      console.log("❌ Pilihan tidak valid.");
      await sleep(1000);
    }
  }
}

mainMenu();
