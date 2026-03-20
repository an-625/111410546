const students = [
  { name: "小明", score: 60 },
  { name: "小華", score: 95 },
  { name: "小美", score: 85 }
];
const top = students.reduce((max, s) => s.score > max.score ? s : max);
console.log(`第一名是：${top.name} (${top.score}分)`);
