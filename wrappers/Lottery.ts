import { Address, beginCell, Builder, Cell, Contract, contractAddress, ContractProvider, Dictionary, DictionaryValue, Sender, SendMode, toNano } from '@ton/core';

export type LotteryConfig = {
    adminAddress: Address,
    bankWalletAddress: Address,
    cycleLength: number,
    betAmount: bigint
};

export function lotteryConfigToCell(config: LotteryConfig): Cell {
    return beginCell()
                .storeBit(0)
                .storeAddress(config.adminAddress)
                .storeAddress(config.bankWalletAddress)
                .storeDict(Dictionary.empty())
                .storeUint(config.cycleLength, 32)
                .storeCoins(config.betAmount)
                .storeUint(0, 32)
                .storeCoins(0)
            .endCell();
}

export class Lottery implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Lottery(address);
    }

    static createFromConfig(config: LotteryConfig, code: Cell, workchain = 0) {
        const data = lotteryConfigToCell(config);
        const init = { code, data };
        return new Lottery(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0xfe0f6f57, 32).storeUint(Math.floor(Date.now() / 1000), 64).endCell(),
        });
    }

    async sendChangeBet(provider: ContractProvider, via: Sender, value: bigint, newBet: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x367482d2, 32).storeUint(Math.floor(Date.now() / 1000), 64).storeCoins(newBet).endCell(),
        });
    }

    async sendChangeCycleLength(provider: ContractProvider, via: Sender, value: bigint, newCycleLength: number) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0xd5eab682, 32).storeUint(Math.floor(Date.now() / 1000), 64).storeUint(newCycleLength, 32).endCell(),
        });
    }

    async sendChangeBankWalletAddress(provider: ContractProvider, via: Sender, value: bigint, newBankAddress: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0xf06c0892, 32).storeUint(Math.floor(Date.now() / 1000), 64).storeAddress(newBankAddress).endCell(),
        });
    }

    async sendWithdrawJettons(provider: ContractProvider, via: Sender, value: bigint, opts: {
        jettonWalletAddress: Address,
        jettonAmount: bigint,
        toAddress?: Address
    }) {
        let msgBody = beginCell()
                        .storeUint(0xba2c493a, 32)
                        .storeUint(Math.floor(Date.now() / 1000), 64)
                        .storeAddress(opts.jettonWalletAddress)
                        .storeCoins(opts.jettonAmount)

        if(opts.toAddress != undefined) {
            msgBody.storeAddress(opts.toAddress);
        }                

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msgBody.endCell()
        });
    }

    async sendWithdrawNft(provider: ContractProvider, via: Sender, value: bigint, opts: {
        nftAddress: Address,
        toAddress?: Address
    }) {
        let msgBody = beginCell()
                        .storeUint(0x683da743, 32)
                        .storeUint(Math.floor(Date.now() / 1000), 64)
                        .storeAddress(opts.nftAddress)
                        
        if(opts.toAddress != undefined) {
            msgBody.storeAddress(opts.toAddress);
        }                

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msgBody.endCell()
        });
    }

    // GET METHODS

    async getLotteryData(provider: ContractProvider) {
        let { stack } = await provider.get('get_lottery_data', [])

        return {
            adminAddress: stack.readAddress(),
            bankWalletAddress: stack.readAddress(),
            addrList: stack.readCell(),
            cycleLength: stack.readNumber(),
            betAmount: stack.readBigNumber(),
            txCount: stack.readNumber(),
            bankTotalCash: stack.readBigNumber()
        }
    }

    async getLotteryStatus(provider: ContractProvider) {
        return (await provider.get('get_lottery_status', [])).stack.readBoolean()
    }
}
