import sha256 from 'crypto-js/sha256';

class DataObject {
    id: number;
    timestamp: Date;
    body: string;

    constructor(id: number, body: string) {
        this.id = id;
        this.body = body;
        this.timestamp = new Date();
    }
}

const data1 = new DataObject(1, "Hello World");

console.log(`Raw data object: '${JSON.stringify(data1)}'`);
console.log(`Data object body hashed with SHA256:'${sha256(data1.body)}'`);
console.log(`Full data object hashed with SHA256:'${sha256(JSON.stringify(data1))}'`);