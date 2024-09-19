import { Address, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const lottery = provider.open(Lottery.createFromConfig({
        adminAddress: provider.sender().address as Address,         // адрес админа (в данном случае будет админ тот, кто отправляет транзакцию на деплой)
        bankWalletAddress: Address.parse(""),                       // адрес банка, куда придет процент (просто скопировать и вставить адрес в кавычки)
        cycleLength: 5,                                             // количество циклов (транзакций)
        betAmount: toNano("0.1")                                    // сумма ставки (1,2,3...n)
    }, await compile('Lottery')));

    await lottery.sendDeploy(provider.sender(), toNano('1'));       // деплой

    await provider.waitForDeploy(lottery.address, 25);

    // @ ДОП МЕТОДЫ @ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // await lottery.sendChangeBet(provider.sender(), toNano("0.01"), toNano("20"))                    // смена ставки (валидна только после конца цикла, до начала нового)

    // await lottery.sendChangeCycleLength(provider.sender(), toNano("0.01"), 10)                      // смена циклов (транзакций) (так же валидна только после конца цикла, до начала нового)

    // await lottery.sendChangeBankWalletAddress(provider.sender(), toNano("0.01"), Address.parse("")) // смена адреса банка (просто скопировать и вставить адрес в кавычки)

    // await lottery.sendWithdrawJettons(provider.sender(), toNano("0.055"), {                         // отправить "случайно" попавшие жетоны на контракт (вариант без toAddress отправит токены на zero-address.ton)
    //     jettonWalletAddress: Address.parse("Адрес жетон кошелька контракта"),
    //     jettonAmount: toNano("10")
    // })

    // await lottery.sendWithdrawJettons(provider.sender(), toNano("0.055"), {                         // отправить "случайно" попавшие жетоны на контракт (вариант с toAddress отправит токены нужному адресу)
    //     jettonWalletAddress: Address.parse("Адрес жетон кошелька контракта"),
    //     jettonAmount: toNano("10"),
    //     toAddress: Address.parse("Адрес обычного кошелька юзера (или контракта), кому нено отправить")
    // })

    // await lottery.sendWithdrawNft(provider.sender(), toNano("0.055"), {                             // отправить "случайно" попавшую NFT на контракт (вариант без toAddress отправит NFT на zero-address.ton)
    //     nftAddress: Address.parse("Адрес нфт, которую надо отправить")
    // })

    // await lottery.sendWithdrawNft(provider.sender(), toNano("0.055"), {                             // отправить "случайно" попавшую NFT на контракт (вариант с toAddress отправит NFT нужному адресу)
    //     nftAddress: Address.parse("Адрес NFT, которую надо отправить"),
    //     toAddress: Address.parse("Адрес кому нужно отправить NFT (кошелек или контракт)")
    // })
}
