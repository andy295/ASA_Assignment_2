class GlobalUtility {

    static stringToInt(str) {
        var matches = /\d+$/.exec(str);
        if (matches)
            return parseInt(matches[0], 10);

        return nAn;
    }

    static actionTimeMs(min) {
        let ms = 50 / 5 * min;
        return ms;
    }

    static generateRandomValue(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static isValidObj(obj) {
        if (Object.keys(obj).length === 0)
            return false;
        
            return true;
    }
}

module.exports = GlobalUtility;