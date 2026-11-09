export function cleanUpList(list, filter, destroy) {
  let newLength = 0;
  for (let i = 0; i < list.length; ++i) {
    if (filter(list[i])) {
      list[newLength++] = list[i];
    } else {
      destroy(list[i]);
    }
  }
  list.length = newLength;
}
