# MoonSwapClub

```shell
cd frontend

# 先清一下缓存，以防编译异常，我遇到了，清理后一切恢复正常
yarn cache clean --force

# 启动
yarn start

# 备注：如果node verson>=17，需要加入如下环境变量
export NODE_OPTIONS="--openssl-legacy-provider --no-experimental-fetch"

# 若要发布，可进行编译
yarn build
```

## 遇到lint报错执行以下命令可以自动修复
npx prettier --write "src/**/*.{ts,tsx}"



## 合约编译
```shell
cd hardhat
npx hardhat compile
```

## 发布合约

```shell
npx hardhat --network xlayer run MOON:deploy

npx hardhat okverify --network xlayer 0x163F78829bD4DC67d8E4BDD5331C5f0F6196F2a6

yarn run hardhat UniswapV2:deploy --gas-price 2 --wait-num 5 --network xlayer


npx hardhat flatten contracts/uniswap-v2-periphery/test/WETH9.sol > flat/WETH9.sol
```