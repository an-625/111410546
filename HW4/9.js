const products = [
  { name: "筆電", price: 30000 },
  { name: "滑鼠", price: 500 },
  { name: "手機", price: 20000 }
];
const expensive = products.filter(p => p.price > 10000);
console.log("高價商品:", expensive);
