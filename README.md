# Lottery on TON

Blockchain based lottery smart contract on TON.

Everything works automatically & safely. The rules are simple — send TON to this smart contract address and win. 70% of the prize goes to winner, 30% of goes as fee to bank address.
Lottery contract is reusable, i.e. once you deployed it you can use it forever.
Supports various customizations, such as:
- bet amount changing
- changing the number of transactions in one round
- changing bank address
- also has ability to withdraw unexpected Jettons & NFTs.

There are 2 versions of lottery. Lottery w/cooldown and lottery w/o cooldown.
More information available in [`contracts`](https://github.com/SweetJesus50/TONLottery/tree/master/contracts).

**Try it on [TON Lottery](https://lotteryton.com/)!**

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
