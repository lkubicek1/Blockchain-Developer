const bitcoinMessage = require('bitcoinjs-message');

export class StarCoin {
    address?: string;
    message?: string|undefined|null;
    signature?: string|undefined|null;
    star?: any;

    constructor(address?: string, message?: string|undefined|null, signature?: string|undefined|null, star?: any) {
        this.address = address;
        this.message = message;
        this.signature = signature;
        this.star = star;
    }

    getTime(): number|undefined|null {
        if(this.message == null) return null;
        return parseInt(this.message.split(':')[1]);
    }

    verify(): boolean|never {
        if(this.address == null) return false;
        if(this.message == null) return false;
        if(this.signature == null) return false;
        return bitcoinMessage.verify(this.message, this.address, this.signature);
    }

    toDataObject(): any {
        return {
            address: this.address,
            message: this.message,
            signature: this.signature,
            star: this.star
        }
    }
}