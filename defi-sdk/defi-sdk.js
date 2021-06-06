const ABI = {
    ERC20: abi_erc20,
    Factory: abi_factory,
    Router: abi_router,
    Pairs: abi_pairs
};

class DeFiSDK {

    version = '0.1.3';

    constructor(rpc_url, wallet) {
        this.setRPC(rpc_url);
        this.setWallet(wallet);
    }

    setRPC(rpcURL) {
        this.rpcURL = rpcURL || 'https://bsc-dataseed.binance.org/';
        this.provider = new ethers.providers.JsonRpcProvider(this.rpcURL);
    }

    setWallet(wallet) {
        if (wallet && wallet.address) {
            this.wallet = wallet;
        } else {
            if (typeof wallet === 'string') {
                if (wallet.length === 66) {
                    this.wallet = new ethers.Wallet(wallet, this.provider);
                } else {
                    wallet = new ethers.Wallet.fromMnemonic(wallet);
                    this.wallet = wallet.connect(this.provider);
                }
            }
        }

        if(this.wallet){
            this.wallet.balance = async function() {
                return +ethers.utils.formatUnits(await this.getBalance());
            }
            this.loadContracts(this.contractAddresses);
        }
    }

    async loadContracts(list) {
        let _self = this;
        list = list || Contracts;
        this.contractAddresses = list;

        const provider = this.wallet || this.provider;
        const BUSD = '0xe9e7cea3dedca5984780bafc599bd69add087d56';
        let Contract = {
            Tokens: {} 
        };

        await Promise.all(Object.keys(list.Tokens).map(async sym => {
            Contract.Tokens[sym] = new ethers.Contract(list.Tokens[sym], ABI.ERC20, provider);
        }));

        await Promise.all(Object.keys(list.AMM).map(async dex => {
            Contract[dex] = {
                Factory: new ethers.Contract(list.AMM[dex].Factory, ABI.Factory, provider),
                Router: new ethers.Contract(list.AMM[dex].Router, ABI.Router, provider),
            };

            Contract[dex].swap = async function (amountsIn, from, to, slippage) {
                slippage = slippage || 0.5;
                amountsIn = ethers.utils.parseUnits(amountsIn.toString(), 18);

                const amounts = await this.Router.getAmountsOut(amountsIn, [list.Tokens[from], list.Tokens[to]]);
                let amountsOut = ethers.utils.formatUnits(amounts[1]);
                amountsOut = ethers.utils.parseUnits((amountsOut - (amountsOut / 100 * slippage)).toString(), 18);

                const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 10;
                let gasLimit = '150000';
                try {
                    gasLimit = await this.Router.estimateGas.swapExactTokensForTokens(amountsIn, amountsOut, [list.Tokens[from], list.Tokens[to]], _self.wallet.address, deadline);
                } catch (e) {}
                return await this.Router.swapExactTokensForTokens(amountsIn, amountsOut, [list.Tokens[from], list.Tokens[to]], _self.wallet.address, deadline, {
                    gasPrice: ethers.utils.parseUnits('5', 'gwei'),
                    gasLimit: gasLimit.toString()
                });
            }

            await Promise.all(Object.keys(list.Tokens).map(async sym => {
                if (list.AMM[dex].stables) {
                    
                    await Promise.all(Object.keys(list.AMM[dex].stables).map(async stable => {
                        list.Tokens[stable] = list.AMM[dex].stables[stable];
                        Contract.Tokens[stable] = new ethers.Contract(list.AMM[dex].stables[stable], ABI.ERC20, provider);

                        Contract[dex][sym + '_' + stable] = new ethers.Contract(await Contract[dex].Factory.getPair(list.Tokens[sym], list.AMM[dex].stables[stable]), ABI.Pairs, provider);
                    }));
                    
                } else {
                    Contract[dex][sym + '_BUSD'] = new ethers.Contract(await Contract[dex].Factory.getPair(list.Tokens[sym], BUSD), ABI.Pairs, provider);
                }

                await Promise.all(Object.keys(Contract[dex]).map(async pairs => {
                    if (pairs !== 'Factory' && pairs !== 'Router') {
                        Contract[dex][pairs].pairs = pairs.split('_');
                        Contract[dex][pairs].price = async function () { // only support standard 18-digits decimals for now
                            const reserves = await this.getReserves();
                            return reserves[1] / reserves[0];
                        }
                        Contract[dex][pairs].buy = async function(amount){
                            amount = amount || await Contract.Tokens[this.pairs[1]].balance();
                            return Contract[dex].swap(amount, this.pairs[1], this.pairs[0]);
                        }
                        Contract[dex][pairs].sell = async function(amount){
                            amount = amount || await Contract.Tokens[this.pairs[0]].balance();
                            return Contract[dex].swap(amount, this.pairs[0], this.pairs[1]);
                        }
                    }
                }));

            }));
        }));

        
        await Promise.all(Object.keys(Contract.Tokens).map(async sym => {
            Contract.Tokens[sym].balance = async function() {
                return +ethers.utils.formatUnits(await this.balanceOf(_self.wallet.address));
            }
        }));

        Object.keys(Contract).forEach(i => {
            this[i] = Contract[i];
        });
    }

}
