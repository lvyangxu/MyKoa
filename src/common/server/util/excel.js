let xlsx = require("xlsx");
module.exports = {
    read: (filePath)=> {
        let workbook = xlsx.readFile(filePath);
        let valueArr = workbook.SheetNames.map(d=> {
            let worksheet = workbook.Sheets[d];
            let data = xlsx.utils.sheet_to_json(worksheet);
            return {sheetName: d, data: data};
        });
        return valueArr;
    },
    write: ()=> {

    }
};