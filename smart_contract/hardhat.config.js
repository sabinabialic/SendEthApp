// https://eth-ropsten.alchemyapi.io/v2/DJtAS8GwqZcAKot91W6OXHT7Zcwa_zVo

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/DJtAS8GwqZcAKot91W6OXHT7Zcwa_zVo',
      accounts: [ '19e9e1f79ef8456ec07a845eb2b8256e8e8791e246b5298c56f8f196b5785b40' ]
    }
  }
}
