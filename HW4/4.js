const jsonString = '{"name":"小明","age":18}';
const obj = JSON.parse(jsonString);
console.log("姓名:", obj.name, "年齡:", obj.age);
