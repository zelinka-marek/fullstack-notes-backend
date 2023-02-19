export function reverse(string) {
  return string.split("").reverse().join("");
}

export function average(array) {
  return array.length
    ? array.reduce((sum, item) => sum + item, 0) / array.length
    : 0;
}
