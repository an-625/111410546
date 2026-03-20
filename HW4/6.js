function findMax(arr) {
  let max = arr[0];
  for (let num of arr) {
    if (num > max) max = num;
  }
  return max;
}
console.log("最大值:", findMax([3, 9, 2, 7]));
