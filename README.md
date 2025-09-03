# MoonSwapClub

一个基于 Uniswap V2 的去中心化交易所（DEX），部署在 X Layer 网络上。

## 🌟 项目简介

MoonSwapClub 是一个完整的 DeFi 交易平台，包含：
- 🔄 代币交换功能
- 💧 流动性挖矿
- 📊 交易对管理
- 🎯 现代化的 Web 界面

## 🏗️ 项目结构

```
moonswap.club/
├── contract/           # 智能合约
│   ├── contracts/      # Solidity 合约源码
│   ├── sdk/           # TypeScript SDK
│   ├── tasks/         # 部署和验证脚本
│   └── deployment/    # 部署配置
├── interface/         # 前端界面
│   ├── src/          # React 应用源码
│   ├── public/       # 静态资源
│   └── cypress/      # E2E 测试
└── README.md         # 项目文档
```

## 🚀 快速开始

### 前端开发

```shell
cd interface

# 清理缓存（如遇到编译异常）
yarn cache clean --force

# 安装依赖
yarn install

# 启动开发服务器
yarn start

# 构建生产版本
yarn build
```

**注意：** 如果 Node.js 版本 >= 17，需要设置环境变量：
```shell
export NODE_OPTIONS="--openssl-legacy-provider --no-experimental-fetch"
```

### 智能合约开发

```shell
cd contract

# 安装依赖
yarn install

# 编译合约
npx hardhat compile

# 运行测试
yarn test

# 代码覆盖率测试
yarn test:cov
```

## 📋 环境要求

- **Node.js**: >= 14.x
- **Yarn**: >= 1.22.x
- **Hardhat**: >= 2.6.x
- **React**: >= 16.13.x

## 🔧 环境配置

### 前端环境变量

创建 `.env.local` 文件：
```env
REACT_APP_CHAIN_ID="196"
REACT_APP_NETWORK_URL="https://xlayerrpc.okx.com"
REACT_APP_PORTIS_ID="your-portis-id"
REACT_APP_FORTMATIC_KEY="your-fortmatic-key"
REACT_APP_GOOGLE_ANALYTICS_ID="your-ga-id"
```

### 合约环境变量

创建 `.env` 文件：
```env
MOON_SWAP_PRIVATE_KEY="your-private-key"
XLayerAPIKEY="your-xlayer-api-key"
GAS_PRICE=2
```

## 🌐 网络配置

### X Layer 主网
- **Chain ID**: 196
- **RPC URL**: https://xlayerrpc.okx.com
- **区块浏览器**: https://www.oklink.com/xlayer

### X Layer 测试网
- **Chain ID**: 195
- **RPC URL**: https://testrpc.xlayer.tech
- **区块浏览器**: https://www.oklink.com/xlayer-test

## 📦 合约部署

### 本地开发网络

```shell
# 启动本地节点
anvil --fork-url https://xlayerrpc.okx.com

# 部署合约
cd contract
npx hardhat --network localhost run scripts/deploy.js
```

### X Layer 主网部署

```shell
cd contract

# 部署 Uniswap V2 合约
yarn run hardhat UniswapV2:deploy --gas-price 2 --wait-num 5 --network xlayer

# 部署 Multicall 合约
yarn run hardhat MultiCall:deploy --gas-price 2 --wait-num 5 --network xlayer

# 验证合约
npx hardhat okverify --network xlayer
```

## 📝 合约地址

### X Layer 主网 (Chain ID: 196)

| 合约 | 地址 |
|------|------|
| WOKB | `0xe538905cf8410324e03a5a23c1c177a474d59b2b` |
| Factory | `0x1FB6c576Da55D069dDb465b0428A9b7D1e36442d` |
| Router | `0x2120625409De8f3a9eb5BC103A5f5db286dfE4d5` |
| Multicall | `0x10c29019B0075f7464A968414Ef192e1bd57dA2b` |

## 🧪 测试

### 前端测试
```shell
cd interface
yarn test                    # 单元测试
yarn integration-test        # 集成测试
```

### 合约测试
```shell
cd contract
yarn test                    # 合约测试
yarn test:cov               # 覆盖率测试
```

### E2E 测试
```shell
cd interface
yarn cypress:open          # 打开 Cypress 测试界面
yarn cypress:run           # 运行所有 E2E 测试
```

## 🔍 代码质量

### Lint 检查和修复
```shell
# 前端代码格式化
cd interface
npx prettier --write "src/**/*.{ts,tsx}"
yarn lint

# 合约代码格式化
cd contract
yarn format:fix
```

## 🛠️ 开发工具

### 推荐的 VS Code 扩展
- Solidity (Juan Blanco)
- Prettier - Code formatter
- ESLint
- TypeScript Importer

### 浏览器扩展
- MetaMask
- WalletConnect

## 📚 技术栈

### 前端
- **React** 16.13+ - UI 框架
- **TypeScript** - 类型安全
- **Styled Components** - CSS-in-JS
- **Web3React** - Web3 连接
- **React Router** - 路由管理
- **Redux Toolkit** - 状态管理

### 智能合约
- **Solidity** 0.5.16 & 0.6.6 - 合约语言
- **Hardhat** - 开发框架
- **OpenZeppelin** - 安全库
- **Ethers.js** - 以太坊交互

### 测试
- **Jest** - 单元测试
- **Cypress** - E2E 测试
- **Waffle** - 合约测试

## 🔐 安全考虑

- 所有合约都经过全面测试
- 使用 OpenZeppelin 的安全库
- 实施了滑点保护
- 支持交易截止时间设置

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范
- 遵循 ESLint 和 Prettier 配置
- 编写测试用例
- 更新相关文档

## 📄 许可证

- 前端界面：GPL-3.0-or-later
- 智能合约：MIT License

## 🔗 相关链接

- [官方网站](https://moonswap.club)
- [应用界面](https://app.moonswap.club)
- [文档](https://docs.moonswap.club)
- [GitHub](https://github.com/hxfjsw/MoonSwapClub)
- [X Layer 官网](https://www.okx.com/xlayer)

## 📞 联系我们

- **Discord**: [加入我们的社区](https://discord.gg/moonswap)
- **Twitter**: [@MoonSwapClub](https://twitter.com/moonswapclub)
- **Telegram**: [MoonSwap 中文群](https://t.me/moonswapclub)
- **Email**: contact@moonswap.club

## ⚠️ 免责声明

MoonSwapClub 是一个实验性的 DeFi 协议。使用前请：
- 仔细阅读智能合约代码
- 了解相关风险
- 只投入您能承受损失的资金
- 在主网使用前先在测试网测试

## 🗺️ 路线图

- [x] 基础交换功能
- [x] 流动性挖矿
- [x] X Layer 主网部署
- [ ] 治理代币发行
- [ ] 跨链桥接
- [ ] 移动端应用
- [ ] NFT 市场集成

## 📊 统计信息

- **总锁仓价值 (TVL)**: 实时更新
- **24h 交易量**: 实时更新
- **支持的代币**: 50+
- **活跃用户**: 1000+

---

**⭐ 如果这个项目对您有帮助，请给我们一个 Star！**