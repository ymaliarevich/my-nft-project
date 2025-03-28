// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MyNFT is ERC721, ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    constructor()
    ERC721("MyNFT", "MyNFT")
    Ownable(msg.sender)
    {
        _nextTokenId = 0;
    }

    function safeMint() external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function _baseURI() internal pure override returns(string memory) {
        return "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/";
    }

    function safeMintTo(address to) external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable)
    returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, amount);
    }
}