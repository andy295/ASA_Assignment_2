function stringToInt(str) {
	var matches = /\d+$/.exec(str);
    if (matches)
        return parseInt(matches[0], 10)

    return 0
}

function actionTimeMs(min) {
    let ms = 50 / 5 * min
    return ms
}