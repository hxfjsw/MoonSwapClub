import '@nomiclabs/hardhat-ethers';
import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {PayableOverrides} from 'ethers';
import {
    EthersExecutionManager,
    getDeployment,
    setDeployment,
    LOCK_DIR,
    RETRY_NUMBER,
    log,
} from '../utils';

const wethContract = 'WETH9';
const routerContract = 'UniswapV2Router02';
const factoryContract = 'UniswapV2Factory';
const taskSymbol = 'UniswapV2'
const taskName = `${taskSymbol}:deploy`;
// console.log("taskName",taskName)

task(taskName, `Deploy ${taskSymbol}`)
    .addOptionalParam('waitNum', 'The waitNum to transaction')
    .addOptionalParam('gasPrice', 'The gasPrice to transaction')
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const txConfig: PayableOverrides = {};
        txConfig.gasPrice = args['gasPrice']
            ? hre.ethers.utils.parseUnits(args['gasPrice'], 'gwei')
            : undefined;
        const waitNum = args['waitNum'] ? parseInt(args['waitNum']) : 1;
        const ethersExecutionManager = new EthersExecutionManager(
            `${LOCK_DIR}/${taskName}.lock`,
            RETRY_NUMBER,
            waitNum
        );
        await ethersExecutionManager.load();
        const operator = (await hre.ethers.getSigners())[0];
        const chainId = Number(await hre.getChainId());

        log.info(`operator ${operator.address}`);

        const CalHash = await hre.ethers.getContractFactory("CalHash");
        const mgr = await CalHash.deploy();
        await mgr.deployed(); //等的确认发布
        const hash = await mgr.getInitHash();
        console.log("hash", hash)
        // return;

        log.info(`deploy ${wethContract}`);
        const Weth = await hre.ethers.getContractFactory(wethContract);
        const deployWethResult = await ethersExecutionManager.transaction(
            Weth.deploy.bind(Weth),
            [],
            ['contractAddress', 'blockNumber'],
            `deploy ${wethContract}`,
            txConfig
        );
        const wethProxyAddress = deployWethResult.contractAddress;
        const wethImplAddress = wethProxyAddress;
        const wethFromBlock = deployWethResult.blockNumber;
        const wethVersion = '1.0.1';
        log.info(
            `${wethContract} deployed proxy at ${wethProxyAddress},impl at ${wethImplAddress},version ${wethVersion},fromBlock ${wethFromBlock}`
        );

        log.info(`deploy ${factoryContract}`);
        const Factory = await hre.ethers.getContractFactory(factoryContract);
        const deployFactoryResult = await ethersExecutionManager.transaction(
            Factory.deploy.bind(Factory),
            [operator.address],
            ['contractAddress', 'blockNumber'],
            `deploy ${factoryContract}`,
            txConfig
        );
        const factoryProxyAddress = deployFactoryResult.contractAddress;
        const factoryImplAddress = factoryProxyAddress;
        const factoryFromBlock = deployFactoryResult.blockNumber;
        const factoryVersion = '1.0.1';
        log.info(
            `${factoryContract} deployed proxy at ${factoryProxyAddress},impl at ${factoryImplAddress},version ${factoryVersion},fromBlock ${factoryFromBlock}`
        );

        log.info(`deploy ${routerContract}`);
        const Router = await hre.ethers.getContractFactory(routerContract);
        const deployRouterResult = await ethersExecutionManager.transaction(
            Router.deploy.bind(Router),
            [factoryProxyAddress, wethProxyAddress],
            ['contractAddress', 'blockNumber'],
            `deploy ${routerContract}`,
            txConfig
        );
        const routerProxyAddress = deployRouterResult.contractAddress;
        const routerImplAddress = routerProxyAddress;
        const routerFromBlock = deployRouterResult.blockNumber;
        const routerVersion = '1.0.1';
        log.info(
            `${routerContract} deployed proxy at ${routerProxyAddress},impl at ${routerImplAddress},version ${routerVersion},fromBlock ${routerFromBlock}`
        );

        const deployment = await getDeployment(chainId);

        deployment.weth = {
            proxyAddress: wethProxyAddress,
            implAddress: wethImplAddress,
            version: wethVersion,
            contract: wethContract,
            operator: operator.address,
            fromBlock: wethFromBlock,
        };

        deployment.factory = {
            proxyAddress: factoryProxyAddress,
            implAddress: factoryImplAddress,
            version: factoryVersion,
            contract: factoryContract,
            operator: operator.address,
            fromBlock: factoryFromBlock,
        };

        deployment.router = {
            proxyAddress: routerProxyAddress,
            implAddress: routerImplAddress,
            version: routerVersion,
            contract: routerContract,
            operator: operator.address,
            fromBlock: routerFromBlock,
        };

        await setDeployment(chainId, deployment);

        const amount = "1000000000000000000000000000"
        const TestToken = await hre.ethers.getContractFactory('DeflatingERC20');
        const tt = await TestToken.deploy(amount);
        await tt.deployed(); //等的确认发布
        console.log('TestToken', tt.address)

        const tx= await tt.approve(routerProxyAddress,amount)
        const recp = await tx.wait();
        console.log('recp', recp.status)

        // console.log(deployRouterResult)
        const addLiqTx = await Router.attach(routerProxyAddress).addLiquidityETH(tt.address,amount,"0","0",operator.address,"1755284777",{
            value:"100000000"
        })
        const addLiqRec = await tx.wait();
        console.log('addLiqRec', addLiqRec.status)

        ethersExecutionManager.printGas();
        ethersExecutionManager.deleteLock();
    });


