export const columns = [
  { field: 'id', sortable: false, width: 80 },
  { field: 'createdAt', sortable: false, width: 100 },
  { field: 'name', sortable: false, flex: 0.3 },
  { field: 'words', sortable: false, flex: 1 }
]

export const data = [
  {
    id: 1,
    created_at: 1555016400000,
    name: 'Paper for test',
    words: '字1 字2 字3 字4 字5 字6'
  },
  {
    id: 2,
    created_at: 1555016400000,
    name: 'Paper 1',
    words: '字6 字5 字4 字3 字2 字1'
  }
]
