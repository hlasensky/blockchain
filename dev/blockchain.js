import sha256 from "sha256";
import { v1 as uuidv1 } from 'uuid';


const currentNodeUrl = process.argv[3];

class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransaction = [];

        this.currentNodeUrl = currentNodeUrl;
        this.networkNodes = [];

        this.createNewBlock(100, "0", "0");
    }

    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transaction: this.pendingTransaction,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash
        };

        this.pendingTransaction = [];
        this.chain.push(newBlock);

        return newBlock;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    createNewTransaction(amount, sender, recipient) {
        const newTransaction = {
            amount: amount,
            sender: sender,
            recipient: recipient,
            transactionId: uuidv1().split("-").join("")
        };


        return newTransaction;
    }

    addTransactionToPendingTransactions(transactionObj) {
        this.pendingTransaction.push(transactionObj);

        return this.getLastBlock()["index"] + 1; 
    }

    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataAsString = previousBlockHash + String(nonce) + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);

        return hash
    }
    
    proofOfWork(previousBlocHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlocHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== "0000") {
            nonce++;
            hash = this.hashBlock(previousBlocHash, currentBlockData, nonce);
        }
        
        return nonce;
    }

    chainIsValid(blockchain) {
        let validChain = true;

        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const prevBlock = blockchain[i - 1];
            const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transaction'], index: currentBlock['index'] }, currentBlock['nonce']);
            if (blockHash.substring(0, 4) !== '0000') validChain = false;
            if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
        };
    
        const genesisBlock = blockchain[0];
        const correctNonce = genesisBlock['nonce'] === 100;
        const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
        const correctHash = genesisBlock['hash'] === '0';
        const correctTransactions = genesisBlock['transaction'].length === 0;
    
        if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;
    
        return validChain;
    };


    getBlock(blockHash) {
        let correctBlock = null;
        this.chain.forEach(block => {
            if (block.hash === blockHash) correctBlock = block;
        });
        return correctBlock
    };


    getTransaction(transactionId) {
        let correctTransactions = null;
        let correctBlock = null;
        this.chain.forEach(block => {
            block.transaction.forEach(transaction => {
                if (transaction.transactionId === transactionId) {
                    correctTransactions = transaction;
                    correctBlock = block;
                };
            });
        });

        return {
            transaction: correctTransactions,
            block: correctBlock
        };
    };


    getAddressData(address) {
        const addressTransactions = [];
        this.chain.forEach(block => {
            block.transaction.forEach(transaction => {
                if (transaction.sender === address || transaction.recipient === address) {
                    addressTransactions.push(transaction);
                };
            });
        });
        let balance = 0;
        addressTransactions.forEach(transaction => {
            if (transaction.recipient === address) balance += transaction.amount;
            else if (transaction.sender === address) balance -= transaction.amount;
        });
        return {
            addressTransactions: addressTransactions,
            addressBalance: balance
        }
    };
}




export default Blockchain;