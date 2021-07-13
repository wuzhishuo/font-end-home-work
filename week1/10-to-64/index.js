const SIGNS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+'.split(
  ''
);
function to64(num) {
  if (Number.isNaN(Number(num))) {
    return '';
  }

  let initPartResult = [];
  let fractionalPartResult = [];
  let initPart = Math.trunc(num);
  let fractionalPart = num - initPart;

  let divisor = initPart;

  while (divisor > 63) {
    initPartResult.push(SIGNS[divisor % 64]);
    divisor = Math.floor(divisor / 64);
  }
  initPartResult.push(SIGNS[divisor]);

  let accuracy = 12;
  while (accuracy > 0 && fractionalPart != 0) {
    let product = fractionalPart * 64;
    let initPart = Math.trunc(product);
    fractionalPart = product - initPart;
    fractionalPartResult.push(SIGNS[initPart]);
    accuracy--;
  }

  return fractionalPartResult.length
    ? initPartResult.reverse().join('') + '.' + fractionalPartResult.join('')
    : initPartResult.reverse().join('');
}
