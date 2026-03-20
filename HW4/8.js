const scores = [80, 90, 70];
const total = scores.reduce((a, b) => a + b, 0);
console.log("平均分:", total / scores.length);
