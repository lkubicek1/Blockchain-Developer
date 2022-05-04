/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message`
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *
 */
import {IBlock} from "./block.model";
import {StarCoin} from "./star.model";

const BlockClass = require('./block.model');

export interface IBlockchain {
    initializeChain(): Promise<IBlockchain>;
    getChainHeight(): Promise<number>;
    requestMessageOwnershipVerification(address: string): Promise<string>;
    submitStar(address: string, message: string|undefined|null, signature: string|undefined|null, star: any): Promise<IBlock>;
    getBlockByHash(hash: string): Promise<IBlock|undefined|null>;
    getBlockByHeight(height: number): Promise<IBlock|undefined|null>;
    getStarsByWalletAddress (address: string): Promise<Array<any>>;
    validateChain(): Promise<any>;
}

class Blockchain implements IBlockchain {

    chain: Array<IBlock>;

    /**
     * Constructor of the class, you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     * Also everytime you create a Blockchain class you will need to initialized the chain creating
     * the Genesis Block.
     * The methods in this class will always return a Promise to allow client applications or
     * other backends to call asynchronous functions.
     */
    constructor() {
        this.chain = [];
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     * You should use the `addBlock(block)` to create the Genesis Block
     * Passing as a data `{data: 'Genesis Block'}`
     */
    async initializeChain(): Promise<IBlockchain> {
        return this.getChainHeight()
            .then(async height => {
                if (height === -1) {
                    let block: IBlock = new BlockClass.Block({data: BlockClass.GENESIS_BLOCK});
                    await this._addBlock(block);
                }
                let self = this;
                return new Promise<IBlockchain>(resolve => resolve(self));
            });
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight(): Promise<number> {
        return new Promise((resolve, reject) => {
            resolve(this.chain.length - 1);
        });
    }

    /**
     * _addBlock(data) will store a block in the chain
     * @param {*} block
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to
     * create the `block hash` and push the block into the chain array. Don't for get
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention
     * that this method is a private method.
     */
    _addBlock(block: IBlock): Promise<IBlock> {
        let self = this;
        return new Promise(async resolve => {
            return self.getChainHeight()
                .then(height => {
                    return self.getBlockByHeight(height)
                        .then(previousBlock => {
                            const previousBlockHash = previousBlock?.getHash();
                            return block.init(height + 1, previousBlockHash)
                                .then(nextBlock => {
                                    self.chain.push(nextBlock);
                                    resolve(block);
                                });
                        });
                });
        });
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address
     */
    requestMessageOwnershipVerification(address: string): Promise<string> {
        return new Promise((resolve) => {
            resolve(`${address}:${new Date().getTime().toString().slice(0,-3)}:starRegistry`)
        });
    }

    /**
     * The submitStar(address: string, message: string, signature: string, star: any) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Verify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address
     * @param {*} message
     * @param {*} signature
     * @param {*} star
     */
    submitStar(address: string, message: string|undefined|null, signature: string|undefined|null, star: any): Promise<IBlock> {
        let self = this;

        const starCoin: StarCoin = new StarCoin(address, message, signature, star);
        return new Promise(async (resolve, reject) => {
            if(starCoin.getTime() == null) {
                reject(new Error("Null starCoin time.  Unable to submit."));
                return;
            }

            let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
            let elapsedSeconds: number = currentTime - <number>starCoin.getTime();
            if(elapsedSeconds > (5 * 60)) {
                reject(new Error(`Elapsed Time ${elapsedSeconds} is greater than 5 minutes.  Unable to submit`));
                return;
            }

            try {
                let verified: boolean = starCoin.verify();
                let block: IBlock = new BlockClass.Block(starCoin.toDataObject());
                if(verified) {
                    resolve(await self._addBlock(block));
                } else reject(block);
            } catch (err) {
                reject(new Error("Verification failure: " + err));
            }

        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash
     */
    getBlockByHash(hash: string): Promise<IBlock|undefined|null> {
        let self = this;
        return new Promise(resolve => {
            let block: IBlock|undefined = self.chain.find(b => b.getHash() === hash);
            resolve(block);
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object
     * with the height equal to the parameter `height`
     * @param {*} height
     */
    getBlockByHeight(height: number): Promise<IBlock|undefined|null> {
        let self = this;
        return new Promise(resolve => {
            let block: IBlock|undefined = self.chain
                .filter(p => p !== null)
                .find(p => p.getHeight() === height);
            resolve(block)
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain
     * and are belongs to the owner with the wallet address passed as parameter.
     * Remember the star should be returned decoded.
     * @param {*} address
     */

    //Reference: https://knowledge.udacity.com/questions/282668

    getStarsByWalletAddress (address: string): Promise<Array<any>> {
        let self = this;
        return new Promise(resolve => {
            let stars: Array<any> = [];
            self.chain
                .filter(b => b !== null)
                .filter(b => b.getHeight() !== null && b.getHeight() !== 0)
                .map(b => b.getBData())
                .forEach(data => {
                    data.then(d => {
                        if (d.hasOwnProperty("address")) {
                            if(d.address === address) stars.push(d);
                        }
                    });
                });
            resolve(stars);
        });
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */
    validateChain(): Promise<Array<IBlock>> {
        let self = this;
        return new Promise<Array<IBlock>>(resolve => {
            let errorLog: Array<IBlock> = [];
            self.chain.forEach(async b => {
                if(b === null) {
                    errorLog.push(b);
                    return;
                }

                if (b.getHeight() === 0) { //Genesis Block
                    if(!await b.validate()) errorLog.push(b);
                    return;
                }

                let blockHeight = b.getHeight();
                if (blockHeight == null) {
                    errorLog.push(b);
                    return;
                }

                let previousBlock: IBlock|undefined|null = await self.getBlockByHeight(<number>blockHeight - 1);
                if (previousBlock == null) {
                    errorLog.push(b);
                    return;
                }
                if (previousBlock.getHeight() !== 0) {
                    if (previousBlock.getPreviousBlockHash() == null) {
                        errorLog.push(b);
                        return;
                    }
                }

                if (b.getPreviousBlockHash() == null) {
                    errorLog.push(b);
                    return;
                }
                if (previousBlock.getHash() !== b.getPreviousBlockHash()) { //Broken Chain
                    errorLog.push(b);
                    return;
                }

                let isValid: boolean = await b.validate();
                if(!isValid) errorLog.push(b);
            });
            resolve(errorLog);
        });
    }
}

module.exports.Blockchain = Blockchain;