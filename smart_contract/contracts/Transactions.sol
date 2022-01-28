// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
  // Number of transactions
  uint256 transactionCount;

  event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

  // These are the properties the Transfer needs to have
  struct TransferStruct {
    address sender;
    address receiver;
    uint amount;
    string message;
    uint256 timestamp;
    string keyword;
  }

  // Array of objects
  TransferStruct[] transactions;

  function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
    // Adding the transaction to the list of all transactions
    transactionCount+=1;
    transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

    // Emit the event
    emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);

  }

  function getAllTransactions() public view returns(TransferStruct[] memory) {
    return transactions;
  }

  function getTransactionCount() public view returns(uint256) {
    return transactionCount;
  }
}
