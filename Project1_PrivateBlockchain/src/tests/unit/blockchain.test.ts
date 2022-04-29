import {IBlockchain} from "../../models/blockchain.model";
import {IBlock} from "../../models/block.model";
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
});