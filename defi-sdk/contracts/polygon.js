
const Contracts = {
    Tokens: {
        TITAN: '0xaaa5b9e6c589642f98a1cda99b9d024b8407285a',
        WMATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        IRON: '0xd86b5923f3ad7b585ed81b448170ae026c65ae9a'
    },
    Farms: {
        Iron: {
            MasterChef: '0xb444d596273c66ac269c33c30fbb245f4ba8a79d'
        }
    },
    AMM: {
        
        Quick: {
            stables: {
                USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                IRON: '0xd86b5923f3ad7b585ed81b448170ae026c65ae9a',
                WMATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
            },
            Factory: '0x5757371414417b8c6caad45baef941abc7d3ab32',
            Router: '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff',
        },
        
        Sushi: {
            stables: {
                USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                IRON: '0xd86b5923f3ad7b585ed81b448170ae026c65ae9a',
                WMATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
            },
            Factory: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
            Router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        }
    }
};

if(typeof module !== 'undefined') module.exports = Contracts;