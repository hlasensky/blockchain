import Blockchain from "./blockchain.js";

const bitcoin = new Blockchain();
const bc1 = {
    "chain": [
    {
    "index": 1,
    "timestamp": 1614098177646,
    "transaction": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1614098206027,
    "transaction": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timestamp": 1614098259238,
    "transaction": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "409dc1d075f511ebbcb80dc46e3914cb",
    "transactionId": "51a5588075f511ebbcb80dc46e3914cb"
    },
    {
    "amount": 3000,
    "sender": "fggjgjgjgjgjgjj",
    "recipient": "tuztutzutzututututuzt",
    "transactionId": "63e5211075f511ebbcb80dc46e3914cb"
    },
    {
    "amount": 500,
    "sender": "fggjgjgjgjgjgjj",
    "recipient": "tuztutzutzututututuzt",
    "transactionId": "6909332075f511ebbcb80dc46e3914cb"
    },
    {
    "amount": 1,
    "sender": "fggjgjgjgjgjgjj",
    "recipient": "tuztutzutzututututuzt",
    "transactionId": "6bdc776075f511ebbcb80dc46e3914cb"
    }
    ],
    "nonce": 40438,
    "hash": "0000e5fc485a2d099797a915966f08c9a3a9e65d0b655cb6b5b0a23c2936212b",
    "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timestamp": 1614098309512,
    "transaction": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "409dc1d075f511ebbcb80dc46e3914cb",
    "transactionId": "714078a075f511ebbcb80dc46e3914cb"
    },
    {
    "amount": 12,
    "sender": "fggjgjgjgjgjgjj",
    "recipient": "tuztutzutzututututuzt",
    "transactionId": "8108636075f511ebbcb80dc46e3914cb"
    },
    {
    "amount": 124,
    "sender": "fggjgjgjgjgjgjj",
    "recipient": "tuztutzutzututututuzt",
    "transactionId": "82fb80d075f511ebbcb80dc46e3914cb"
    },
    {
    "amount": 96,
    "sender": "fggjgjgjgjgjgjj",
    "recipient": "tuztutzutzututututuzt",
    "transactionId": "85205ca075f511ebbcb80dc46e3914cb"
    },
    {
    "amount": 69,
    "sender": "fggjgjgjgjgjgjj",
    "recipient": "tuztutzutzututututuzt",
    "transactionId": "87486cc075f511ebbcb80dc46e3914cb"
    },
    {
    "amount": 699,
    "sender": "fggjgjgjgjgjgjj",
    "recipient": "tuztutzutzututututuzt",
    "transactionId": "8990fd3075f511ebbcb80dc46e3914cb"
    }
    ],
    "nonce": 233490,
    "hash": "000085c05127fee218672b2219673f5d1080302713a57e05d0237d06f980cdc9",
    "previousBlockHash": "0000e5fc485a2d099797a915966f08c9a3a9e65d0b655cb6b5b0a23c2936212b"
    },
    {
    "index": 5,
    "timestamp": 1614098336435,
    "transaction": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "409dc1d075f511ebbcb80dc46e3914cb",
    "transactionId": "8f37d3d075f511ebbcb80dc46e3914cb"
    }
    ],
    "nonce": 52134,
    "hash": "0000aed37eba57882071b01ed4a47270cc9dc771f4eb40cb949b40f58562330b",
    "previousBlockHash": "000085c05127fee218672b2219673f5d1080302713a57e05d0237d06f980cdc9"
    },
    {
    "index": 6,
    "timestamp": 1614098340390,
    "transaction": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "409dc1d075f511ebbcb80dc46e3914cb",
    "transactionId": "9f43a56075f511ebbcb80dc46e3914cb"
    }
    ],
    "nonce": 69914,
    "hash": "0000790e30f1269a4e53263b72241b61d29235d34e434a0d25c037ba1b9d04e2",
    "previousBlockHash": "0000aed37eba57882071b01ed4a47270cc9dc771f4eb40cb949b40f58562330b"
    }
    ],
    "pendingTransaction": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "409dc1d075f511ebbcb80dc46e3914cb",
    "transactionId": "a19f6fb075f511ebbcb80dc46e3914cb"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
};



console.log(bitcoin.chainIsValid(bc1.chain));

