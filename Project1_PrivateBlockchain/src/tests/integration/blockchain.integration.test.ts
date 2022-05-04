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

    test("submitStar not valid test", () => {
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
            return false;
        });

        return blockchain.initializeChain()
            .then(async initializedChain => {

                let message: string = await initializedChain.requestMessageOwnershipVerification(address);

                expect(message).toContain(address);
                let messageTime: number = parseInt(message.split(':')[1]);
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
                expect(messageTime).toBeCloseTo(currentTime, 1);
                return expect(initializedChain.submitStar(address, message, signature, star))
                    .rejects.toBeDefined();
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

    test("submitStar and validateChain null height test", () => {
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

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                //set chain height to null
                let hash: string|null|undefined = nextBlock.getHash();
                expect(hash).toBeDefined();
                await initializedChain.getBlockByHash(<string>hash)
                    .then(b => {
                        expect(b).toBeDefined();
                        expect(b?.getHeight()).toBeDefined();
                        expect(b?.getHeight()).toBe(1);
                        let cast: any = <any>b;
                        cast.height = null;
                        expect(b?.getHeight()).toBeNull();
                    });

                return expect(initializedChain.validateChain()).resolves.toHaveLength(1);
            });
    });

    test("submitStar and validateChain null genesis block test", () => {
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

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                //set chain height to null
                let height: number|null|undefined = nextBlock.getHeight();
                expect(height).toBeDefined();
                expect(height).toBe(1);
                await initializedChain.getBlockByHeight((<number>height) - 1)
                    .then(previousBlock => {
                        expect(previousBlock).toBeDefined();
                        expect(previousBlock?.getHeight()).toBeDefined();
                        expect(previousBlock?.getHeight()).toBe(0);
                    });

                let castedChain: any = <any>initializedChain;
                castedChain.chain[0] = null;
                await initializedChain.getBlockByHeight((<number>height) - 1)
                    .then(previousBlock => {
                        expect(previousBlock).not.toBeDefined();
                    });

                return expect(initializedChain.validateChain()).resolves.toHaveLength(2);
            });
    });

    test("submitStar and validateChain null block test", () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';

        let signature: string = "mockSig";
        let star1: any = {
            starName: "test1"
        }
        let star2: any = {
            starName: "test2"
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

                let nextBlock1: IBlock = await initializedChain.submitStar(address, message, signature, star1);
                expect(nextBlock1).toBeDefined();

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                let nextBlock2: IBlock = await initializedChain.submitStar(address, message, signature, star2);
                expect(nextBlock2).toBeDefined();

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                //set chain height to null
                let height2: number|null|undefined = nextBlock2.getHeight();
                expect(height2).toBeDefined();
                expect(height2).toBe(2);
                await initializedChain.getBlockByHeight((<number>height2) - 1)
                    .then(previousBlock => {
                        expect(previousBlock).toBeDefined();
                        expect(previousBlock?.getHeight()).toBeDefined();
                        expect(previousBlock?.getHeight()).toBe(1);
                    });

                await expect(initializedChain.getChainHeight()).resolves.toBe(2);

                let castedChain: any = <any>initializedChain;
                castedChain.chain[1] = null;
                await initializedChain.getBlockByHeight((<number>height2) - 1)
                    .then(previousBlock => {
                        expect(previousBlock).not.toBeDefined();
                    });

                return expect(initializedChain.validateChain()).resolves.toHaveLength(2);
            });
    });

    test("submitStar and validateChain tampered block test", () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';

        let signature: string = "mockSig";
        let star1: any = {
            starName: "test1"
        }
        let star2: any = {
            starName: "test2"
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

                let nextBlock1: IBlock = await initializedChain.submitStar(address, message, signature, star1);
                expect(nextBlock1).toBeDefined();

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                let nextBlock2: IBlock = await initializedChain.submitStar(address, message, signature, star2);
                expect(nextBlock2).toBeDefined();

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                //set chain height to null
                let height2: number|null|undefined = nextBlock2.getHeight();
                expect(height2).toBeDefined();
                expect(height2).toBe(2);
                await initializedChain.getBlockByHeight((<number>height2) - 1)
                    .then(previousBlock => {
                        expect(previousBlock).toBeDefined();
                        expect(previousBlock?.getHeight()).toBeDefined();
                        expect(previousBlock?.getHeight()).toBe(1);
                    });

                await expect(initializedChain.getChainHeight()).resolves.toBe(2);

                let castedChain: any = <any>initializedChain;
                castedChain.chain[1].hash = "tampered";

                return expect(initializedChain.validateChain()).resolves.toHaveLength(1);
            });
    });

    test("submitStar and validateChain null block hash test", () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';

        let signature: string = "mockSig";
        let star1: any = {
            starName: "test1"
        }
        let star2: any = {
            starName: "test2"
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

                let nextBlock1: IBlock = await initializedChain.submitStar(address, message, signature, star1);
                expect(nextBlock1).toBeDefined();
                let height1: number|null|undefined = nextBlock1.getHeight();
                expect(height1).toBeDefined();
                expect(height1).toBe(1);

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                let nextBlock2: IBlock = await initializedChain.submitStar(address, message, signature, star2);
                expect(nextBlock2).toBeDefined();

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                //set chain height to null
                let height2: number|null|undefined = nextBlock2.getHeight();
                expect(height2).toBeDefined();
                expect(height2).toBe(2);
                await initializedChain.getBlockByHeight((<number>height2) - 1)
                    .then(previousBlock => {
                        expect(previousBlock).toBeDefined();
                        expect(previousBlock?.getHeight()).toBeDefined();
                        expect(previousBlock?.getHeight()).toBe(1);
                    });

                await expect(initializedChain.getChainHeight()).resolves.toBe(2);

                let castedChain: any = <any>initializedChain;
                castedChain.chain[1].previousBlockHash = null;
                await initializedChain.getBlockByHeight(<number>height1)
                    .then(b => {
                        expect(b?.getPreviousBlockHash()).toBeNull();
                    });

                return expect(initializedChain.validateChain()).resolves.toHaveLength(2);
            });
    });

    test("submitStar and validateChain tampered block hash test", () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';

        let signature: string = "mockSig";
        let star1: any = {
            starName: "test1"
        }
        let star2: any = {
            starName: "test2"
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

                let nextBlock1: IBlock = await initializedChain.submitStar(address, message, signature, star1);
                expect(nextBlock1).toBeDefined();
                let height1: number|null|undefined = nextBlock1.getHeight();
                expect(height1).toBeDefined();
                expect(height1).toBe(1);

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                let nextBlock2: IBlock = await initializedChain.submitStar(address, message, signature, star2);
                expect(nextBlock2).toBeDefined();

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                //tamper with chain hash
                let height2: number|null|undefined = nextBlock2.getHeight();
                expect(height2).toBeDefined();
                expect(height2).toBe(2);
                await initializedChain.getBlockByHeight((<number>height2) - 1)
                    .then(previousBlock => {
                        expect(previousBlock).toBeDefined();
                        expect(previousBlock?.getHeight()).toBeDefined();
                        expect(previousBlock?.getHeight()).toBe(1);
                    });

                await expect(initializedChain.getChainHeight()).resolves.toBe(2);

                let castedChain: any = <any>initializedChain;
                castedChain.chain[1].previousBlockHash = "MODIFIED";
                await initializedChain.getBlockByHeight(<number>height1)
                    .then(b => {
                        expect(b?.getPreviousBlockHash()).toBe("MODIFIED");
                    });

                return expect(initializedChain.validateChain()).resolves.toHaveLength(1);
            });
    });

    test("getStarsByWalletAddress test", () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';

        let signature: string = "mockSig";
        let star1: any = {
            starName: "test1"
        }
        let star2: any = {
            starName: "test2"
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

                let nextBlock1: IBlock = await initializedChain.submitStar(address, message, signature, star1);
                expect(nextBlock1).toBeDefined();
                let height1: number|null|undefined = nextBlock1.getHeight();
                expect(height1).toBeDefined();
                expect(height1).toBe(1);

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                let nextBlock2: IBlock = await initializedChain.submitStar(address, message, signature, star2);
                expect(nextBlock2).toBeDefined();

                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);
                await expect(initializedChain.getChainHeight()).resolves.toBe(2);
                return initializedChain.getStarsByWalletAddress(address)
                    .then((stars: Array<any>) => {
                        expect(stars).toBeDefined();
                        expect(stars).toHaveLength(2);


                    });
            });
    });

    test("getStarsByWalletAddress multiple address test", () => {
        let blockchain: IBlockchain = new BlockchainClass.Blockchain();
        let address1: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
        let address2: string = 'address2';

        let signature: string = "mockSig";
        let star1: any = {
            starName: "test1"
        }
        let star2: any = {
            starName: "test2"
        }
        let star3: any = {
            starName: "test3"
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

                let message1: string = await initializedChain.requestMessageOwnershipVerification(address1);
                let message2: string = await initializedChain.requestMessageOwnershipVerification(address2);

                expect(message1).toContain(address1);
                expect(message2).toContain(address2);
                let messageTime1: number = parseInt(message1.split(':')[1]);
                let messageTime2: number = parseInt(message2.split(':')[1]);
                let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
                expect(messageTime1).toBeCloseTo(currentTime, 1);
                expect(messageTime2).toBeCloseTo(currentTime, 1);

                let nextBlock1: IBlock = await initializedChain.submitStar(address1, message1, signature, star1);
                expect(nextBlock1).toBeDefined();
                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                let nextBlock2: IBlock = await initializedChain.submitStar(address1, message1, signature, star2);
                expect(nextBlock2).toBeDefined();
                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                let nextBlock3: IBlock = await initializedChain.submitStar(address2, message2, signature, star3);
                expect(nextBlock3).toBeDefined();
                await expect(initializedChain.validateChain()).resolves.toHaveLength(0);

                await expect(initializedChain.getChainHeight()).resolves.toBe(3);
                await initializedChain.getStarsByWalletAddress(address1)
                    .then((stars: Array<any>) => {
                        expect(stars).toBeDefined();
                        expect(stars).toHaveLength(2);
                    });
                return initializedChain.getStarsByWalletAddress(address2)
                    .then((stars: Array<any>) => {
                        expect(stars).toBeDefined();
                        expect(stars).toHaveLength(1);
                    });
            });
    });
});