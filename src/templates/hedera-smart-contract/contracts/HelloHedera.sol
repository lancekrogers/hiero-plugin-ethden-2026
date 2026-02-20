// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloHedera {
    string private _greeting;

    event GreetingChanged(string oldGreeting, string newGreeting);

    constructor(string memory initialGreeting) {
        _greeting = initialGreeting;
    }

    function greeting() public view returns (string memory) {
        return _greeting;
    }

    function setGreeting(string memory newGreeting) public {
        string memory old = _greeting;
        _greeting = newGreeting;
        emit GreetingChanged(old, newGreeting);
    }
}
