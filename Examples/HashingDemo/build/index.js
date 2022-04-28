"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = __importDefault(require("crypto-js/sha256"));
class DataObject {
    id;
    timestamp;
    body;
    constructor(id, body) {
        this.id = id;
        this.body = body;
        this.timestamp = new Date();
    }
}
const data1 = new DataObject(1, "Hello World");
console.log(`Raw data object: '${JSON.stringify(data1)}'`);
console.log(`Data object body hashed with SHA256:'${(0, sha256_1.default)(data1.body)}'`);
console.log(`Full data object hashed with SHA256:'${(0, sha256_1.default)(JSON.stringify(data1))}'`);
