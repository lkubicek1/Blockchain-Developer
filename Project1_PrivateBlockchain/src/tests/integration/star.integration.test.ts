
const bitcoinMessage = require('bitcoinjs-message');
import {StarCoin} from "../../models/star.model";

describe("StarCoin Class Integration Tests", () => {
    test("StarCoin verify test", () => {

        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
        let currentTime: string = new Date().getTime().toString().slice(0,-3);
        let message: string = `${address}:${currentTime}:starRegistry`;
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

        let starCoin: StarCoin = new StarCoin(address, message, signature, star);



        let verified = starCoin.verify();

        expect(verified).toBe(true);
    });
});