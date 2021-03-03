<h1>Blockchain</h1>
<hr>

This blockchain is a finall project from very good course, that I took.
The course was focused on introduction to this topic.
Course: https://github.com/erictraub/Learn-Blockchain-By-Building-Your-Own-In-JavaScript

To run this blockchian you whut need Postman for making requests, then run command `npm install`, this command will install all needed liblaries.
To start nodes use `npm run node_1` to `npm run node_5`(blockchain will be visible on http://localhost:3001/blockchain to http://localhost:3005/blockchain), after that make request on endpoint `/register-and-broadcast-node` with Postman like this:

![image](https://user-images.githubusercontent.com/43587802/109873332-e3cbdd00-7c6d-11eb-984d-643dd2f5f944.png)

This will connect all the nodes to one network.

If u want to make transaction hit `/transaction/brodcast` endpoint in Postman:

![image](https://user-images.githubusercontent.com/43587802/109873837-9ef47600-7c6e-11eb-9b70-73ad10a98995.png)

To mine a block, hit `http://localhost:PORT/mine` in your browser, it's not important on which node, you hit this endpoint, the network is synchronized, so it will make it automatically

Also you can visit block exprorer by going on `http://localhost:PORT/block-explorer`

![image](https://user-images.githubusercontent.com/43587802/109876138-af5a2000-7c71-11eb-8ca0-7a99f0ee38a1.png)

