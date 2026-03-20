// 1. 判斷奇偶數
function checkEvenOdd(num) {
  if (num % 2 === 0) return "偶數";
  return "奇數";
}
console.log("測試 7:", checkEvenOdd(7));
console.log("測試 10:", checkEvenOdd(10));
// 測試結果：奇數、偶數


// 2. 陣列元素平方
const arr = [1, 2, 3, 4];
const squared = [];
for (let i = 0; i < arr.length; i++) {
  squared.push(arr[i] ** 2);
}
console.log("平方結果:", squared);
// 測試結果：[1, 4, 9, 16]


// 3. while 迴圈累加
let sum = 0;
let n = 1;
while (n <= 5) {
  sum += n;
  n++;
}
console.log("1 到 5 的總和:", sum);
// 測試結果：15


// 4. JSON 轉物件
const jsonString = '{"name":"小明","age":18}';
const obj = JSON.parse(jsonString);
console.log("姓名:", obj.name, "年齡:", obj.age);
// 測試結果：姓名: 小明 年齡: 18


// 5. 物件方法更新
const user = {
  name: "Alice",
  email: "test@mail.com",
  updateEmail(newEmail) {
    this.email = newEmail;
  }
};
user.updateEmail("new@mail.com");
console.log("更新後:", user.email);
// 測試結果：new@mail.com


// 6. 陣列最大值
function findMax(arr) {
  let max = arr[0];
  for (let num of arr) {
    if (num > max) max = num;
  }
  return max;
}
console.log("最大值:", findMax([3, 9, 2, 7]));
// 測試結果：9


// 7. while 倒數
let count = 3;
while (count > 0) {
  console.log(count + "...");
  count--;
}
console.log("時間到！");
// 測試結果：3... 2... 1... 時間到！


// 8. 成績平均
const scores = [80, 90, 70];
const total = scores.reduce((a, b) => a + b, 0);
console.log("平均分:", total / scores.length);
// 測試結果：80


// 9. 陣列過濾
const products = [
  { name: "筆電", price: 30000 },
  { name: "滑鼠", price: 500 },
  { name: "手機", price: 20000 }
];
const expensive = products.filter(p => p.price > 10000);
console.log("高價商品:", expensive);
// 測試結果：[ { name: '筆電', price: 30000 }, { name: '手機', price: 20000 } ]


// 10. 找出最高分學生
const students = [
  { name: "小明", score: 60 },
  { name: "小華", score: 95 },
  { name: "小美", score: 85 }
];
const top = students.reduce((max, s) => s.score > max.score ? s : max);
console.log(`第一名是：${top.name} (${top.score}分)`);
// 測試結果：第一名是：小華 (95分)
