import {IBlock} from "../../models/block.model";
const BlockClass = require('../../models/block.model');


describe("Block Class", () => {
    test("Block class constructor test", () => {
        let block: IBlock = new BlockClass.Block({data: BlockClass.GENESIS_BLOCK});
        expect(block).toBeDefined();
    });

    test("Block class height 0 test", () => {
        let block: IBlock = new BlockClass.Block({data: BlockClass.GENESIS_BLOCK});
        return block.init(0, null)
            .then(b => expect(b.getHeight()).toBe(0));
    });

    test("Block class height 1 test", () => {
        let block: IBlock = new BlockClass.Block({data: BlockClass.GENESIS_BLOCK});
        return block.init(1, null)
            .then(b => expect(b.getHeight()).toBe(1));
    });

    test("Block class getBData test", () => {
        let testData: any = { data: 'Test Block' };
        let block: IBlock = new BlockClass.Block(testData);
        return block.getBData().then(data => {
            expect(data).toStrictEqual(testData);
        });
    });

    test("Block class getBData Genesis Block test", () => {
        let testData: any = { data: BlockClass.GENESIS_BLOCK };
        let block: IBlock = new BlockClass.Block(testData);
        return expect(block.getBData()).rejects.toEqual(Error(BlockClass.GENESIS_BLOCK));
    });

    test("Block class validate test", () => {
        let testData: any = { data: 'Test Block' };
        let block: IBlock = new BlockClass.Block(testData);
        return block.init(0, null)
            .then(b => {
                expect(b.validate()).resolves.toEqual(true);
            })
    });

    test("Block class validate tampered test", () => {
        let testData: any = { data: 'Test Block' };
        let block = new BlockClass.Block(testData);
        return block.init(0, null)
            .then((b: { body: { data: string; }; validate: () => any; }) => {
                b.body = { data: 'Tampered with' };
                expect(b.validate()).resolves.toEqual(false);
            });
    });

});