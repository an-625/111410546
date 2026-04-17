let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99);   // 修改原陣列
  b = [100];    // 只是重新指派，不影響外部
}
process(listA, listB);

console.log(listA); // [1, 2, 99]
console.log(listB); // [3, 4]
