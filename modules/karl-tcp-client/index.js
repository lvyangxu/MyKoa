let net = require("net");
class tcpClient {
    constructor(param) {
        this.param = param;
    }

    connect() {
        const clientSocket = net.createConnection({
            port: this.param.port,
            host: this.param.hostname
        }, () => {
            //'connect' listener
            if (this.param.hasOwnProperty("connectCallback")) {
                this.param.connectCallback();
            }
        });

        clientSocket.on('data', (message) => {
            if (this.param.hasOwnProperty("receiveCallback")) {
                this.param.receiveCallback(message);
            }
        });
        clientSocket.on('end', () => {
            if (this.param.hasOwnProperty("endCallback")) {
                this.param.endCallback();
            }
        });

        this.clientSocket = clientSocket;
    }

    send(message) {
        this.clientSocket.write(message);
    }

}

module.exports = tcpClient;