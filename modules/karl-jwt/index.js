import crypto from "crypto";

class jwt {

    constructor(json) {
        let { algorithm, secret } = json;
        this.algorithm = algorithm === undefined ? "aes192" : algorithm;
        this.secret = secret;
    }

    encrypt(text) {
        let cipher = crypto.createCipher(this.algorithm, this.secret);
        let encrypted = cipher.update(JSON.stringify(text), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(text) {
        let decipher = crypto.createDecipher(this.algorithm, this.secret);
        let decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    encryptJWT(header, payload, signature) {
        header = this.encrypt(header);
        payload = this.encrypt(payload);
        signature = this.encrypt(signature);
        let jwtString = header + "." + payload + "." + signature;
        return jwtString;
    }

    decryptJWT(encrypted) {
        let json = {};
        let arr = encrypted.split(".");
        if (arr.length != 3) {
            return json;
        }
        let [header, payload, signature] = arr.map(d => {
            d = this.decrypt(d);
            d = JSON.parse(d);
            return d;
        });

        json = {
            header: header,
            payload: payload,
            signature: signature
        };
        return json;
    }

}

module.exports = jwt;
