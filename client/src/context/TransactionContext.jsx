import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () => {
  // A Provider (in ethers) is a class which provides an abstraction for a connection to the Ethereum Network. 
  // It provides read-only access to the Blockchain and its status.
  // A Web3Provider wraps a standard Web3 provider, which is what MetaMask injects as window.ethereum into each page
  const provider = new ethers.providers.Web3Provider(ethereum);
  // A Signer is a class which (usually) in some way directly or indirectly has access to a private key, 
  // which can sign messages and transactions to authorize the network to charge your account ether to perform operations.
  const signer = provider.getSigner();
  // A Contract is an abstraction which represents a connection to a specific contract on the Ethereum Network, 
  //so that applications can use it like a normal JavaScript object.
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionContract;
};

export const TransactionProvider = ({children}) => {
  const[currentAccount, setCurrentAccount] = useState('');
  const[walletBalance, setWalletBalance] = useState('');
  const[formData, setFormData] = useState({addressTo: '', amount: '', keyword:'', message:''});
  const[isLoading, setIsLoading] = useState(false);
  const[transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  const[transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({...prevState, [name]: e.target.value}));
  };

  const getAllTransactions = async() => {
    try {
      if(!ethereum) return alert("Please install MetaMask!");
      // Get the contract and all available transactions
      const transactionContract = getEthereumContract();
      const availableTransactions = await transactionContract.getAllTransactions();

      // Formatting the available transactions
      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }))
      // Log the array of transactions
      console.log(structuredTransactions);
      setTransactions(structuredTransactions);
    } catch (error) { console.log(error); }
  };

  const checkWalletConnected = async() => {
    try {
      if(!ethereum) return alert("Please install MetaMask!");
      // Get the eth account
      const accounts = await ethereum.request({method: 'eth_accounts'});
      // If an account exists, set the current account and get all transactions
      if(accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
        //console.log("Current account:" + accounts[0]);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const balance = await provider.getBalance(accounts[0]);
        const parsedBalance = ethers.utils.formatEther(balance);
        setWalletBalance(parsedBalance);
        console.log(parsedBalance);

      } else { console.log("No accounts found.")}
    } catch(error) {
      console.log(error);
      throw new Error("No Ethereum object.");
    }
  };

  const checkTransactionsExist = async() => {
    try {
        if(ethereum) {
          const transactionContract = getEthereumContract();
          const transactionCount = await transactionContract.getTransactionCount();
          // Set the number of transactions in local storage
          window.localStorage.setItem('transactionCount', transactionCount);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object.");
    }
  };

  const connectWallet = async() => {
    try {
      if(!ethereum) return alert("Please install MetaMask!");
      // Get available account and set it as the current account
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      setCurrentAccount(accounts[0]);
    } catch(error) {
        console.log(error);
        throw new Error("No Ethereum object.");
    }
  };

  const sendTransaction = async() => {
    try {
      if(!ethereum) return alert("Please install MetaMask!");

      // Get the data from the form and set the contract
      const {addressTo, amount, keyword, message} = formData;
      const transactionContract = getEthereumContract();
      // Converts decimal amount into GWEI hexadecimal amoint
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208', // 21000 GWEI == 0.000021 ETH
          value: parsedAmount._hex
        }]
      });

      // Store transaction to the blockcgain
      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);

      // Wait for the transaction to go through
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      // Get the number of transactions
      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
      // Reload once compleated
      window.reload();
    } catch(error) {
        console.log(error);
        throw new Error("No Ethereum object.");
    }
  };

  useEffect(() => {
    checkWalletConnected();
    checkTransactionsExist();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider value={{connectWallet, currentAccount, walletBalance, formData, handleChange, sendTransaction, transactions, isLoading}}>
      {children}
    </TransactionContext.Provider>
  );
};
