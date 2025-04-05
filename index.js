require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const readline = require("readline");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Fungsi untuk jeda antar transaksi
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const TX_INTERVAL = parseInt(process.env.TX_INTERVAL_MS) || 2000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const recipients = fs.readFileSync("recipients.txt", "utf-8")
  .split("\n")
  .map(line => line.trim())
  .filter(line => line !== "");

recipients.sort(() => Math.random() - 0.5);

async function main() {
  rl.question("Masukkan jumlah maksimal transaksi yang ingin dikirim: ", async (input) => {
    const maxTx = parseInt(input);
    const useERC20 = process.env.USE_ERC20 === "true";
    const tokenDecimals = parseInt(process.env.TOKEN_DECIMALS || "18");
    const tokenContractAddress = process.env.TOKEN_CONTRACT;

    let tokenSymbol = process.env.TOKEN_SYMBOL || "TOKEN";

    let tokenContract;
    if (useERC20) {
      const abi = [
        "function transfer(address to, uint amount) public returns (bool)",
        "function symbol() public view returns (string)"
      ];
      tokenContract = new ethers.Contract(tokenContractAddress, abi, wallet);
      try {
        tokenSymbol = await tokenContract.symbol();
      } catch (e) {
        console.warn("Gagal mengambil simbol token, menggunakan default dari .env");
      }
    }

    const logs = [];
    const totalTx = Math.min(maxTx, recipients.length);

    rl.question(`Masukkan jumlah ${tokenSymbol} yang ingin dikirim ke tiap address: `, async (amt) => {
      const amount = ethers.parseUnits(amt, tokenDecimals);

      for (let i = 0; i < totalTx; i++) {
        const to = recipients[i];
        try {
          let tx;
          if (useERC20) {
            tx = await tokenContract.transfer(to, amount);
          } else {
            tx = await wallet.sendTransaction({ to, value: amount });
          }

          const txHash = tx.hash;
          const txType = useERC20 ? "ERC-20" : "TEA";
          const explorer = "https://sepolia.tea.xyz/tx/" + txHash;
          const log = `[${txType}] ✅ Transaksi ${i + 1} | Berhasil mengirim ${ethers.formatUnits(amount, tokenDecimals)} ${tokenSymbol} ke ${to} dari ${wallet.address} — Tx Hash: ${explorer}`;
          console.log(log);
          logs.push(log);
        } catch (err) {
          const log = `[${useERC20 ? "ERC-20" : "TEA"}] ❌ Transaksi ${i + 1} | Gagal mengirim ke ${to} dari ${wallet.address} — Reason: ${err.message}`;
          console.log(log);
          logs.push(log);
        }

        await sleep(TX_INTERVAL);
      }

      fs.writeFileSync("logs.txt", logs.join("\n"), "utf-8");
      rl.close();
    });
  });
}

main();
