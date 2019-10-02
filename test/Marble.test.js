const Marble = artifacts.require('./Marble.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Marble', (accounts) => {
  let contract;

  before(async () => {
    contract = await Marble.deployed()
  });

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    });

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'MarbleToken')
    });

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'MBL')
    })

  });

  describe('minting', async () => {

    it('creates a new token', async () => {
      const result = await contract.mint('#EC058E', 50, "Marble Token 1");
      const totalSupply = await contract.totalSupply();
      // SUCCESS
      assert.equal(totalSupply, 1);
      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct');
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct');
      assert.equal(event.to, accounts[0], 'to is correct');

      // FAILURE: cannot mint same marble twice
      await contract.mint('#EC058E', 50, "Marble Token 1").should.be.rejected;
    })
  });

  describe('indexing', async () => {
    it('lists marble colors', async () => {
      // Mint 3 more tokens
      await contract.mint('#5386E4', 50, "Marble Token 2")
      await contract.mint('#FFFFFF',  20, "Marble Token 3")
      await contract.mint('#000000',  10, "Marble Token 4")
      const totalSupply = await contract.totalSupply()

      let marble;
      let result = [];

      for (let i = 1; i <= totalSupply; i++) {
        marble = await contract.marbles(i - 1)
        result.push(marble.color)
      }

      let expectedColors = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']
      assert.equal(result.join(','), expectedColors.join(','))
    })
  })

});
