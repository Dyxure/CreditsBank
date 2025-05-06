function calc(num, percent, month) {
    percent = (percent / 100) / 12;
    return Math.round((num * percent) / (1 - (1  + percent) ** (-month)))
}

console.log(calc(1000, 2, 6));