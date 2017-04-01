"use strict";

/**
 * 对string和number设置方法
 * @param funcName
 * @param func
 */
var extend = function extend(funcName, func) {
    if (!String.prototype[funcName]) {
        String.prototype[funcName] = func;
    }
    if (!Number.prototype[funcName]) {
        Number.prototype[funcName] = func;
    }
};

/**
 * 对number设置方法
 * @param funcName
 * @param func
 */
var extendNumber = function extendNumber(funcName, func) {
    if (!Number.prototype[funcName]) {
        Number.prototype[funcName] = func;
    }
};

extendNumber("includes", function (search, start) {
    var input = this;
    input = input.toString();
    return input.includes(search);
});

extend("utf8Encode", function () {
    var input = this.toString();
    var output = "";
    input = input.replace(/\r\n/g, "\n");
    for (var n = 0; n < input.length; n++) {
        var c = input.charCodeAt(n);
        if (c < 128) {
            output += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
            output += String.fromCharCode(c >> 6 | 192);
            output += String.fromCharCode(c & 63 | 128);
        } else {
            output += String.fromCharCode(c >> 12 | 224);
            output += String.fromCharCode(c >> 6 & 63 | 128);
            output += String.fromCharCode(c & 63 | 128);
        }
    }
    return output;
});

extend("utf8Decode", function () {
    var input = this.toString();
    var output = "";
    var i = 0;
    var c = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0;

    while (i < input.length) {
        c = input.charCodeAt(i);
        if (c < 128) {
            output += String.fromCharCode(c);
            i++;
        } else if (c > 191 && c < 224) {
            c2 = input.charCodeAt(i + 1);
            output += String.fromCharCode((c & 31) << 6 | c2 & 63);
            i += 2;
        } else {
            c2 = input.charCodeAt(i + 1);
            c3 = input.charCodeAt(i + 2);
            output += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            i += 3;
        }
    }
    return output;
});

extend("urlEncode", function () {
    var output = encodeURIComponent(this.toString());
    return output;
});

extend("urlDecode", function () {
    var output = decodeURIComponent(this.toString());
    return output;
});

//md5 32 encode lower case
extend("md5Encode", function () {
    var input = this.toString().utf8Encode();

    var rotateLeft = function rotateLeft(lValue, iShiftBits) {
        return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
    };

    var addUnsigned = function addUnsigned(lX, lY) {
        var lX4 = void 0,
            lY4 = void 0,
            lX8 = void 0,
            lY8 = void 0,
            lResult = void 0;
        lX8 = lX & 0x80000000;
        lY8 = lY & 0x80000000;
        lX4 = lX & 0x40000000;
        lY4 = lY & 0x40000000;
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return lResult ^ 0xC0000000 ^ lX8 ^ lY8;else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        } else {
            return lResult ^ lX8 ^ lY8;
        }
    };

    var F = function F(x, y, z) {
        return x & y | ~x & z;
    };

    var G = function G(x, y, z) {
        return x & z | y & ~z;
    };

    var H = function H(x, y, z) {
        return x ^ y ^ z;
    };

    var I = function I(x, y, z) {
        return y ^ (x | ~z);
    };

    var FF = function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var GG = function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var HH = function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var II = function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function convertToWordArray(string) {
        var lWordCount = void 0;
        var lMessageLength = string.length;
        var lNumberOfWordsTempOne = lMessageLength + 8;
        var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - lNumberOfWordsTempOne % 64) / 64;
        var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
            lByteCount++;
        }
        lWordCount = (lByteCount - lByteCount % 4) / 4;
        lBytePosition = lByteCount % 4 * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | 0x80 << lBytePosition;
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function wordToHex(lValue) {
        var WordToHexValue = "",
            WordToHexValueTemp = "",
            lByte = void 0,
            lCount = void 0;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = lValue >>> lCount * 8 & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue += WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };

    var x = Array();
    var k = void 0,
        AA = void 0,
        BB = void 0,
        CC = void 0,
        DD = void 0,
        a = void 0,
        b = void 0,
        c = void 0,
        d = void 0;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    x = convertToWordArray(input);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    var output = tempValue.toLowerCase();
    return output;
});

extend("base64Encode", function () {
    var input = this.toString().utf8Encode();
    var output = "";
    var base64KeyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var chr1 = void 0,
        chr2 = void 0,
        chr3 = void 0,
        enc1 = void 0,
        enc2 = void 0,
        enc3 = void 0,
        enc4 = void 0;
    var i = 0;
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += base64KeyStr.charAt(enc1) + base64KeyStr.charAt(enc2) + base64KeyStr.charAt(enc3) + base64KeyStr.charAt(enc4);
    }
    return output;
});

extend("base64Decode", function () {
    var input = this.toString().replace(/[^A-Za-z0-9\+\/=]/g, "");
    var output = "";
    var base64KeyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var chr1 = void 0,
        chr2 = void 0,
        chr3 = void 0;
    var enc1 = void 0,
        enc2 = void 0,
        enc3 = void 0,
        enc4 = void 0;
    var i = 0;
    while (i < input.length) {
        enc1 = base64KeyStr.indexOf(input.charAt(i++));
        enc2 = base64KeyStr.indexOf(input.charAt(i++));
        enc3 = base64KeyStr.indexOf(input.charAt(i++));
        enc4 = base64KeyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output += String.fromCharCode(chr1);
        if (enc3 != 64) {
            output += String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output += String.fromCharCode(chr3);
        }
    }
    output = output.utf8Decode();
    return output;
});

extend("base64UrlEncode", function () {
    var output = this.toString().base64Encode().urlEncode();
    return output;
});

extend("urlBase64Decode", function () {
    var output = this.toString().urlDecode().base64Decode();
    return output;
});

/**
 * 如果不能转换为json，将抛出一个错误
 */
extend("toJson", function () {
    return eval('(' + this + ')');
});

module.exports = "";