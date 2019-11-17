pragma solidity >=0.5.0 < 0.6.0;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';

contract Marble is ERC721Full {

  struct MarbleRep {
    string color;
    uint border;
    string name;

  }

  MarbleRep[] public marbles;

  mapping(string => bool) _marbleExists;

  constructor() ERC721Full("MarbleToken", "MBL") public {
  }


  function mint(string memory color, uint border, string memory name) public {

    require(!_marbleExists[name]);

    MarbleRep memory marble = MarbleRep(color, border, name);
    uint id = marbles.push(marble);

    _mint(msg.sender, id);
    _marbleExists[name] = true;
  }

}
