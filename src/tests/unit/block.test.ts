import {IBlock} from "../../models/block.model";
const BlockClass = require('../../models/block.model');


describe("Block Class", () => {
    test("Block class constructor test", () => {
        let block: IBlock = new BlockClass.Block({data: 'Genesis Block'});
        expect(block).toBeDefined();
    });

    test("Block class height test", () => {
        let block: IBlock = new BlockClass.Block({data: 'Genesis Block'});
        expect(block.getHeight()).toBe(0);
    });

});