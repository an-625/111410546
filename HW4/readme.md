# 📘 JavaScript 基礎練習統整

## 🔹 1. 判斷奇偶數
function checkEvenOdd(num) {
  return num % 2 === 0 ? "偶數" : "奇數";
}

console.log(checkEvenOdd(7));  // 奇數
console.log(checkEvenOdd(10)); // 偶數


## 🔹 2. 陣列元素平方
const arr = [1, 2, 3, 4];
const squared = arr.map(x => x ** 2);

console.log(squared); // [1, 4, 9, 16]


## 🔹 3. 累加（1 到 5）
let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum += i;
}

console.log(sum); // 15


## 🔹 4. JSON 轉物件
const jsonString = '{"name":"小明","age":18}';
const obj = JSON.parse(jsonString);

console.log(obj.name, obj.age); // 小明 18


## 🔹 5. 物件方法更新
const user = {
  name: "Alice",
  email: "test@mail.com",
  updateEmail(newEmail) {
    this.email = newEmail;
  }
};

user.updateEmail("new@mail.com");
console.log(user.email); // new@mail.com


## 🔹 6. 陣列最大值
function findMax(arr) {
  return Math.max(...arr);
}

console.log(findMax([3, 9, 2, 7])); // 9


## 🔹 7. 倒數計時
let count = 3;

while (count > 0) {
  console.log(count + "...");
  count--;
}

console.log("時間到！");


## 🔹 8. 計算平均
const scores = [80, 90, 70];
const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

console.log(avg); // 80


## 🔹 9. 篩選高價商品
const products = [
  { name: "筆電", price: 30000 },
  { name: "滑鼠", price: 500 },
  { name: "手機", price: 20000 }
];

const expensive = products.filter(p => p.price > 10000);

console.log(expensive);


## 🔹 10. 找出最高分學生
const students = [
  { name: "小明", score: 60 },
  { name: "小華", score: 95 },
  { name: "小美", score: 85 }
];

const top = students.reduce((max, s) =>
  s.score > max.score ? s : max
);

console.log(`${top.name} (${top.score}分)`);


# 🧠 重點整理

## 📌 核心語法
- if / else
- for / while
- function

## 📌 陣列操作
- map()：轉換
- filter()：篩選
- reduce()：累加

## 📌 其他
- JSON.parse()
- Math.max()
- 展開運算子 (...)
