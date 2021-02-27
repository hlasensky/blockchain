import express from 'express'
const app = express()
import bodyParser from "body-parser"
import Blockchain from "./blockchain.js"
import { v1 as uuidv1 } from 'uuid';
import rp from "request-promise"


const port = process.argv[2];

const nodeAddress = uuidv1().split("-").join("");

const bitcoin = new Blockchain();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/blockchain", (req, res) => {
    res.send(bitcoin);
});

app.post("/transaction", (req, res) => {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}!` })
});

app.post("/transaction/brodcast", (req, res) => {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + "/transaction",
            method: "POST",
            body: { newTransaction: newTransaction },
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: "Transaction created and brodcast successfully!" })
    })
});


app.get("/mine", (req, res) => {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlocHash = lastBlock["hash"];
    const currentBlockData = {
        transactions: bitcoin.pendingTransaction,
        index: lastBlock["index"] + 1
    };

    const nonce = bitcoin.proofOfWork(previousBlocHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlocHash, currentBlockData, nonce); 
    const newBlock = bitcoin.createNewBlock(nonce, previousBlocHash, blockHash);
    
    const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

    Promise.all(requestPromises)
    .then(data => {
        const requestOptions = {
            uri: bitcoin.currentNodeUrl + "/transaction/brodcast",
            method: "POST",
            body: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
            json: true
        };
        return rp(requestOptions);
    })
    .then(data => {
        res.json({
            note: "New block mined and broadcast successfully",
            block: newBlock
        });
    });
 });

app.post('/receive-new-block', function(req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash; 
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransaction = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});

app.post("/register-and-brodcast-node", (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

    Promise.all(regNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + "/register-nodes-bulk",
            method: "POST",
            body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
            json: true
        };

        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({ note: "New node registered with network successfully!"})
    });
});

app.post("/register-node", (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlredyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlredyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({ note: "New node registered successfully!" });
});

app.post("/register-nodes-bulk", (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlredyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlredyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({ note: "Bulk registration successful!" })
});


app.get("/consensus", (req, res) => {
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};  
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
    .then(blockchains => {
        const currentChainLength = bitcoin.chain.length;
        let maxChainLenght = currentChainLength;
        let newLongestChain = null;
        let newPendingTransaction = null;
        blockchains.forEach(blockchain => {
            if (blockchain.chain.length > maxChainLenght) {
                maxChainLenght = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransaction = blockchains.pendingTransaction;
            };
        });
        if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
            res.json({
                note: "Current chain has not been replaced.",
                chain: bitcoin.chain
            });
        } else {
            bitcoin.chain = newLongestChain;
            bitcoin.pendingTransaction = newPendingTransaction;
            res.json({
                note: "This chain has been replaced.",
                chain: bitcoin.chain
            });
        }
    });
});



app.get("/block/:blockHash", (req, res) => {
    const blockhash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockhash);
    res.json({
        block: correctBlock
    })
});

app.get("/transaction/:transactionId", (req, res) => {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transactions: transactionData.transaction,
        block: transactionData.block
    });
});

app.get("/address/:address", (req, res) => {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    res.json({
        addressData: addressData
    });
});

app.get("/block-explorer", (req, res) => {
    res.sendFile("./block-explorer/index.html", {root: "dev"});
});


app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});