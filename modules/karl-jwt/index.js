"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jwt = function () {
    function jwt(json) {
        _classCallCheck(this, jwt);

        var _json$algorithm = json.algorithm,
            algorithm = _json$algorithm === undefined ? "aes192" : _json$algorithm,
            secret = json.secret;

        this.secret = secret;
    }

    _createClass(jwt, [{
        key: "encrypt",
        value: function encrypt(text) {
            var cipher = _crypto2.default.createCipher(this.algorithm, this.secret);
            var encrypted = cipher.update(JSON.stringify(text), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }
    }, {
        key: "decrypt",
        value: function decrypt(text) {
            var decipher = _crypto2.default.createDecipher(this.algorithm, this.secret);
            var decrypted = decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
    }, {
        key: "encryptJWT",
        value: function encryptJWT(header, payload, signature) {
            header = this.encrypt(header);
            payload = this.encrypt(payload);
            signature = this.encrypt(signature);
            var jwtString = header + "." + payload + "." + signature;
            return jwtString;
        }
    }, {
        key: "decryptJWT",
        value: function decryptJWT(encrypted) {
            var _this = this;

            var json = {};
            var arr = encrypted.split(".");
            if (arr.length !== 3) {
                return json;
            }

            var _arr$map = arr.map(function (d) {
                d = _this.decrypt(d);
                d = JSON.parse(d);
                return d;
            }),
                _arr$map2 = _slicedToArray(_arr$map, 3),
                header = _arr$map2[0],
                payload = _arr$map2[1],
                signature = _arr$map2[2];

            json = {
                header: header,
                payload: payload,
                signature: signature
            };
            return json;
        }
    }]);

    return jwt;
}();

module.exports = jwt;
