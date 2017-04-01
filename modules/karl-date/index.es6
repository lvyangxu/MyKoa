class date {
    /**
     * 判断是否是闰年
     * @param year
     * @returns {boolean}
     */
    static isLeapYear(year) {
        if (year % 4 != 0) {
            return false;
        }
        if (year % 100 == 0) {
            if (year % 400 == 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    /**
     * 根据年和月获取当月的天数
     * @param year
     * @param month
     * @returns {number}
     */
    static getDaysOfMonth(year, month) {
        let days = 30;
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                days = 31;
                break;
            case 2:
                if (this.isLeapYear(year)) {
                    days = 29;
                } else {
                    days = 28;
                }
                break;
        }
        return days;
    }

    /**
     * 根据年和月获取上个月的天数
     * @param year
     * @param month
     * @returns {number}
     */
    static getDaysOfLastMonth(year, month) {
        if (month == 1) {
            year--;
            month = 12;
        } else {
            year = year;
            month--;
        }
        let days = this.getDaysOfMonth(year, month);
        return days;
    }

    /**
     * 根据传入的日期和偏移量获取新的日期
     * @param date 日期对象
     * @param json 偏移量的json值
     * @returns {{year: number, month: number, day: number, hour: number, minute: number, second: number}}
     */
    static add(date, json) {
        let arr = [];
        if (date instanceof Date) {
            arr = [
                {id: "year", value: date.getFullYear()},
                {id: "month", value: date.getMonth() + 1},
                {id: "day", value: date.getDate()},
                {id: "hour", value: date.getHours()},
                {id: "minute", value: date.getMinutes()},
                {id: "second", value: date.getSeconds()}
            ]
        } else {
            arr = [
                {id: "year", value: date.year},
                {id: "month", value: date.month},
                {id: "day", value: date.day},
                {id: "hour", value: date.hour},
                {id: "minute", value: date.minute},
                {id: "second", value: date.second}
            ]
        }
        if (json != undefined) {
            arr = arr.map(d=> {
                if (json.hasOwnProperty(d.id)) {
                    d.value = d.value + json[d.id];
                }
                return d;
            });
        }

        let newDate = new Date(arr[0].value, arr[1].value - 1, arr[2].value, arr[3].value, arr[4].value, arr[5].value);
        let value = {
            year: newDate.getFullYear(),
            month: newDate.getMonth() + 1,
            day: newDate.getDate(),
            hour: newDate.getHours(),
            minute: newDate.getMinutes(),
            second: newDate.getSeconds()
        };
        return value;
    }
}

module.exports = date;