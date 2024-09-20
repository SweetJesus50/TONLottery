import { Address, toNano } from '@ton/core';
import { LotteryWCooldown } from '../wrappers/LotteryWCooldown';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lotteryWCooldown = provider.open(LotteryWCooldown.createFromConfig({
        adminAddress: provider.sender().address as Address,         // адрес админа (в данном случае будет админ тот, кто отправляет транзакцию на деплой)
        bankWalletAddress: Address.parse(""),                       // адрес банка, куда придет процент (просто скопировать и вставить адрес в кавычки)
        cycleLength: 5,                                             // количество транзакций (ставок) в одном раунде
        betAmount: toNano("1") 
    }, await compile('LotteryWCooldown')));

    await lotteryWCooldown.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(lotteryWCooldown.address, 20);

    // run methods on `lotteryWCooldown`
}
