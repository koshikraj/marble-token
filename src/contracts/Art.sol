pragma solidity >=0.5.0 < 0.6.0;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';

contract Art is ERC721Full {

  struct Art {
    string color;
    uint border;
    string name;

  }

  Art[] public arts;

  mapping(string => bool) _artExists;

  constructor() ERC721Full("ArtToken", "ART") public {
  }


  function mint(string memory color, uint border, string memory name) public {

    require(!_artExists[name]);

    Art memory art = Art(color, border, name);
    uint id = arts.push(art);

    _mint(msg.sender, id);
    _artExists[name] = true;
  }

}
