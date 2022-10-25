// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract FundMe {
    event NewNote(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Note {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Note[] notes;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev fund the owner of the contract
     * @param _name name of funder
     * @param _message message to sender
     */
    function fund(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Cannot fund with 0 eth");
        notes.push(Note(msg.sender, block.timestamp, _name, _message));
        emit NewNote(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev withraw ETH that is in the contract to the owner
     */
    function withdrawFunds() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrieve memos from the blockchain
     */
    function getNotes() public view returns (Note[] memory) {
        return notes;
    }
}
