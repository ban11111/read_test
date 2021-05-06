export function markDuplicates(items) {
  let hashMap = {}
  let markedItems = []
  items.map((word, index) => {
    markedItems.push({ word: word, dup: false })
    if (!hashMap[word]) {
      hashMap[word] = [1, index]
    } else if (hashMap[word][0] === 1) {
      hashMap[word][0] = 2
      markedItems[hashMap[word][1]].dup = true
      markedItems[index].dup = true
    } else if (hashMap[word][0] === 2) {
      markedItems[index].dup = true
    }
    return null
  })
  return markedItems
}
