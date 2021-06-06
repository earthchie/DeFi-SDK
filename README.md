# DeFi-SDK

Client-side-focused DeFi SDK.

## Usage

Just run it in localhost then open the console and check `DeFi` variable for commands

เปิดเว็บใน localhost แล้วเปิด console ขึ้นมา จากนั้นลองดูตัวแปร `DeFi` จะพบกับคำสั่งที่ใช้ได้

![image](https://user-images.githubusercontent.com/7013039/120937140-f30f6a80-c735-11eb-8021-44bb37b56f1e.png)


## Example 1: Swap (Buy) token if the price drop below certain value
ตัวอย่างการเฝ้าราคา ถ้าราคาร่วงมาแตะจุดที่ต้องการ ก็จะซื้ออัตโนมัติ

ระวังอย่าใช้ wallet ประจำนะครับ ควรสร้าง wallet ใหม่สำหรับโปรเจคนี้โดยเฉพาะ

```javascript
DeFi.setWallet('Your private key or Mnemonic'); // don't use your active wallet here. create new one for this project instead.

DeFi.provider.on('block', async n => { // listen to new block event

    let price = await DeFi.Twindex.DOP_BUSD.price(); // get DOP price

    console.log('Block', n, 'DOP Price', price, 'BUSD'); // show info

    if(price <= 1.25){ // if DOP price drop below 1.25 BUSD
        
        // stop listening to new block event
        DeFi.provider.off(); 
        
        // swap all BUSD in the wallet to DOP
        // buy with all BUSD in the wallet. You can set specific amount too, using `.buy(BUSD = 10)` means buy 10 BUSD of DOP.
        let list = await DeFi.Twindex.DOP_BUSD.buy();
        
        console.log(list);
  
    }

});

```

## Example 2: Swap (Sell) token if the price reached certain value
ตัวอย่างการเฝ้าราคา ถ้าราคาขึ้นไปแตะจุดที่ต้องการ ก็จะขายอัตโนมัติ

ระวังอย่าใช้ wallet ประจำนะครับ ควรสร้าง wallet ใหม่สำหรับโปรเจคนี้โดยเฉพาะ

```javascript
DeFi.setWallet('Your private key or Mnemonic'); // don't use your active wallet here. create new one for this project instead.

DeFi.provider.on('block', async n => { // listen to new block event

    let price = await DeFi.Twindex.DOP_BUSD.price(); // get DOP price

    console.log('Block', n, 'DOP Price', price, 'BUSD'); // show info

    if(price >= 5){ // if DOP price reached 5 BUSD
        
        // stop listening to new block event
        DeFi.provider.off(); 
        
        // swap all DOP in the wallet to BUSD
        // sell all DOP in the wallet. You can set specific amount too, using `.sell(DOP = 1)` means sell 1 DOP.
        let result = await DeFi.Twindex.DOP_BUSD.sell();
        
        console.log(result); 
  
    }

});

```

## More simple examples
```
DeFi.provider; // ethers.js standard Provider
DeFi.wallet; // ethers.js standard Signer

DeFi.wallet.address; // get my wallet address

await DeFi.wallet.balance(); // get BNB balance

await DeFi.BUSD.balance(); // get BUSD balance
await DeFi.DOP.balance(); // get DOP balance

await DeFi.Twindex.PTZ_DOLLY.price(); // get PTZ price in DOLLY at Twindex
await DeFi.Pancake.WAD_BUSD.price(); // get WAD price in BUSD at Pancake

await DeFi.Twindex.DOP_DOLLY.buy(DOLLY = 10); // Buy DOP with 10 DOLLY at Twindex
await DeFi.Pancake.DOP_BUSD.sell(DOP = 2); // Sell 2 DOP for BUSD at Pancake

await DeFi.Twindex.swap(amount = 10, from = "BUSD", to = "DOP"); // swap 10 BUSD to DOP at Twindex. same as DeFi.Twindex.DOP_BUSD.buy(10);
await DeFi.Pancake.swap(amount = 2, from = "DOP", to = "BUSD"); // swap 2 DOP to BUSD at Pancake. same as DeFi.Pancake.DOP_BUSD.sell(2);

await DeFi.Pancake.swap(amount = 1, from = "BUSD", to = "SCZ", slippage_percentage = 1.5); // swap 1 BUSD to SCZ at Pancake with slippage percentage at 1.5%

DeFi.provider.on('block', blockNumber => console.log(blockNumber)); // listen to new block event
DeFi.provider.on('pending', transaction => console.log(transaction)); // listen to pending transaction event

// listen to token transfer event
DeFi.Tokens.DOP.on('Transfer', (from, to, amount, transaction) => console.log(from, to, amount, transaction));
```

## Want to add more Dex and Token?
Easy, just edit `./defi-sdk/contracts/bsc.js` as you please.


## Buy me some food
เลี้ยงข้าวผมได้ โดยการบริจาคมาที่กระเป๋านี้ครับ

### `0xF00D9600F507daDbDD7CEE75C570C0B4E8b2611E`

![image](https://user-images.githubusercontent.com/7013039/120937036-4b923800-c735-11eb-91cd-753549c9be0e.png)
