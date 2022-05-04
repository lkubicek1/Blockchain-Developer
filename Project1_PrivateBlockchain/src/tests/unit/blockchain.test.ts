import {IBlockchain} from "../../models/blockchain.model";
import {IBlock} from "../../models/block.model";
import {StarCoin} from "../../models/star.model";


const BlockClass = require('../../models/block.model');
const BlockchainClass = require('../../models/blockchain.model');

describe('Blockchain Class', () => {
    test('Blockchain class constructor test', () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        expect(blockchain).toBeDefined();
        return  blockchain.getChainHeight()
            .then(chainHeight => {
                expect(chainHeight).toBe(-1);
            })
    });

    test('Initialize chain test', () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        return blockchain.initializeChain()
            .then(initializedChain => {
                expect(initializedChain).toBeDefined();
                initializedChain.getChainHeight()
                    .then(chainHeight => {
                        expect(chainHeight).toBe(0);
                    });
            });
    });

    test('Get genesis block test', () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        return blockchain.initializeChain()
            .then(async initializedChain => {
                expect(initializedChain).toBeDefined();
                let block: IBlock | undefined | null = await initializedChain.getBlockByHeight(0);
                expect(block).toBeDefined();
                return expect(block?.getBData()).rejects.toEqual(Error(BlockClass.GENESIS_BLOCK));
            });
    });

    test('Get genesis block by hash test', () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        return blockchain.initializeChain()
            .then(async initializedChain => {
                expect(initializedChain).toBeDefined();
                let genesis: IBlock | undefined | null = await initializedChain.getBlockByHeight(0);
                expect(genesis).toBeDefined();
                expect(genesis?.getHash()).toBeDefined();
                let hash: string = <string>genesis?.getHash();
                let block: IBlock | undefined | null = await initializedChain.getBlockByHash(hash);
                expect(block).toBeDefined();
                return expect(block?.getBData()).rejects.toEqual(Error(BlockClass.GENESIS_BLOCK));
            });
    });

    test('Validate empty chain test', () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        return blockchain.initializeChain()
            .then(initializedChain => {
                return expect(initializedChain.validateChain()).resolves.toHaveLength(0);
            });
    });

    test('Validate empty chain invalid genesis block test', () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        return blockchain.initializeChain()
            .then(initializedChain => {
                let castedChain: any = <any>initializedChain;
                return Promise.resolve(castedChain.chain[0])
                    .then(b => {
                        b.body = { data: 'Tampered with' };
                        expect(b.validate()).resolves.toEqual(false);
                        return expect(initializedChain.validateChain()).resolves.toHaveLength(1);
                    })
            });
    });

    test('Request ownership test', () => {
       let blockchain: IBlockchain = new BlockchainClass.Blockchain();
       let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
       return blockchain.requestMessageOwnershipVerification(address)
           .then(message => {
               expect(message).toContain(address);
               let messageTime: number = parseInt(message.split(':')[1]);
               let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
               expect(messageTime).toBeCloseTo(currentTime, 1);
           });
    });

    test('Submit star null message test', () => {

        let blockchain: IBlockchain = new BlockchainClass.Blockchain();

        return blockchain.initializeChain()
            .then(async initializedChain => {

                let address = "stub";
                let message = undefined;
                let signature = "stub";
                let star = {};

                return expect(initializedChain.submitStar(address, message, signature, star))
                    .rejects.toBeDefined()
                    .then(() => {
                        return expect(initializedChain.validateChain()).resolves.toHaveLength(0);
                    });
            });
    });

    test('Submit star elapsed time test', () => {

        let blockchain: IBlockchain = new BlockchainClass.Blockchain();

        return blockchain.initializeChain()
            .then(async initializedChain => {

                let address = "stub";
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
                let tooLongAgo = currentTime - (60*6);
                let message = `stub:${tooLongAgo}:stub`;
                let signature = "stub";
                let star = {};

                return expect(initializedChain.submitStar(address, message, signature, star))
                    .rejects.toBeDefined()
                    .then(() => {
                        return expect(initializedChain.validateChain()).resolves.toHaveLength(0);
                    });

            });
    });

    test('Submit star null message test', () => {

        let blockchain: IBlockchain = new BlockchainClass.Blockchain();

        return blockchain.initializeChain()
            .then(async initializedChain => {

                let address = "stub";
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
                let signature = "stub";
                let message = `${address}:${currentTime}:${signature}`;
                let star = {};

                const mockVerify = jest.spyOn(StarCoin.prototype, 'verify');
                mockVerify.mockImplementation(() => {
                    throw new Error("Mock exception");
                });

                return expect(initializedChain.submitStar(address, message, signature, star))
                    .rejects.toBeDefined()
                    .then(() => {
                        jest.resetAllMocks();
                        return expect(initializedChain.validateChain()).resolves.toHaveLength(0);
                    });

            });
    });
});