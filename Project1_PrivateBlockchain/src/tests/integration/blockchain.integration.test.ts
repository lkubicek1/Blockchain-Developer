import {IBlockchain} from "../../models/blockchain.model";
import {IBlock} from "../../models/block.model";
const bitcoinMessage = require("bitcoinjs-message");
const BlockchainClass = require('../../models/blockchain.model');

describe('Blockchain Class Integration Tests', () => {
    test("submitStar test", () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';

        let signature: string = "mockSig";
        let star: any = {
            starName: "test"
        }


        const mockVerify = jest.spyOn(bitcoinMessage, 'verify');
        mockVerify.mockImplementation((message,
                                       address,
                                       signature,
                                       messagePrefix?,
                                       checkSegwitAlways? ) => {
            return true;
        });

        return blockchain.initializeChain()
            .then(async initializedChain => {

                let message: string = await initializedChain.requestMessageOwnershipVerification(address);

                expect(message).toContain(address);
                let messageTime: number = parseInt(message.split(':')[1]);
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
                expect(messageTime).toBeCloseTo(currentTime, 1);

                return initializedChain.submitStar(address, message, signature, star)
                    .then(nextBlock => {
                        expect(nextBlock).toBeDefined();
                    });
            });
    });

    test("submitStar and validateChain test", () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';

        let signature: string = "mockSig";
        let star: any = {
            starName: "test"
        }


        const mockVerify = jest.spyOn(bitcoinMessage, 'verify');
        mockVerify.mockImplementation((message,
                                       address,
                                       signature,
                                       messagePrefix?,
                                       checkSegwitAlways? ) => {
            return true;
        });

        return blockchain.initializeChain()
            .then(async initializedChain => {

                let message: string = await initializedChain.requestMessageOwnershipVerification(address);

                expect(message).toContain(address);
                let messageTime: number = parseInt(message.split(':')[1]);
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
                expect(messageTime).toBeCloseTo(currentTime, 1);

                let nextBlock: IBlock = await initializedChain.submitStar(address, message, signature, star);

                expect(nextBlock).toBeDefined();

                return expect(initializedChain.validateChain()).resolves.toHaveLength(0);
            });
    });
});