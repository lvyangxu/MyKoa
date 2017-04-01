let net = require("net");
class tcpServer {
    constructor(param) {
        this.param = param;
        this.socketList = [];
    }

    listen() {
        const server = net.createServer(socket => {
            // 'connection' listener
            socket.on('end', () => {
                if (this.param.hasOwnProperty("endCallback")) {
                    this.param.endCallback();
                }
                this.socketList = this.socketList.filter(d => {
                    return d != socket;
                });
                socket.end();
            });
            socket.on("error", (err) => {
                console.log("socket err:" + err);
                socket.end();
            });

            if (this.param.hasOwnProperty("connectCallback")) {
                this.param.connectCallback(socket);
            }

            this.socketList.push(socket);
        });
        server.on('error', (err) => {
            if (this.param.hasOwnProperty("errorCallback")) {
                this.param.errorCallback(err);
            }
        });
        server.listen(this.param.port, this.param.hostname, () => {
            if (this.param.hasOwnProperty("startCallback")) {
                this.param.startCallback();
            }
        });

    }

    send(socket, message) {
        socket.write(message);
    }

    receive(message) {
        if (this.param.hasOwnProperty("receiveCallback")) {
            this.param.receiveCallback(message);
        }
    }

}

module.exports = tcpServer;