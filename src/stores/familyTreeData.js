import { writable } from 'svelte/store'

const familyTreeData = {}

const activePerson = {}

const people = [
  {
    name: 'Kendall Roy',
    bithdate: '3/15/1975',
    parents: [
      'Logan Roy',
      'Carolne Collingwood'
    ],
    siblings: [
      'Connor Roy',
      'Roman Roy',
      'Siobhan Roy'
    ],
  },
  {
    name: 'Roman Roy',
    bithdate: '3/15/1975',
    parents: [
      'Logan Roy',
      'Carolne Collingwood'
    ],
    siblings: [
      'Connor Roy',
      'Kendall Roy',
      'Siobhan Roy'
    ],
  },
]

familyTreeData['activePerson'] = activePerson
familyTreeData['people'] = people

export default writable(familyTreeData)
