require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const TOKEN_NAME = process.env.TOKEN_NAME || "MyToken";
const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "MTK";
const TOKEN_SUPPLY = ethers.parseUnits(process.env.TOKEN_SUPPLY || "1000000", 18);

const ERC20_SOURCE = {
  abi: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
  ],
  bytecode: "0x608060405234801561001057600080fd5b50604051610..." // placeholder
};

async function main() {
  console.log("Deploying token...");
  const factory = new ethers.ContractFactory(ERC20_SOURCE.abi, ERC20_SOURCE.bytecode, wallet);
  const contract = await factory.deploy(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_SUPPLY);
  await contract.waitForDeployment();
  console.log("Token deployed at:", contract.target);
}

main().catch(console.error);
