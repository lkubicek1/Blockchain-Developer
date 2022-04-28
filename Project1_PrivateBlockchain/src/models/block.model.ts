/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform,
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 *  All the exposed methods should return a Promise to allow all the methods
 *  run asynchronous.
 */

const hex2ascii = require('hex2ascii');
const sha256 = require('crypto-js/sha256');

const GENESIS_BLOCK: string = 'Genesis Block';

export interface IBlock {
    init(): Promise<IBlock>;
    validate(): Promise<boolean>;
    getBData(): Promise<any>;
    getHeight(): number;
}

class Block implements IBlock {
    hash?: string;              // Hash of the block
    height: number;             // Block Height (consecutive number of each block)
    body: string;               // Will contain the transactions stored in the block, by default it will encode the data
    time: string;               // Timestamp for the Block creation
    previousBlockHash?: string;  // Reference to the previous Block Hash


    // Constructor - argument data will be the object containing the transaction data
    constructor(data: any, height: number, previousBlockHash: string){
        this.height = height;
        this.body = Buffer.from(JSON.stringify(data)).toString('hex');
        this.time = new Date().getTime().toString().slice(0,-3);
        this.previousBlockHash = previousBlockHash;
    }

    init(): Promise<IBlock> {
        let self = this;
        return new Promise<IBlock>(resolve => {
            self.hash = sha256(JSON.stringify(self.getBlockObject())).toString();
            resolve(self);
        });
    };

    /**
     *  validate() method will validate if the block has been tampered or not.
     *  Been tampered means that someone from outside the application tried to change
     *  values in the block data as a consequence the hash of the block should be different.
     *  Steps:
     *  1. Return a new promise to allow the method be called asynchronous.
     *  2. Save the in auxiliary variable the current hash of the block (`this` represent the block object)
     *  3. Recalculate the hash of the entire block (Use SHA256 from crypto-js library)
     *  4. Compare if the auxiliary hash value is different from the calculated one.
     *  5. Resolve true or false depending on if it is valid or not.
     *  Note: to access the class values inside a Promise code you need to create an auxiliary value `let self = this;`
     */
    validate(): Promise<boolean> {
        let self = this;
        return new Promise<boolean>(resolve => {
            const calculatedHash = sha256(JSON.stringify(self.getBlockObject())).toString();
            resolve(self.hash == calculatedHash);
        });
    }

    /**
     *  Auxiliary Method to return the block body (decoding the data)
     *  Steps:
     *
     *  1. Use hex2ascii module to decode the data
     *  2. Because data is a javascript object use JSON.parse(string) to get the Javascript Object
     *  3. Resolve with the data and make sure that you don't need to return the data for the `genesis block`
     *     or Reject with an error.
     */
    getBData(): Promise<any> {
        return new Promise((resolve, reject) => {
            const decodedBody: any = JSON.parse(hex2ascii(this.body));
            if(decodedBody.data == GENESIS_BLOCK) {
                reject(Error(GENESIS_BLOCK));
            } else {
                resolve(decodedBody);
            }
        });
    }

    getHeight(): number {
        return this.height;
    }

    //Helper function for hash calculation
    getBlockObject(): any {
        return {
            height: this.height,
            body: this.body,
            time: this.time,
            previousBlockHash: this.previousBlockHash
        };
    }
}

module.exports.Block = Block;                                                       // Exposing the Block class as a module
module.exports.GENESIS_BLOCK = GENESIS_BLOCK;
