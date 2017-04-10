/**
 * Created by anshi on 2017/4/5.
 */


let encodeKey = "avalon"
let s = "hello world"

var buf = new Buffer("Hello World!");
    console.log(buf)

// let encode = text => {
//     let arr = text.split("");
//     console.log(arr);
//     let d2 = arr.map((d, i) => {
//         let j = i % encodeKey.length;
//         let c1 = text.charCodeAt(i);
//         // let c2 = encodeKey.charCodeAt[j]
//         let c2 = 0x12;
//         let d1 = c1 ^ c2;
//         return d1;
//     }).join(".");
//     return d2;
// }
//
// for(let i = 0;i< s.length;i++){
//     console.log(s.charCodeAt(i));
// }
//
// console.log(encode(s))
