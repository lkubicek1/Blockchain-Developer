import {StarCoin} from "../../models/star.model";

describe("StarCoin class", () => {
    test("StarCoin Constructor Test", () => {
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
        let currentTime: string = new Date().getTime().toString().slice(0,-3);
        let message: string = `${address}:${currentTime}:starRegistry`;
        let signature: string = "mockSig";
        let star: any = {
            starName: "test"
        }
        let starCoin: StarCoin = new StarCoin(address, message, signature, star);

        expect(starCoin).toBeDefined();
    });

    test("StarCoin getTime test", () => {
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
        let currentTime: string = new Date().getTime().toString().slice(0,-3);
        let message: string = `${address}:${currentTime}:starRegistry`;
        let signature: string = "mockSig";
        let star: any = {
            starName: "test"
        }
        let starCoin: StarCoin = new StarCoin(address, message, signature, star);

        let starTime = starCoin.getTime();
        expect(starTime).toBeDefined();
        expect(starTime).not.toBe(null);
        expect((<number>starTime).toString()).toBe(currentTime);
    });

    test("StarCoin getTime null message test", () => {
        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
        let message = undefined;
        let signature: string = "mockSig";
        let star: any = {
            starName: "test"
        }
        let starCoin: StarCoin = new StarCoin(address, message, signature, star);

        let starTime = starCoin.getTime();
        expect(starTime).toBeNull();
    });

    test("StarCoin toDataObject test", () => {

        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
        let currentTime: string = new Date().getTime().toString().slice(0,-3);
        let message: string = `${address}:${currentTime}:starRegistry`;
        let signature: string = "mockSig";
        let star: any = {
            starName: "test"
        }
        let starCoin: StarCoin = new StarCoin(address, message, signature, star);

        let dataObject: any = starCoin.toDataObject();

        expect(dataObject).toBeDefined();

        const expectedObject: any = {
            "address": address,
            "message": message,
            "signature": signature,
            "star": star
        }

        expect(dataObject).toStrictEqual(expectedObject);
    });

    test("StarCoin verify address undefined test", () => {

        let address = undefined;
        let currentTime: string = new Date().getTime().toString().slice(0,-3);
        let message: string = `${address}:${currentTime}:starRegistry`;
        let signature: string = "mockSig";
        let star: any = {
            starName: "test"
        }
        let starCoin: StarCoin = new StarCoin(address, message, signature, star);

        let verified = starCoin.verify();

        expect(verified).toBe(false);
    });

    test("StarCoin verify message undefined test", () => {

        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
        let message = undefined;
        let signature: string = "mockSig";
        let star: any = {
            starName: "test"
        }
        let starCoin: StarCoin = new StarCoin(address, message, signature, star);

        let verified = starCoin.verify();

        expect(verified).toBe(false);
    });

    test("StarCoin verify signature undefined test", () => {

        let address: string = 'tb1qa6adql9tphxf60t7ktpkjyqufrxdasfhekwmm9';
        let currentTime: string = new Date().getTime().toString().slice(0,-3);
        let message: string = `${address}:${currentTime}:starRegistry`;
        let signature = undefined;
        let star: any = {
            starName: "test"
        }
        let starCoin: StarCoin = new StarCoin(address, message, signature, star);

        let verified = starCoin.verify();

        expect(verified).toBe(false);
    });
});