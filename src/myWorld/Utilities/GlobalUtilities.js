class GlobalUtility {

    static stringToInt(str) {
        var matches = /\d+$/.exec(str);
        if (matches)
            return parseInt(matches[0], 10);

        return 0;
    }

    static actionTimeMs(min) {
        let ms = 50 / 5 * min;
        return ms;
    }
}

module.exports = GlobalUtility;