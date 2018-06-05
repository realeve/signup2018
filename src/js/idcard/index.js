import area from './arealist';

let validate = str => {
    str = str.toUpperCase();
    let reg = /^[1-9]\d{13}X$|^[1-9]\d{14}$|^[1-9]\d{17}$|^[1-9]\d{16}X$/;

    let status = validateArea(str);
    let location = getArea(str);
    if (!reg.test(str)) {
        return {
            status: false,
            location
        };
    }
    status = validateDate(str);
    if (!status) {
        return {
            status,
            location
        };
    }
    status = validateCode(str);
    return {
        status,
        location
    };
}

// 校验地区
let validateArea = ID => {
    let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
    if (city[ID.substr(0, 2)] === undefined) {
        return false;
    };
    return true;
}

// 校验生日
let validateDate = ID => {
    let birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
    let d = new Date(birthday);
    let newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
    let currentTime = new Date().getTime();
    let time = d.getTime();
    if (time >= currentTime || birthday !== newBirthday) {
        return false
    }
    return true;
}

let validateCode = ID => {
    if (ID.length == 15) {
        // 15位身份证不校验
        return true;
    }
    let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0,
        i, residue;
    for (i = 0; i < 17; i++) {
        sum += ID.substr(i, 1) * arrInt[i];
    }
    residue = arrCh[sum % 11];
    return residue == ID.substr(17, 1);
}

let getArea = str => {
    let area = str.substr(0, 6);
    let province = str.substr(0, 2) + '0000';
    let city = str.substr(0, 4) + '00';
    return {
        province: query(province),
        city: query(city),
        county: query(area)
    }
}

let query = areacode => {
    let result = area.list.filter(item => item[0] == areacode);
    return result.length ? result[0][1] : '';
}

export default {
    validate
}