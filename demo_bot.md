# demo bot
nodejs worker demo

## how to start
```bash
git clone <git_repository>
npm install
node demo_bot.js
```
## line notify alert
```js
let DeFi;
async function main() {

    // Read-only
    // var _DeFiSDK = require('./defi-sdk/defi-sdk.js');

    // console.log(_DeFiSDK);
    DeFi = new DeFiSDK('https://bsc-dataseed.binance.org/');

    // with private key, is able to sign transactions 
    // var DeFi = new DeFiSDK('https://bsc-dataseed.binance.org/', private_key);

    DeFi.setLineToken('<line notify token>'); //////////////////////////// set line token
    await DeFi.loadContracts();
    console.log('Ready...');

    DeFi.provider.on('block', async n => {

        console.log('Block', n);
        var dop_price = await DeFi.Twindex.DOP_BUSD.price();
        var twin_price = await DeFi.Twindex.TWIN_BUSD.price();
        var ale_price = await DeFi.Ale_swap.ALE_BUSD.price();
        var leaf_price = await DeFi.Pancake.LEAF_BUSD.price();

        console.log('TWIN :: $'+twin_price);
        console.log('DOP :: $'+dop_price);
        console.log('ALE :: $'+ale_price);
        console.log('LEAF :: $'+leaf_price);
        if (ale_price > 0.05){
            await DeFi.sendMsg('ALE PRICE :: $'+ale_price); //////////////////////  send line notify
        }
    });

    // or
    // await DeFi.Twindex.swap(amount = 1, from = 'TWIN', to = 'DOP'); // requires private key or mnemonic
}
```
