function calculateTotal(cart, discountFunc) {
  const sum = cart.reduce((acc, cur) => acc + cur, 0);
  return discountFunc(sum);
}

const result = calculateTotal([100, 200, 300], total => total - 50);
console.log(result); // 550
