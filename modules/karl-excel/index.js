let xlsx = require("xlsx");
let arr = [
    "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
];
let numberToExcelColumnName = (index)=> {
    index++;
    let max = 26;
    let p = 1;
    while (index > max) {
        p++;
        max += Math.pow(26, p);
    }
    for (let i = 1; i < p; i++) {
        index -= Math.pow(26, i);
    }
    let str = "";
    index--;
    for (let i = 1; i <= p; i++) {
        let j = Math.floor(index / Math.pow(26, p - i)) % 26;
        str += arr[j];
    }
    return str;
};

module.exports = {
    read: (filePath)=> {
        let workbook = xlsx.readFileSync(filePath);
        let valueArr = workbook.SheetNames.map(d=> {
            let worksheet = workbook.Sheets[d];
            let data = xlsx.utils.sheet_to_json(worksheet);
            return {sheetName: d, data: data};
        });
        return valueArr;
    },
    write: (filePath, value)=> {
        let SheetNames = value.map(d=> {
            return d.sheetName;
        });
        let Sheets = {};
        value.forEach(d=> {
            let data = {};
            let maxColumnIndex = 0;
            d.data.forEach((d1, i)=> {
                maxColumnIndex = Math.max(maxColumnIndex, d1.length);
                d1.forEach((d2, j)=> {
                    let str = numberToExcelColumnName(j);
                    let cellIndex = `${str}${i + 1}`;
                    data[cellIndex] = {v: d2};
                });
            });
            let maxStr = numberToExcelColumnName(maxColumnIndex);
            data["!ref"] = `A1:${maxStr}${d.data.length}`;
            Sheets[d.sheetName] = data;
        });
        let workbook = {SheetNames: SheetNames, Sheets: Sheets};
        xlsx.writeFileSync(workbook, filePath);
    }
};