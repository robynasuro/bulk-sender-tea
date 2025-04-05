require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const TOKEN_NAME = process.env.TOKEN_NAME || "MyToken";
const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "MTK";
const TOKEN_SUPPLY = ethers.parseUnits(process.env.TOKEN_SUPPLY || "1000000", 18);

// ABI dan bytecode hasil compile dari ERC-20 (OpenZeppelin standar)
const ERC20_SOURCE = {
  abi: [
    "constructor(string memory name, string memory symbol, uint256 initialSupply)",
    "function name() public view returns (string memory)",
    "function symbol() public view returns (string memory)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
    "function transfer(address recipient, uint256 amount) public returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ],
  bytecode: "0x608060405234801561001057600080fd5b506040516104c63803806104c683398101604081905261002f91610059565b600080546001600160a01b03191633179055610100806100526000396000f3fe60806040526004361061003f5760003560e01c806370a0823114610044578063a9059cbb14610073578063dd62ed3e146100a2575b600080fd5b34801561005057600080fd5b506100596100d5565b604051610066919061030d565b60405180910390f35b34801561007f57600080fd5b506100886100de565b604051610095919061030d565b60405180910390f35b3480156100ae57600080fd5b506100b76100e5565b6040516100c4919061030d565b60405180910390f35b6000546001600160a01b031633146100df57600080fd5b6000546001600160a01b031633146100f957600080fd5b6001600160a01b03811660009081526020819052604090205460ff1681565b6001600160a01b03821660009081526020819052604090205460ff161561014457600080fd5b6001600160a01b03831660009081526020819052604090205460ff16151561016d57600080fd5b6001600160a01b03841660009081526020819052604090205460ff161561019657600080fd5b6000805460ff191660011790556001600160a01b03831660009081526020819052604090205460ff16156101c857600080fd5b6000805460ff19169055506001600160a01b03811660009081526020819052604090205460ff1690565b6000805460ff166101ff57600080fd5b6001600160a01b03811660009081526020819052604081205460ff16151561022757600080fd5b6001600160a01b03821660009081526020819052604090205460ff16801561025657506000546001600160a01b031633145b1561026157600080fd5b6001600160a01b03831660009081526020819052604090205460ff16151561028c57600080fd5b60005460ff16156102a257600080fd5b6000546001600160a01b031633146102bb57600080fd5b60005460ff166102cb57600080fd5b6000546001600160a01b031681565b6000546001600160a01b03168156fea2646970667358221220302b3d3e6ea12bd8c69c7742e5c6cccf7ec357b9ce90fa1ad933d9fdf14a77f264736f6c63430008130033"
};

async function main() {
  console.log(`Deploying token: ${TOKEN_NAME} (${TOKEN_SYMBOL}) with total supply ${ethers.formatUnits(TOKEN_SUPPLY, 18)}...`);
  const factory = new ethers.ContractFactory(ERC20_SOURCE.abi, ERC20_SOURCE.bytecode, wallet);
  const contract = await factory.deploy(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_SUPPLY);
  await contract.waitForDeployment();
  console.log("✅ Token berhasil dideploy di alamat:", contract.target);
}

main().catch(console.error);
