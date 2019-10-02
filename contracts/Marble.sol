pragma solidity >=0.5.0 < 0.6.0;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';

contract Marble is ERC721Full {

  struct Marble {
    string color;
    uint border;
    string name;

  }

  Marble[] public marbles;

  mapping(string => bool) _marbleExists;

  constructor() ERC721Full("MarbleToken", "MBL") public {
  }


  function mint(string memory color, uint border, string memory name) public {

    require(!_marbleExists[name]);

    Marble memory marble = Marble(color, border, name);
    uint id = marbles.push(marble);

    _mint(msg.sender, id);
    _marbleExists[name] = true;
  }

}
