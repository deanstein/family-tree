import { writable } from 'svelte/store'

const familyTreeData = {}

const people = [
  {
    name: 'Kendall Roy',
    bithdate: '3/15/1975',
    siblings: [
      "Connor Roy",
      "Roman Roy",
      "Siobhan Roy"
    ],
  },
  {
    name: 'Roman Roy',
    bithdate: '3/15/1975',
    siblings: [
      "Connor Roy",
      "Kendall Roy",
      "Siobhan Roy"
    ],
  },
]

familyTreeData['people'] = people

export default writable(familyTreeData)