task("MultiCall:deploy", `Deploy MultiCall`)
    .addOptionalParam('waitNum', 'The waitNum to transaction')
    .addOptionalParam('gasPrice', 'The gasPrice to transaction')
    .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
        const txConfig: PayableOverrides = {};
        txConfig.gasPrice = args['gasPrice']
            ? hre.ethers.utils.parseUnits(args['gasPrice'], 'gwei')
            : undefined;
        const waitNum = args['waitNum'] ? parseInt(args['waitNum']) : 1;
        const ethersExecutionManager = new EthersExecutionManager(
            `${LOCK_DIR}/MultiCall:deploy.lock`,
            RETRY_NUMBER,
            waitNum
        );
        await ethersExecutionManager.load();
        const operator = (await hre.ethers.getSigners())[0];
        const chainId = Number(await hre.getChainId());

        log.info(`operator ${operator.address}`);

        log.info(`deploy MultiCall`);
        const MultiCall = await hre.ethers.getContractFactory('Multicall2');
        const mgr = await MultiCall.deploy();
        await mgr.deployed(); //等的确认发布

        log.info(
            `MultiCall deployed ${mgr.address}`
        );

        try {
            // 测试 Multicall 合约自己的只读函数，这些函数是安全的
            console.log('Testing Multicall contract own functions...');
            
            // 1. 获取当前区块时间戳
            const currentBlock = await mgr.getCurrentBlockTimestamp();
            console.log('Current block timestamp:', currentBlock.toString());
            
            // 2. 获取当前区块难度
            const difficulty = await mgr.getCurrentBlockDifficulty();
            console.log('Current block difficulty:', difficulty.toString());
            
            // 3. 获取当前区块 gas limit
            const gasLimit = await mgr.getCurrentBlockGasLimit();
            console.log('Current block gas limit:', gasLimit.toString());
            
            // 4. 获取操作者地址的 ETH 余额
            const balance = await mgr.getEthBalance(operator.address);
            console.log('Operator ETH balance:', hre.ethers.utils.formatEther(balance), 'ETH');
            
            // 5. 测试 aggregate 函数，但使用一个安全的调用
            // 创建一个简单的测试调用，调用一个不存在的合约（会失败但不会崩溃）
            const safeCall = [
                {
                    target: "0x6088F6D6B6d64B9F42Ef06E1b34c6bF08C696d71", // 零地址
                    callData: "0x06fdde03" // 空的调用数据
                }
            ];
            
            console.log('Testing aggregate with safe call...');
            const result = await mgr.callStatic.aggregate(safeCall);
            console.log('Aggregate result - Block number:', result.blockNumber.toString());
            console.log('Return data length:', result.returnData.length);
            
        } catch (error: any) {
            console.error('Error during read-only calls:', error);
            
            // 如果是 aggregate 调用失败，尝试更详细的错误信息
            if (error.code === 'CALL_EXCEPTION') {
                console.log('Call exception details:');
                console.log('- Data:', error.data);
                console.log('- Transaction:', error.transaction);
            }
        }

        ethersExecutionManager.printGas();
        ethersExecutionManager.deleteLock();
    });
