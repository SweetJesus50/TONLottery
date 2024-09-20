import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { LotteryWCooldown } from '../wrappers/LotteryWCooldown';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('LotteryWCooldown', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('LotteryWCooldown');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let lotteryWCooldown: SandboxContract<LotteryWCooldown>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        lotteryWCooldown = blockchain.openContract(LotteryWCooldown.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await lotteryWCooldown.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: lotteryWCooldown.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and lotteryWCooldown are ready to use
    });
});
